"""
Tests unitarios para el módulo de ventas
"""
import pytest
from httpx import AsyncClient, ASGITransport
from decimal import Decimal
from app.main import app
from app.crud.sale import create_sale, get_sale, get_sales, update_sale, delete_sale
from app.crud.product import create_product
from app.api.products.schemas import ProductCreate
from app.api.sales.schemas import SaleCreate, SaleUpdate, SaleItemCreate


@pytest.mark.asyncio
async def test_create_sale(db_session):
    """Test crear venta"""
    # Crear producto primero
    product_schema = ProductCreate(
        name="Producto para Venta",
        price=Decimal("50.00"),
        stock=100,
    )
    product = create_product(db_session, product_schema)
    
    # Crear venta
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        customer_email="cliente@test.com",
        status="pending",
        items=[
            SaleItemCreate(
                product_id=product.id,
                quantity=2,
                unit_price=Decimal("50.00"),
            )
        ],
    )
    
    sale = create_sale(db_session, sale_schema, user_id=1)
    assert sale.customer_name == "Cliente Test"
    assert sale.status == "pending"
    assert len(sale.items) == 1
    # Total incluye IVA (21%): 100 * 1.21 = 121.00
    assert sale.total == Decimal("121.00")


@pytest.mark.asyncio
async def test_get_sale(db_session):
    """Test obtener venta por ID"""
    # Crear producto y venta
    product = create_product(db_session, ProductCreate(name="Producto", price=Decimal("50.00"), stock=100))
    sale_schema = SaleCreate(
        customer_name="Cliente",
        items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("50.00"))],
    )
    created_sale = create_sale(db_session, sale_schema, user_id=1)
    
    # Obtener venta
    sale = get_sale(db_session, created_sale.id)
    assert sale is not None
    assert sale.customer_name == "Cliente"


@pytest.mark.asyncio
async def test_get_sales(db_session):
    """Test obtener lista de ventas"""
    # Crear producto
    product = create_product(db_session, ProductCreate(name="Producto", price=Decimal("50.00"), stock=100))
    
    # Crear varias ventas
    for i in range(3):
        sale_schema = SaleCreate(
            customer_name=f"Cliente {i+1}",
            items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("50.00"))],
        )
        create_sale(db_session, sale_schema, user_id=1)
    
    # Obtener ventas
    sales = get_sales(db_session, user_id=1, skip=0, limit=10)
    assert len(sales) == 3


@pytest.mark.asyncio
async def test_update_sale(db_session):
    """Test actualizar venta"""
    # Crear producto y venta
    product = create_product(db_session, ProductCreate(name="Producto", price=Decimal("50.00"), stock=100))
    sale_schema = SaleCreate(
        customer_name="Cliente Original",
        status="pending",
        items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("50.00"))],
    )
    created_sale = create_sale(db_session, sale_schema, user_id=1)
    
    # Actualizar venta
    update_schema = SaleUpdate(
        status="completed",
        customer_name="Cliente Actualizado",
    )
    updated_sale = update_sale(db_session, created_sale.id, update_schema)
    assert updated_sale is not None
    assert updated_sale.status == "completed"
    assert updated_sale.customer_name == "Cliente Actualizado"


@pytest.mark.asyncio
async def test_delete_sale(db_session):
    """Test eliminar venta"""
    # Crear producto y venta
    product = create_product(db_session, ProductCreate(name="Producto", price=Decimal("50.00"), stock=100))
    sale_schema = SaleCreate(
        customer_name="Cliente",
        items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("50.00"))],
    )
    created_sale = create_sale(db_session, sale_schema, user_id=1)
    sale_id = created_sale.id
    
    # Eliminar venta
    result = delete_sale(db_session, sale_id)
    assert result is True
    
    # Verificar que fue eliminada
    sale = get_sale(db_session, sale_id)
    assert sale is None


@pytest.mark.asyncio
async def test_sale_api_endpoints():
    """Test endpoints de API de ventas"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Autenticación
        await ac.post(
            "/api/auth/register",
            json={
                "email": "testsales@example.com",
                "name": "Test User",
                "password": "testpass123",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={
                "username": "testsales@example.com",
                "password": "testpass123",
            },
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear producto primero
        product_response = await ac.post(
            "/api/products",
            json={
                "name": "Producto para Venta",
                "price": 100.00,
                "stock": 50,
            },
            headers=headers,
        )
        product_id = product_response.json()["id"]
        
        # Crear venta
        sale_response = await ac.post(
            "/api/sales",
            json={
                "customer_name": "Cliente API Test",
                "items": [
                    {
                        "product_id": product_id,
                        "quantity": 2,
                        "unit_price": 100.00,
                    }
                ],
            },
            headers=headers,
        )
        assert sale_response.status_code == 201
        sale_id = sale_response.json()["id"]
        
        # Obtener venta
        get_response = await ac.get(f"/api/sales/{sale_id}", headers=headers)
        assert get_response.status_code == 200
        assert get_response.json()["customer_name"] == "Cliente API Test"
        
        # Actualizar venta
        update_response = await ac.put(
            f"/api/sales/{sale_id}",
            json={"status": "completed"},
            headers=headers,
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "completed"

