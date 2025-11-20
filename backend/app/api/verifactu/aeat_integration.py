from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User
from ...crud.invoice_registry import get_invoice_registries, mark_as_sent_to_aeat
from ...utils.aeat_client import aeat_client
from ...core.aeat_config import aeat_settings

router = APIRouter(prefix="/api/verifactu/aeat", tags=["verifactu-aeat"])


@router.post("/send-registry/{registry_id}")
def send_registry_to_aeat(
    registry_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Envía un registro específico a la AEAT
    En producción, aquí se haría la conexión real con los servicios de la AEAT
    """
    from ...crud.invoice_registry import get_invoice_registry
    
    registry = get_invoice_registry(db, registry_id)
    if not registry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro no encontrado"
        )
    
    if registry.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para enviar este registro"
        )
    
    # Envío real a AEAT (preparado para producción)
    from ...utils.verifactu import generate_facturae_xml
    import json
    
    # Obtener datos del registro
    invoice_data = json.loads(registry.invoice_data)
    xml_content = generate_facturae_xml(invoice_data, registry.previous_hash)
    
    # Preparar datos para envío
    registry_data = {
        "hash": registry.hash,
        "previous_hash": registry.previous_hash,
        "timestamp": registry.timestamp.isoformat(),
        "sale_id": registry.sale_id,
    }
    
    # Enviar a AEAT usando el cliente
    try:
        aeat_response = aeat_client.send_invoice_registry(registry_data, xml_content)
        
        # Marcar como enviado solo si fue exitoso
        if aeat_response.get("success"):
            registry = mark_as_sent_to_aeat(db, registry_id)
            
            return {
                "message": "Registro enviado exitosamente a AEAT",
                "registry_id": registry.id,
                "sent_at": registry.sent_at.isoformat(),
                "aeat_reference": aeat_response.get("aeat_reference"),
                "aeat_response": aeat_response
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Error al enviar a AEAT: {aeat_response.get('message', 'Error desconocido')}"
            )
    except Exception as e:
        # Si falla el envío real, registrar el error pero no marcar como enviado
        logger.error(f"Error enviando registro {registry_id} a AEAT: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error al conectar con AEAT: {str(e)}"
        )


@router.post("/send-all-pending")
def send_all_pending_to_aeat(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Envía todos los registros pendientes a la AEAT
    """
    registries = get_invoice_registries(db, current_user.id, skip=0, limit=10000)
    pending = [r for r in registries if not r.sent_to_aeat]
    
    if not pending:
        return {
            "message": "No hay registros pendientes",
            "sent_count": 0
        }
    
    sent_count = 0
    errors = []
    
    from ...crud.invoice_registry import get_invoice_registry
    from ...utils.verifactu import generate_facturae_xml
    import json
    
    for registry in pending:
        try:
            # Obtener datos y generar XML
            invoice_data = json.loads(registry.invoice_data)
            xml_content = generate_facturae_xml(invoice_data, registry.previous_hash)
            
            registry_data = {
                "hash": registry.hash,
                "previous_hash": registry.previous_hash,
                "timestamp": registry.timestamp.isoformat(),
                "sale_id": registry.sale_id,
            }
            
            # Enviar a AEAT
            aeat_response = aeat_client.send_invoice_registry(registry_data, xml_content)
            
            if aeat_response.get("success"):
                mark_as_sent_to_aeat(db, registry.id)
                sent_count += 1
            else:
                errors.append(f"Error enviando registro {registry.id}: {aeat_response.get('message', 'Error desconocido')}")
        except Exception as e:
            errors.append(f"Error enviando registro {registry.id}: {str(e)}")
    
    return {
        "message": f"{sent_count} registros enviados exitosamente",
        "sent_count": sent_count,
        "errors": errors if errors else None
    }


@router.get("/status")
def get_aeat_integration_status(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene el estado de la integración con AEAT
    """
    registries = get_invoice_registries(db, current_user.id, skip=0, limit=10000)
    
    # Obtener estado del cliente AEAT
    aeat_status = aeat_client.get_integration_status()
    
    return {
        "total_registries": len(registries),
        "sent_to_aeat": len([r for r in registries if r.sent_to_aeat]),
        "pending": len([r for r in registries if not r.sent_to_aeat]),
        "last_sent": max(
            [r.sent_at.isoformat() if r.sent_at else None for r in registries if r.sent_at],
            default=None
        ),
        "integration_enabled": True,
        "aeat_endpoint": aeat_settings.AEAT_PRODUCTION_URL if not aeat_settings.AEAT_USE_SANDBOX else aeat_settings.AEAT_SANDBOX_URL,
        "use_sandbox": aeat_settings.AEAT_USE_SANDBOX,
        "aeat_connection": aeat_status,
        "certificate_configured": aeat_settings.AEAT_DEFAULT_CERTIFICATE_PATH is not None,
    }

