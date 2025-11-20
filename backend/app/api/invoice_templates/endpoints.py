from fastapi import APIRouter, Depends, status, HTTPException, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import Optional, List

from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User
from ...core.exceptions import NotFoundError, AuthorizationError, BusinessLogicError, DatabaseError
from ...core.logging_config import get_logger
from ...crud.invoice_template import (
    get_invoice_template,
    get_invoice_templates,
    get_default_template,
    create_invoice_template,
    update_invoice_template,
    delete_invoice_template,
    render_invoice_with_template
)
from .schemas import (
    InvoiceTemplateCreate,
    InvoiceTemplateUpdate,
    InvoiceTemplateOut
)

logger = get_logger(__name__)

router = APIRouter(prefix="/api/invoice-templates", tags=["invoice-templates"])


@router.get("", response_model=List[InvoiceTemplateOut])
def list_invoice_templates(
    include_system: bool = Query(True, description="Incluir plantillas del sistema"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Lista plantillas de factura disponibles"""
    templates = get_invoice_templates(
        db,
        user_id=current_user.id,
        include_system=include_system,
        skip=skip,
        limit=limit
    )
    return templates


@router.get("/default", response_model=InvoiceTemplateOut)
def get_default_invoice_template(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene la plantilla por defecto"""
    template = get_default_template(db, user_id=current_user.id)
    if not template:
        logger.warning(
            f"No hay plantilla por defecto para usuario: {current_user.id}",
            extra={"user_id": current_user.id}
        )
        raise NotFoundError("Plantilla por defecto")
    return template


@router.get("/{template_id}", response_model=InvoiceTemplateOut)
def get_invoice_template_by_id(
    template_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene una plantilla por ID"""
    template = get_invoice_template(db, template_id)
    if not template:
        logger.warning(
            f"Plantilla no encontrada: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id}
        )
        raise NotFoundError("Plantilla", template_id)
    
    # Verificar acceso (plantillas globales o del usuario)
    if template.user_id and template.user_id != current_user.id:
        logger.warning(
            f"Intento de acceso no autorizado a plantilla: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id, "owner_id": template.user_id}
        )
        raise AuthorizationError("No tienes permiso para ver esta plantilla")
    
    return template


@router.post("", response_model=InvoiceTemplateOut, status_code=status.HTTP_201_CREATED)
def create_new_invoice_template(
    template: InvoiceTemplateCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Crea una nueva plantilla de factura"""
    try:
        return create_invoice_template(db, template, user_id=current_user.id)
    except Exception as e:
        logger.warning(
            f"Error al crear plantilla: {str(e)}",
            extra={"user_id": current_user.id}
        )
        raise BusinessLogicError(str(e))


@router.put("/{template_id}", response_model=InvoiceTemplateOut)
def update_invoice_template_by_id(
    template_id: int,
    template_update: InvoiceTemplateUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Actualiza una plantilla de factura"""
    template = get_invoice_template(db, template_id)
    if not template:
        logger.warning(
            f"Intento de actualizar plantilla inexistente: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id}
        )
        raise NotFoundError("Plantilla", template_id)
    
    # Verificar acceso
    if template.user_id and template.user_id != current_user.id:
        logger.warning(
            f"Intento de actualizar plantilla no autorizada: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id, "owner_id": template.user_id}
        )
        raise AuthorizationError("No tienes permiso para actualizar esta plantilla")
    
    # No permitir editar plantillas del sistema (a menos que sea admin)
    if template.is_system:
        logger.warning(
            f"Intento de editar plantilla del sistema: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id}
        )
        raise AuthorizationError("No se pueden editar plantillas del sistema")
    
    updated = update_invoice_template(db, template_id, template_update, user_id=current_user.id)
    return updated


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice_template_by_id(
    template_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Elimina una plantilla de factura"""
    template = get_invoice_template(db, template_id)
    if not template:
        logger.warning(
            f"Intento de eliminar plantilla inexistente: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id}
        )
        raise NotFoundError("Plantilla", template_id)
    
    # Verificar acceso
    if template.user_id and template.user_id != current_user.id:
        logger.warning(
            f"Intento de eliminar plantilla no autorizada: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id, "owner_id": template.user_id}
        )
        raise AuthorizationError("No tienes permiso para eliminar esta plantilla")
    
    success = delete_invoice_template(db, template_id, user_id=current_user.id)
    if not success:
        logger.warning(
            f"No se puede eliminar plantilla: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id}
        )
        raise BusinessLogicError("No se puede eliminar esta plantilla (puede ser del sistema o estar en uso)")
    return None


@router.get("/{template_id}/preview/{sale_id}", response_class=HTMLResponse)
def preview_invoice_with_template(
    template_id: int,
    sale_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Genera un preview HTML de una factura usando una plantilla específica"""
    template = get_invoice_template(db, template_id)
    if not template:
        logger.warning(
            f"Plantilla no encontrada para preview: {template_id}",
            extra={"template_id": template_id, "user_id": current_user.id}
        )
        raise NotFoundError("Plantilla", template_id)
    
    # Verificar acceso a la venta
    from ...crud.sale import get_sale
    sale = get_sale(db, sale_id)
    if not sale or sale.user_id != current_user.id:
        logger.warning(
            f"Intento de preview de factura no autorizada: {sale_id}",
            extra={"sale_id": sale_id, "user_id": current_user.id}
        )
        raise AuthorizationError("No tienes permiso para ver esta factura")
    
    try:
        html = render_invoice_with_template(db, sale_id, template_id)
        return HTMLResponse(content=html)
    except Exception as e:
        logger.error(
            f"Error renderizando factura: {str(e)}",
            extra={"sale_id": sale_id, "template_id": template_id, "user_id": current_user.id},
            exc_info=True
        )
        raise DatabaseError(f"Error renderizando factura: {str(e)}")

