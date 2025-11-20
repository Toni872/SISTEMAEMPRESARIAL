"""
Script para probar la generación manual de factura desde factura recurrente
"""
import requests
import sys
from datetime import date

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8000"

# Login
login_data = {"username": "test@example.com", "password": "test12345"}
response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data, 
                        headers={"Content-Type": "application/x-www-form-urlencoded"})
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Obtener factura recurrente
response = requests.get(f"{BASE_URL}/api/recurring-invoices", headers=headers)
recurring_invoices = response.json()

if not recurring_invoices:
    print("No hay facturas recurrentes. Creando una...")
    # Obtener productos
    products = requests.get(f"{BASE_URL}/api/products", headers=headers).json()
    if not products:
        print("No hay productos. Creando uno...")
        product = requests.post(f"{BASE_URL}/api/products", json={
            "name": "Servicio Mensual",
            "price": 100.00,
            "stock": 100
        }, headers=headers).json()
    else:
        product = products[0]
    
    # Crear factura recurrente con fecha de hoy
    recurring = requests.post(f"{BASE_URL}/api/recurring-invoices", json={
        "name": "Factura para Generar Ahora",
        "customer_name": "Cliente Test",
        "frequency": "monthly",
        "start_date": date.today().isoformat(),
        "day_of_month": date.today().day,
        "is_active": True,
        "items": [{"product_id": product["id"], "quantity": 1, "unit_price": 100.00}]
    }, headers=headers).json()
    recurring_id = recurring["id"]
    print(f"Factura recurrente creada: ID {recurring_id}")
else:
    recurring_id = recurring_invoices[0]["id"]
    print(f"Usando factura recurrente existente: ID {recurring_id}")

# Actualizar next_run_date a hoy (usando update)
print("\nActualizando fecha de ejecucion a hoy...")
update_data = {"next_run_date": date.today().isoformat()}
# Nota: Necesitamos agregar next_run_date al schema de update, por ahora probamos generate

# Generar factura con force=true para forzar generación
print("Generando factura (forzando generacion)...")
response = requests.post(f"{BASE_URL}/api/recurring-invoices/{recurring_id}/generate?force=true", headers=headers)

if response.status_code == 200:
    result = response.json()
    print(f"\n[OK] Factura generada exitosamente!")
    print(f"   Factura ID: {result['sale']['id']}")
    print(f"   Numero: {result['sale']['sale_number']}")
    print(f"   Total: EUR {result['sale']['total']}")
    print(f"   Proxima ejecucion: {result['next_run_date']}")
    
    # Verificar que la factura se creo correctamente
    sale_response = requests.get(f"{BASE_URL}/api/sales/{result['sale']['id']}", headers=headers)
    sale = sale_response.json()
    print(f"\n   Items en la factura: {len(sale['items'])}")
    print(f"   Estado: {sale['status']}")
else:
    print(f"[ERROR] {response.status_code}: {response.text}")

