from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case, extract
from typing import List, Optional, Dict
from datetime import datetime, date, timedelta
from decimal import Decimal
from ..models.sale import Sale, SaleItem
from ..models.product import Product


def get_average_ticket(db: Session, user_id: Optional[int] = None, start_date: Optional[date] = None, end_date: Optional[date] = None) -> float:
    """Calcula el ticket promedio"""
    query = db.query(Sale).filter(Sale.status == "completed")
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
    
    total_revenue = query.with_entities(func.sum(Sale.total)).scalar() or Decimal("0")
    total_sales = query.count()
    
    if total_sales == 0:
        return 0.0
    
    return float(total_revenue / total_sales)


def get_profit_margin(db: Session, user_id: Optional[int] = None, start_date: Optional[date] = None, end_date: Optional[date] = None) -> Dict[str, float]:
    """Calcula el margen de beneficio"""
    query = db.query(Sale).filter(Sale.status == "completed")
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
    
    # Obtener todas las ventas completadas
    sales = query.all()
    
    total_revenue = Decimal("0")
    total_cost = Decimal("0")
    
    for sale in sales:
        total_revenue += sale.total
        
        # Calcular costo total de los items vendidos
        for item in sale.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product and product.cost:
                total_cost += Decimal(str(product.cost)) * item.quantity
    
    total_revenue_float = float(total_revenue)
    total_cost_float = float(total_cost)
    total_profit = total_revenue_float - total_cost_float
    
    if total_revenue_float == 0:
        return {
            "profit_margin": 0.0,
            "total_profit": 0.0
        }
    
    profit_margin = (total_profit / total_revenue_float) * 100
    
    return {
        "profit_margin": profit_margin,
        "total_profit": total_profit
    }


def get_period_comparison(db: Session, user_id: Optional[int] = None, period: str = "month") -> Dict[str, float]:
    """Compara el período actual con el anterior"""
    today = date.today()
    
    if period == "month":
        # Período actual: este mes
        current_start = date(today.year, today.month, 1)
        current_end = today
        
        # Período anterior: mes pasado
        if today.month == 1:
            previous_start = date(today.year - 1, 12, 1)
            previous_end = date(today.year - 1, 12, 31)
        else:
            previous_start = date(today.year, today.month - 1, 1)
            previous_end = date(today.year, today.month - 1, 28)  # Aproximado
        
        previous_end = min(previous_end, date.today() - timedelta(days=1))
    
    elif period == "week":
        # Período actual: esta semana
        days_since_monday = today.weekday()
        current_start = today - timedelta(days=days_since_monday)
        current_end = today
        
        # Período anterior: semana pasada
        previous_start = current_start - timedelta(days=7)
        previous_end = current_start - timedelta(days=1)
    
    else:  # year
        # Período actual: este año
        current_start = date(today.year, 1, 1)
        current_end = today
        
        # Período anterior: año pasado
        previous_start = date(today.year - 1, 1, 1)
        previous_end = date(today.year - 1, 12, 31)
    
    # Calcular estadísticas del período actual
    current_query = db.query(Sale).filter(
        Sale.status == "completed",
        func.date(Sale.created_at) >= current_start,
        func.date(Sale.created_at) <= current_end
    )
    
    if user_id:
        current_query = current_query.filter(Sale.user_id == user_id)
    
    current_revenue = current_query.with_entities(func.sum(Sale.total)).scalar() or Decimal("0")
    current_sales = current_query.count()
    
    # Calcular estadísticas del período anterior
    previous_query = db.query(Sale).filter(
        Sale.status == "completed",
        func.date(Sale.created_at) >= previous_start,
        func.date(Sale.created_at) <= previous_end
    )
    
    if user_id:
        previous_query = previous_query.filter(Sale.user_id == user_id)
    
    previous_revenue = previous_query.with_entities(func.sum(Sale.total)).scalar() or Decimal("0")
    previous_sales = previous_query.count()
    
    # Calcular cambios porcentuales
    revenue_change = 0.0
    sales_change = 0.0
    
    if float(previous_revenue) > 0:
        revenue_change = ((float(current_revenue) - float(previous_revenue)) / float(previous_revenue)) * 100
    
    if previous_sales > 0:
        sales_change = ((current_sales - previous_sales) / previous_sales) * 100
    
    return {
        "current_revenue": float(current_revenue),
        "current_sales": current_sales,
        "previous_revenue": float(previous_revenue),
        "previous_sales": previous_sales,
        "revenue_change_percent": revenue_change,
        "sales_change_percent": sales_change
    }


