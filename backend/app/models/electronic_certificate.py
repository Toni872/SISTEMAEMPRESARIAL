from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class ElectronicCertificate(Base):
    """
    Certificados electrónicos para autenticación con AEAT
    """
    __tablename__ = "electronic_certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Información del certificado
    name = Column(String(200), nullable=False)
    certificate_type = Column(String(50), nullable=False)  # 'pfx', 'p12', 'cer', etc.
    
    # Datos del certificado (encriptados en producción)
    certificate_data = Column(Text, nullable=True)  # Base64 o ruta al archivo
    certificate_path = Column(String(500), nullable=True)  # Ruta al archivo del certificado
    
    # Información del emisor
    issuer = Column(String(200), nullable=True)
    subject = Column(String(200), nullable=True)
    serial_number = Column(String(100), nullable=True)
    
    # Fechas de validez
    valid_from = Column(DateTime(timezone=True), nullable=True)
    valid_to = Column(DateTime(timezone=True), nullable=True)
    
    # Estado
    is_active = Column(Boolean, default=True, nullable=False)
    is_valid = Column(Boolean, default=True, nullable=False)
    
    # Metadatos
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", backref="electronic_certificates")

