from fastapi import APIRouter, Depends, status, HTTPException, Query, Path
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date

from ...crud.sale import (
    get_sale,
    get_sales,
    create_sale,
    update_sale,
    delete_sale,
    get_sales_stats
)
from ...api.sales.schemas import SaleCreate, SaleUpdate, SaleOut
from ...api.auth.deps import get_db_session, get_current_user
from ...core.exceptions import NotFoundError, AuthorizationError, BusinessLogicError
from ...core.logging_config import get_logger
from ...core.rate_limit import limiter, get_rate_limit_dependency
from ...models.user import User

logger = get_logger(__name__)

router = APIRouter(
    prefix="/api/sales",
    tags=["sales"],
    responses={
        401: {"description": "No autenticado"},
        403: {"description": "No autorizado"},
        404: {"description": "Recurso no encontrado"},
        422: {"description": "Error de validación"},
        400: {"description": "Error de lógica de negocio"}
    }
)


@router.get(
    "",
    response_model=List[SaleOut],
    summary="Listar ventas",
    description="""
    Obtiene una lista paginada de ventas del usuario actual con filtros opcionales.
    
    **Filtros disponibles:**
    - `status`: Filtrar por estado (pending, completed, cancelled)
    - `start_date`: Fecha de inicio para filtrar ventas
    - `end_date`: Fecha de fin para filtrar ventas
    
    **Nota:** Solo se retornan las ventas del usuario autenticado.
    """,
    responses={
        200: {"description": "Lista de ventas obtenida exitosamente"}
    }
)
def list_sales(
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros"),
    status: Optional[str] = Query(None, description="Filtrar por estado", example="completed"),
    start_date: Optional[date] = Query(None, description="Fecha de inicio", example="2025-01-01"),
    end_date: Optional[date] = Query(None, description="Fecha de fin", example="2025-12-31"),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Listar ventas del usuario actual"""
    sales = get_sales(
        db,
        skip=skip,
        limit=limit,
        user_id=current_user.id,
        status=status,
        start_date=start_date,
        end_date=end_date
    )
    return sales


@router.get(
    "/stats",
    response_model=dict,
    summary="Estadísticas de ventas",
    description="""
    Obtiene estadísticas agregadas de ventas del usuario.
    
    **Métricas incluidas:**
    - `total_sales`: Número total de ventas completadas
    - `total_revenue`: Ingresos totales
    - `total_items_sold`: Cantidad total de items vendidos
    
    **Filtros opcionales:**
    - `start_date`: Fecha de inicio del período
    - `end_date`: Fecha de fin del período
    """,
    responses={
        200: {
            "description": "Estadísticas obtenidas exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "total_sales": 150,
                        "total_revenue": 45000.50,
                        "total_items_sold": 320
                    }
                }
            }
        }
    }
)
def get_stats(
    start_date: Optional[date] = Query(None, description="Fecha de inicio", example="2025-01-01"),
    end_date: Optional[date] = Query(None, description="Fecha de fin", example="2025-12-31"),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtener estadísticas de ventas del usuario"""
    stats = get_sales_stats(db, user_id=current_user.id, start_date=start_date, end_date=end_date)
    return stats


@router.get(
    "/{sale_id}",
    response_model=SaleOut,
    summary="Obtener venta por ID",
    description="Obtiene los detalles de una venta específica. Solo se puede acceder a ventas propias.",
    responses={
        200: {"description": "Venta encontrada"},
        403: {"description": "No autorizado - la venta pertenece a otro usuario"},
        404: {"description": "Venta no encontrada"}
    }
)
def get_sale_by_id(
    sale_id: int = Path(..., description="ID de la venta", example=1),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtener una venta por ID"""
    sale = get_sale(db, sale_id)
    if not sale:
        logger.warning(
            f"Venta no encontrada: {sale_id}",
            extra={"user_id": current_user.id, "sale_id": sale_id}
        )
        raise NotFoundError("Venta", sale_id)
    
    # Verificar que la venta pertenece al usuario
    if sale.user_id != current_user.id:
        logger.warning(
            f"Intento de acceso no autorizado a venta: {sale_id}",
            extra={"user_id": current_user.id, "sale_id": sale_id, "owner_id": sale.user_id}
        )
        raise AuthorizationError("No tienes permiso para ver esta venta")
    
    return sale


@router.post(
    "",
    response_model=SaleOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nueva venta",
    dependencies=get_rate_limit_dependency("30/minute"),
    description="""
    Crea una nueva venta con sus items.
    
    **Validaciones:**
    - Debe incluir al menos un item
    - Los productos deben existir y tener stock suficiente
    - El stock se reduce automáticamente al crear la venta
    
    **Cálculos automáticos:**
    - Subtotal: Suma de (cantidad × precio_unitario) de todos los items
    - IVA: 21% del subtotal
    - Total: Subtotal + IVA
    """,
    responses={
        201: {"description": "Venta creada exitosamente"},
        400: {"description": "Error de validación o lógica de negocio (ej: stock insuficiente)"}
    }
)
def create_new_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Crear una nueva venta"""
    try:
        return create_sale(db, sale, current_user.id)
    except ValueError as e:
        logger.warning(
            f"Error al crear venta: {str(e)}",
            extra={"user_id": current_user.id}
        )
        raise BusinessLogicError(str(e))


@router.put(
    "/{sale_id}",
    response_model=SaleOut,
    summary="Actualizar venta",
    description="Actualiza una venta existente. Solo se pueden actualizar ventas propias.",
    responses={
        200: {"description": "Venta actualizada exitosamente"},
        403: {"description": "No autorizado"},
        404: {"description": "Venta no encontrada"}
    }
)
def update_sale_by_id(
    sale_id: int = Path(..., description="ID de la venta", example=1),
    sale_update: SaleUpdate = ...,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Actualizar una venta"""
    sale = get_sale(db, sale_id)
    if not sale:
        logger.warning(
            f"Intento de actualizar venta inexistente: {sale_id}",
            extra={"user_id": current_user.id, "sale_id": sale_id}
        )
        raise NotFoundError("Venta", sale_id)
    
    # Verificar que la venta pertenece al usuario
    if sale.user_id != current_user.id:
        logger.warning(
            f"Intento de actualizar venta no autorizada: {sale_id}",
            extra={"user_id": current_user.id, "sale_id": sale_id, "owner_id": sale.user_id}
        )
        raise AuthorizationError("No tienes permiso para actualizar esta venta")
    
    updated_sale = update_sale(db, sale_id, sale_update)
    return updated_sale


@router.delete(
    "/{sale_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar venta",
    description="""
    Elimina una venta. Si la venta estaba completada, el stock de los productos se restaura automáticamente.
    
    **Advertencia:** Esta acción es permanente.
    """,
    responses={
        204: {"description": "Venta eliminada exitosamente"},
        403: {"description": "No autorizado"},
        404: {"description": "Venta no encontrada"}
    }
)
def delete_sale_by_id(
    sale_id: int = Path(..., description="ID de la venta a eliminar", example=1),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Eliminar una venta"""
    sale = get_sale(db, sale_id)
    if not sale:
        logger.warning(
            f"Intento de eliminar venta inexistente: {sale_id}",
            extra={"user_id": current_user.id, "sale_id": sale_id}
        )
        raise NotFoundError("Venta", sale_id)
    
    # Verificar que la venta pertenece al usuario
    if sale.user_id != current_user.id:
        logger.warning(
            f"Intento de eliminar venta no autorizada: {sale_id}",
            extra={"user_id": current_user.id, "sale_id": sale_id, "owner_id": sale.user_id}
        )
        raise AuthorizationError("No tienes permiso para eliminar esta venta")
    
    success = delete_sale(db, sale_id)
    if not success:
        logger.warning(
            f"Error al eliminar venta: {sale_id}",
            extra={"user_id": current_user.id, "sale_id": sale_id}
        )
        raise NotFoundError("Venta", sale_id)
    return None