def get_top_products(db: Session, user_id: Optional[int] = None, limit: int = 5, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict]:
    """Obtiene los productos más vendidos"""
    query = db.query(
        SaleItem.product_id,
        Product.name,
        func.sum(SaleItem.quantity).label('total_sold'),
        func.sum(SaleItem.subtotal).label('total_revenue')
    ).join(
        Product, SaleItem.product_id == Product.id
    ).join(
        Sale, SaleItem.sale_id == Sale.id
    ).filter(
        Sale.status == "completed"
    )
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
    
    results = query.group_by(
        SaleItem.product_id,
        Product.name
    ).order_by(
        func.sum(SaleItem.quantity).desc()
    ).limit(limit).all()
    
    # Calcular total para porcentajes
    total_sold = sum(r.total_sold for r in results) if results else 1
    
    top_products = []
    for r in results:
        top_products.append({
            "product_id": r.product_id,
            "product_name": r.name,
            "total_sold": int(r.total_sold),
            "total_revenue": float(r.total_revenue),
            "percentage": (r.total_sold / total_sold) * 100 if total_sold > 0 else 0
        })
    
    return top_products


def get_top_customers(db: Session, user_id: Optional[int] = None, limit: int = 5, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict]:
    """Obtiene los clientes más valiosos"""
    query = db.query(
        Sale.customer_email,
        Sale.customer_name,
        func.count(Sale.id).label('total_sales'),
        func.sum(Sale.total).label('total_revenue')
    ).filter(
        Sale.status == "completed"
    )
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
    
    results = query.group_by(
        Sale.customer_email,
        Sale.customer_name
    ).order_by(
        func.sum(Sale.total).desc()
    ).limit(limit).all()
    
    # Calcular total para porcentajes
    total_revenue = sum(float(r.total_revenue) for r in results) if results else 1
    
    top_customers = []
    for r in results:
        top_customers.append({
            "customer_email": r.customer_email,
            "customer_name": r.customer_name,
            "total_sales": int(r.total_sales),
            "total_revenue": float(r.total_revenue),
            "percentage": (float(r.total_revenue) / total_revenue) * 100 if total_revenue > 0 else 0
        })
    
    return top_customers


def get_sales_timeline(db: Session, user_id: Optional[int] = None, period: str = "monthly", months: int = 12) -> List[Dict]:
    """Obtiene ventas por período para gráfico de línea"""
    today = date.today()
    timeline = []
    
    if period == "monthly":
        for i in range(months - 1, -1, -1):
            # Calcular fecha del mes
            if today.month - i <= 0:
                year = today.year - 1
                month = today.month - i + 12
            else:
                year = today.year
                month = today.month - i
            
            month_start = date(year, month, 1)
            
            # Calcular último día del mes
            if month == 12:
                month_end = date(year + 1, 1, 1) - timedelta(days=1)
            else:
                month_end = date(year, month + 1, 1) - timedelta(days=1)
            
            month_end = min(month_end, today)
            
            query = db.query(Sale).filter(
                Sale.status == "completed",
                func.date(Sale.created_at) >= month_start,
                func.date(Sale.created_at) <= month_end
            )
            
            if user_id:
                query = query.filter(Sale.user_id == user_id)
            
            sales_count = query.count()
            revenue = query.with_entities(func.sum(Sale.total)).scalar() or Decimal("0")
            
            month_names = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
            timeline.append({
                "period": f"{month_names[month - 1]} {str(year)[-2:]}",
                "sales_count": sales_count,
                "revenue": float(revenue)
            })
    
    elif period == "weekly":
        # Últimas 12 semanas
        for i in range(11, -1, -1):
            week_start = today - timedelta(weeks=i, days=today.weekday())
            week_end = week_start + timedelta(days=6)
            week_end = min(week_end, today)
            
            query = db.query(Sale).filter(
                Sale.status == "completed",
                func.date(Sale.created_at) >= week_start,
                func.date(Sale.created_at) <= week_end
            )
            
            if user_id:
                query = query.filter(Sale.user_id == user_id)
            
            sales_count = query.count()
            revenue = query.with_entities(func.sum(Sale.total)).scalar() or Decimal("0")
            
            timeline.append({
                "period": f"Sem {week_start.isocalendar()[1]}",
                "sales_count": sales_count,
                "revenue": float(revenue)
            })
    
    return timeline


