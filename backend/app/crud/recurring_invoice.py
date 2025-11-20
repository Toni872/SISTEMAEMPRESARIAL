from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import date, datetime, timedelta
from decimal import Decimal

from ..models.recurring_invoice import RecurringInvoice, RecurringInvoiceItem
from ..api.recurring_invoices.schemas import RecurringInvoiceCreate, RecurringInvoiceUpdate
from ..crud.sale import create_sale
from ..api.sales.schemas import SaleCreate, SaleItemCreate


def calculate_next_run_date(
    frequency: str,
    current_date: date,
    day_of_month: Optional[int] = None
) -> date:
    """Calcula la próxima fecha de ejecución según la frecuencia"""
    if frequency == "daily":
        return current_date + timedelta(days=1)
    elif frequency == "weekly":
        return current_date + timedelta(weeks=1)
    elif frequency == "monthly":
        # Si hay día específico del mes
        if day_of_month:
            # Calcular siguiente mes con ese día
            if current_date.month == 12:
                next_month = 1
                next_year = current_date.year + 1
            else:
                next_month = current_date.month + 1
                next_year = current_date.year
            
            # Asegurar que el día existe en el mes (ej: 31 en febrero)
            try:
                return date(next_year, next_month, day_of_month)
            except ValueError:
                # Si el día no existe, usar el último día del mes
                from calendar import monthrange
                last_day = monthrange(next_year, next_month)[1]
                return date(next_year, next_month, min(day_of_month, last_day))
        else:
            # Usar el mismo día del mes siguiente
            if current_date.month == 12:
                return date(current_date.year + 1, 1, current_date.day)
            else:
                return date(current_date.year, current_date.month + 1, current_date.day)
    elif frequency == "quarterly":
        # Cada 3 meses
        if current_date.month <= 9:
            return date(current_date.year, current_date.month + 3, current_date.day)
        else:
            return date(current_date.year + 1, current_date.month - 9, current_date.day)
    elif frequency == "yearly":
        return date(current_date.year + 1, current_date.month, current_date.day)
    else:
        raise ValueError(f"Frecuencia no válida: {frequency}")


def get_recurring_invoice(db: Session, recurring_invoice_id: int) -> Optional[RecurringInvoice]:
    """Obtiene una factura recurrente por ID"""
    return db.query(RecurringInvoice).filter(RecurringInvoice.id == recurring_invoice_id).first()


def get_recurring_invoices(
    db: Session,
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None
) -> List[RecurringInvoice]:
    """Lista facturas recurrentes"""
    query = db.query(RecurringInvoice)
    
    if user_id:
        query = query.filter(RecurringInvoice.user_id == user_id)
    
    if is_active is not None:
        query = query.filter(RecurringInvoice.is_active == is_active)
    
    return query.order_by(RecurringInvoice.created_at.desc()).offset(skip).limit(limit).all()


def create_recurring_invoice(
    db: Session,
    recurring_invoice: RecurringInvoiceCreate,
    user_id: int
) -> RecurringInvoice:
    """Crea una nueva factura recurrente"""
    # Calcular próxima fecha de ejecución
    next_run = calculate_next_run_date(
        recurring_invoice.frequency,
        recurring_invoice.start_date,
        recurring_invoice.day_of_month
    )
    
    # Crear la factura recurrente
    db_recurring = RecurringInvoice(
        name=recurring_invoice.name,
        user_id=user_id,
        customer_name=recurring_invoice.customer_name,
        customer_email=recurring_invoice.customer_email,
        customer_phone=recurring_invoice.customer_phone,
        frequency=recurring_invoice.frequency,
        start_date=recurring_invoice.start_date,
        end_date=recurring_invoice.end_date,
        next_run_date=next_run,
        day_of_month=recurring_invoice.day_of_month,
        notes=recurring_invoice.notes,
        is_active=recurring_invoice.is_active,
    )
    
    db.add(db_recurring)
    db.flush()  # Para obtener el ID
    
    # Crear los items
    for item_data in recurring_invoice.items:
        db_item = RecurringInvoiceItem(
            recurring_invoice_id=db_recurring.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            description=item_data.description,
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_recurring)
    return db_recurring


