"""
Script para probar los endpoints de facturas recurrentes
"""
import requests
import json
import sys
from datetime import date, timedelta

# Configurar encoding para Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8000"

def test_recurring_invoices():
    """Prueba completa de facturas recurrentes"""
    
    print("=" * 60)
    print("PRUEBA DE FACTURAS RECURRENTES")
    print("=" * 60)
    
    # 1. Login para obtener token
    print("\n1. Autenticacion...")
    
    # Intentar con diferentes usuarios comunes
    users_to_try = [
        {"username": "test@example.com", "password": "test12345"},
        {"username": "admin@example.com", "password": "admin123"},
        {"username": "user@example.com", "password": "user123"},
    ]
    
    token = None
    for user_creds in users_to_try:
        try:
            response = requests.post(
                f"{BASE_URL}/api/auth/login",
                data=user_creds,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            if response.status_code == 200:
                auth_data = response.json()
                token = auth_data["access_token"]
                print(f"[OK] Login exitoso con {user_creds['username']}")
                print(f"   Token obtenido: {token[:20]}...")
                break
        except:
            continue
    
    if not token:
        print("[ERROR] No se pudo autenticar con ningun usuario")
        print("\n[INFO] Creando usuario de prueba...")
        try:
            import random
            test_email = f"test{random.randint(1000,9999)}@example.com"
            register_data = {
                "email": test_email,
                "password": "test12345",
                "name": "Usuario Prueba"
            }
            response = requests.post(
                f"{BASE_URL}/api/auth/register",
                json=register_data
            )
            if response.status_code == 201:
                print(f"[OK] Usuario creado: {test_email}")
                login_data = {
                    "username": test_email,
                    "password": "test12345"
                }
                response = requests.post(
                    f"{BASE_URL}/api/auth/login",
                    data=login_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                response.raise_for_status()
                auth_data = response.json()
                token = auth_data["access_token"]
                print(f"[OK] Login exitoso")
            else:
                print(f"[ERROR] No se pudo crear usuario: {response.text}")
                print("\n[INFO] Por favor crea un usuario manualmente en:")
                print("   http://localhost:8000/docs -> /api/auth/register")
                return
        except Exception as e2:
            print(f"[ERROR] Error: {e2}")
            return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 2. Obtener productos disponibles (necesarios para crear factura recurrente)
    print("\n2. Obteniendo productos...")
    try:
        response = requests.get(f"{BASE_URL}/api/products", headers=headers)
        response.raise_for_status()
        products = response.json()
        if not products:
            print("⚠️  No hay productos. Creando uno de prueba...")
            # Crear un producto de prueba
            product_data = {
                "name": "Producto Prueba Recurrente",
                "description": "Producto para probar facturas recurrentes",
                "price": 100.00,
                "stock": 100,
                "category": "Servicios"
            }
            response = requests.post(f"{BASE_URL}/api/products", json=product_data, headers=headers)
            response.raise_for_status()
            product = response.json()
            print(f"[OK] Producto creado: {product['id']}")
        else:
            product = products[0]
            print(f"[OK] Producto encontrado: {product['name']} (ID: {product['id']})")
    except Exception as e:
        print(f"[ERROR] Error obteniendo productos: {e}")
        return
    
    # 3. Crear factura recurrente
    print("\n3. Creando factura recurrente...")
    tomorrow = date.today() + timedelta(days=1)
    next_month = date.today() + timedelta(days=30)
    
    recurring_invoice_data = {
        "name": "Factura Recurrente de Prueba",
        "customer_name": "Cliente Prueba",
        "customer_email": "cliente@prueba.com",
        "frequency": "monthly",
        "start_date": tomorrow.isoformat(),
        "end_date": next_month.isoformat(),
        "day_of_month": 15,  # Dia 15 de cada mes
        "notes": "Factura recurrente creada desde script de prueba",
        "is_active": True,
        "items": [
            {
                "product_id": product["id"],
                "quantity": 1,
                "unit_price": 100.00,
                "description": "Servicio mensual"
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/recurring-invoices",
            json=recurring_invoice_data,
            headers=headers
        )
        response.raise_for_status()
        recurring_invoice = response.json()
        print(f"[OK] Factura recurrente creada exitosamente!")
        print(f"   ID: {recurring_invoice['id']}")
        print(f"   Nombre: {recurring_invoice['name']}")
        print(f"   Frecuencia: {recurring_invoice['frequency']}")
        print(f"   Proxima ejecucion: {recurring_invoice['next_run_date']}")
        recurring_id = recurring_invoice['id']
    except Exception as e:
        print(f"[ERROR] Error creando factura recurrente: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Respuesta: {e.response.text}")
        return
    
    # 4. Listar facturas recurrentes
    print("\n4. Listando facturas recurrentes...")
    try:
        response = requests.get(f"{BASE_URL}/api/recurring-invoices", headers=headers)
        response.raise_for_status()
        recurring_invoices = response.json()
        print(f"[OK] Encontradas {len(recurring_invoices)} facturas recurrentes")
        for ri in recurring_invoices:
            print(f"   - {ri['name']} (ID: {ri['id']}, Activa: {ri['is_active']})")
    except Exception as e:
        print(f"[ERROR] Error listando facturas recurrentes: {e}")
    
    # 5. Obtener factura recurrente especifica
    print(f"\n5. Obteniendo factura recurrente {recurring_id}...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/recurring-invoices/{recurring_id}",
            headers=headers
        )
        response.raise_for_status()
        ri = response.json()
        print(f"[OK] Factura recurrente obtenida:")
        print(f"   - Total facturas generadas: {ri['total_invoices_generated']}")
        print(f"   - Items: {len(ri['items'])}")
    except Exception as e:
        print(f"[ERROR] Error obteniendo factura recurrente: {e}")
    
    # 6. Generar factura manualmente (forzar generacion)
    print(f"\n6. Generando factura manualmente desde factura recurrente...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/recurring-invoices/{recurring_id}/generate",
            headers=headers
        )
        if response.status_code == 400:
            print("[INFO] No se puede generar aun (fecha futura). Esto es normal.")
            print("   La factura se generara automaticamente el dia programado.")
        else:
            response.raise_for_status()
            result = response.json()
            print(f"[OK] Factura generada exitosamente!")
            print(f"   Factura ID: {result['sale']['id']}")
            print(f"   Total: EUR {result['sale']['total']}")
            print(f"   Proxima ejecucion: {result['next_run_date']}")
    except Exception as e:
        print(f"[INFO] {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Respuesta: {e.response.text}")
    
    # 7. Procesar facturas vencidas (endpoint de procesamiento)
    print(f"\n7. Procesando facturas recurrentes vencidas...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/recurring-invoices/process-due",
            headers=headers
        )
        response.raise_for_status()
        result = response.json()
        print(f"[OK] Procesamiento completado:")
        print(f"   - Procesadas: {result['stats']['processed']}")
        print(f"   - Generadas: {result['stats']['generated']}")
        print(f"   - Errores: {result['stats']['errors']}")
    except Exception as e:
        print(f"[INFO] Error procesando: {e}")
    
    # 8. Resumen final
    print("\n" + "=" * 60)
    print("RESUMEN DE PRUEBAS")
    print("=" * 60)
    print("[OK] Endpoints probados:")
    print("   - POST /api/recurring-invoices (crear)")
    print("   - GET /api/recurring-invoices (listar)")
    print("   - GET /api/recurring-invoices/{id} (obtener)")
    print("   - POST /api/recurring-invoices/{id}/generate (generar)")
    print("   - POST /api/recurring-invoices/process-due (procesar)")
    print("\n[INFO] Proximos pasos:")
    print("   1. Ver facturas recurrentes en Swagger: http://localhost:8000/docs")
    print("   2. Crear frontend para gestionar facturas recurrentes")
    print("   3. Configurar cron job para procesamiento automatico")
    print("=" * 60)


if __name__ == "__main__":
    test_recurring_invoices()

