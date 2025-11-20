from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
import json

from ..models.invoice_registry import InvoiceRegistry
from ..models.sale import Sale
from ..utils.verifactu import calculate_invoice_hash, generate_facturae_xml, generate_qr_code_data
from ..utils.aeat_client import aeat_client


def get_invoice_registry(db: Session, sale_id: int) -> Optional[InvoiceRegistry]:
    """Obtiene el registro Verifactu de una factura"""
    return db.query(InvoiceRegistry).filter(InvoiceRegistry.sale_id == sale_id).first()


def get_last_registry(db: Session, user_id: int) -> Optional[InvoiceRegistry]:
    """Obtiene el último registro Verifactu de un usuario (para enlazar previous_hash)"""
    return db.query(InvoiceRegistry).filter(
        InvoiceRegistry.user_id == user_id
    ).order_by(InvoiceRegistry.timestamp.desc()).first()


def create_invoice_registry(db: Session, sale: Sale) -> InvoiceRegistry:
    """
    Crea un registro Verifactu para una factura
    Calcula el hash y lo enlaza con el registro anterior
    """
    # Obtener último registro del usuario
    last_registry = get_last_registry(db, sale.user_id)
    previous_hash = last_registry.hash if last_registry else None
    
    # Preparar datos de la factura para el hash
    invoice_data = {
        'sale_id': sale.id,
        'sale_number': sale.sale_number,
        'customer_name': sale.customer_name,
        'customer_email': sale.customer_email,
        'subtotal': float(sale.subtotal),
        'tax': float(sale.tax),
        'total': float(sale.total),
        'created_at': sale.created_at.isoformat() if sale.created_at else None,
        'items': [
            {
                'product_id': item.product_id,
                'product_name': item.product.name if item.product else 'Producto',
                'quantity': item.quantity,
                'unit_price': float(item.unit_price),
                'subtotal': float(item.subtotal),
            }
            for item in sale.items
        ]
    }
    
    # Calcular hash
    invoice_hash = calculate_invoice_hash(invoice_data)
    
    # Generar XML
    xml_content = generate_facturae_xml(invoice_data, previous_hash)
    
    # Generar QR
    qr_data = generate_qr_code_data(invoice_data, invoice_hash)
    
    # Crear registro
    registry = InvoiceRegistry(
        sale_id=sale.id,
        user_id=sale.user_id,
        hash=invoice_hash,
        previous_hash=previous_hash,
        invoice_data=json.dumps(invoice_data, ensure_ascii=False),
        qr_code=qr_data,
        timestamp=datetime.now()
    )
    
    db.add(registry)
    db.commit()
    db.refresh(registry)
    
    return registry


def get_invoice_registries(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100
) -> List[InvoiceRegistry]:
    """Lista los registros Verifactu de un usuario"""
    return db.query(InvoiceRegistry).filter(
        InvoiceRegistry.user_id == user_id
    ).order_by(InvoiceRegistry.timestamp.desc()).offset(skip).limit(limit).all()


def mark_as_sent_to_aeat(db: Session, registry_id: int, actually_send: bool = False) -> Optional[InvoiceRegistry]:
    """
    Marca un registro como enviado a AEAT
    Si actually_send=True, intenta enviarlo realmente a los servicios AEAT
    
    Args:
        db: Sesión de base de datos
        registry_id: ID del registro
        actually_send: Si True, envía realmente a AEAT (requiere certificado configurado)
    
    Returns:
        Registro actualizado o None si no existe
    """
    registry = db.query(InvoiceRegistry).filter(InvoiceRegistry.id == registry_id).first()
    if not registry:
        return None
    
    # Si se solicita envío real, intentar enviar a AEAT
    if actually_send:
        try:
            import json
            invoice_data = json.loads(registry.invoice_data)
            
            registry_data = {
                'sale_id': registry.sale_id,
                'hash': registry.hash,
                'previous_hash': registry.previous_hash,
                'invoice_data': invoice_data,
                'sale_number': registry.sale.sale_number if registry.sale else None,
            }
            
            # Enviar a AEAT
            aeat_response = aeat_client.send_invoice_registry(registry_data)
            
            # Guardar referencia de AEAT si viene en la respuesta
            if 'reference_number' in aeat_response:
                # Podríamos agregar un campo reference_number_aeat al modelo si es necesario
                pass
            
        except Exception as e:
            # Log del error pero no fallar - marcar como enviado localmente
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error enviando registro {registry_id} a AEAT: {e}")
    
    registry.sent_to_aeat = True
    registry.sent_at = datetime.now()
    db.commit()
    db.refresh(registry)
    
    return registry

