from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User
from ...core.exceptions import NotFoundError, AuthorizationError, BusinessLogicError
from ...core.logging_config import get_logger
from ...crud.recurring_invoice import (
    get_recurring_invoice,
    get_recurring_invoices,
    create_recurring_invoice,
    update_recurring_invoice,
    delete_recurring_invoice,
    generate_invoice_from_recurring,
    process_due_recurring_invoices
)
from .schemas import (
    RecurringInvoiceCreate,
    RecurringInvoiceUpdate,
    RecurringInvoiceOut
)

logger = get_logger(__name__)

router = APIRouter(prefix="/api/recurring-invoices", tags=["recurring-invoices"])


@router.get("", response_model=List[RecurringInvoiceOut])
def list_recurring_invoices(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Lista facturas recurrentes del usuario actual"""
    recurring_invoices = get_recurring_invoices(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        is_active=is_active
    )
    return recurring_invoices


@router.get("/{recurring_invoice_id}", response_model=RecurringInvoiceOut)
def get_recurring_invoice_by_id(
    recurring_invoice_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene una factura recurrente por ID"""
    recurring_invoice = get_recurring_invoice(db, recurring_invoice_id)
    if not recurring_invoice:
        logger.warning(
            f"Factura recurrente no encontrada: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id}
        )
        raise NotFoundError("Factura recurrente", recurring_invoice_id)
    
    # Verificar que pertenece al usuario
    if recurring_invoice.user_id != current_user.id:
        logger.warning(
            f"Intento de acceso no autorizado a factura recurrente: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id, "owner_id": recurring_invoice.user_id}
        )
        raise AuthorizationError("No tienes permiso para ver esta factura recurrente")
    
    return recurring_invoice


@router.post("", response_model=RecurringInvoiceOut, status_code=status.HTTP_201_CREATED)
def create_new_recurring_invoice(
    recurring_invoice: RecurringInvoiceCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Crea una nueva factura recurrente"""
    try:
        return create_recurring_invoice(db, recurring_invoice, current_user.id)
    except ValueError as e:
        logger.warning(
            f"Error al crear factura recurrente: {str(e)}",
            extra={"user_id": current_user.id}
        )
        raise BusinessLogicError(str(e))


@router.put("/{recurring_invoice_id}", response_model=RecurringInvoiceOut)
def update_recurring_invoice_by_id(
    recurring_invoice_id: int,
    recurring_invoice_update: RecurringInvoiceUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Actualiza una factura recurrente"""
    recurring_invoice = get_recurring_invoice(db, recurring_invoice_id)
    if not recurring_invoice:
        logger.warning(
            f"Intento de actualizar factura recurrente inexistente: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id}
        )
        raise NotFoundError("Factura recurrente", recurring_invoice_id)
    
    # Verificar que pertenece al usuario
    if recurring_invoice.user_id != current_user.id:
        logger.warning(
            f"Intento de actualizar factura recurrente no autorizada: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id, "owner_id": recurring_invoice.user_id}
        )
        raise AuthorizationError("No tienes permiso para actualizar esta factura recurrente")
    
    updated = update_recurring_invoice(db, recurring_invoice_id, recurring_invoice_update)
    return updated


@router.delete("/{recurring_invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recurring_invoice_by_id(
    recurring_invoice_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Elimina una factura recurrente"""
    recurring_invoice = get_recurring_invoice(db, recurring_invoice_id)
    if not recurring_invoice:
        logger.warning(
            f"Intento de eliminar factura recurrente inexistente: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id}
        )
        raise NotFoundError("Factura recurrente", recurring_invoice_id)
    
    # Verificar que pertenece al usuario
    if recurring_invoice.user_id != current_user.id:
        logger.warning(
            f"Intento de eliminar factura recurrente no autorizada: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id, "owner_id": recurring_invoice.user_id}
        )
        raise AuthorizationError("No tienes permiso para eliminar esta factura recurrente")
    
    success = delete_recurring_invoice(db, recurring_invoice_id)
    if not success:
        logger.warning(
            f"Error al eliminar factura recurrente: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id}
        )
        raise NotFoundError("Factura recurrente", recurring_invoice_id)
    return None


@router.post("/{recurring_invoice_id}/generate", response_model=dict)
def generate_invoice_now(
    recurring_invoice_id: int,
    force: bool = Query(False, description="Forzar generación incluso si la fecha es futura"),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Genera una factura manualmente desde una factura recurrente"""
    recurring_invoice = get_recurring_invoice(db, recurring_invoice_id)
    if not recurring_invoice:
        logger.warning(
            f"Intento de generar factura desde recurrente inexistente: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id}
        )
        raise NotFoundError("Factura recurrente", recurring_invoice_id)
    
    # Verificar que pertenece al usuario
    if recurring_invoice.user_id != current_user.id:
        logger.warning(
            f"Intento de generar factura desde recurrente no autorizada: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id, "owner_id": recurring_invoice.user_id}
        )
        raise AuthorizationError("No tienes permiso para generar facturas desde esta factura recurrente")
    
    # Si force=True, actualizar next_run_date a hoy para permitir generación
    if force:
        from datetime import date
        recurring_invoice.next_run_date = date.today()
        db.commit()
        db.refresh(recurring_invoice)
    
    result = generate_invoice_from_recurring(db, recurring_invoice_id)
    if not result:
        logger.warning(
            f"No se pudo generar factura desde recurrente: {recurring_invoice_id}",
            extra={"recurring_invoice_id": recurring_invoice_id, "user_id": current_user.id, "force": force}
        )
        raise BusinessLogicError("No se pudo generar la factura. Verifica que la factura recurrente esté activa y en fecha. Usa ?force=true para forzar la generación.")
    
    from ...api.sales.schemas import SaleOut
    return {
        "message": "Factura generada exitosamente",
        "sale": SaleOut.model_validate(result["sale"]),
        "next_run_date": result["recurring_invoice"].next_run_date.isoformat()
    }


@router.post("/process-due", response_model=dict)
def process_due_invoices(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Procesa todas las facturas recurrentes vencidas
    NOTA: En producción, esto debería ejecutarse automáticamente con un cron job
    Solo disponible para administradores o para testing
    """
    # Por ahora permitimos a todos los usuarios ejecutarlo
    # En producción, restringir a admin o ejecutar automáticamente
    stats = process_due_recurring_invoices(db)
    return {
        "message": "Procesamiento completado",
        "stats": stats
    }

