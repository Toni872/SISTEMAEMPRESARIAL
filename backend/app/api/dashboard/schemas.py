from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class TopProduct(BaseModel):
    product_id: int
    product_name: str
    total_sold: int
    total_revenue: float
    percentage: float

    class Config:
        from_attributes = True


class TopCustomer(BaseModel):
    customer_email: Optional[str]
    customer_name: Optional[str]
    total_sales: int
    total_revenue: float
    percentage: float

    class Config:
        from_attributes = True


class SalesTimelinePoint(BaseModel):
    period: str
    sales_count: int
    revenue: float

    class Config:
        from_attributes = True


class CategoryDistribution(BaseModel):
    category: Optional[str]
    sales_count: int
    revenue: float
    percentage: float

    class Config:
        from_attributes = True


class DashboardAlert(BaseModel):
    type: str  # stock_critical, pending_sales, no_movement_products
    severity: str  # high, medium, low
    title: str
    message: str
    count: int
    action_url: Optional[str] = None

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    # Métricas básicas
    total_revenue: float
    total_sales: int
    total_products: int
    low_stock_count: int
    
    # Métricas financieras
    average_ticket: float
    profit_margin: float
    total_profit: float
    
    # Comparaciones temporales
    revenue_change_percent: float
    sales_change_percent: float
    revenue_previous_period: float
    sales_previous_period: int
    
    # Top items
    top_products: List[TopProduct]
    top_customers: List[TopCustomer]
    
    # Distribuciones
    category_distribution: List[CategoryDistribution]
    sales_by_status: dict
    
    # Timeline
    sales_timeline: List[SalesTimelinePoint]
    
    # Alertas
    alerts: List[DashboardAlert]

    class Config:
        from_attributes = True

