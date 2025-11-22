"""
Tests unitarios para el módulo de compras
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.crud.purchase import create_purchase, get_purchase, get_purchases, update_purchase
from app.crud.supplier import create_supplier


@pytest.mark.asyncio
async def test_create_purchase(db_session):
    """Test crear compra"""
    # Crear proveedor primero
    supplier_data = {
        "name": "Proveedor Test",
        "email": "proveedor@test.com",
        "is_active": True,
    }
    supplier = create_supplier(db_session, supplier_data, user_id=1)
    
    # Crear compra
    purchase_data = {
        "supplier_id": supplier.id,
        "purchase_date": "2025-01-15",
        "reference_number": "REF-001",
        "status": "pending",
        "items": [
            {
                "product_name": "Producto Compra",
                "description": "Descripción",
                "quantity": 10,
                "unit_price": 25.00,
                "tax_rate": 21.0,
            }
        ],
    }
    
    purchase = create_purchase(db_session, purchase_data, user_id=1)
    assert purchase.supplier_id == supplier.id
    assert purchase.status == "pending"
    assert len(purchase.items) == 1
    assert purchase.total == 302.50  # 10 * 25.00 * 1.21


@pytest.mark.asyncio
async def test_get_purchase(db_session):
    """Test obtener compra por ID"""
    # Crear proveedor y compra
    supplier = create_supplier(db_session, {"name": "Proveedor", "is_active": True}, user_id=1)
    purchase_data = {
        "supplier_id": supplier.id,
        "purchase_date": "2025-01-15",
        "status": "pending",
        "items": [{"product_name": "Producto", "quantity": 1, "unit_price": 10.00, "tax_rate": 21.0}],
    }
    created_purchase = create_purchase(db_session, purchase_data, user_id=1)
    
    # Obtener compra
    purchase = get_purchase(db_session, created_purchase.id, user_id=1)
    assert purchase is not None
    assert purchase.supplier_id == supplier.id


@pytest.mark.asyncio
async def test_get_purchases(db_session):
    """Test obtener lista de compras"""
    # Crear proveedor
    supplier = create_supplier(db_session, {"name": "Proveedor", "is_active": True}, user_id=1)
    
    # Crear varias compras
    for i in range(3):
        purchase_data = {
            "supplier_id": supplier.id,
            "purchase_date": "2025-01-15",
            "items": [{"product_name": f"Producto {i+1}", "quantity": 1, "unit_price": 10.00, "tax_rate": 21.0}],
        }
        create_purchase(db_session, purchase_data, user_id=1)
    
    # Obtener compras
    purchases = get_purchases(db_session, user_id=1, skip=0, limit=10)
    assert len(purchases) == 3


@pytest.mark.asyncio
async def test_update_purchase(db_session):
    """Test actualizar compra"""
    # Crear proveedor y compra
    supplier = create_supplier(db_session, {"name": "Proveedor", "is_active": True}, user_id=1)
    purchase_data = {
        "supplier_id": supplier.id,
        "purchase_date": "2025-01-15",
        "status": "pending",
        "items": [{"product_name": "Producto", "quantity": 1, "unit_price": 10.00, "tax_rate": 21.0}],
    }
    created_purchase = create_purchase(db_session, purchase_data, user_id=1)
    
    # Actualizar compra
    update_data = {
        "status": "approved",
    }
    updated_purchase = update_purchase(db_session, created_purchase.id, update_data, user_id=1)
    assert updated_purchase.status == "approved"


@pytest.mark.asyncio
async def test_purchase_api_endpoints():
    """Test endpoints de API de compras"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Autenticación
        await ac.post(
            "/api/auth/register",
            json={
                "email": "testpurchases@example.com",
                "name": "Test User",
                "password": "testpass123",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={
                "username": "testpurchases@example.com",
                "password": "testpass123",
            },
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear proveedor primero
        supplier_response = await ac.post(
            "/api/purchases/suppliers",
            json={
                "name": "Proveedor API Test",
                "email": "proveedor@test.com",
            },
            headers=headers,
        )
        supplier_id = supplier_response.json()["id"]
        
        # Crear compra
        purchase_response = await ac.post(
            "/api/purchases",
            json={
                "supplier_id": supplier_id,
                "purchase_date": "2025-01-15",
                "status": "pending",
                "items": [
                    {
                        "product_name": "Producto API Test",
                        "quantity": 5,
                        "unit_price": 20.00,
                        "tax_rate": 21.0,
                    }
                ],
            },
            headers=headers,
        )
        assert purchase_response.status_code == 201
        purchase_id = purchase_response.json()["id"]
        
        # Obtener compra
        get_response = await ac.get(f"/api/purchases/{purchase_id}", headers=headers)
        assert get_response.status_code == 200
        assert get_response.json()["supplier_id"] == supplier_id
        
        # Actualizar compra
        update_response = await ac.put(
            f"/api/purchases/{purchase_id}",
            json={"status": "approved"},
            headers=headers,
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "approved"

