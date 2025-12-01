from fastapi import APIRouter, Depends, status, HTTPException, Query, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User
from ...core.exceptions import NotFoundError, ValidationError, BusinessLogicError
from ...core.logging_config import get_logger
from ...core.rate_limit import limiter, get_rate_limit_dependency

logger = get_logger(__name__)
from ...crud.supplier import (
    get_suppliers,
    get_supplier,
    create_supplier,
    update_supplier,
    delete_supplier
)
from ...crud.purchase import (
    get_purchases,
    get_purchase,
    create_purchase,
    update_purchase,
    delete_purchase
)
from ...utils.purchase_export import (
    generate_purchase_pdf,
    generate_purchases_list_pdf,
    generate_purchases_excel
)
from .schemas import (
    SupplierCreate,
    SupplierUpdate,
    SupplierOut,
    PurchaseCreate,
    PurchaseUpdate,
    PurchaseOut
)

router = APIRouter(prefix="/api/purchases", tags=["purchases"])


# ========== SUPPLIER ENDPOINTS ==========

@router.get("/suppliers", response_model=List[SupplierOut])
def list_suppliers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Lista los proveedores del usuario"""
    suppliers = get_suppliers(db, current_user.id, skip, limit)
    return suppliers


@router.post(
    "/suppliers",
    response_model=SupplierOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=get_rate_limit_dependency("30/minute")
)
def create_supplier_endpoint(
    supplier: SupplierCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Crea un nuevo proveedor"""
    supplier_data = supplier.model_dump(exclude_unset=True)
    # Convertir strings vacíos a None para campos opcionales
    for key in ['tax_id', 'email', 'phone', 'address', 'city', 'postal_code', 'contact_person', 'website', 'notes']:
        if key in supplier_data and supplier_data[key] == '':
            supplier_data[key] = None
    return create_supplier(db, supplier_data, current_user.id)


