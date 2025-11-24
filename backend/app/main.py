from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as user_router
from app.qr_routes import router as qr_router, redirect_router, analytics_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="QRTrack API",
    description="Sistema de rastreamento de QR Codes com analytics em tempo real",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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