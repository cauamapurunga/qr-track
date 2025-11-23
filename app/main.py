from fastapi import FastAPI
from app.routes import router as user_router
from app.qr_routes import router as qr_router, redirect_router, analytics_router

app = FastAPI(
    title="QRTrack API",
    description="Sistema de rastreamento de QR Codes com analytics em tempo real",
    version="1.0.0"
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "QRTrack API is running"}

# Rotas de usuários
app.include_router(user_router)

# Rotas de QR Codes
app.include_router(qr_router)
app.include_router(redirect_router)
app.include_router(analytics_router)