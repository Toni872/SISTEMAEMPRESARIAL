import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.user import User
from app.models.product import Product
from app.models.sale import Sale, SaleItem
from app.crud.sale import create_sale
from app.api.sales.schemas import SaleCreate

client = TestClient(app)


@pytest.fixture
def test_user(db_session: Session) -> User:
    """Crear usuario de prueba"""
    from app.models.user import User
    from app.core.security import get_password_hash
    user = User(
        email="test_invoice@example.com",
        hashed_password=get_password_hash("testpassword123"),
        name="Test User"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_product(db_session: Session, test_user: User) -> Product:
    """Crear producto de prueba"""
    from app.crud.product import create_product
    from app.api.products.schemas import ProductCreate
    from decimal import Decimal
    product_schema = ProductCreate(
        name="Producto Test",
        sku="TEST-001",
        price=Decimal("100.00"),
        stock=10,
    )
    product = create_product(db_session, product_schema)
    return product


@pytest.fixture
def test_sale(db_session: Session, test_user: User, test_product: Product) -> Sale:
    """Crear venta de prueba"""
    from app.api.sales.schemas import SaleItemCreate
    sale_data = SaleCreate(
        customer_name="Cliente Test",
        customer_email="cliente@test.com",
        items=[
            SaleItemCreate(
                product_id=test_product.id,
                quantity=2,
                unit_price=100.00
            )
        ],
        status="completed"
    )
    sale = create_sale(db_session, sale_data, test_user.id)
    return sale


def test_list_invoices(db_session: Session, test_user: User, test_sale: Sale):
    """Test: Listar facturas"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Listar facturas
    response = client.get("/api/invoices", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "invoices" in data
    assert "total" in data
    assert len(data["invoices"]) > 0


def test_get_invoice(db_session: Session, test_user: User, test_sale: Sale):
    """Test: Obtener factura por ID"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener factura
    response = client.get(f"/api/invoices/{test_sale.id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["sale_id"] == test_sale.id
    assert data["sale_number"] == test_sale.sale_number
    assert len(data["items"]) > 0


def test_create_invoice_from_sale(db_session: Session, test_user: User, test_sale: Sale):
    """Test: Crear factura desde venta"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Crear factura sin registro Verifactu
    response = client.post(
        "/api/invoices",
        json={"sale_id": test_sale.id, "register_in_verifactu": False},
        headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["sale_id"] == test_sale.id
    assert data["invoice_registry_id"] is None


def test_create_invoice_with_verifactu(db_session: Session, test_user: User, test_sale: Sale):
    """Test: Crear factura con registro Verifactu"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Crear factura con registro Verifactu
    response = client.post(
        "/api/invoices",
        json={"sale_id": test_sale.id, "register_in_verifactu": True},
        headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["sale_id"] == test_sale.id
    assert data["invoice_registry_id"] is not None
    assert data["invoice_hash"] is not None


def test_create_invoice_duplicate_fails(db_session: Session, test_user: User, test_sale: Sale):
    """Test: Crear factura duplicada falla"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Crear primera factura con registro Verifactu
    response = client.post(
        "/api/invoices",
        json={"sale_id": test_sale.id, "register_in_verifactu": True},
        headers=headers
    )
    assert response.status_code == 201
    
    # Intentar crear segunda factura (debe fallar)
    response = client.post(
        "/api/invoices",
        json={"sale_id": test_sale.id, "register_in_verifactu": True},
        headers=headers
    )
    assert response.status_code == 400


def test_get_invoice_not_found(db_session: Session, test_user: User):
    """Test: Obtener factura inexistente falla"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener factura inexistente
    response = client.get("/api/invoices/99999", headers=headers)
    assert response.status_code == 404


def test_filter_invoices_by_status(db_session: Session, test_user: User, test_sale: Sale):
    """Test: Filtrar facturas por estado"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Filtrar por estado completed
    response = client.get("/api/invoices?status=completed", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert all(invoice["status"] == "completed" for invoice in data["invoices"])


def test_filter_invoices_by_registry(db_session: Session, test_user: User, test_sale: Sale):
    """Test: Filtrar facturas por registro Verifactu"""
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": test_user.email, "password": "testpassword123"}
    )
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Crear factura con registro
    client.post(
        "/api/invoices",
        json={"sale_id": test_sale.id, "register_in_verifactu": True},
        headers=headers
    )
    
    # Filtrar solo facturas con registro
    response = client.get("/api/invoices?has_registry=true", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert all(invoice["invoice_registry_id"] is not None for invoice in data["invoices"])

