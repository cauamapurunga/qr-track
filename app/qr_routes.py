from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse, StreamingResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.depends import get_db_session, get_current_user
from app.qr_code_use_cases import QRCodeUseCases
from app.schemas import QRCodeCreate, QRCodeResponse, AnalyticsResponse, ScanAnalytic

router = APIRouter(prefix="/qr", tags=["QR Codes"])
redirect_router = APIRouter(tags=["Redirect"])
analytics_router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.post("", response_model=QRCodeResponse, status_code=status.HTTP_201_CREATED)
def create_qr_code(
    qr_data: QRCodeCreate,
    request: Request,
    current_user = Depends(get_current_user),
    db_session: Session = Depends(get_db_session)
):
    """Cria um novo QR Code para o usuário autenticado"""
    uc = QRCodeUseCases(db_session=db_session)
    base_url = str(request.base_url)
    qr_code = uc.create_qr_code(qr_data, current_user.id, base_url)
    
    return QRCodeResponse(
        id=qr_code.id,
        code=qr_code.code,
        destination_url=qr_code.destination_url,
        created_at=qr_code.created_at.isoformat(),
        scan_count=len(qr_code.scans)
    )


@router.get("", response_model=list[QRCodeResponse])
def list_user_qr_codes(
    current_user = Depends(get_current_user),
    db_session: Session = Depends(get_db_session)
):
    """Lista todos os QR Codes do usuário autenticado"""
    uc = QRCodeUseCases(db_session=db_session)
    qr_codes = uc.get_user_qr_codes(current_user.id)
    
    return [
        QRCodeResponse(
            id=qr.id,
            code=qr.code,
            destination_url=qr.destination_url,
            created_at=qr.created_at.isoformat(),
            scan_count=len(qr.scans)
        )
        for qr in qr_codes
    ]


@router.get("/image/{code}")
def get_qr_image(code: str, request: Request, db_session: Session = Depends(get_db_session)):
    """Retorna a imagem PNG do QR Code"""
    uc = QRCodeUseCases(db_session=db_session)
    base_url = str(request.base_url)
    image_buffer = uc.generate_qr_image(code, base_url)
    
    return StreamingResponse(image_buffer, media_type="image/png")


@router.delete("/{code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_qr_code(
    code: str,
    current_user = Depends(get_current_user),
    db_session: Session = Depends(get_db_session)
):
    """Deleta um QR Code do usuário autenticado"""
    uc = QRCodeUseCases(db_session=db_session)
    uc.delete_qr_code(code, current_user.id)
    return None


@redirect_router.get("/r/{code}")
def redirect_and_track(
    code: str,
    request: Request,
    db_session: Session = Depends(get_db_session)
):
    """Captura analytics e redireciona para URL de destino"""
    ip_address = request.client.host
    user_agent = request.headers.get("user-agent", "Unknown")
    
    uc = QRCodeUseCases(db_session=db_session)
    destination_url = uc.process_scan(code, ip_address, user_agent)
    
    return RedirectResponse(url=destination_url, status_code=status.HTTP_302_FOUND)


@analytics_router.get("/{code}", response_model=AnalyticsResponse)
def get_qr_analytics(
    code: str,
    days: int = None,
    current_user = Depends(get_current_user),
    db_session: Session = Depends(get_db_session)
):
    """Retorna as estatísticas de scans de um QR Code. Use days para filtrar (ex: days=7 para últimos 7 dias)"""
    uc = QRCodeUseCases(db_session=db_session)
    analytics = uc.get_analytics(code, current_user.id, days)
    
    qr_code = analytics["qr_code"]
    
    scans_data = [
        ScanAnalytic(
            id=scan.id,
            ip_address=scan.ip_address,
            browser=scan.browser,
            browser_version=scan.browser_version,
            os=scan.os,
            os_version=scan.os_version,
            device=scan.device,
            scanned_at=scan.scanned_at.isoformat()
        )
        for scan in qr_code.scans
    ]
    
    return AnalyticsResponse(
        qr_code=QRCodeResponse(
            id=qr_code.id,
            code=qr_code.code,
            destination_url=qr_code.destination_url,
            created_at=qr_code.created_at.isoformat(),
            scan_count=len(qr_code.scans)
        ),
        total_scans=len(qr_code.scans),
        unique_visitors=analytics["unique_visitors"],
        scans=scans_data,
        top_browsers=analytics["top_browsers"],
        top_os=analytics["top_os"],
        top_devices=analytics["top_devices"]
    )
