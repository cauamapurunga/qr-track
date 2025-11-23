import secrets
import string
import qrcode
from io import BytesIO
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from user_agents import parse
from datetime import datetime
from app.db.models import QRCodeModel, ScanAnalyticsModel, UserModel
from app.schemas import QRCodeCreate


class QRCodeUseCases:
    def __init__(self, db_session: Session):
        self.db_session = db_session
    
    def _generate_short_code(self, length: int = 6) -> str:
        while True:
            code = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(length))
            existing = self.db_session.query(QRCodeModel).filter_by(code=code).first()
            if not existing:
                return code
    
    def create_qr_code(self, qr_data: QRCodeCreate, user_id: int, base_url: str) -> QRCodeModel:
        short_code = self._generate_short_code()
        
        qr_code = QRCodeModel(
            code=short_code,
            destination_url=qr_data.destination_url,
            user_id=user_id
        )
        
        self.db_session.add(qr_code)
        self.db_session.commit()
        self.db_session.refresh(qr_code)
        
        return qr_code
    
    def get_user_qr_codes(self, user_id: int) -> list[QRCodeModel]:
        return self.db_session.query(QRCodeModel).filter_by(user_id=user_id).all()
    
    def generate_qr_image(self, code: str, base_url: str) -> BytesIO:
        qr_code = self.db_session.query(QRCodeModel).filter_by(code=code).first()
        
        if not qr_code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="QR Code not found"
            )
        
        redirect_url = f"{base_url}r/{code}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(redirect_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        buf = BytesIO()
        img.save(buf, format='PNG')
        buf.seek(0)
        
        return buf
    
    def _get_ip_geolocation(self, ip_address: str, api_key: str) -> dict:
        import requests
        try:
            response = requests.get(f"https://api.ipgeolocation.io/ipgeo?apiKey={api_key}&ip={ip_address}")
            if response.status_code == 200:
                data = response.json()
                return {
                    "country": data.get("country_name"),
                    "city": data.get("city"),
                    "latitude": data.get("latitude"),
                    "longitude": data.get("longitude"),
                    "timezone": data.get("time_zone", {}).get("name"),
                    "isp": data.get("isp")
                }
        except:
            pass
        return {}
    
    def process_scan(self, code: str, ip_address: str, user_agent: str, api_key: str = None) -> str:
        qr_code = self.db_session.query(QRCodeModel).filter_by(code=code).first()
        
        if not qr_code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="QR Code not found"
            )
        
        ua = parse(user_agent)
        
        geo_data = {}
        if api_key:
            geo_data = self._get_ip_geolocation(ip_address, api_key)
        
        scan = ScanAnalyticsModel(
            qr_code_id=qr_code.id,
            ip_address=ip_address,
            user_agent=user_agent,
            browser=ua.browser.family,
            browser_version=ua.browser.version_string,
            os=ua.os.family,
            os_version=ua.os.version_string,
            device=ua.device.family,
            country=geo_data.get("country"),
            city=geo_data.get("city"),
            latitude=geo_data.get("latitude"),
            longitude=geo_data.get("longitude"),
            timezone=geo_data.get("timezone"),
            isp=geo_data.get("isp")
        )
        
        self.db_session.add(scan)
        self.db_session.commit()
        
        return qr_code.destination_url
    
    def get_analytics(self, code: str, user_id: int, days: int = None):
        from collections import Counter
        from datetime import timedelta
        
        qr_code = self.db_session.query(QRCodeModel).filter_by(code=code, user_id=user_id).first()
        
        if not qr_code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="QR Code not found or you don't have permission"
            )
        
        scans = qr_code.scans
        
        if days:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            scans = [scan for scan in scans if scan.scanned_at >= cutoff_date]
        
        # Unique visitors (IPs únicos)
        unique_ips = len(set(scan.ip_address for scan in scans))
        
        # Top browsers
        browser_counter = Counter(scan.browser for scan in scans if scan.browser)
        top_browsers = [{"name": name, "count": count} for name, count in browser_counter.most_common(5)]
        
        # Top OS
        os_counter = Counter(scan.os for scan in scans if scan.os)
        top_os = [{"name": name, "count": count} for name, count in os_counter.most_common(5)]
        
        # Top devices
        device_counter = Counter(scan.device for scan in scans if scan.device)
        top_devices = [{"type": device, "count": count} for device, count in device_counter.most_common(5)]
        
        # Top countries
        country_counter = Counter(scan.country for scan in scans if scan.country)
        top_countries = [{"name": name, "count": count} for name, count in country_counter.most_common(5)]
        
        # Top cities
        city_counter = Counter(scan.city for scan in scans if scan.city)
        top_cities = [{"name": name, "count": count} for name, count in city_counter.most_common(5)]
        
        return {
            "qr_code": qr_code,
            "unique_visitors": unique_ips,
            "top_browsers": top_browsers,
            "top_os": top_os,
            "top_devices": top_devices,
            "top_countries": top_countries,
            "top_cities": top_cities
        }
    
    def delete_qr_code(self, code: str, user_id: int):
        qr_code = self.db_session.query(QRCodeModel).filter_by(code=code, user_id=user_id).first()
        
        if not qr_code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="QR Code not found or you don't have permission"
            )
        
        self.db_session.delete(qr_code)
        self.db_session.commit()
