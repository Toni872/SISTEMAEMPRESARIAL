from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base
import enum


class PurchaseStatus(str, enum.Enum):
    """Estados de una compra"""
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    RECEIVED = "received"
    CANCELLED = "cancelled"


class Purchase(Base):
    """
    Compras realizadas a proveedores
    """
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False, index=True)
    
    # Información de la compra
    purchase_number = Column(String(50), unique=True, nullable=False, index=True)
    purchase_date = Column(DateTime(timezone=True), nullable=False)
    
    # Totales
    subtotal = Column(Numeric(10, 2), nullable=False, default=0)
    tax = Column(Numeric(10, 2), nullable=False, default=0)
    total = Column(Numeric(10, 2), nullable=False, default=0)
    
    # Estado
    status = Column(SQLEnum(PurchaseStatus), default=PurchaseStatus.DRAFT, nullable=False)
    
    # Información adicional
    notes = Column(Text, nullable=True)
    reference_number = Column(String(100), nullable=True)  # Número de referencia del proveedor
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    supplier = relationship("Supplier", back_populates="purchases")
    items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")


class PurchaseItem(Base):
    """
    Items de una compra
    """
    __tablename__ = "purchase_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)
    
    # Información del item
    description = Column(String(500), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    tax_rate = Column(Numeric(5, 2), nullable=False, default=21.0)  # IVA %
    subtotal = Column(Numeric(10, 2), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    purchase = relationship("Purchase", back_populates="items")
    product = relationship("Product")

