"""
Script de seed completo para tests E2E
Crea usuario de prueba, productos, ventas y compras de ejemplo
"""
import sys
import os
from datetime import datetime, timedelta
from decimal import Decimal

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.product import Product
from app.models.sale import Sale, SaleItem
from app.models.purchase import Purchase, PurchaseItem, PurchaseStatus
from app.models.supplier import Supplier
from app.core.security import get_password_hash
from app.crud.user import get_user_by_email, verify_user_email
from app.crud.product import create_product
from app.crud.sale import create_sale, generate_sale_number
from app.crud.purchase import create_purchase, generate_purchase_number
from app.api.products.schemas import ProductCreate
from app.api.sales.schemas import SaleCreate, SaleItemCreate
from app.api.purchases.schemas import PurchaseCreate, PurchaseItemCreate


def seed_e2e_data():
    """Crea datos completos para tests E2E"""
    db = SessionLocal()
    
    try:
        print("[*] Iniciando seed de datos E2E...")
        
        # 1. Crear usuario de prueba para E2E
        print("\n[*] Creando usuario de prueba...")
        test_email = "test@example.com"
        test_password = "testpassword123"
        
        existing_user = get_user_by_email(db, test_email)
        if existing_user:
            print(f"   [OK] Usuario ya existe: {test_email}")
            test_user = existing_user
            # Asegurar que esté verificado y activo
            test_user.is_verified = True
            test_user.is_active = True
            db.commit()
        else:
            hashed_password = get_password_hash(test_password)
            test_user = User(
                email=test_email,
                hashed_password=hashed_password,
                name="Usuario Prueba E2E",
                role="admin",
                is_active=True,
                is_verified=True
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"   [OK] Usuario creado: {test_email} / {test_password}")
        
        # 2. Crear productos de ejemplo
        print("\n[*] Creando productos de ejemplo...")
        products_data = [
            {
                "name": "Laptop Dell XPS 15",
                "description": "Laptop profesional de alto rendimiento",
                "sku": "LAP-DELL-XPS15",
                "price": Decimal("1299.99"),
                "cost": Decimal("900.00"),
                "stock": 25,
                "min_stock": 5,
                "category": "Electrónica"
            },
            {
                "name": "Mouse Logitech MX Master 3",
                "description": "Mouse inalámbrico ergonómico",
                "sku": "MOU-LOG-MX3",
                "price": Decimal("99.99"),
                "cost": Decimal("60.00"),
                "stock": 50,
                "min_stock": 10,
                "category": "Accesorios"
            },
            {
                "name": "Teclado Mecánico Keychron K8",
                "description": "Teclado mecánico inalámbrico",
                "sku": "TEC-KEY-K8",
                "price": Decimal("149.99"),
                "cost": Decimal("90.00"),
                "stock": 30,
                "min_stock": 8,
                "category": "Accesorios"
            },
            {
                "name": "Monitor LG UltraWide 34",
                "description": "Monitor ultrawide 34 pulgadas",
                "sku": "MON-LG-UW34",
                "price": Decimal("599.99"),
                "cost": Decimal("400.00"),
                "stock": 15,
                "min_stock": 3,
                "category": "Electrónica"
            },
            {
                "name": "Auriculares Sony WH-1000XM5",
                "description": "Auriculares con cancelación de ruido",
                "sku": "AUR-SON-WH1000",
                "price": Decimal("399.99"),
                "cost": Decimal("250.00"),
                "stock": 20,
                "min_stock": 5,
                "category": "Audio"
            },
            {
                "name": "Producto Stock Bajo",
                "description": "Producto para probar alertas de stock",
                "sku": "LOW-STOCK-001",
                "price": Decimal("49.99"),
                "cost": Decimal("30.00"),
                "stock": 2,  # Stock bajo
                "min_stock": 5,
                "category": "Test"
            }
        ]
        
        created_products = []
        for prod_data in products_data:
            existing_product = db.query(Product).filter(Product.sku == prod_data["sku"]).first()
            if existing_product:
                print(f"   [SKIP] Producto ya existe: {prod_data['name']}")
                created_products.append(existing_product)
            else:
                product = Product(**prod_data)
                db.add(product)
                db.commit()
                db.refresh(product)
                created_products.append(product)
                print(f"   [OK] Producto creado: {prod_data['name']}")
        
        # 3. Crear ventas de ejemplo
        print("\n[*] Creando ventas de ejemplo...")
        
        # Venta completada reciente
        sale1_date = datetime.now() - timedelta(days=2)
        sale1 = Sale(
            sale_number=generate_sale_number(db),
            customer_name="Juan Pérez",
            customer_email="juan.perez@example.com",
            customer_phone="+34 600 123 456",
            subtotal=Decimal("1299.99"),
            tax=Decimal("272.99"),
            total=Decimal("1572.98"),
            status="completed",
            created_at=sale1_date,
            updated_at=sale1_date,
            user_id=test_user.id
        )
        db.add(sale1)
        db.commit()
        db.refresh(sale1)
        
        # Item de la venta 1
        sale1_item = SaleItem(
            sale_id=sale1.id,
            product_id=created_products[0].id,  # Laptop
            quantity=1,
            unit_price=Decimal("1299.99"),
            subtotal=Decimal("1299.99")
        )
        db.add(sale1_item)
        
        # Venta completada más reciente
        sale2_date = datetime.now() - timedelta(days=1)
        sale2 = Sale(
            sale_number=generate_sale_number(db),
            customer_name="María García",
            customer_email="maria.garcia@example.com",
            customer_phone="+34 600 789 012",
            subtotal=Decimal("249.98"),
            tax=Decimal("52.50"),
            total=Decimal("302.48"),
            status="completed",
            created_at=sale2_date,
            updated_at=sale2_date,
            user_id=test_user.id
        )
        db.add(sale2)
        db.commit()
        db.refresh(sale2)
        
        # Items de la venta 2
        sale2_item1 = SaleItem(
            sale_id=sale2.id,
            product_id=created_products[1].id,  # Mouse
            quantity=1,
            unit_price=Decimal("99.99"),
            subtotal=Decimal("99.99")
        )
        sale2_item2 = SaleItem(
            sale_id=sale2.id,
            product_id=created_products[2].id,  # Teclado
            quantity=1,
            unit_price=Decimal("149.99"),
            subtotal=Decimal("149.99")
        )
        db.add(sale2_item1)
        db.add(sale2_item2)
        
        # Venta pendiente
        sale3 = Sale(
            sale_number=generate_sale_number(db),
            customer_name="Pedro López",
            customer_email="pedro.lopez@example.com",
            subtotal=Decimal("599.99"),
            tax=Decimal("125.99"),
            total=Decimal("725.98"),
            status="pending",
            user_id=test_user.id
        )
        db.add(sale3)
        db.commit()
        db.refresh(sale3)
        
        sale3_item = SaleItem(
            sale_id=sale3.id,
            product_id=created_products[3].id,  # Monitor
            quantity=1,
            unit_price=Decimal("599.99"),
            subtotal=Decimal("599.99")
        )
        db.add(sale3_item)
        
        db.commit()
        print(f"   [OK] 3 ventas creadas")
        
        # 4. Crear proveedores y compras
        print("\n[*] Creando proveedores y compras...")
        
        # Proveedor 1
        supplier1 = Supplier(
            name="TechSupply S.L.",
            email="contacto@techsupply.com",
            phone="+34 900 111 222",
            address="Calle Tecnología 123, Madrid",
            tax_id="B12345678",
            user_id=test_user.id
        )
        db.add(supplier1)
        db.commit()
        db.refresh(supplier1)
        
        # Compra 1
        purchase1_date = datetime.now() - timedelta(days=5)
        purchase1 = Purchase(
            user_id=test_user.id,
            supplier_id=supplier1.id,
            purchase_number=generate_purchase_number(db, test_user.id),
            purchase_date=purchase1_date,
            subtotal=Decimal("1800.00"),
            tax=Decimal("378.00"),
            total=Decimal("2178.00"),
            status=PurchaseStatus.APPROVED,
            notes="Compra de laptops para stock",
            created_at=purchase1_date,
            updated_at=purchase1_date
        )
        db.add(purchase1)
        db.commit()
        db.refresh(purchase1)
        
        purchase1_item = PurchaseItem(
            purchase_id=purchase1.id,
            product_id=created_products[0].id,
            description="Laptop Dell XPS 15",
            quantity=Decimal("2"),
            unit_price=Decimal("900.00"),
            tax_rate=Decimal("21.0"),
            subtotal=Decimal("1800.00")
        )
        db.add(purchase1_item)
        
        # Proveedor 2
        supplier2 = Supplier(
            name="Accesorios Pro",
            email="ventas@accesoriospro.com",
            phone="+34 900 333 444",
            address="Avenida Accesorios 456, Barcelona",
            tax_id="B87654321",
            user_id=test_user.id
        )
        db.add(supplier2)
        db.commit()
        db.refresh(supplier2)
        
        # Compra 2
        purchase2_date = datetime.now() - timedelta(days=3)
        purchase2 = Purchase(
            user_id=test_user.id,
            supplier_id=supplier2.id,
            purchase_number=generate_purchase_number(db, test_user.id),
            purchase_date=purchase2_date,
            subtotal=Decimal("300.00"),
            tax=Decimal("63.00"),
            total=Decimal("363.00"),
            status=PurchaseStatus.RECEIVED,
            notes="Mouse y teclados",
            created_at=purchase2_date,
            updated_at=purchase2_date
        )
        db.add(purchase2)
        db.commit()
        db.refresh(purchase2)
        
        purchase2_item1 = PurchaseItem(
            purchase_id=purchase2.id,
            product_id=created_products[1].id,
            description="Mouse Logitech MX Master 3",
            quantity=Decimal("3"),
            unit_price=Decimal("60.00"),
            tax_rate=Decimal("21.0"),
            subtotal=Decimal("180.00")
        )
        purchase2_item2 = PurchaseItem(
            purchase_id=purchase2.id,
            product_id=created_products[2].id,
            description="Teclado Mecánico Keychron K8",
            quantity=Decimal("2"),
            unit_price=Decimal("90.00"),
            tax_rate=Decimal("21.0"),
            subtotal=Decimal("180.00")
        )
        db.add(purchase2_item1)
        db.add(purchase2_item2)
        
        db.commit()
        print(f"   [OK] 2 proveedores y 2 compras creadas")
        
        print("\n[OK] Seed E2E completado exitosamente!")
        print("\n[*] Resumen:")
        print(f"   - Usuario: {test_email} / {test_password}")
        print(f"   - Productos: {len(created_products)}")
        print(f"   - Ventas: 3")
        print(f"   - Proveedores: 2")
        print(f"   - Compras: 2")
        
    except Exception as e:
        print(f"\n[ERROR] Error durante seed: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_e2e_data()

