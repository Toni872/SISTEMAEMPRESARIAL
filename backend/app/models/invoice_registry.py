from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class InvoiceRegistry(Base):
    """
    Registro de facturas para cumplir con Verifactu
    Cada factura debe tener un registro único con hash SHA-256
    Los registros se enlazan mediante previous_hash para garantizar trazabilidad
    """
    __tablename__ = "invoice_registry"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Hash SHA-256 de esta factura
    hash = Column(String(64), nullable=False, unique=True, index=True)
    
    # Hash del registro anterior (para enlazar cronológicamente)
    previous_hash = Column(String(64), nullable=True, index=True)
    
    # Marca de tiempo de creación
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Datos de la factura en JSON (para verificación)
    invoice_data = Column(Text, nullable=False)  # JSON serializado
    
    # Ruta al XML generado
    xml_path = Column(String(500), nullable=True)
    
    # Estado de remisión a AEAT
    sent_to_aeat = Column(Boolean, default=False, nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    
    # Código QR (almacenado como texto)
    qr_code = Column(Text, nullable=True)
    
    # Metadatos adicionales
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    sale = relationship("Sale", backref="invoice_registry")
    user = relationship("User", backref="invoice_registries")

