from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User
from ...crud.dashboard import (
    get_average_ticket,
    get_profit_margin,
    get_period_comparison,
    get_top_products,
    get_top_customers,
    get_sales_timeline,
    get_category_distribution,
    get_sales_by_status,
    get_dashboard_alerts
)
from ...crud.sale import get_sales_stats
from ...crud.product import get_products_count, get_low_stock_products
from .schemas import DashboardStats, TopProduct, TopCustomer, SalesTimelinePoint, CategoryDistribution, DashboardAlert

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    period: str = Query("month", regex="^(month|week|year)$"),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene todas las estadísticas del dashboard"""
    
    # Obtener métricas básicas
    sales_stats = get_sales_stats(db, user_id=current_user.id)
    products_count = get_products_count(db, is_active=True)
    low_stock_products = get_low_stock_products(db)
    
    # Calcular métricas financieras
    average_ticket = get_average_ticket(db, user_id=current_user.id)
    profit_data = get_profit_margin(db, user_id=current_user.id)
    
    # Comparaciones temporales
    comparison = get_period_comparison(db, user_id=current_user.id, period=period)
    
    # Top items
    top_products = get_top_products(db, user_id=current_user.id, limit=5)
    top_customers = get_top_customers(db, user_id=current_user.id, limit=5)
    
    # Distribuciones
    category_dist = get_category_distribution(db, user_id=current_user.id)
    sales_by_status = get_sales_by_status(db, user_id=current_user.id)
    
    # Timeline
    timeline = get_sales_timeline(db, user_id=current_user.id, period="monthly", months=12)
    
    # Alertas
    alerts = get_dashboard_alerts(db, user_id=current_user.id)
    
    return DashboardStats(
        total_revenue=sales_stats["total_revenue"],
        total_sales=sales_stats["total_sales"],
        total_products=products_count,
        low_stock_count=len(low_stock_products),
        average_ticket=average_ticket,
        profit_margin=profit_data["profit_margin"],
        total_profit=profit_data["total_profit"],
        revenue_change_percent=comparison["revenue_change_percent"],
        sales_change_percent=comparison["sales_change_percent"],
        revenue_previous_period=comparison["previous_revenue"],
        sales_previous_period=comparison["previous_sales"],
        top_products=[TopProduct(**p) for p in top_products],
        top_customers=[TopCustomer(**c) for c in top_customers],
        category_distribution=[CategoryDistribution(**d) for d in category_dist],
        sales_by_status=sales_by_status,
        sales_timeline=[SalesTimelinePoint(**t) for t in timeline],
        alerts=[DashboardAlert(**a) for a in alerts]
    )


@router.get("/top-products")
def get_top_products_endpoint(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene los productos más vendidos"""
    products = get_top_products(db, user_id=current_user.id, limit=limit)
    return {"products": products}


@router.get("/top-customers")
def get_top_customers_endpoint(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene los clientes más valiosos"""
    customers = get_top_customers(db, user_id=current_user.id, limit=limit)
    return {"customers": customers}


@router.get("/timeline")
def get_timeline_endpoint(
    period: str = Query("monthly", regex="^(monthly|weekly)$"),
    months: int = Query(12, ge=1, le=24),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene ventas por período para gráficos"""
    timeline = get_sales_timeline(db, user_id=current_user.id, period=period, months=months)
    return {"timeline": timeline}


@router.get("/category-distribution")
def get_category_distribution_endpoint(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene distribución de ventas por categoría"""
    distribution = get_category_distribution(db, user_id=current_user.id)
    return {"distribution": distribution}


@router.get("/alerts")
def get_alerts_endpoint(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene alertas proactivas"""
    alerts = get_dashboard_alerts(db, user_id=current_user.id)
    return {"alerts": alerts}

