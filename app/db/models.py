from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    # Relacionamento: um usuário tem muitos QR Codes
    qr_codes = relationship("QRCodeModel", back_populates="owner")


class QRCodeModel(Base):
    __tablename__ = "qr_codes"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)  # código curto (ex: xyz123)
    destination_url = Column(String, nullable=False)  # URL de destino final
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relacionamentos
    owner = relationship("UserModel", back_populates="qr_codes")
    scans = relationship("ScanAnalyticsModel", back_populates="qr_code", cascade="all, delete-orphan")


class ScanAnalyticsModel(Base):
    __tablename__ = "scan_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    qr_code_id = Column(Integer, ForeignKey("qr_codes.id"), nullable=False)
    
    # Dados coletados automaticamente
    ip_address = Column(String, nullable=False)
    user_agent = Column(String, nullable=False)  # String completa do user agent
    
    # Dados processados do user agent
    browser = Column(String)
    browser_version = Column(String)
    os = Column(String)
    os_version = Column(String)
    device = Column(String)
    
    scanned_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relacionamento
    qr_code = relationship("QRCodeModel", back_populates="scans")