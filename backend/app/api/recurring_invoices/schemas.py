from pydantic import BaseModel, Field, EmailStr, ConfigDict
from decimal import Decimal
from typing import Optional, List
from datetime import date, datetime


class RecurringInvoiceItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Decimal = Field(..., gt=0)
    description: Optional[str] = None


class RecurringInvoiceItemCreate(RecurringInvoiceItemBase):
    pass


class RecurringInvoiceItemOut(RecurringInvoiceItemBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class RecurringInvoiceBase(BaseModel):
    name: str = Field(..., max_length=200)
    customer_name: Optional[str] = Field(None, max_length=200)
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = Field(None, max_length=50)
    frequency: str = Field(..., pattern="^(daily|weekly|monthly|quarterly|yearly)$")
    start_date: date
    end_date: Optional[date] = None
    day_of_month: Optional[int] = Field(None, ge=1, le=31)
    notes: Optional[str] = None
    is_active: bool = True


class RecurringInvoiceCreate(RecurringInvoiceBase):
    items: List[RecurringInvoiceItemCreate] = Field(..., min_items=1)


class RecurringInvoiceUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    customer_name: Optional[str] = Field(None, max_length=200)
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = Field(None, max_length=50)
    frequency: Optional[str] = Field(None, pattern="^(daily|weekly|monthly|quarterly|yearly)$")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    next_run_date: Optional[date] = None  # Permitir actualizar próxima fecha manualmente
    day_of_month: Optional[int] = Field(None, ge=1, le=31)
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class RecurringInvoiceOut(RecurringInvoiceBase):
    id: int
    user_id: int
    next_run_date: date
    total_invoices_generated: int
    created_at: datetime
    updated_at: datetime
    items: List[RecurringInvoiceItemOut] = []
    
    model_config = ConfigDict(from_attributes=True)