@router.get("/suppliers/{supplier_id}", response_model=SupplierOut)
def get_supplier_endpoint(
    supplier_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene un proveedor por ID"""
    supplier = get_supplier(db, supplier_id, current_user.id)
    if not supplier:
        logger.warning(
            f"Proveedor no encontrado: {supplier_id}",
            extra={"user_id": current_user.id, "supplier_id": supplier_id}
        )
        raise NotFoundError("Proveedor", supplier_id)
    return supplier


@router.put("/suppliers/{supplier_id}", response_model=SupplierOut)
def update_supplier_endpoint(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Actualiza un proveedor"""
    supplier_data = supplier.model_dump(exclude_unset=True)
    updated = update_supplier(db, supplier_id, current_user.id, supplier_data)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    return updated


@router.delete("/suppliers/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier_endpoint(
    supplier_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Elimina un proveedor"""
    if not delete_supplier(db, supplier_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )


# ========== PURCHASE ENDPOINTS ==========

@router.get("", response_model=List[PurchaseOut])
def list_purchases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Lista las compras del usuario"""
    purchases = get_purchases(db, current_user.id, skip, limit)
    return purchases


@router.post(
    "",
    response_model=PurchaseOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=get_rate_limit_dependency("30/minute")
)
def create_purchase_endpoint(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Crea una nueva compra"""
    purchase_data = purchase.model_dump(exclude={'items'})
    items_data = [item.model_dump() for item in purchase.items]
    
    # Verificar que el proveedor existe y pertenece al usuario
    supplier = get_supplier(db, purchase.supplier_id, current_user.id)
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    return create_purchase(db, purchase_data, items_data, current_user.id)


@router.get("/{purchase_id}", response_model=PurchaseOut)
def get_purchase_endpoint(
    purchase_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene una compra por ID"""
    purchase = get_purchase(db, purchase_id, current_user.id)
    if not purchase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compra no encontrada"
        )
    return purchase


@router.put("/{purchase_id}", response_model=PurchaseOut)
def update_purchase_endpoint(
    purchase_id: int,
    purchase: PurchaseUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Actualiza una compra"""
    purchase_data = purchase.model_dump(exclude_unset=True, exclude={'items'})
    items_data = None
    
    if purchase.items:
        items_data = [item.model_dump() for item in purchase.items]
    
    # Si se cambia el proveedor, verificar que existe
    if purchase_data.get('supplier_id'):
        supplier = get_supplier(db, purchase_data['supplier_id'], current_user.id)
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proveedor no encontrado"
            )
    
    updated = update_purchase(db, purchase_id, current_user.id, purchase_data, items_data)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compra no encontrada"
        )
    return updated


@router.delete("/{purchase_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_purchase_endpoint(
    purchase_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Elimina una compra"""
    if not delete_purchase(db, purchase_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compra no encontrada"
        )


# ========== EXPORT ENDPOINTS ==========

@router.get("/{purchase_id}/export/pdf")
def export_purchase_pdf(
    purchase_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Exporta una compra individual a PDF"""
    purchase = get_purchase(db, purchase_id, current_user.id)
    if not purchase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compra no encontrada"
        )
    
    # Convertir a diccionario para la exportación
    from sqlalchemy.orm import joinedload
    purchase_with_relations = db.query(Purchase).options(
        joinedload(Purchase.supplier),
        joinedload(Purchase.items)
    ).filter(Purchase.id == purchase_id).first()
    
    purchase_data = {
        'purchase_number': purchase_with_relations.purchase_number,
        'purchase_date': purchase_with_relations.purchase_date,
        'supplier': {
            'name': purchase_with_relations.supplier.name,
            'tax_id': purchase_with_relations.supplier.tax_id,
            'address': purchase_with_relations.supplier.address,
        } if purchase_with_relations.supplier else {},
        'status': purchase_with_relations.status.value,
        'subtotal': float(purchase_with_relations.subtotal),
        'tax': float(purchase_with_relations.tax),
        'total': float(purchase_with_relations.total),
        'reference_number': purchase_with_relations.reference_number,
        'notes': purchase_with_relations.notes,
        'items': [
            {
                'description': item.description,
                'quantity': float(item.quantity),
                'unit_price': float(item.unit_price),
                'tax_rate': float(item.tax_rate),
                'subtotal': float(item.subtotal),
            }
            for item in purchase_with_relations.items
        ]
    }
    
    pdf_content = generate_purchase_pdf(purchase_data)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=compra_{purchase_with_relations.purchase_number}.pdf"
        }
    )


@router.get("/export/pdf")
def export_purchases_list_pdf(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    supplier_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Exporta una lista de compras a PDF"""
    from sqlalchemy.orm import joinedload
    from sqlalchemy import and_
    from ...models.purchase import Purchase, PurchaseStatus
    
    query = db.query(Purchase).options(
        joinedload(Purchase.supplier),
        joinedload(Purchase.items)
    ).filter(Purchase.user_id == current_user.id)
    
    # Aplicar filtros
    if supplier_id:
        query = query.filter(Purchase.supplier_id == supplier_id)
    if status:
        try:
            query = query.filter(Purchase.status == PurchaseStatus(status))
        except ValueError:
            pass
    if start_date:
        try:
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Purchase.purchase_date >= start_dt)
        except:
            pass
    if end_date:
        try:
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Purchase.purchase_date <= end_dt)
        except:
            pass
    
    purchases = query.order_by(Purchase.purchase_date.desc()).offset(skip).limit(limit).all()
    
    purchases_data = []
    for purchase in purchases:
        purchases_data.append({
            'purchase_number': purchase.purchase_number,
            'purchase_date': purchase.purchase_date,
            'supplier': {
                'name': purchase.supplier.name if purchase.supplier else 'N/A',
            },
            'status': purchase.status.value,
            'subtotal': float(purchase.subtotal),
            'tax': float(purchase.tax),
            'total': float(purchase.total),
            'reference_number': purchase.reference_number,
        })
    
    pdf_content = generate_purchases_list_pdf(purchases_data)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=compras_{datetime.now().strftime('%Y%m%d')}.pdf"
        }
    )


@router.get("/export/excel")
def export_purchases_excel(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    supplier_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Exporta una lista de compras a Excel"""
    from sqlalchemy.orm import joinedload
    from sqlalchemy import and_
    from ...models.purchase import Purchase, PurchaseStatus
    
    query = db.query(Purchase).options(
        joinedload(Purchase.supplier),
        joinedload(Purchase.items)
    ).filter(Purchase.user_id == current_user.id)
    
    # Aplicar filtros
    if supplier_id:
        query = query.filter(Purchase.supplier_id == supplier_id)
    if status:
        try:
            query = query.filter(Purchase.status == PurchaseStatus(status))
        except ValueError:
            pass
    if start_date:
        try:
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Purchase.purchase_date >= start_dt)
        except:
            pass
    if end_date:
        try:
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Purchase.purchase_date <= end_dt)
        except:
            pass
    
    purchases = query.order_by(Purchase.purchase_date.desc()).offset(skip).limit(limit).all()
    
    purchases_data = []
    for purchase in purchases:
        purchases_data.append({
            'purchase_number': purchase.purchase_number,
            'purchase_date': purchase.purchase_date,
            'supplier': {
                'name': purchase.supplier.name if purchase.supplier else 'N/A',
            },
            'status': purchase.status.value,
            'subtotal': float(purchase.subtotal),
            'tax': float(purchase.tax),
            'total': float(purchase.total),
            'reference_number': purchase.reference_number,
        })
    
    excel_content = generate_purchases_excel(purchases_data)
    
    return Response(
        content=excel_content,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename=compras_{datetime.now().strftime('%Y%m%d')}.xlsx"
        }
    )