def update_recurring_invoice(
    db: Session,
    recurring_invoice_id: int,
    recurring_invoice_update: RecurringInvoiceUpdate
) -> Optional[RecurringInvoice]:
    """Actualiza una factura recurrente"""
    db_recurring = get_recurring_invoice(db, recurring_invoice_id)
    if not db_recurring:
        return None
    
    update_data = recurring_invoice_update.model_dump(exclude_unset=True)
    
    # Si cambia la frecuencia o start_date, recalcular next_run_date
    if "frequency" in update_data or "start_date" in update_data or "day_of_month" in update_data:
        frequency = update_data.get("frequency", db_recurring.frequency)
        start_date = update_data.get("start_date", db_recurring.start_date)
        day_of_month = update_data.get("day_of_month", db_recurring.day_of_month)
        update_data["next_run_date"] = calculate_next_run_date(frequency, start_date, day_of_month)
    
    for field, value in update_data.items():
        setattr(db_recurring, field, value)
    
    db.commit()
    db.refresh(db_recurring)
    return db_recurring


def delete_recurring_invoice(db: Session, recurring_invoice_id: int) -> bool:
    """Elimina una factura recurrente"""
    db_recurring = get_recurring_invoice(db, recurring_invoice_id)
    if not db_recurring:
        return False
    
    db.delete(db_recurring)
    db.commit()
    return True


def generate_invoice_from_recurring(
    db: Session,
    recurring_invoice_id: int
) -> Optional[dict]:
    """
    Genera una factura (Sale) a partir de una factura recurrente
    Retorna la factura creada o None si hay error
    """
    recurring = get_recurring_invoice(db, recurring_invoice_id)
    if not recurring or not recurring.is_active:
        return None
    
    # Verificar que es la fecha correcta (o ya pasó)
    today = date.today()
    if recurring.next_run_date > today:
        return None
    
    # Verificar que no haya expirado
    if recurring.end_date and recurring.end_date < today:
        recurring.is_active = False
        db.commit()
        return None
    
    # Crear los items para la factura
    sale_items = []
    for item in recurring.items:
        sale_items.append(SaleItemCreate(
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        ))
    
    # Crear la factura
    sale_create = SaleCreate(
        customer_name=recurring.customer_name,
        customer_email=recurring.customer_email,
        customer_phone=recurring.customer_phone,
        notes=f"Factura generada automáticamente desde: {recurring.name}",
        status="pending",
        items=sale_items
    )
    
    # Crear la venta usando la función existente
    sale = create_sale(db, sale_create, recurring.user_id)
    
    # Marcar que fue generada por esta factura recurrente
    sale.recurring_invoice_id = recurring.id
    
    # Actualizar la factura recurrente
    recurring.total_invoices_generated += 1
    recurring.next_run_date = calculate_next_run_date(
        recurring.frequency,
        today,
        recurring.day_of_month
    )
    
    db.commit()
    db.refresh(sale)
    
    return {
        "sale": sale,
        "recurring_invoice": recurring
    }


def process_due_recurring_invoices(db: Session) -> dict:
    """
    Procesa todas las facturas recurrentes que están listas para generar
    Retorna estadísticas del proceso
    """
    today = date.today()
    
    # Obtener facturas recurrentes activas que deben ejecutarse hoy o antes
    due_invoices = db.query(RecurringInvoice).filter(
        and_(
            RecurringInvoice.is_active == True,
            RecurringInvoice.next_run_date <= today,
            RecurringInvoice.start_date <= today
        )
    ).all()
    
    stats = {
        "processed": 0,
        "generated": 0,
        "errors": 0,
        "expired": 0
    }
    
    for recurring in due_invoices:
        stats["processed"] += 1
        
        # Verificar si expiró
        if recurring.end_date and recurring.end_date < today:
            recurring.is_active = False
            stats["expired"] += 1
            continue
        
        try:
            result = generate_invoice_from_recurring(db, recurring.id)
            if result:
                stats["generated"] += 1
            else:
                stats["errors"] += 1
        except Exception as e:
            print(f"Error generando factura recurrente {recurring.id}: {e}")
            stats["errors"] += 1
    
    db.commit()
    return stats

