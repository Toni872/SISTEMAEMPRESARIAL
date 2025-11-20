from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List

from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User
from ...models.sale import Sale
from ...crud.invoice_registry import (
    get_invoice_registry,
    create_invoice_registry,
    get_invoice_registries,
    mark_as_sent_to_aeat
)
from ...crud.sale import get_sale
from ...utils.verifactu import generate_facturae_xml

router = APIRouter(prefix="/api/verifactu", tags=["verifactu"])


@router.post("/sales/{sale_id}/register")
def register_invoice(
    sale_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Registra una factura en el sistema Verifactu
    Genera hash SHA-256 y lo enlaza con el registro anterior
    """
    sale = get_sale(db, sale_id)
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Factura no encontrada"
        )
    
    if sale.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para registrar esta factura"
        )
    
    # Verificar si ya existe registro
    existing = get_invoice_registry(db, sale_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta factura ya está registrada en Verifactu"
        )
    
    registry = create_invoice_registry(db, sale)
    
    return {
        "message": "Factura registrada exitosamente en Verifactu",
        "registry_id": registry.id,
        "hash": registry.hash,
        "previous_hash": registry.previous_hash,
        "qr_code": registry.qr_code
    }


@router.get("/sales/{sale_id}/xml")
def get_invoice_xml(
    sale_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Genera y retorna el XML Facturae 3.2 de una factura registrada
    """
    sale = get_sale(db, sale_id)
    if not sale:
        logger.warning(f"Factura no encontrada para XML Verifactu: {sale_id}", extra={"sale_id": sale_id, "user_id": current_user.id})
        raise NotFoundError("Factura", sale_id)
    
    if sale.user_id != current_user.id:
        logger.warning(f"Intento de ver XML de factura no autorizada: {sale_id}", extra={"sale_id": sale_id, "user_id": current_user.id, "owner_id": sale.user_id})
        raise AuthorizationError("No tienes permiso para ver esta factura")
    
    registry = get_invoice_registry(db, sale_id)
    if not registry:
        logger.warning(f"Factura no registrada en Verifactu: {sale_id}", extra={"sale_id": sale_id, "user_id": current_user.id})
        raise NotFoundError("Registro de Verifactu", sale_id)
    
    # Generar XML
    import json
    invoice_data = json.loads(registry.invoice_data)
    xml_content = generate_facturae_xml(invoice_data, registry.previous_hash)
    
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={
            "Content-Disposition": f'attachment; filename="factura_{sale.sale_number}.xml"'
        }
    )


@router.get("/registry")
def list_registry(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Lista los registros Verifactu del usuario
    """
    from ...models.sale import Sale
    
    registries = get_invoice_registries(db, current_user.id, skip, limit)
    
    result = []
    for r in registries:
        # Obtener sale_number de forma segura
        sale_number = None
        try:
            sale = db.query(Sale).filter(Sale.id == r.sale_id).first()
            if sale:
                sale_number = sale.sale_number
        except Exception:
            pass
        
        result.append({
            "id": r.id,
            "sale_id": r.sale_id,
            "sale_number": sale_number,
            "hash": r.hash,
            "previous_hash": r.previous_hash,
            "timestamp": r.timestamp.isoformat() if r.timestamp else None,
            "sent_to_aeat": r.sent_to_aeat,
            "sent_at": r.sent_at.isoformat() if r.sent_at else None,
            "qr_code": r.qr_code
        })
    
    return result


@router.post("/registry/{registry_id}/mark-sent")
def mark_registry_sent(
    registry_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Marca un registro como enviado a AEAT
    """
    registry = mark_as_sent_to_aeat(db, registry_id)
    if not registry:
        logger.warning(f"Registro Verifactu no encontrado: {registry_id}", extra={"registry_id": registry_id, "user_id": current_user.id})
        raise NotFoundError("Registro de Verifactu", registry_id)
    
    if registry.user_id != current_user.id:
        logger.warning(f"Intento de modificar registro no autorizado: {registry_id}", extra={"registry_id": registry_id, "user_id": current_user.id, "owner_id": registry.user_id})
        raise AuthorizationError("No tienes permiso para modificar este registro")
    
    return {
        "message": "Registro marcado como enviado a AEAT",
        "registry_id": registry.id,
        "sent_at": registry.sent_at.isoformat()
    }


@router.post("/validate-integrity")
def validate_integrity(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Valida la integridad de la cadena de registros Verifactu
    Verifica que todos los registros estén correctamente enlazados
    """
    from ...crud.invoice_registry import get_invoice_registries
    from ...utils.verifactu import calculate_invoice_hash
    import json
    
    registries = get_invoice_registries(db, current_user.id, skip=0, limit=10000)
    errors = []
    
    # Ordenar por timestamp
    registries_sorted = sorted(registries, key=lambda r: r.timestamp)
    
    for i, registry in enumerate(registries_sorted):
        # Verificar hash de la factura
        invoice_data = json.loads(registry.invoice_data)
        calculated_hash = calculate_invoice_hash(invoice_data)
        
        if calculated_hash != registry.hash:
            errors.append(f"Registro {registry.id}: Hash no coincide con los datos de la factura")
        
        # Verificar enlace con registro anterior
        if i > 0:
            previous_registry = registries_sorted[i - 1]
            if registry.previous_hash != previous_registry.hash:
                errors.append(
                    f"Registro {registry.id}: previous_hash no coincide con el hash del registro anterior"
                )
        elif registry.previous_hash is not None:
            errors.append(f"Registro {registry.id}: No debería tener previous_hash (es el primero)")
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors if errors else None,
        "total_registries": len(registries_sorted)
    }

