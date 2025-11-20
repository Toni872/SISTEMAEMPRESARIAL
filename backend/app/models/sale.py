from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    sale_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(200), nullable=True)
    customer_email = Column(String(200), nullable=True)
    customer_phone = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax = Column(Numeric(10, 2), default=0, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, completed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recurring_invoice_id = Column(Integer, ForeignKey("recurring_invoices.id"), nullable=True)  # Si fue generada por una factura recurrente

    # Relationships
    items = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")
    user = relationship("User", backref="sales")


class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    # Relationships
    sale = relationship("Sale", back_populates="items")
    product = relationship("Product", backref="sale_items")



