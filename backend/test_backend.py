"""
Script para validar el backend completo
Prueba todos los endpoints de autenticación, productos y ventas
"""

import requests
import json
from decimal import Decimal

BASE_URL = "http://localhost:8000"


def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")


def print_result(test_name, success, details=""):
    status = "[OK] PASS" if success else "[FAIL] FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"   {details}")


# Variables globales para almacenar tokens y IDs
token = None
product_id = None
sale_id = None

print_section("VALIDACIÓN DEL BACKEND")
print("Probando endpoints del backend FastAPI...\n")

# ============================================
# 1. HEALTH CHECK
# ============================================
print_section("1. HEALTH CHECK")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    success = response.status_code == 200
    print_result("Health check", success, f"Status: {response.status_code}")
    if success:
        print(f"   Response: {response.json()}")
except Exception as e:
    print_result("Health check", False, f"Error: {str(e)}")
    print("\n[ERROR] El backend no esta corriendo. Por favor inicia el servidor con:")
    print("   docker-compose up")
    exit(1)

# ============================================
# 2. AUTENTICACIÓN
# ============================================
print_section("2. AUTENTICACIÓN")

# 2.1 Login
try:
    login_data = {"email": "admin@example.com", "password": "admin1234"}
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data, timeout=5)
    success = response.status_code == 200
    if success:
        data = response.json()
        token = data.get("access_token")
        print_result("Login", True, f"Token obtenido: {token[:20]}...")
    else:
        print_result(
            "Login", False, f"Status: {response.status_code}, Response: {response.text}"
        )
except Exception as e:
    print_result("Login", False, f"Error: {str(e)}")

if not token:
    print(
        "\n[ERROR] No se pudo obtener el token. Verifica que el usuario admin exista."
    )
    print("   Ejecuta: python scripts/seed.py")
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

# 2.2 Get Current User
try:
    response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers, timeout=5)
    success = response.status_code == 200
    if success:
        user_data = response.json()
        print_result("Get current user", True, f"Usuario: {user_data.get('email')}")
    else:
        print_result("Get current user", False, f"Status: {response.status_code}")
except Exception as e:
    print_result("Get current user", False, f"Error: {str(e)}")

# ============================================
# 3. PRODUCTOS
# ============================================
print_section("3. PRODUCTOS")

# 3.1 Listar productos (debe estar vacío inicialmente)
try:
    response = requests.get(f"{BASE_URL}/api/products", headers=headers, timeout=5)
    success = response.status_code == 200
    products = response.json() if success else []
    print_result("Listar productos", success, f"Productos encontrados: {len(products)}")
except Exception as e:
    print_result("Listar productos", False, f"Error: {str(e)}")
    products = []

# 3.2 Crear producto
try:
    product_data = {
        "name": "Producto de Prueba",
        "description": "Descripción del producto de prueba",
        "sku": "TEST-001",
        "price": "29.99",
        "cost": "15.00",
        "stock": 100,
        "min_stock": 10,
        "category": "Electrónica",
        "is_active": True,
    }
    response = requests.post(
        f"{BASE_URL}/api/products", json=product_data, headers=headers, timeout=5
    )
    success = response.status_code == 201
    if success:
        product = response.json()
        product_id = product.get("id")
        print_result(
            "Crear producto", True, f"ID: {product_id}, Nombre: {product.get('name')}"
        )
    else:
        print_result(
            "Crear producto",
            False,
            f"Status: {response.status_code}, Response: {response.text}",
        )
except Exception as e:
    print_result("Crear producto", False, f"Error: {str(e)}")

if not product_id:
    print("\n⚠️  No se pudo crear un producto. Continuando con las pruebas...")

# 3.3 Obtener producto por ID
if product_id:
    try:
        response = requests.get(
            f"{BASE_URL}/api/products/{product_id}", headers=headers, timeout=5
        )
        success = response.status_code == 200
        if success:
            product = response.json()
            print_result(
                "Obtener producto por ID", True, f"Nombre: {product.get('name')}"
            )
        else:
            print_result(
                "Obtener producto por ID", False, f"Status: {response.status_code}"
            )
    except Exception as e:
        print_result("Obtener producto por ID", False, f"Error: {str(e)}")

# 3.4 Actualizar producto
if product_id:
    try:
        update_data = {"stock": 150, "price": "34.99"}
        response = requests.put(
            f"{BASE_URL}/api/products/{product_id}",
            json=update_data,
            headers=headers,
            timeout=5,
        )
        success = response.status_code == 200
        if success:
            product = response.json()
            print_result(
                "Actualizar producto",
                True,
                f"Nuevo stock: {product.get('stock')}, Nuevo precio: {product.get('price')}",
            )
        else:
            print_result(
                "Actualizar producto",
                False,
                f"Status: {response.status_code}, Response: {response.text}",
            )
    except Exception as e:
        print_result("Actualizar producto", False, f"Error: {str(e)}")

