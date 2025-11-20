from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from ...crud.product import (
    get_product,
    get_products,
    create_product,
    update_product,
    delete_product,
    get_products_count,
    get_low_stock_products,
    get_product_by_sku
)
from ...api.products.schemas import ProductCreate, ProductUpdate, ProductOut
from ...api.auth.deps import get_db_session, get_current_user
from ...core.exceptions import NotFoundError, ConflictError, BusinessLogicError
from ...core.logging_config import get_logger
from ...models.user import User

logger = get_logger(__name__)

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=List[ProductOut])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    category: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db_session)
):
    """Listar productos con filtros opcionales"""
    products = get_products(db, skip=skip, limit=limit, search=search, category=category, is_active=is_active)
    return products


@router.get("/count", response_model=dict)
def get_count(
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db_session)
):
    """Obtener conteo de productos"""
    count = get_products_count(db, is_active=is_active)
    return {"count": count}


@router.get("/low-stock", response_model=List[ProductOut])
def list_low_stock_products(db: Session = Depends(get_db_session)):
    """Listar productos con stock bajo"""
    products = get_low_stock_products(db)
    return products


@router.get("/{product_id}", response_model=ProductOut)
def get_product_by_id(product_id: int, db: Session = Depends(get_db_session)):
    """Obtener un producto por ID"""
    product = get_product(db, product_id)
    if not product:
        logger.warning(f"Producto no encontrado: {product_id}", extra={"product_id": product_id})
        raise NotFoundError("Producto", product_id)
    return product


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_new_product(
    product: ProductCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Crear un nuevo producto"""
    # Verificar si el SKU ya existe
    if product.sku:
        existing = get_product_by_sku(db, product.sku)
        if existing:
            logger.warning(
                f"Intento de crear producto con SKU duplicado: {product.sku}",
                extra={"sku": product.sku, "user_id": current_user.id}
            )
            raise ConflictError("Ya existe un producto con este SKU", error_code="SKU_ALREADY_EXISTS")
    
    return create_product(db, product)


@router.put("/{product_id}", response_model=ProductOut)
def update_product_by_id(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Actualizar un producto"""
    product = update_product(db, product_id, product_update)
    if not product:
        logger.warning(
            f"Intento de actualizar producto inexistente: {product_id}",
            extra={"product_id": product_id, "user_id": current_user.id}
        )
        raise NotFoundError("Producto", product_id)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_by_id(
    product_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Eliminar un producto"""
    success = delete_product(db, product_id)
    if not success:
        logger.warning(
            f"Intento de eliminar producto inexistente: {product_id}",
            extra={"product_id": product_id, "user_id": current_user.id}
        )
        raise NotFoundError("Producto", product_id)
    return None

