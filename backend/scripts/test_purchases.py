#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para probar los endpoints de compras y proveedores
"""
import sys
import requests
import json
from datetime import datetime

# Configurar encoding UTF-8 para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

BASE_URL = "http://localhost:8000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_result(success, message):
    if success:
        print(f"✅ {message}")
    else:
        print(f"❌ {message}")

def login():
    """Iniciar sesión y obtener token"""
    print_section("1. AUTENTICACIÓN")
    
    # Intentar login con usuario de prueba
    login_data = {
        "username": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print_result(True, f"Login exitoso")
            print(f"   Token obtenido: {token[:20]}...")
            return token
        else:
            print_result(False, f"Error en login: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print_result(False, f"Error de conexión: {str(e)}")
        return None

def test_suppliers(token):
    """Probar endpoints de proveedores"""
    print_section("2. PROVEEDORES")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Crear proveedor
    print("\n📝 Creando proveedor...")
    supplier_data = {
        "name": "TechSupply SA",
        "tax_id": "B12345678",
        "email": "contacto@techsupply.com",
        "phone": "+34 912 345 678",
        "address": "Calle Ejemplo 123",
        "city": "Madrid",
        "postal_code": "28001",
        "country": "España",
        "contact_person": "Juan Pérez",
        "is_active": True
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/purchases/suppliers",
            headers=headers,
            json=supplier_data
        )
        if response.status_code == 201:
            supplier = response.json()
            print_result(True, f"Proveedor creado: {supplier['name']} (ID: {supplier['id']})")
            supplier_id = supplier['id']
        else:
            print_result(False, f"Error creando proveedor: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return None
    
    # Listar proveedores
    print("\n📋 Listando proveedores...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/purchases/suppliers",
            headers=headers
        )
        if response.status_code == 200:
            suppliers = response.json()
            print_result(True, f"Proveedores encontrados: {len(suppliers)}")
            for s in suppliers:
                print(f"   - {s['name']} ({s['email']})")
        else:
            print_result(False, f"Error listando proveedores: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
    
    return supplier_id

def test_purchases(token, supplier_id):
    """Probar endpoints de compras"""
    print_section("3. COMPRAS")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Crear compra
    print("\n📝 Creando compra...")
    purchase_data = {
        "supplier_id": supplier_id,
        "purchase_date": datetime.now().isoformat(),
        "status": "pending",
        "notes": "Compra de prueba",
        "items": [
            {
                "description": "Producto A",
                "quantity": 10,
                "unit_price": 50.00,
                "tax_rate": 21.0,
                "subtotal": 500.00
            },
            {
                "description": "Producto B",
                "quantity": 5,
                "unit_price": 30.00,
                "tax_rate": 21.0,
                "subtotal": 150.00
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/purchases",
            headers=headers,
            json=purchase_data
        )
        if response.status_code == 201:
            purchase = response.json()
            print_result(True, f"Compra creada: {purchase['purchase_number']}")
            print(f"   Total: €{purchase['total']}")
            print(f"   Items: {len(purchase['items'])}")
            purchase_id = purchase['id']
        else:
            print_result(False, f"Error creando compra: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return None
    
    # Listar compras
    print("\n📋 Listando compras...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/purchases",
            headers=headers
        )
        if response.status_code == 200:
            purchases = response.json()
            print_result(True, f"Compras encontradas: {len(purchases)}")
            for p in purchases:
                print(f"   - {p['purchase_number']}: €{p['total']} ({p['status']})")
        else:
            print_result(False, f"Error listando compras: {response.status_code}")
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
    
    return purchase_id

def main():
    print("\n" + "="*60)
    print("  TEST DE ENDPOINTS DE COMPRAS Y PROVEEDORES")
    print("="*60)
    
    # Login
    token = login()
    if not token:
        print("\n❌ No se pudo obtener token. Abortando.")
        return
    
    # Probar proveedores
    supplier_id = test_suppliers(token)
    if not supplier_id:
        print("\n❌ No se pudo crear proveedor. Abortando.")
        return
    
    # Probar compras
    purchase_id = test_purchases(token, supplier_id)
    if not purchase_id:
        print("\n❌ No se pudo crear compra.")
        return
    
    print_section("RESUMEN")
    print_result(True, "Todas las pruebas completadas exitosamente")
    print(f"\n   Proveedor creado: ID {supplier_id}")
    print(f"   Compra creada: ID {purchase_id}")
    print("\n✅ El módulo de compras está funcionando correctamente!")

if __name__ == "__main__":
    main()