# 3.5 Contar productos
try:
    response = requests.get(
        f"{BASE_URL}/api/products/count", headers=headers, timeout=5
    )
    success = response.status_code == 200
    if success:
        count_data = response.json()
        print_result("Contar productos", True, f"Total: {count_data.get('count', 0)}")
    else:
        print_result("Contar productos", False, f"Status: {response.status_code}")
except Exception as e:
    print_result("Contar productos", False, f"Error: {str(e)}")

# 3.6 Productos con bajo stock
try:
    response = requests.get(
        f"{BASE_URL}/api/products/low-stock", headers=headers, timeout=5
    )
    success = response.status_code == 200
    if success:
        low_stock = response.json()
        print_result("Productos con bajo stock", True, f"Encontrados: {len(low_stock)}")
    else:
        print_result(
            "Productos con bajo stock", False, f"Status: {response.status_code}"
        )
except Exception as e:
    print_result("Productos con bajo stock", False, f"Error: {str(e)}")

# ============================================
# 4. VENTAS
# ============================================
print_section("4. VENTAS")

# 4.1 Listar ventas (debe estar vacío inicialmente)
try:
    response = requests.get(f"{BASE_URL}/api/sales", headers=headers, timeout=5)
    success = response.status_code == 200
    sales = response.json() if success else []
    print_result("Listar ventas", success, f"Ventas encontradas: {len(sales)}")
except Exception as e:
    print_result("Listar ventas", False, f"Error: {str(e)}")
    sales = []

# 4.2 Crear venta (solo si tenemos un producto)
if product_id:
    try:
        sale_data = {
            "customer_name": "Cliente de Prueba",
            "customer_email": "cliente@test.com",
            "status": "pending",
            "items": [{"product_id": product_id, "quantity": 2, "unit_price": "29.99"}],
        }
        response = requests.post(
            f"{BASE_URL}/api/sales", json=sale_data, headers=headers, timeout=5
        )
        success = response.status_code == 201
        if success:
            sale = response.json()
            sale_id = sale.get("id")
            print_result(
                "Crear venta",
                True,
                f"ID: {sale_id}, Total: {sale.get('total')}, Número: {sale.get('sale_number')}",
            )
        else:
            print_result(
                "Crear venta",
                False,
                f"Status: {response.status_code}, Response: {response.text}",
            )
    except Exception as e:
        print_result("Crear venta", False, f"Error: {str(e)}")
else:
    print_result(
        "Crear venta", False, "No hay productos disponibles para crear una venta"
    )
    sale_id = None

# 4.3 Obtener venta por ID
if sale_id:
    try:
        response = requests.get(
            f"{BASE_URL}/api/sales/{sale_id}", headers=headers, timeout=5
        )
        success = response.status_code == 200
        if success:
            sale = response.json()
            print_result(
                "Obtener venta por ID",
                True,
                f"Número: {sale.get('sale_number')}, Items: {len(sale.get('items', []))}",
            )
        else:
            print_result(
                "Obtener venta por ID", False, f"Status: {response.status_code}"
            )
    except Exception as e:
        print_result("Obtener venta por ID", False, f"Error: {str(e)}")

# 4.4 Estadísticas de ventas
try:
    response = requests.get(f"{BASE_URL}/api/sales/stats", headers=headers, timeout=5)
    success = response.status_code == 200
    if success:
        stats = response.json()
        print_result(
            "Estadísticas de ventas",
            True,
            f"Total ventas: {stats.get('total_sales', 0)}, Ingresos: {stats.get('total_revenue', 0)}",
        )
    else:
        print_result("Estadísticas de ventas", False, f"Status: {response.status_code}")
except Exception as e:
    print_result("Estadísticas de ventas", False, f"Error: {str(e)}")

# 4.5 Actualizar venta
if sale_id:
    try:
        update_data = {"status": "completed"}
        response = requests.put(
            f"{BASE_URL}/api/sales/{sale_id}",
            json=update_data,
            headers=headers,
            timeout=5,
        )
        success = response.status_code == 200
        if success:
            sale = response.json()
            print_result(
                "Actualizar venta", True, f"Nuevo estado: {sale.get('status')}"
            )
        else:
            print_result(
                "Actualizar venta",
                False,
                f"Status: {response.status_code}, Response: {response.text}",
            )
    except Exception as e:
        print_result("Actualizar venta", False, f"Error: {str(e)}")

# ============================================
# RESUMEN
# ============================================
print_section("RESUMEN")
print("[OK] Validacion del backend completada")
print(f"\nResultados:")
print(f"   - Token obtenido: {'[OK]' if token else '[FAIL]'}")
print(f"   - Producto creado: {'[OK]' if product_id else '[FAIL]'}")
print(f"   - Venta creada: {'[OK]' if sale_id else '[FAIL]'}")
print(
    f"\nSi todos los tests pasaron, el backend esta listo para conectar con el frontend."
)
print(f"\nDocumentacion API: {BASE_URL}/docs")
