from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class InvoiceTemplateBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    html_template: str = Field(..., min_length=10)  # Debe tener contenido mínimo
    header_color: str = Field(default="#3b82f6", pattern="^#[0-9A-Fa-f]{6}$")
    footer_text: Optional[str] = None
    logo_url: Optional[str] = Field(None, max_length=500)
    show_tax_breakdown: bool = True
    show_payment_terms: bool = True
    show_notes: bool = True
    is_default: bool = False


class InvoiceTemplateCreate(InvoiceTemplateBase):
    pass


class InvoiceTemplateUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    html_template: Optional[str] = Field(None, min_length=10)
    header_color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    footer_text: Optional[str] = None
    logo_url: Optional[str] = Field(None, max_length=500)
    show_tax_breakdown: Optional[bool] = None
    show_payment_terms: Optional[bool] = None
    show_notes: Optional[bool] = None
    is_default: Optional[bool] = None


class InvoiceTemplateOut(InvoiceTemplateBase):
    id: int
    is_system: bool
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class InvoiceTemplatePreview(BaseModel):
    """Schema para preview de factura con plantilla"""
    template_id: int
    sale_id: Optional[int] = None  # Si queremos preview con datos reales
    preview_html: str  # HTML renderizado

