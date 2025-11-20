from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


# ========== SUPPLIER SCHEMAS ==========

class SupplierBase(BaseModel):
    name: str
    tax_id: Optional[str] = None
    email: Optional[str] = None  # Cambiado de EmailStr a str para permitir validación más flexible
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "España"
    contact_person: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None
    is_active: bool = True
    
    @validator('email', pre=True)
    def validate_email(cls, v):
        if v == '' or v is None:
            return None
        # Validar formato de email si se proporciona
        if v:
            from email_validator import validate_email as ve, EmailNotValidError
            try:
                ve(v)
                return v
            except EmailNotValidError:
                raise ValueError('Email inválido')
        return v


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

