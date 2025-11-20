from fastapi import APIRouter, Depends, status, HTTPException, Query
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
from ...models.user import User

logger = get_logger(__name__)

router = APIRouter(prefix="/api/sales", tags=["sales"])


@router.get("", response_model=List[SaleOut])
def list_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
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


@router.get("/stats", response_model=dict)
def get_stats(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtener estadísticas de ventas del usuario"""
    stats = get_sales_stats(db, user_id=current_user.id, start_date=start_date, end_date=end_date)
    return stats


@router.get("/{sale_id}", response_model=SaleOut)
def get_sale_by_id(
    sale_id: int,
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


@router.post("", response_model=SaleOut, status_code=status.HTTP_201_CREATED)
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


@router.put("/{sale_id}", response_model=SaleOut)
def update_sale_by_id(
    sale_id: int,
    sale_update: SaleUpdate,
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


@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sale_by_id(
    sale_id: int,
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



