"""
Tests unitarios para el módulo de Compras
"""
import pytest
from httpx import AsyncClient, ASGITransport
from decimal import Decimal
from datetime import datetime
from app.main import app
from app.crud.purchase import create_purchase, get_purchase, get_purchases, update_purchase, delete_purchase
from app.crud.supplier import create_supplier
from app.api.purchases.schemas import PurchaseCreate, PurchaseUpdate, PurchaseItemCreate, SupplierCreate


@pytest.mark.asyncio
async def test_create_supplier(db_session):
    """Test crear proveedor"""
    supplier_data = {
        "name": "Proveedor Test",
        "tax_id": "B12345678",
        "email": "proveedor@test.com",
        "phone": "+34600123456",
        "address": "Calle Test 123",
        "city": "Madrid",
        "postal_code": "28001",
        "country": "España",
        "is_active": True
    }
    
    supplier = create_supplier(db_session, supplier_data, user_id=1)
    assert supplier.name == "Proveedor Test"
    assert supplier.tax_id == "B12345678"
    assert supplier.email == "proveedor@test.com"
    assert supplier.is_active is True


@pytest.mark.asyncio
async def test_create_purchase(db_session):
    """Test crear compra"""
    # Crear proveedor primero
    supplier = create_supplier(
        db_session,
        {
            "name": "Proveedor Test",
            "country": "España",
            "is_active": True
        },
        user_id=1
    )
    
    # Crear compra
    purchase_data = {
        "supplier_id": supplier.id,
        "purchase_date": datetime.now(),
        "subtotal": Decimal("200.00"),
        "tax": Decimal("42.00"),
        "total": Decimal("242.00"),
        "status": "draft",
        "reference_number": "REF-001"
    }
    
    items_data = [
        {
            "description": "Producto Test",
            "quantity": Decimal("2"),
            "unit_price": Decimal("100.00"),
            "tax_rate": Decimal("21.0"),
            "subtotal": Decimal("200.00")
        }
    ]
    
    purchase = create_purchase(db_session, purchase_data, items_data, user_id=1)
    assert purchase.supplier_id == supplier.id
    assert purchase.subtotal == Decimal("200.00")
    assert purchase.total == Decimal("242.00")
    assert len(purchase.items) == 1


@pytest.mark.asyncio
async def test_get_purchase(db_session):
    """Test obtener compra por ID"""
    # Crear proveedor y compra
    supplier = create_supplier(
        db_session,
        {"name": "Proveedor Test", "country": "España"},
        user_id=1
    )
    
    purchase_data = {
        "supplier_id": supplier.id,
        "purchase_date": datetime.now(),
        "subtotal": Decimal("100.00"),
        "tax": Decimal("21.00"),
        "total": Decimal("121.00"),
        "status": "draft"
    }
    
    items_data = [
        {
            "description": "Producto Test",
            "quantity": Decimal("1"),
            "unit_price": Decimal("100.00"),
            "tax_rate": Decimal("21.0"),
            "subtotal": Decimal("100.00")
        }
    ]
    
    created_purchase = create_purchase(db_session, purchase_data, items_data, user_id=1)
    
    # Obtener compra
    purchase = get_purchase(db_session, created_purchase.id, user_id=1)
    assert purchase is not None
    assert purchase.supplier_id == supplier.id
    assert purchase.id == created_purchase.id


@pytest.mark.asyncio
async def test_get_purchases(db_session):
    """Test obtener lista de compras"""
    # Crear proveedor
    supplier = create_supplier(
        db_session,
        {"name": "Proveedor Test", "country": "España"},
        user_id=1
    )
    
    # Crear varias compras
    for i in range(3):
        purchase_data = {
            "supplier_id": supplier.id,
            "purchase_date": datetime.now(),
            "subtotal": Decimal("100.00"),
            "tax": Decimal("21.00"),
            "total": Decimal("121.00"),
            "status": "draft"
        }
        items_data = [
            {
                "description": f"Producto {i+1}",
                "quantity": Decimal("1"),
                "unit_price": Decimal("100.00"),
                "tax_rate": Decimal("21.0"),
                "subtotal": Decimal("100.00")
            }
        ]
        create_purchase(db_session, purchase_data, items_data, user_id=1)
    
    # Obtener compras
    purchases = get_purchases(db_session, user_id=1, skip=0, limit=10)
    assert len(purchases) == 3


