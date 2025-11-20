from sqlalchemy import Column, Integer, String, Date, DateTime, Text, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base
import enum


class TaxModelType(str, enum.Enum):
    """Tipos de modelos fiscales"""
    MODEL_303 = "303"  # IVA Trimestral
    MODEL_111 = "111"  # Retenciones IRPF
    MODEL_130 = "130"  # IRPF Autónomos
    MODEL_347 = "347"  # Operaciones con terceros


class TaxDeclarationStatus(str, enum.Enum):
    """Estados de una declaración fiscal"""
    DRAFT = "draft"  # Borrador
    CALCULATED = "calculated"  # Calculada pero no generada
    GENERATED = "generated"  # Generada (PDF/XML creados)
    SUBMITTED = "submitted"  # Enviada a AEAT
    ACCEPTED = "accepted"  # Aceptada por AEAT
    REJECTED = "rejected"  # Rechazada por AEAT


class TaxDeclaration(Base):
    """
    Modelo para declaraciones fiscales españolas
    Almacena declaraciones de modelos 303, 111, etc.
    """
    __tablename__ = "tax_declarations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Usuario que genera la declaración
    
    # Tipo de modelo fiscal
    model_type = Column(SQLEnum(TaxModelType), nullable=False)
    
    # Periodo de declaración
    period_quarter = Column(Integer, nullable=True)  # 1, 2, 3, 4 para trimestres
    period_year = Column(Integer, nullable=False)  # Año
    period_start_date = Column(Date, nullable=False)  # Fecha inicio periodo
    period_end_date = Column(Date, nullable=False)  # Fecha fin periodo
    
    # Estado de la declaración
    status = Column(SQLEnum(TaxDeclarationStatus), default=TaxDeclarationStatus.DRAFT, nullable=False)
    
    # Datos de la declaración (JSON con todos los campos del modelo)
    declaration_data = Column(JSON, nullable=True)  # Datos calculados y campos del formulario
    
    # Información de envío
    submitted_at = Column(DateTime(timezone=True), nullable=True)  # Fecha de envío
    response_data = Column(JSON, nullable=True)  # Respuesta de AEAT (si aplica)
    reference_number = Column(String(50), nullable=True)  # Número de referencia AEAT
    
    # Archivos generados
    pdf_path = Column(String(500), nullable=True)  # Ruta al PDF generado
    xml_path = Column(String(500), nullable=True)  # Ruta al XML generado
    
    # Metadatos
    notes = Column(Text, nullable=True)  # Notas adicionales
    is_rectification = Column(String(10), nullable=True)  # Si es rectificativa, ID de la original
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    # user = relationship("User", backref="tax_declarations")  # Opcional

