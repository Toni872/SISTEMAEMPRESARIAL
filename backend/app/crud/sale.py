from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, date
from decimal import Decimal
from ..models.sale import Sale, SaleItem
from ..models.product import Product
from ..api.sales.schemas import SaleCreate, SaleUpdate, SaleItemCreate


def generate_sale_number(db: Session) -> str:
    """Genera un número de venta único"""
    today = datetime.now().strftime("%Y%m%d")
    last_sale = db.query(Sale).filter(Sale.sale_number.like(f"SALE-{today}-%")).order_by(Sale.id.desc()).first()
    
    if last_sale:
        last_num = int(last_sale.sale_number.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    
    return f"SALE-{today}-{new_num:04d}"


def get_sale(db: Session, sale_id: int) -> Optional[Sale]:
    """Obtiene una venta con sus items cargados (eager loading)"""
    return db.query(Sale).options(joinedload(Sale.items)).filter(Sale.id == sale_id).first()


def get_sales(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> List[Sale]:
    """Obtiene lista de ventas con items cargados (eager loading para evitar N+1)"""
    query = db.query(Sale).options(joinedload(Sale.items))
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    if status:
        query = query.filter(Sale.status == status)
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
    
    return query.order_by(Sale.created_at.desc()).offset(skip).limit(limit).all()


def create_sale(db: Session, sale: SaleCreate, user_id: int) -> Sale:
    # Calcular totales
    subtotal = Decimal("0")
    for item in sale.items:
        item_subtotal = Decimal(str(item.unit_price)) * item.quantity
        subtotal += item_subtotal
    
    # Calcular impuesto (21% IVA por defecto)
    tax = subtotal * Decimal("0.21")
    total = subtotal + tax
    
    # Crear la venta
    sale_data = sale.model_dump(exclude={"items"})
    sale_data["sale_number"] = generate_sale_number(db)
    sale_data["subtotal"] = subtotal
    sale_data["tax"] = tax
    sale_data["total"] = total
    sale_data["user_id"] = user_id
    
    db_sale = Sale(**sale_data)
    db.add(db_sale)
    db.flush()  # Para obtener el ID
    
    # Crear los items de la venta y actualizar stock
    for item_data in sale.items:
        # Verificar que el producto existe y tiene stock suficiente
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        if not product:
            db.rollback()
            raise ValueError(f"Producto con ID {item_data.product_id} no encontrado")
        
        if product.stock < item_data.quantity:
            db.rollback()
            raise ValueError(f"Stock insuficiente para el producto {product.name}. Stock disponible: {product.stock}")
        
        # Crear el item
        item_subtotal = Decimal(str(item_data.unit_price)) * item_data.quantity
        db_item = SaleItem(
            sale_id=db_sale.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            subtotal=item_subtotal
        )
        db.add(db_item)
        
        # Actualizar stock del producto
        product.stock -= item_data.quantity
    
    db.commit()
    db.refresh(db_sale)
    return db_sale


def update_sale(db: Session, sale_id: int, sale_update: SaleUpdate) -> Optional[Sale]:
    db_sale = get_sale(db, sale_id)
    if not db_sale:
        return None
    
    update_data = sale_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sale, field, value)
    
    db.commit()
    db.refresh(db_sale)
    return db_sale


def delete_sale(db: Session, sale_id: int) -> bool:
    db_sale = get_sale(db, sale_id)
    if not db_sale:
        return False
    
    # Restaurar stock de productos si la venta estaba completada
    if db_sale.status == "completed":
        for item in db_sale.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.stock += item.quantity
    
    db.delete(db_sale)
    db.commit()
    return True


def get_sales_stats(
    db: Session,
    user_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> dict:
    """Obtiene estadísticas de ventas"""
    query = db.query(Sale).filter(Sale.status == "completed")
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
    
    total_sales = query.count()
    total_revenue = query.with_entities(func.sum(Sale.total)).scalar() or Decimal("0")
    total_items = db.query(SaleItem).join(Sale).filter(Sale.status == "completed")
    
    if user_id:
        total_items = total_items.filter(Sale.user_id == user_id)
    
    if start_date:
        total_items = total_items.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        total_items = total_items.filter(func.date(Sale.created_at) <= end_date)
    
    total_items_sold = total_items.with_entities(func.sum(SaleItem.quantity)).scalar() or 0
    
    return {
        "total_sales": total_sales,
        "total_revenue": float(total_revenue),
        "total_items_sold": total_items_sold
    }



