from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from typing import Optional


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    sku: Optional[str] = Field(None, max_length=100)
    price: Decimal = Field(..., gt=0)
    cost: Optional[Decimal] = None
    stock: int = Field(default=0, ge=0)
    min_stock: int = Field(default=0, ge=0)
    category: Optional[str] = Field(None, max_length=100)
    is_active: bool = Field(default=True)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    sku: Optional[str] = Field(None, max_length=100)
    price: Optional[Decimal] = Field(None, gt=0)
    cost: Optional[Decimal] = None
    stock: Optional[int] = Field(None, ge=0)
    min_stock: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None


class ProductOut(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)



