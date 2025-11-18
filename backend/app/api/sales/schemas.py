from pydantic import BaseModel, Field, ConfigDict, EmailStr
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


class SaleItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Decimal = Field(..., gt=0)


class SaleItemCreate(SaleItemBase):
    pass


class SaleItemOut(SaleItemBase):
    id: int
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


class SaleBase(BaseModel):
    customer_name: Optional[str] = Field(None, max_length=200)
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    status: str = Field(default="pending", pattern="^(pending|completed|cancelled)$")


class SaleCreate(SaleBase):
    items: List[SaleItemCreate] = Field(..., min_length=1)


class SaleOut(SaleBase):
    id: int
    sale_number: str
    subtotal: Decimal
    tax: Decimal
    total: Decimal
    created_at: datetime
    updated_at: datetime
    user_id: int
    items: List[SaleItemOut] = []

    model_config = ConfigDict(from_attributes=True)


class SaleUpdate(BaseModel):
    customer_name: Optional[str] = Field(None, max_length=200)
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(pending|completed|cancelled)$")