@pytest.mark.asyncio
async def test_update_purchase(db_session):
    """Test actualizar compra"""
    # Crear proveedor y compra
    supplier = create_supplier(
        db_session,
        {"name": "Proveedor Test", "country": "España"},
        user_id=1
    )
    
    purchase_data = {
        "supplier_id": supplier.id,
        "purchase_date": datetime.now(),
        "subtotal": Decimal("100.00"),
        "tax": Decimal("21.00"),
        "total": Decimal("121.00"),
        "status": "draft"
    }
    
    items_data = [
        {
            "description": "Producto Original",
            "quantity": Decimal("1"),
            "unit_price": Decimal("100.00"),
            "tax_rate": Decimal("21.0"),
            "subtotal": Decimal("100.00")
        }
    ]
    
    created_purchase = create_purchase(db_session, purchase_data, items_data, user_id=1)
    
    # Actualizar compra
    update_data = {
        "status": "APPROVED",
        "notes": "Compra completada"
    }
    
    updated_purchase = update_purchase(
        db_session,
        created_purchase.id,
        user_id=1,
        purchase_data=update_data
    )
    assert updated_purchase is not None
    assert updated_purchase.status.value == "approved"  # PurchaseStatus usa lowercase
    assert updated_purchase.notes == "Compra completada"


@pytest.mark.asyncio
async def test_delete_purchase(db_session):
    """Test eliminar compra"""
    # Crear proveedor y compra
    supplier = create_supplier(
        db_session,
        {"name": "Proveedor Test", "country": "España"},
        user_id=1
    )
    
    purchase_data = {
        "supplier_id": supplier.id,
        "purchase_date": datetime.now(),
        "subtotal": Decimal("100.00"),
        "tax": Decimal("21.00"),
        "total": Decimal("121.00"),
        "status": "draft"
    }
    
    items_data = [
        {
            "description": "Producto a Eliminar",
            "quantity": Decimal("1"),
            "unit_price": Decimal("100.00"),
            "tax_rate": Decimal("21.0"),
            "subtotal": Decimal("100.00")
        }
    ]
    
    created_purchase = create_purchase(db_session, purchase_data, items_data, user_id=1)
    purchase_id = created_purchase.id
    
    # Eliminar compra
    result = delete_purchase(db_session, purchase_id, user_id=1)
    assert result is True
    
    # Verificar que fue eliminada
    purchase = get_purchase(db_session, purchase_id, user_id=1)
    assert purchase is None


@pytest.mark.asyncio
async def test_purchase_api_endpoints(db_session):
    """Test endpoints de API de compras"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Registrar y autenticar usuario
        await ac.post(
            "/api/auth/register",
            json={
                "email": "testpurchases@example.com",
                "name": "Test User",
                "password": "TestPass123!",
            },
        )
        
        login_response = await ac.post(
            "/api/auth/login",
            data={
                "username": "testpurchases@example.com",
                "password": "TestPass123!",
            },
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear proveedor primero
        supplier_response = await ac.post(
            "/api/purchases/suppliers",
            json={
                "name": "Proveedor API Test",
                "country": "España",
                "is_active": True
            },
            headers=headers,
        )
        assert supplier_response.status_code == 201
        supplier_id = supplier_response.json()["id"]
        
        # Crear compra
        purchase_response = await ac.post(
            "/api/purchases",
            json={
                "supplier_id": supplier_id,
                "purchase_date": datetime.now().isoformat(),
                "subtotal": 200.00,
                "tax": 42.00,
                "total": 242.00,
                "status": "draft",
                "items": [
                    {
                        "description": "Producto API Test",
                        "quantity": 2,
                        "unit_price": 100.00,
                        "tax_rate": 21.0,
                        "subtotal": 200.00
                    }
                ]
            },
            headers=headers,
        )
        assert purchase_response.status_code == 201
        purchase_id = purchase_response.json()["id"]
        assert float(purchase_response.json()["total"]) == 242.00
        
        # Obtener compra
        get_response = await ac.get(f"/api/purchases/{purchase_id}", headers=headers)
        assert get_response.status_code == 200
        assert get_response.json()["supplier_id"] == supplier_id
        
        # Actualizar compra
        update_response = await ac.put(
            f"/api/purchases/{purchase_id}",
            json={"status": "APPROVED"},
            headers=headers,
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "approved"
        
        # Listar compras
        list_response = await ac.get("/api/purchases", headers=headers)
        assert list_response.status_code == 200
        assert len(list_response.json()) >= 1
        
        # Eliminar compra
        delete_response = await ac.delete(f"/api/purchases/{purchase_id}", headers=headers)
        assert delete_response.status_code == 204
