"""
Tests unitarios para el módulo de productos
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.product import Product
from app.crud.product import create_product, get_product, get_products, update_product, delete_product
from app.api.auth.deps import get_db_session


@pytest.mark.asyncio
async def test_create_product(db_session):
    """Test crear producto"""
    product_data = {
        "name": "Producto Test",
        "description": "Descripción del producto",
        "sku": "SKU-001",
        "price": 99.99,
        "cost": 50.00,
        "stock": 100,
        "min_stock": 10,
        "category": "Electrónica",
        "is_active": True,
    }
    
    product = create_product(db_session, product_data, user_id=1)
    assert product.name == "Producto Test"
    assert product.price == 99.99
    assert product.stock == 100
    assert product.is_active is True


@pytest.mark.asyncio
async def test_get_product(db_session):
    """Test obtener producto por ID"""
    # Crear producto primero
    product_data = {
        "name": "Producto Test",
        "price": 99.99,
        "stock": 100,
    }
    created_product = create_product(db_session, product_data, user_id=1)
    
    # Obtener producto
    product = get_product(db_session, created_product.id, user_id=1)
    assert product is not None
    assert product.name == "Producto Test"
    assert product.id == created_product.id


@pytest.mark.asyncio
async def test_get_products(db_session):
    """Test obtener lista de productos"""
    # Crear varios productos
    for i in range(3):
        product_data = {
            "name": f"Producto {i+1}",
            "price": 10.00 * (i + 1),
            "stock": 10 * (i + 1),
        }
        create_product(db_session, product_data, user_id=1)
    
    # Obtener productos
    products = get_products(db_session, user_id=1, skip=0, limit=10)
    assert len(products) == 3


@pytest.mark.asyncio
async def test_update_product(db_session):
    """Test actualizar producto"""
    # Crear producto
    product_data = {
        "name": "Producto Original",
        "price": 50.00,
        "stock": 50,
    }
    created_product = create_product(db_session, product_data, user_id=1)
    
    # Actualizar producto
    update_data = {
        "name": "Producto Actualizado",
        "price": 75.00,
    }
    updated_product = update_product(db_session, created_product.id, update_data, user_id=1)
    assert updated_product.name == "Producto Actualizado"
    assert updated_product.price == 75.00
    assert updated_product.stock == 50  # No cambió


@pytest.mark.asyncio
async def test_delete_product(db_session):
    """Test eliminar producto"""
    # Crear producto
    product_data = {
        "name": "Producto a Eliminar",
        "price": 25.00,
        "stock": 25,
    }
    created_product = create_product(db_session, product_data, user_id=1)
    product_id = created_product.id
    
    # Eliminar producto
    delete_product(db_session, product_id, user_id=1)
    
    # Verificar que fue eliminado
    product = get_product(db_session, product_id, user_id=1)
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

