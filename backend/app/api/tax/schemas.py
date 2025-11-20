from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import date, datetime
from enum import Enum


class TaxModelType(str, Enum):
    MODEL_303 = "303"
    MODEL_111 = "111"
    MODEL_130 = "130"
    MODEL_347 = "347"


class TaxDeclarationStatus(str, Enum):
    DRAFT = "draft"
    CALCULATED = "calculated"
    GENERATED = "generated"
    SUBMITTED = "submitted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class TaxDeclarationBase(BaseModel):
    model_type: TaxModelType
    period_quarter: Optional[int] = Field(None, ge=1, le=4)
    period_year: int = Field(..., ge=2000, le=2100)
    period_start_date: date
    period_end_date: date
    notes: Optional[str] = None
    is_rectification: Optional[str] = None


class TaxDeclarationCreate(TaxDeclarationBase):
    pass


class TaxDeclarationUpdate(BaseModel):
    status: Optional[TaxDeclarationStatus] = None
    declaration_data: Optional[Dict[str, Any]] = None
    submitted_at: Optional[datetime] = None
    response_data: Optional[Dict[str, Any]] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class TaxDeclarationOut(TaxDeclarationBase):
    id: int
    user_id: int
    status: TaxDeclarationStatus
    declaration_data: Optional[Dict[str, Any]] = None
    submitted_at: Optional[datetime] = None
    response_data: Optional[Dict[str, Any]] = None
    reference_number: Optional[str] = None
    pdf_path: Optional[str] = None
    xml_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Esquema específico para Modelo 303
class Model303CalculationRequest(BaseModel):
    quarter: int = Field(..., ge=1, le=4, description="Trimestre (1-4)")
    year: int = Field(..., ge=2000, le=2100, description="Año")
    include_purchases: bool = Field(False, description="Incluir compras (si tenemos módulo)")


class Model303CalculationResult(BaseModel):
    """Resultado del cálculo del Modelo 303"""
    period: str  # "Q1 2025"
    period_start: date
    period_end: date
    
    # Ventas
    sales_base_21: float = Field(0.0, description="Base imponible al 21%")
    sales_tax_21: float = Field(0.0, description="Cuota IVA al 21%")
    sales_base_10: float = Field(0.0, description="Base imponible al 10%")
    sales_tax_10: float = Field(0.0, description="Cuota IVA al 10%")
    sales_base_4: float = Field(0.0, description="Base imponible al 4%")
    sales_tax_4: float = Field(0.0, description="Cuota IVA al 4%")
    sales_base_exempt: float = Field(0.0, description="Base imponible exenta")
    total_sales_base: float = Field(0.0, description="Total base imponible ventas")
    total_sales_tax: float = Field(0.0, description="Total IVA repercutido")
    
    # Compras (cuando tengamos módulo)
    purchases_base_21: float = Field(0.0, description="Base imponible compras al 21%")
    purchases_tax_21: float = Field(0.0, description="Cuota IVA compras al 21%")
    purchases_base_10: float = Field(0.0, description="Base imponible compras al 10%")
    purchases_tax_10: float = Field(0.0, description="Cuota IVA compras al 10%")
    purchases_base_4: float = Field(0.0, description="Base imponible compras al 4%")
    purchases_tax_4: float = Field(0.0, description="Cuota IVA compras al 4%")
    total_purchases_base: float = Field(0.0, description="Total base imponible compras")
    total_purchases_tax: float = Field(0.0, description="Total IVA soportado")
    
    # Resultado
    result_to_pay: float = Field(0.0, description="Resultado a ingresar (positivo)")
    result_to_refund: float = Field(0.0, description="Resultado a devolver (negativo)")
    
    # Detalles
    sales_count: int = Field(0, description="Número de ventas incluidas")
    sales_details: list = Field(default_factory=list, description="Detalle de ventas")
    purchases_count: int = Field(0, description="Número de compras incluidas")
    purchases_details: list = Field(default_factory=list, description="Detalle de compras")


class Model303GenerateRequest(BaseModel):
    quarter: int = Field(..., ge=1, le=4)
    year: int = Field(..., ge=2000, le=2100)
    include_purchases: bool = False
    notes: Optional[str] = None


# Esquema específico para Modelo 111
class Model111CalculationRequest(BaseModel):
    quarter: int = Field(..., ge=1, le=4, description="Trimestre (1-4)")
    year: int = Field(..., ge=2000, le=2100, description="Año")


class Model111WithholdingDetail(BaseModel):
    """Detalle de una retención"""
    nif: str = Field(..., description="NIF del profesional")
    name: str = Field(..., description="Nombre del profesional")
    base_amount: float = Field(..., ge=0, description="Base de retención")
    withholding_rate: float = Field(15.0, ge=0, le=100, description="Porcentaje de retención (típicamente 15%)")
    withholding_amount: float = Field(..., ge=0, description="Importe retenido")


class Model111CalculationResult(BaseModel):
    """Resultado del cálculo del Modelo 111"""
    period: str  # "Q1 2025"
    period_start: date
    period_end: date
    
    # Retenciones
    total_withholdings: float = Field(0.0, description="Total retenciones practicadas")
    total_base: float = Field(0.0, description="Total base de retención")
    withholding_count: int = Field(0, description="Número de retenciones")
    withholding_details: list[Model111WithholdingDetail] = Field(default_factory=list, description="Detalle de retenciones")


class Model111GenerateRequest(BaseModel):
    quarter: int = Field(..., ge=1, le=4)
    year: int = Field(..., ge=2000, le=2100)
    withholdings: list[Model111WithholdingDetail] = Field(..., description="Lista de retenciones practicadas")
    notes: Optional[str] = None

