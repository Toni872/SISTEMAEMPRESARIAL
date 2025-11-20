from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class RecurringInvoice(Base):
    """
    Modelo para facturas recurrentes
    Permite programar facturas que se generan automáticamente
    """
    __tablename__ = "recurring_invoices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)  # Nombre descriptivo de la factura recurrente
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Información del cliente
    customer_name = Column(String(200), nullable=True)
    customer_email = Column(String(200), nullable=True)
    customer_phone = Column(String(50), nullable=True)
    
    # Configuración de recurrencia
    frequency = Column(String(50), nullable=False)  # daily, weekly, monthly, quarterly, yearly
    start_date = Column(Date, nullable=False)  # Fecha de inicio
    end_date = Column(Date, nullable=True)  # Fecha de fin (opcional, None = sin fin)
    next_run_date = Column(Date, nullable=False)  # Próxima fecha de generación
    day_of_month = Column(Integer, nullable=True)  # Día del mes (1-31) para frecuencia mensual
    
    # Plantilla de factura (almacenamos los items como JSON o referencia)
    # Por simplicidad, almacenamos los items como JSON en notes o creamos tabla relacionada
    notes = Column(Text, nullable=True)  # Notas generales
    
    # Estado
    is_active = Column(Boolean, default=True, nullable=False)
    total_invoices_generated = Column(Integer, default=0, nullable=False)  # Contador
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", backref="recurring_invoices")
    generated_sales = relationship("Sale", backref="recurring_invoice_source", foreign_keys="Sale.recurring_invoice_id")


class RecurringInvoiceItem(Base):
    """
    Items de una factura recurrente
    Almacena los productos/servicios que se incluyen en cada factura generada
    """
    __tablename__ = "recurring_invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    recurring_invoice_id = Column(Integer, ForeignKey("recurring_invoices.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    description = Column(String(500), nullable=True)  # Descripción personalizada (opcional)
    
    # Relationships
    recurring_invoice = relationship("RecurringInvoice", backref="items")
    product = relationship("Product", backref="recurring_invoice_items")

