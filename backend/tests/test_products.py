"""
Tests unitarios para el módulo de productos
"""
import pytest
from httpx import AsyncClient, ASGITransport
from decimal import Decimal
from app.main import app
from app.crud.product import create_product, get_product, get_products, update_product, delete_product
from app.api.products.schemas import ProductCreate, ProductUpdate


@pytest.mark.asyncio
async def test_create_product(db_session):
    """Test crear producto"""
    product_schema = ProductCreate(
        name="Producto Test",
        description="Descripción del producto",
        sku="SKU-001",
        price=Decimal("99.99"),
        cost=Decimal("50.00"),
        stock=100,
        min_stock=10,
        category="Electrónica",
        is_active=True,
    )
    
    product = create_product(db_session, product_schema)
    assert product.name == "Producto Test"
    assert product.price == Decimal("99.99")
    assert product.stock == 100
    assert product.is_active is True


@pytest.mark.asyncio
async def test_get_product(db_session):
    """Test obtener producto por ID"""
    # Crear producto primero
    product_schema = ProductCreate(
        name="Producto Test",
        price=Decimal("99.99"),
        stock=100,
    )
    created_product = create_product(db_session, product_schema)
    
    # Obtener producto
    product = get_product(db_session, created_product.id)
    assert product is not None
    assert product.name == "Producto Test"
    assert product.id == created_product.id


@pytest.mark.asyncio
async def test_get_products(db_session):
    """Test obtener lista de productos"""
    # Crear varios productos
    for i in range(3):
        product_schema = ProductCreate(
            name=f"Producto {i+1}",
            price=Decimal(str(10.00 * (i + 1))),
            stock=10 * (i + 1),
        )
        create_product(db_session, product_schema)
    
    # Obtener productos
    products = get_products(db_session, skip=0, limit=10)
    assert len(products) == 3


@pytest.mark.asyncio
async def test_update_product(db_session):
    """Test actualizar producto"""
    # Crear producto
    product_schema = ProductCreate(
        name="Producto Original",
        price=Decimal("50.00"),
        stock=50,
    )
    created_product = create_product(db_session, product_schema)
    
    # Actualizar producto
    update_schema = ProductUpdate(
        name="Producto Actualizado",
        price=Decimal("75.00"),
    )
    updated_product = update_product(db_session, created_product.id, update_schema)
    assert updated_product is not None
    assert updated_product.name == "Producto Actualizado"
    assert updated_product.price == Decimal("75.00")
    assert updated_product.stock == 50  # No cambió


@pytest.mark.asyncio
async def test_delete_product(db_session):
    """Test eliminar producto"""
    # Crear producto
    product_schema = ProductCreate(
        name="Producto a Eliminar",
        price=Decimal("25.00"),
        stock=25,
    )
    created_product = create_product(db_session, product_schema)
    product_id = created_product.id
    
    # Eliminar producto
    result = delete_product(db_session, product_id)
    assert result is True
    
    # Verificar que fue eliminado
    product = get_product(db_session, product_id)
    assert product is None


@pytest.mark.asyncio
async def test_product_api_endpoints():
    """Test endpoints de API de productos"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Primero necesitamos autenticarnos
        # Registrar usuario
        await ac.post(
            "/api/auth/register",
            json={
                "email": "testproducts@example.com",
                "name": "Test User",
                "password": "testpass123",
            },
        )
        
        # Login
        login_response = await ac.post(
            "/api/auth/login",
            data={
                "username": "testproducts@example.com",
                "password": "testpass123",
            },
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear producto
        product_response = await ac.post(
            "/api/products",
            json={
                "name": "Producto API Test",
                "price": 100.00,
                "stock": 50,
            },
            headers=headers,
        )
        assert product_response.status_code == 201
        product_id = product_response.json()["id"]
        
        # Obtener producto
        get_response = await ac.get(f"/api/products/{product_id}", headers=headers)
        assert get_response.status_code == 200
        assert get_response.json()["name"] == "Producto API Test"
        
        # Actualizar producto
        update_response = await ac.put(
            f"/api/products/{product_id}",
            json={"price": 150.00},
            headers=headers,
        )
        assert update_response.status_code == 200
        assert update_response.json()["price"] == 150.00
        
        # Eliminar producto
        delete_response = await ac.delete(f"/api/products/{product_id}", headers=headers)
        assert delete_response.status_code == 204

