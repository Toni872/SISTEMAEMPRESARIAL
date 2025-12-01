"""
Tests unitarios para el módulo de Ventas
"""
import pytest
from httpx import AsyncClient, ASGITransport
from decimal import Decimal
from datetime import date, datetime
from app.main import app
from app.crud.sale import create_sale, get_sale, get_sales, update_sale, delete_sale
from app.crud.product import create_product
from app.api.sales.schemas import SaleCreate, SaleUpdate, SaleItemCreate
from app.api.products.schemas import ProductCreate


@pytest.mark.asyncio
async def test_create_sale(db_session):
    """Test crear venta"""
    # Crear producto primero
    product = create_product(
        db_session,
        ProductCreate(
            name="Producto Test",
            price=Decimal("100.00"),
            stock=50,
        )
    )
    
    # Crear venta
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        customer_email="cliente@test.com",
        items=[
            SaleItemCreate(
                product_id=product.id,
                quantity=2,
                unit_price=Decimal("100.00")
            )
        ],
        status="completed"
    )
    
    sale = create_sale(db_session, sale_schema, user_id=1)
    assert sale.customer_name == "Cliente Test"
    assert sale.subtotal == Decimal("200.00")  # 2 * 100
    assert sale.tax == Decimal("42.00")  # 21% de 200
    assert sale.total == Decimal("242.00")  # 200 + 42
    assert len(sale.items) == 1


@pytest.mark.asyncio
async def test_get_sale(db_session):
    """Test obtener venta por ID"""
    # Crear producto y venta
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test", price=Decimal("50.00"), stock=100)
    )
    
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("50.00"))]
    )
    created_sale = create_sale(db_session, sale_schema, user_id=1)
    
    # Obtener venta
    sale = get_sale(db_session, created_sale.id)
    assert sale is not None
    assert sale.customer_name == "Cliente Test"
    assert sale.id == created_sale.id


@pytest.mark.asyncio
async def test_get_sales(db_session):
    """Test obtener lista de ventas"""
    # Crear producto
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test", price=Decimal("10.00"), stock=100)
    )
    
    # Crear varias ventas
    for i in range(3):
        sale_schema = SaleCreate(
            customer_name=f"Cliente {i+1}",
            items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("10.00"))]
        )
        create_sale(db_session, sale_schema, user_id=1)
    
    # Obtener ventas
    sales = get_sales(db_session, skip=0, limit=10, user_id=1)
    assert len(sales) == 3


@pytest.mark.asyncio
async def test_update_sale(db_session):
    """Test actualizar venta"""
    # Crear producto y venta
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test", price=Decimal("50.00"), stock=100)
    )
    
    sale_schema = SaleCreate(
        customer_name="Cliente Original",
        items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("50.00"))]
    )
    created_sale = create_sale(db_session, sale_schema, user_id=1)
    
    # Actualizar venta
    update_schema = SaleUpdate(
        customer_name="Cliente Actualizado",
        status="completed"
    )
    updated_sale = update_sale(db_session, created_sale.id, update_schema)
    assert updated_sale is not None
    assert updated_sale.customer_name == "Cliente Actualizado"
    assert updated_sale.status == "completed"


