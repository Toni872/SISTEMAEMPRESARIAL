from fastapi import APIRouter, Depends, status, HTTPException, Query, Path, Request
from fastapi.responses import JSONResponse
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
from ...core.rate_limit import limiter
from ...models.user import User

logger = get_logger(__name__)

router = APIRouter(
    prefix="/api/products",
    tags=["products"],
    responses={
        401: {"description": "No autenticado"},
        403: {"description": "No autorizado"},
        404: {"description": "Recurso no encontrado"},
        422: {"description": "Error de validación"},
        409: {"description": "Conflicto - recurso ya existe"}
    }
)


@router.get(
    "",
    response_model=List[ProductOut],
    summary="Listar productos",
    description="""
    Obtiene una lista paginada de productos con filtros opcionales.
    
    **Filtros disponibles:**
    - `search`: Busca en nombre, SKU o descripción
    - `category`: Filtra por categoría
    - `is_active`: Filtra por estado activo/inactivo
    
    **Paginación:**
    - `skip`: Número de registros a saltar (default: 0)
    - `limit`: Número máximo de registros a retornar (default: 100, max: 1000)
    """,
    responses={
        200: {
            "description": "Lista de productos obtenida exitosamente",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "name": "Laptop Dell XPS 15",
                            "description": "Laptop profesional",
                            "sku": "DELL-XPS15-001",
                            "price": 1299.99,
                            "stock": 25,
                            "is_active": True
                        }
                    ]
                }
            }
        }
    }
)
def list_products(
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros"),
    search: Optional[str] = Query(None, description="Buscar en nombre, SKU o descripción"),
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    is_active: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: Session = Depends(get_db_session)
):
    """Listar productos con filtros opcionales"""
    products = get_products(db, skip=skip, limit=limit, search=search, category=category, is_active=is_active)
    return products


@router.get(
    "/count",
    response_model=dict,
    summary="Contar productos",
    description="Obtiene el número total de productos, opcionalmente filtrado por estado activo/inactivo.",
    responses={
        200: {
            "description": "Conteo de productos",
            "content": {
                "application/json": {
                    "example": {"count": 150}
                }
            }
        }
    }
)
def get_count(
    is_active: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    db: Session = Depends(get_db_session)
):
    """Obtener conteo de productos"""
    count = get_products_count(db, is_active=is_active)
    return {"count": count}


@router.get(
    "/low-stock",
    response_model=List[ProductOut],
    summary="Productos con stock bajo",
    description="Obtiene la lista de productos cuyo stock está por debajo del mínimo configurado.",
    responses={
        200: {
            "description": "Lista de productos con stock bajo",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 5,
                            "name": "Producto con stock bajo",
                            "stock": 3,
                            "min_stock": 10,
                            "is_active": True
                        }
                    ]
                }
            }
        }
    }
)
def list_low_stock_products(db: Session = Depends(get_db_session)):
    """Listar productos con stock bajo"""
    products = get_low_stock_products(db)
    return products


@router.get(
    "/{product_id}",
    response_model=ProductOut,
    summary="Obtener producto por ID",
    description="Obtiene los detalles de un producto específico por su ID.",
    responses={
        200: {
            "description": "Producto encontrado",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "name": "Laptop Dell XPS 15",
                        "description": "Laptop profesional",
                        "sku": "DELL-XPS15-001",
                        "price": 1299.99,
                        "stock": 25,
                        "is_active": True
                    }
                }
            }
        },
        404: {
            "description": "Producto no encontrado",
            "content": {
                "application/json": {
                    "example": {
                        "error": "NOT_FOUND",
                        "message": "Producto con ID 999 no encontrado"
                    }
                }
            }
        }
    }
)
def get_product_by_id(
    product_id: int = Path(..., description="ID del producto", example=1),
    db: Session = Depends(get_db_session)
):
    """Obtener un producto por ID"""
    product = get_product(db, product_id)
    if not product:
        logger.warning(f"Producto no encontrado: {product_id}", extra={"product_id": product_id})
        raise NotFoundError("Producto", product_id)
    return product


@router.post(
    "",
    response_model=ProductOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nuevo producto",
    dependencies=[Depends(limiter.limit("30/minute"))],
    description="""
    Crea un nuevo producto en el catálogo.
    
    **Validaciones:**
    - El SKU debe ser único (si se proporciona)
    - El precio debe ser mayor a 0
    - El stock y min_stock deben ser >= 0
    
    **Notas:**
    - Si no se proporciona SKU, se puede crear sin él
    - El producto se crea como activo por defecto
    """,
    responses={
        201: {
            "description": "Producto creado exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "name": "Laptop Dell XPS 15",
                        "sku": "DELL-XPS15-001",
                        "price": 1299.99,
                        "stock": 25,
                        "is_active": True
                    }
                }
            }
        },
        409: {
            "description": "Conflicto - SKU ya existe",
            "content": {
                "application/json": {
                    "example": {
                        "error": "CONFLICT",
                        "message": "Ya existe un producto con este SKU",
                        "error_code": "SKU_ALREADY_EXISTS"
                    }
                }
            }
        }
    }
)
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


@router.put(
    "/{product_id}",
    response_model=ProductOut,
    summary="Actualizar producto",
    dependencies=[Depends(limiter.limit("60/minute"))],
    description="""
    Actualiza un producto existente. Solo se actualizan los campos proporcionados.
    
    **Notas:**
    - Todos los campos son opcionales
    - Solo se actualizan los campos que se envían en el request
    - El SKU debe seguir siendo único si se actualiza
    """,
    responses={
        200: {
            "description": "Producto actualizado exitosamente"
        },
        404: {
            "description": "Producto no encontrado"
        }
    }
)
def update_product_by_id(
    product_id: int = Path(..., description="ID del producto a actualizar", example=1),
    product_update: ProductUpdate = ...,
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


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar producto",
    dependencies=[Depends(limiter.limit("20/minute"))],
    description="""
    Elimina un producto del catálogo.
    
    **Advertencia:** Esta acción es permanente y no se puede deshacer.
    """,
    responses={
        204: {
            "description": "Producto eliminado exitosamente"
        },
        404: {
            "description": "Producto no encontrado"
        }
    }
)
def delete_product_by_id(
    product_id: int = Path(..., description="ID del producto a eliminar", example=1),
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

