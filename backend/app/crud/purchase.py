from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from ..models.purchase import Purchase, PurchaseItem, PurchaseStatus
from ..models.supplier import Supplier


def generate_purchase_number(db: Session, user_id: int) -> str:
    """Genera un número único de compra"""
    # Contar compras del usuario
    count = db.query(Purchase).filter(Purchase.user_id == user_id).count()
    # Formato: COMP-YYYYMMDD-XXXX
    date_str = datetime.now().strftime("%Y%m%d")
    return f"COMP-{date_str}-{count + 1:04d}"


def get_purchase(db: Session, purchase_id: int, user_id: int) -> Optional[Purchase]:
    """Obtiene una compra por ID"""
    return db.query(Purchase).filter(
        Purchase.id == purchase_id,
        Purchase.user_id == user_id
    ).first()


def get_purchases(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Purchase]:
    """Lista las compras de un usuario"""
    return db.query(Purchase).filter(
        Purchase.user_id == user_id
    ).order_by(Purchase.purchase_date.desc()).offset(skip).limit(limit).all()


def create_purchase(db: Session, purchase_data: dict, items_data: List[dict], user_id: int) -> Purchase:
    """Crea una nueva compra con sus items"""
    # Generar número de compra
    purchase_number = generate_purchase_number(db, user_id)
    
    # Calcular totales si no vienen
    if not purchase_data.get('subtotal'):
        subtotal = sum(Decimal(str(item['subtotal'])) for item in items_data)
        tax = sum(Decimal(str(item['subtotal'])) * Decimal(str(item.get('tax_rate', 21))) / 100 for item in items_data)
        total = subtotal + tax
    else:
        subtotal = Decimal(str(purchase_data['subtotal']))
        tax = Decimal(str(purchase_data.get('tax', 0)))
        total = Decimal(str(purchase_data['total']))
    
    # Crear compra
    purchase = Purchase(
        user_id=user_id,
        purchase_number=purchase_number,
        subtotal=subtotal,
        tax=tax,
        total=total,
        **{k: v for k, v in purchase_data.items() if k not in ['subtotal', 'tax', 'total', 'items']}
    )
    
    db.add(purchase)
    db.flush()  # Para obtener el ID
    
    # Crear items
    for item_data in items_data:
        item = PurchaseItem(
            purchase_id=purchase.id,
            **item_data
        )
        db.add(item)
    
    db.commit()
    db.refresh(purchase)
    return purchase


def update_purchase(db: Session, purchase_id: int, user_id: int, purchase_data: dict, items_data: Optional[List[dict]] = None) -> Optional[Purchase]:
    """Actualiza una compra"""
    purchase = get_purchase(db, purchase_id, user_id)
    if not purchase:
        return None
    
    # Actualizar campos de la compra
    for key, value in purchase_data.items():
        if value is not None and key != 'items':
            setattr(purchase, key, value)
    
    # Si hay items nuevos, reemplazar los existentes
    if items_data is not None:
        # Eliminar items existentes
        db.query(PurchaseItem).filter(PurchaseItem.purchase_id == purchase.id).delete()
        
        # Crear nuevos items
        for item_data in items_data:
            item = PurchaseItem(
                purchase_id=purchase.id,
                **item_data
            )
            db.add(item)
        
        # Recalcular totales
        subtotal = sum(Decimal(str(item['subtotal'])) for item in items_data)
        tax = sum(Decimal(str(item['subtotal'])) * Decimal(str(item.get('tax_rate', 21))) / 100 for item in items_data)
        purchase.subtotal = subtotal
        purchase.tax = tax
        purchase.total = subtotal + tax
    
    db.commit()
    db.refresh(purchase)
    return purchase


def delete_purchase(db: Session, purchase_id: int, user_id: int) -> bool:
    """Elimina una compra"""
    purchase = get_purchase(db, purchase_id, user_id)
    if not purchase:
        return False
    
    db.delete(purchase)
    db.commit()
    return True

