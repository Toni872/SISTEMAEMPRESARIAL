from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class InvoiceTemplate(Base):
    """
    Modelo para plantillas de factura
    Permite tener múltiples plantillas personalizables para facturas
    """
    __tablename__ = "invoice_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)  # Nombre de la plantilla
    description = Column(Text, nullable=True)  # Descripción opcional
    
    # Contenido de la plantilla (HTML con placeholders)
    html_template = Column(Text, nullable=False)  # Template HTML con variables como {{customer_name}}, {{total}}, etc.
    
    # Configuración visual
    header_color = Column(String(7), default="#3b82f6")  # Color del header (hex)
    footer_text = Column(Text, nullable=True)  # Texto del footer
    logo_url = Column(String(500), nullable=True)  # URL del logo (opcional)
    
    # Configuración de campos
    show_tax_breakdown = Column(Boolean, default=True)  # Mostrar desglose de impuestos
    show_payment_terms = Column(Boolean, default=True)  # Mostrar términos de pago
    show_notes = Column(Boolean, default=True)  # Mostrar notas
    
    # Estado y pertenencia
    is_default = Column(Boolean, default=False)  # Plantilla por defecto
    is_system = Column(Boolean, default=False)  # Plantilla del sistema (no se puede eliminar)
    user_id = Column(Integer, nullable=True)  # NULL = plantilla global, o user_id = plantilla del usuario
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    # user = relationship("User", backref="invoice_templates")  # Opcional si queremos relación