@pytest.mark.asyncio
async def test_delete_sale(db_session):
    """Test eliminar venta"""
    # Crear producto y venta
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test", price=Decimal("25.00"), stock=100)
    )
    
    sale_schema = SaleCreate(
        customer_name="Cliente a Eliminar",
        items=[SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("25.00"))]
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
async def test_sale_api_endpoints(db_session):
    """Test endpoints de API de ventas"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Registrar y autenticar usuario
        await ac.post(
            "/api/auth/register",
            json={
                "email": "testsales@example.com",
                "name": "Test User",
                "password": "TestPass123!",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={
                "username": "testsales@example.com",
                "password": "TestPass123!",
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
                        "unit_price": 100.00
                    }
                ],
                "status": "completed"
            },
            headers=headers,
        )
        assert sale_response.status_code == 201
        sale_id = sale_response.json()["id"]
        assert sale_response.json()["customer_name"] == "Cliente API Test"
        assert float(sale_response.json()["total"]) == 242.00  # 200 + 21% IVA
        
        # Obtener venta
        get_response = await ac.get(f"/api/sales/{sale_id}", headers=headers)
        assert get_response.status_code == 200
        assert get_response.json()["customer_name"] == "Cliente API Test"
        
        # Actualizar venta
        update_response = await ac.put(
            f"/api/sales/{sale_id}",
            json={"status": "cancelled"},
            headers=headers,
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "cancelled"
        
        # Listar ventas
        list_response = await ac.get("/api/sales", headers=headers)
        assert list_response.status_code == 200
        assert len(list_response.json()) >= 1
        
        # Eliminar venta
        delete_response = await ac.delete(f"/api/sales/{sale_id}", headers=headers)
        assert delete_response.status_code == 204


@pytest.mark.asyncio
async def test_sale_calculates_totals_correctly(db_session):
    """Test que las ventas calculan totales correctamente"""
    # Crear producto
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test", price=Decimal("100.00"), stock=100)
    )
    
    # Crear venta con múltiples items
    sale_schema = SaleCreate(
        items=[
            SaleItemCreate(product_id=product.id, quantity=2, unit_price=Decimal("100.00")),
            SaleItemCreate(product_id=product.id, quantity=1, unit_price=Decimal("50.00"))
        ]
    )
    
    sale = create_sale(db_session, sale_schema, user_id=1)
    
    # Verificar cálculos
    # Subtotal: (2 * 100) + (1 * 50) = 250
    assert sale.subtotal == Decimal("250.00")
    # IVA: 21% de 250 = 52.50
    assert sale.tax == Decimal("52.50")
    # Total: 250 + 52.50 = 302.50
    assert sale.total == Decimal("302.50")


@pytest.mark.asyncio
async def test_sale_insufficient_stock(db_session):
    """Test que falla cuando no hay stock suficiente"""
    # Crear producto con stock limitado
    product = create_product(
        db_session,
        ProductCreate(name="Producto Stock Limitado", price=Decimal("100.00"), stock=5)
    )
    
    # Intentar crear venta con más cantidad de la disponible
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        items=[
            SaleItemCreate(product_id=product.id, quantity=10, unit_price=Decimal("100.00"))
        ]
    )
    
    with pytest.raises(ValueError, match="Stock insuficiente"):
        create_sale(db_session, sale_schema, user_id=1)


@pytest.mark.asyncio
async def test_sale_product_not_found(db_session):
    """Test que falla cuando el producto no existe"""
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        items=[
            SaleItemCreate(product_id=99999, quantity=1, unit_price=Decimal("100.00"))
        ]
    )
    
    with pytest.raises(ValueError, match="no encontrado"):
        create_sale(db_session, sale_schema, user_id=1)


@pytest.mark.asyncio
async def test_sale_decrements_stock(db_session):
    """Test que el stock se decrementa correctamente al crear una venta"""
    # Crear producto con stock conocido
    initial_stock = 50
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test Stock", price=Decimal("100.00"), stock=initial_stock)
    )
    
    # Crear venta
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        items=[
            SaleItemCreate(product_id=product.id, quantity=10, unit_price=Decimal("100.00"))
        ]
    )
    
    create_sale(db_session, sale_schema, user_id=1)
    
    # Verificar que el stock se decrementó
    db_session.refresh(product)
    assert product.stock == initial_stock - 10


@pytest.mark.asyncio
async def test_delete_sale_restores_stock(db_session):
    """Test que al eliminar una venta completada se restaura el stock"""
    # Crear producto
    initial_stock = 50
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test Restore", price=Decimal("100.00"), stock=initial_stock)
    )
    
    # Crear venta completada
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        items=[
            SaleItemCreate(product_id=product.id, quantity=10, unit_price=Decimal("100.00"))
        ],
        status="completed"
    )
    
    created_sale = create_sale(db_session, sale_schema, user_id=1)
    
    # Verificar que el stock se decrementó
    db_session.refresh(product)
    assert product.stock == initial_stock - 10
    
    # Eliminar venta
    delete_sale(db_session, created_sale.id)
    
    # Verificar que el stock se restauró
    db_session.refresh(product)
    assert product.stock == initial_stock


@pytest.mark.asyncio
async def test_sale_with_discount_calculation(db_session):
    """Test cálculo de venta con descuento (si está implementado)"""
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test", price=Decimal("100.00"), stock=100)
    )
    
    # Crear venta normal (sin descuento en el schema actual)
    sale_schema = SaleCreate(
        customer_name="Cliente Test",
        items=[
            SaleItemCreate(product_id=product.id, quantity=2, unit_price=Decimal("100.00"))
        ]
    )
    
    sale = create_sale(db_session, sale_schema, user_id=1)
    
    # Verificar cálculos básicos
    assert sale.subtotal == Decimal("200.00")
    assert sale.tax == Decimal("42.00")  # 21% de 200
    assert sale.total == Decimal("242.00")


@pytest.mark.asyncio
async def test_sale_zero_quantity_fails(db_session):
    """Test que cantidad cero o negativa falla (validación del schema)"""
    product = create_product(
        db_session,
        ProductCreate(name="Producto Test", price=Decimal("100.00"), stock=100)
    )
    
    # El schema SaleItemCreate valida que quantity > 0
    from pydantic import ValidationError
    
    # Cantidad 0 debería fallar
    with pytest.raises(ValidationError):
        SaleItemCreate(product_id=product.id, quantity=0, unit_price=Decimal("100.00"))
    
    # Cantidad negativa debería fallar
    with pytest.raises(ValidationError):
        SaleItemCreate(product_id=product.id, quantity=-1, unit_price=Decimal("100.00"))