def get_category_distribution(db: Session, user_id: Optional[int] = None, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict]:
    """Obtiene distribución de ventas por categoría"""
    query = db.query(
        Product.category,
        func.count(Sale.id).label('sales_count'),
        func.sum(Sale.total).label('revenue')
    ).join(
        SaleItem, Product.id == SaleItem.product_id
    ).join(
        Sale, SaleItem.sale_id == Sale.id
    ).filter(
        Sale.status == "completed"
    )
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
    
    results = query.group_by(Product.category).all()
    
    # Calcular total para porcentajes
    total_revenue = sum(float(r.revenue) for r in results) if results else 1
    
    distribution = []
    for r in results:
        distribution.append({
            "category": r.category or "Sin categoría",
            "sales_count": int(r.sales_count),
            "revenue": float(r.revenue),
            "percentage": (float(r.revenue) / total_revenue) * 100 if total_revenue > 0 else 0
        })
    
    return distribution


def get_sales_by_status(db: Session, user_id: Optional[int] = None) -> Dict[str, int]:
    """Obtiene conteo de ventas por estado"""
    query = db.query(Sale.status, func.count(Sale.id).label('count'))
    
    if user_id:
        query = query.filter(Sale.user_id == user_id)
    
    results = query.group_by(Sale.status).all()
    
    status_dict = {
        "completed": 0,
        "pending": 0,
        "cancelled": 0
    }
    
    for r in results:
        if r.status in status_dict:
            status_dict[r.status] = int(r.count)
    
    return status_dict


def get_dashboard_alerts(db: Session, user_id: Optional[int] = None) -> List[Dict]:
    """Genera alertas proactivas para el dashboard"""
    alerts = []
    
    # Alertas de stock crítico
    low_stock_query = db.query(Product).filter(
        Product.stock <= Product.min_stock,
        Product.is_active == True
    )
    low_stock_count = low_stock_query.count()
    
    if low_stock_count > 0:
        alerts.append({
            "type": "stock_critical",
            "severity": "high",
            "title": "Stock Crítico",
            "message": f"{low_stock_count} producto(s) con stock bajo o agotado",
            "count": low_stock_count,
            "action_url": "/products?filter=low_stock"
        })
    
    # Alertas de ventas pendientes antiguas (>30 días)
    thirty_days_ago = date.today() - timedelta(days=30)
    pending_sales_query = db.query(Sale).filter(
        Sale.status == "pending",
        func.date(Sale.created_at) <= thirty_days_ago
    )
    
    if user_id:
        pending_sales_query = pending_sales_query.filter(Sale.user_id == user_id)
    
    pending_count = pending_sales_query.count()
    
    if pending_count > 0:
        alerts.append({
            "type": "pending_sales",
            "severity": "medium",
            "title": "Ventas Pendientes Antiguas",
            "message": f"{pending_count} venta(s) pendientes por más de 30 días",
            "count": pending_count,
            "action_url": "/sales?status=pending"
        })
    
    # Alertas de productos sin movimiento (sin ventas en 30 días)
    # Obtener IDs de productos con ventas en los últimos 30 días
    products_with_sales_ids = db.query(SaleItem.product_id).join(
        Sale, SaleItem.sale_id == Sale.id
    ).filter(
        Sale.status == "completed",
        func.date(Sale.created_at) >= thirty_days_ago
    ).distinct().all()
    
    products_with_sales_ids_list = [pid[0] for pid in products_with_sales_ids]
    
    # Productos activos sin ventas en los últimos 30 días
    if products_with_sales_ids_list:
        no_movement_query = db.query(Product).filter(
            Product.is_active == True,
            ~Product.id.in_(products_with_sales_ids_list)
        )
    else:
        # Si no hay productos con ventas, todos los productos activos están sin movimiento
        no_movement_query = db.query(Product).filter(
            Product.is_active == True
        )
    
    no_movement_count = no_movement_query.count()
    
    if no_movement_count > 0:
        alerts.append({
            "type": "no_movement_products",
            "severity": "low",
            "title": "Productos Sin Movimiento",
            "message": f"{no_movement_count} producto(s) sin ventas en los últimos 30 días",
            "count": no_movement_count,
            "action_url": "/products"
        })
    
    return alerts

