from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Supplier(Base):
    """
    Proveedores de la empresa
    """
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)  # Usuario propietario
    
    # Información básica
    name = Column(String(200), nullable=False)
    tax_id = Column(String(50), nullable=True)  # NIF/CIF
    email = Column(String(200), nullable=True)
    phone = Column(String(50), nullable=True)
    
    # Dirección
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(100), default="España", nullable=False)
    
    # Información adicional
    contact_person = Column(String(200), nullable=True)
    website = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Estado
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    purchases = relationship("Purchase", back_populates="supplier")

