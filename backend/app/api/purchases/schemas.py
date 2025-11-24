from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from ...core.validators import (
    validate_email_strict,
    validate_spanish_tax_id,
    validate_phone_number,
    validate_postal_code,
    validate_url,
    sanitize_string
)


# ========== SUPPLIER SCHEMAS ==========

class SupplierBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Nombre del proveedor")
    tax_id: Optional[str] = Field(None, description="CIF/NIF del proveedor")
    email: Optional[str] = Field(None, description="Email de contacto")
    phone: Optional[str] = Field(None, description="Teléfono de contacto")
    address: Optional[str] = Field(None, max_length=500, description="Dirección")
    city: Optional[str] = Field(None, max_length=100, description="Ciudad")
    postal_code: Optional[str] = Field(None, description="Código postal")
    country: str = Field(default="España", max_length=100, description="País")
    contact_person: Optional[str] = Field(None, max_length=200, description="Persona de contacto")
    website: Optional[str] = Field(None, description="Sitio web")
    notes: Optional[str] = Field(None, description="Notas adicionales")
    is_active: bool = Field(default=True, description="Estado activo/inactivo")
    
    @validator('name', pre=True)
    def validate_name(cls, v):
        """Sanitiza y valida el nombre"""
        if not v or not isinstance(v, str):
            raise ValueError("El nombre es requerido")
        return sanitize_string(v, max_length=200)
    
    @validator('email', pre=True)
    def validate_email(cls, v):
        """Valida formato de email si se proporciona"""
        if v == '' or v is None:
            return None
        return validate_email_strict(v)
    
    @validator('tax_id', pre=True)
    def validate_tax_id(cls, v):
        """Valida formato de CIF/NIF español"""
        if v == '' or v is None:
            return None
        return validate_spanish_tax_id(v)
    
    @validator('phone', pre=True)
    def validate_phone(cls, v):
        """Valida formato de teléfono español"""
        return validate_phone_number(v)
    
    @validator('postal_code', pre=True)
    def validate_postal_code(cls, v):
        """Valida código postal español"""
        return validate_postal_code(v)
    
    @validator('website', pre=True)
    def validate_website(cls, v):
        """Valida formato de URL"""
        return validate_url(v)
    
    @validator('address', 'city', 'contact_person', 'notes', pre=True)
    def sanitize_text_fields(cls, v):
        """Sanitiza campos de texto"""
        return sanitize_string(v) if v else None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    tax_id: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    contact_person: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class SupplierOut(SupplierBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ========== PURCHASE ITEM SCHEMAS ==========

class PurchaseItemBase(BaseModel):
    product_id: Optional[int] = None
    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal = Decimal("21.0")
    subtotal: Decimal


class PurchaseItemCreate(PurchaseItemBase):
    pass


class PurchaseItemOut(PurchaseItemBase):
    id: int
    purchase_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ========== PURCHASE SCHEMAS ==========

class PurchaseBase(BaseModel):
    supplier_id: int
    purchase_date: datetime
    subtotal: Decimal
    tax: Decimal
    total: Decimal
    status: str = "draft"
    notes: Optional[str] = None
    reference_number: Optional[str] = None


class PurchaseCreate(PurchaseBase):
    items: List[PurchaseItemCreate]


class PurchaseUpdate(BaseModel):
    supplier_id: Optional[int] = None
    purchase_date: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    reference_number: Optional[str] = None
    items: Optional[List[PurchaseItemCreate]] = None


class PurchaseOut(PurchaseBase):
    id: int
    user_id: int
    purchase_number: str
    supplier: SupplierOut
    items: List[PurchaseItemOut]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

