from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from typing import Optional


class ProductBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Nombre del producto",
        example="Laptop Dell XPS 15"
    )
    description: Optional[str] = Field(
        None,
        description="Descripción detallada del producto",
        example="Laptop profesional con pantalla 15 pulgadas, Intel i7, 16GB RAM, 512GB SSD"
    )
    sku: Optional[str] = Field(
        None,
        max_length=100,
        description="Código SKU único del producto",
        example="DELL-XPS15-001"
    )
    price: Decimal = Field(
        ...,
        gt=0,
        description="Precio de venta del producto (sin IVA)",
        example=1299.99
    )
    cost: Optional[Decimal] = Field(
        None,
        description="Costo de adquisición del producto",
        example=899.99
    )
    stock: int = Field(
        default=0,
        ge=0,
        description="Cantidad disponible en stock",
        example=25
    )
    min_stock: int = Field(
        default=0,
        ge=0,
        description="Stock mínimo antes de alertar",
        example=5
    )
    category: Optional[str] = Field(
        None,
        max_length=100,
        description="Categoría del producto",
        example="Electrónica"
    )
    is_active: bool = Field(
        default=True,
        description="Indica si el producto está activo y disponible para venta"
    )


class ProductCreate(ProductBase):
    """Schema para crear un nuevo producto"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Laptop Dell XPS 15",
                "description": "Laptop profesional con pantalla 15 pulgadas",
                "sku": "DELL-XPS15-001",
                "price": 1299.99,
                "cost": 899.99,
                "stock": 25,
                "min_stock": 5,
                "category": "Electrónica",
                "is_active": True
            }
        }
    )


class ProductUpdate(BaseModel):
    """Schema para actualizar un producto existente"""
    name: Optional[str] = Field(None, min_length=1, max_length=200, description="Nombre del producto")
    description: Optional[str] = Field(None, description="Descripción del producto")
    sku: Optional[str] = Field(None, max_length=100, description="Código SKU")
    price: Optional[Decimal] = Field(None, gt=0, description="Precio de venta")
    cost: Optional[Decimal] = Field(None, description="Costo de adquisición")
    stock: Optional[int] = Field(None, ge=0, description="Cantidad en stock")
    min_stock: Optional[int] = Field(None, ge=0, description="Stock mínimo")
    category: Optional[str] = Field(None, max_length=100, description="Categoría")
    is_active: Optional[bool] = Field(None, description="Estado activo/inactivo")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "price": 1199.99,
                "stock": 30,
                "is_active": True
            }
        }
    )


class ProductOut(ProductBase):
    """Schema de respuesta para productos"""
    id: int = Field(..., description="ID único del producto", example=1)

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "name": "Laptop Dell XPS 15",
                "description": "Laptop profesional con pantalla 15 pulgadas",
                "sku": "DELL-XPS15-001",
                "price": 1299.99,
                "cost": 899.99,
                "stock": 25,
                "min_stock": 5,
                "category": "Electrónica",
                "is_active": True
            }
        }
    )



