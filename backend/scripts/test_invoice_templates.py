"""
Script para probar los endpoints de plantillas de factura
"""
import requests
import sys

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8000"

def test_invoice_templates():
    """Prueba completa de plantillas de factura"""
    
    print("=" * 60)
    print("PRUEBA DE PLANTILLAS DE FACTURA")
    print("=" * 60)
    
    # 1. Login
    print("\n1. Autenticacion...")
    login_data = {"username": "test@example.com", "password": "test12345"}
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data,
                                headers={"Content-Type": "application/x-www-form-urlencoded"})
        response.raise_for_status()
        token = response.json()["access_token"]
        print(f"[OK] Login exitoso")
    except:
        # Intentar crear usuario
        register_data = {"email": "test@example.com", "password": "test12345", "name": "Test"}
        requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data,
                                headers={"Content-Type": "application/x-www-form-urlencoded"})
        token = response.json()["access_token"]
        print(f"[OK] Usuario creado y login exitoso")
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # 2. Listar plantillas
    print("\n2. Listando plantillas disponibles...")
    response = requests.get(f"{BASE_URL}/api/invoice-templates", headers=headers)
    response.raise_for_status()
    templates = response.json()
    print(f"[OK] Encontradas {len(templates)} plantillas:")
    for t in templates:
        default_mark = " [DEFAULT]" if t['is_default'] else ""
        system_mark = " [SYSTEM]" if t['is_system'] else ""
        print(f"   - {t['name']} (ID: {t['id']}){default_mark}{system_mark}")
    
    # 3. Obtener plantilla por defecto
    print("\n3. Obteniendo plantilla por defecto...")
    response = requests.get(f"{BASE_URL}/api/invoice-templates/default", headers=headers)
    response.raise_for_status()
    default_template = response.json()
    print(f"[OK] Plantilla por defecto: {default_template['name']}")
    
    # 4. Obtener plantilla específica
    if templates:
        template_id = templates[0]['id']
        print(f"\n4. Obteniendo plantilla {template_id}...")
        response = requests.get(f"{BASE_URL}/api/invoice-templates/{template_id}", headers=headers)
        response.raise_for_status()
        template = response.json()
        print(f"[OK] Plantilla obtenida: {template['name']}")
        print(f"   - Header color: {template['header_color']}")
        print(f"   - Descripcion: {template['description']}")
    
    # 5. Crear plantilla personalizada
    print("\n5. Creando plantilla personalizada...")
    custom_template = {
        "name": "Mi Plantilla Personalizada",
        "description": "Plantilla creada desde script de prueba",
        "html_template": """
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
    <h1 style="color: {{header_color}};">FACTURA {{sale_number}}</h1>
    <p>Cliente: {{customer_name}}</p>
    <p>Total: €{{total}}</p>
    <table>
        <tr><th>Producto</th><th>Precio</th></tr>
        {{items}}
    </table>
</body>
</html>
        """,
        "header_color": "#8b5cf6",
        "is_default": False
    }
    response = requests.post(f"{BASE_URL}/api/invoice-templates", json=custom_template, headers=headers)
    response.raise_for_status()
    created = response.json()
    print(f"[OK] Plantilla creada: {created['name']} (ID: {created['id']})")
    
    # 6. Preview de factura (si hay una venta)
    print("\n6. Obteniendo ventas para preview...")
    response = requests.get(f"{BASE_URL}/api/sales", headers=headers)
    if response.status_code == 200:
        sales = response.json()
        if sales and templates:
            sale_id = sales[0]['id']
            template_id = templates[0]['id']
            print(f"   Generando preview de venta {sale_id} con plantilla {template_id}...")
            preview_url = f"{BASE_URL}/api/invoice-templates/{template_id}/preview/{sale_id}"
            response = requests.get(preview_url, headers=headers)
            if response.status_code == 200:
                print(f"[OK] Preview generado exitosamente (HTML de {len(response.text)} caracteres)")
            else:
                print(f"[INFO] Preview no disponible: {response.status_code}")
        else:
            print("[INFO] No hay ventas para generar preview")
    
    # 7. Resumen
    print("\n" + "=" * 60)
    print("RESUMEN DE PRUEBAS")
    print("=" * 60)
    print("[OK] Endpoints probados:")
    print("   - GET /api/invoice-templates (listar)")
    print("   - GET /api/invoice-templates/default (obtener default)")
    print("   - GET /api/invoice-templates/{id} (obtener especifica)")
    print("   - POST /api/invoice-templates (crear)")
    print("   - GET /api/invoice-templates/{id}/preview/{sale_id} (preview)")
    print("\n[INFO] Proximos pasos:")
    print("   1. Ver plantillas en Swagger: http://localhost:8000/docs")
    print("   2. Integrar selector de plantilla en frontend")
    print("   3. Agregar editor visual de plantillas")
    print("=" * 60)


if __name__ == "__main__":
    test_invoice_templates()

