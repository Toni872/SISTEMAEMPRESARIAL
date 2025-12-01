"""
Tests unitarios para el módulo de Dashboard
"""
import pytest
from httpx import AsyncClient, ASGITransport
from decimal import Decimal
from datetime import date, timedelta
from app.main import app
from app.crud.sale import create_sale
from app.crud.product import create_product
from app.api.products.schemas import ProductCreate
from app.api.sales.schemas import SaleCreate, SaleItemCreate


@pytest.mark.asyncio
async def test_dashboard_stats_endpoint(db_session):
    """Test endpoint de estadísticas del dashboard"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Registrar y autenticar usuario
        await ac.post(
            "/api/auth/register",
            json={
                "email": "dashboard@test.com",
                "name": "Dashboard Test",
                "password": "TestPass123!",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={
                "username": "dashboard@test.com",
                "password": "TestPass123!",
            },
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Obtener estadísticas del dashboard
        response = await ac.get("/api/dashboard/stats?period=month", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "total_revenue" in data
        assert "total_sales" in data
        assert "total_products" in data
        assert "low_stock_count" in data
        assert "average_ticket" in data
        assert "profit_margin" in data
        assert "top_products" in data
        assert "top_customers" in data
        assert "category_distribution" in data
        assert "sales_by_status" in data
        assert "sales_timeline" in data
        assert "alerts" in data


@pytest.mark.asyncio
async def test_dashboard_stats_with_data(db_session):
    """Test dashboard con datos reales"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Registrar y autenticar
        await ac.post(
            "/api/auth/register",
            json={
                "email": "dashboard2@test.com",
                "name": "Dashboard Test 2",
                "password": "TestPass123!",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={
                "username": "dashboard2@test.com",
                "password": "TestPass123!",
            },
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear productos
        product1 = await ac.post(
            "/api/products",
            json={
                "name": "Producto 1",
                "price": 100.00,
                "stock": 50,
                "category": "Electrónica",
            },
            headers=headers,
        )
        assert product1.status_code == 201, f"Error creando producto 1: {product1.text}"
        product1_data = product1.json()
        assert "id" in product1_data, f"Producto 1 no tiene ID: {product1_data}"
        
        product2 = await ac.post(
            "/api/products",
            json={
                "name": "Producto 2",
                "price": 200.00,
                "stock": 30,
                "category": "Hogar",
            },
            headers=headers,
        )
        assert product2.status_code == 201, f"Error creando producto 2: {product2.text}"
        product2_data = product2.json()
        assert "id" in product2_data, f"Producto 2 no tiene ID: {product2_data}"
        
        # Crear ventas
        sale1 = await ac.post(
            "/api/sales",
            json={
                "customer_name": "Cliente 1",
                "customer_email": "cliente1@test.com",
                "items": [
                    {
                        "product_id": product1_data["id"],
                        "quantity": 2,
                        "unit_price": 100.00,
                        "tax_rate": 21.0,
                    }
                ],
                "status": "completed",
            },
            headers=headers,
        )
        assert sale1.status_code == 201, f"Error creando venta 1: {sale1.text}"
        
        sale2 = await ac.post(
            "/api/sales",
            json={
                "customer_name": "Cliente 2",
                "customer_email": "cliente2@test.com",
                "items": [
                    {
                        "product_id": product2_data["id"],
                        "quantity": 1,
                        "unit_price": 200.00,
                        "tax_rate": 21.0,
                    }
                ],
                "status": "completed",
            },
            headers=headers,
        )
        assert sale2.status_code == 201, f"Error creando venta 2: {sale2.text}"
        
        # Obtener estadísticas
        response = await ac.get("/api/dashboard/stats?period=month", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["total_sales"] >= 2
        assert data["total_revenue"] > 0
        assert len(data["top_products"]) > 0
        assert len(data["top_customers"]) > 0


@pytest.mark.asyncio
async def test_dashboard_top_products(db_session):
    """Test endpoint de top productos"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Autenticar
        await ac.post(
            "/api/auth/register",
            json={
                "email": "top@test.com",
                "name": "Top Test",
                "password": "TestPass123!",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={"username": "top@test.com", "password": "TestPass123!"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Obtener top productos
        response = await ac.get("/api/dashboard/top-products?limit=5", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "products" in data
        assert isinstance(data["products"], list)


@pytest.mark.asyncio
async def test_dashboard_top_customers(db_session):
    """Test endpoint de top clientes"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Autenticar
        await ac.post(
            "/api/auth/register",
            json={
                "email": "customers@test.com",
                "name": "Customers Test",
                "password": "TestPass123!",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={"username": "customers@test.com", "password": "TestPass123!"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Obtener top clientes
        response = await ac.get("/api/dashboard/top-customers?limit=5", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "customers" in data
        assert isinstance(data["customers"], list)


@pytest.mark.asyncio
async def test_dashboard_periods(db_session):
    """Test dashboard con diferentes períodos"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Autenticar
        await ac.post(
            "/api/auth/register",
            json={
                "email": "periods@test.com",
                "name": "Periods Test",
                "password": "TestPass123!",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={"username": "periods@test.com", "password": "TestPass123!"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Probar diferentes períodos
        for period in ["week", "month", "year"]:
            response = await ac.get(f"/api/dashboard/stats?period={period}", headers=headers)
            assert response.status_code == 200
            data = response.json()
            assert "total_revenue" in data
            assert "revenue_change_percent" in data


