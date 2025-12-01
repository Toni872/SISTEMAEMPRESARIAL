from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from ...api.auth.deps import get_db_session, get_current_user
from ...api.invoices.schemas import InvoiceOut, InvoiceCreate, InvoiceListOut, InvoiceItemOut
from ...crud.sale import get_sale, get_sales
from ...crud.invoice_registry import get_invoice_registry, create_invoice_registry
from ...models.user import User
from ...core.exceptions import NotFoundError, AuthorizationError, BusinessLogicError
from ...core.logging_config import get_logger

logger = get_logger(__name__)

router = APIRouter(
    prefix="/api/invoices",
    tags=["invoices"],
    responses={
        401: {"description": "No autenticado"},
        403: {"description": "No autorizado"},
        404: {"description": "Recurso no encontrado"},
        422: {"description": "Error de validación"},
        400: {"description": "Error de lógica de negocio"}
    }
)


def sale_to_invoice_out(sale, invoice_registry=None):
    """Convierte una Sale a InvoiceOut"""
    return InvoiceOut(
        id=sale.id,
        sale_id=sale.id,
        sale_number=sale.sale_number,
        customer_name=sale.customer_name,
        customer_email=sale.customer_email,
        customer_phone=sale.customer_phone,
        subtotal=sale.subtotal,
        tax=sale.tax,
        total=sale.total,
        status=sale.status,
        created_at=sale.created_at,
        items=[
            InvoiceItemOut(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name if item.product else "Producto",
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.subtotal,
            )
            for item in sale.items
        ],
        invoice_registry_id=invoice_registry.id if invoice_registry else None,
        invoice_hash=invoice_registry.hash if invoice_registry else None,
        qr_code=invoice_registry.qr_code if invoice_registry else None,
        sent_to_aeat=invoice_registry.sent_to_aeat if invoice_registry else False,
    )


@router.get(
    "",
    response_model=InvoiceListOut,
    summary="Listar facturas",
    description="""
    Obtiene una lista paginada de facturas (ventas) del usuario actual.
    Las facturas son ventas que pueden tener un registro Verifactu asociado.
    
    **Filtros disponibles:**
    - `status`: Filtrar por estado (pending, completed, cancelled)
    - `has_registry`: Filtrar solo facturas con registro Verifactu (true/false)
    
    **Nota:** Solo se retornan las facturas del usuario autenticado.
    """,
    responses={
        200: {"description": "Lista de facturas obtenida exitosamente"}
    }
)
def list_invoices(
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros"),
    status: Optional[str] = Query(None, description="Filtrar por estado", example="completed"),
    has_registry: Optional[bool] = Query(None, description="Filtrar solo facturas con registro Verifactu"),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Listar facturas del usuario actual"""
    # Obtener ventas
    sales = get_sales(
        db,
        skip=skip,
        limit=limit,
        user_id=current_user.id,
        status=status,
    )
    
    # Convertir a facturas y filtrar por registro si es necesario
    invoices = []
    for sale in sales:
        registry = get_invoice_registry(db, sale.id)
        
        # Filtrar por has_registry si se especifica
        if has_registry is not None:
            if has_registry and not registry:
                continue
            if not has_registry and registry:
                continue
        
        invoice = sale_to_invoice_out(sale, registry)
        invoices.append(invoice)
    
    # Contar total (sin paginación para el filtro has_registry)
    total_sales = get_sales(
        db,
        skip=0,
        limit=10000,
        user_id=current_user.id,
        status=status,
    )
    
    if has_registry is not None:
        total = sum(
            1 for sale in total_sales
            if (has_registry and get_invoice_registry(db, sale.id)) or
               (not has_registry and not get_invoice_registry(db, sale.id))
        )
    else:
        total = len(total_sales)
    
    return InvoiceListOut(
        invoices=invoices,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get(
    "/{invoice_id}",
    response_model=InvoiceOut,
    summary="Obtener factura por ID",
    description="""
    Obtiene los detalles completos de una factura por su ID.
    La factura incluye información de la venta y del registro Verifactu si existe.
    """,
    responses={
        200: {"description": "Factura obtenida exitosamente"},
        404: {"description": "Factura no encontrada"}
    }
)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtener factura por ID"""
    sale = get_sale(db, invoice_id)
    if not sale:
        raise NotFoundError("Factura", invoice_id)
    
    if sale.user_id != current_user.id:
        raise AuthorizationError("No tienes permiso para ver esta factura")
    
    registry = get_invoice_registry(db, sale.id)
    return sale_to_invoice_out(sale, registry)


@router.post(
    "",
    response_model=InvoiceOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear factura desde venta",
    description="""
    Crea una factura desde una venta existente.
    
    **Opciones:**
    - `register_in_verifactu`: Si es True, registra automáticamente la factura en Verifactu
    
    **Nota:** La venta debe existir y pertenecer al usuario autenticado.
    """,
    responses={
        201: {"description": "Factura creada exitosamente"},
        400: {"description": "La venta ya tiene una factura registrada"},
        404: {"description": "Venta no encontrada"}
    }
)
def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Crear factura desde venta"""
    sale = get_sale(db, invoice_data.sale_id)
    if not sale:
        raise NotFoundError("Venta", invoice_data.sale_id)
    
    if sale.user_id != current_user.id:
        raise AuthorizationError("No tienes permiso para facturar esta venta")
    
    # Verificar si ya tiene registro
    existing_registry = get_invoice_registry(db, sale.id)
    if existing_registry:
        if invoice_data.register_in_verifactu:
            raise BusinessLogicError("Esta venta ya tiene una factura registrada en Verifactu")
        # Si no se requiere registro, retornar la factura existente
        return sale_to_invoice_out(sale, existing_registry)
    
    # Crear registro Verifactu si se solicita
    registry = None
    if invoice_data.register_in_verifactu:
        try:
            registry = create_invoice_registry(db, sale)
            logger.info(f"Factura creada y registrada en Verifactu: {sale.id}", extra={
                "sale_id": sale.id,
                "user_id": current_user.id,
                "registry_id": registry.id
            })
        except Exception as e:
            logger.error(f"Error creando registro Verifactu: {e}", extra={
                "sale_id": sale.id,
                "user_id": current_user.id
            })
            raise BusinessLogicError(f"Error al registrar factura en Verifactu: {str(e)}")
    
    return sale_to_invoice_out(sale, registry)


