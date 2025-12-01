from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class InvoiceItemOut(BaseModel):
    """Item de factura"""
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


class InvoiceOut(BaseModel):
    """Factura completa"""
    id: int
    sale_id: int
    sale_number: str
    customer_name: Optional[str]
    customer_email: Optional[str]
    customer_phone: Optional[str]
    subtotal: Decimal
    tax: Decimal
    total: Decimal
    status: str
    created_at: datetime
    items: List[InvoiceItemOut]
    invoice_registry_id: Optional[int] = None
    invoice_hash: Optional[str] = None
    qr_code: Optional[str] = None
    sent_to_aeat: bool = False

    model_config = ConfigDict(from_attributes=True)


class InvoiceCreate(BaseModel):
    """Crear factura desde venta"""
    sale_id: int = Field(..., description="ID de la venta a facturar")
    register_in_verifactu: bool = Field(
        default=True,
        description="Si se debe registrar en Verifactu automáticamente"
    )


class InvoiceListOut(BaseModel):
    """Lista de facturas"""
    invoices: List[InvoiceOut]
    total: int
    skip: int
    limit: int


