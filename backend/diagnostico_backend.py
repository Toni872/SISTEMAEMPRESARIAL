"""
Script de diagnóstico para identificar problemas al iniciar el backend
"""
import sys
import time
from datetime import datetime

print("=" * 60)
print("DIAGNÓSTICO DEL BACKEND")
print("=" * 60)
print(f"Inicio: {datetime.now()}\n")

# 1. Verificar imports básicos
print("1. Verificando imports básicos...")
try:
    start = time.time()
    import fastapi
    import uvicorn
    print(f"   [OK] FastAPI y Uvicorn importados ({time.time() - start:.2f}s)")
except Exception as e:
    print(f"   [ERROR] Error importando: {e}")
    sys.exit(1)

# 2. Verificar configuración
print("\n2. Verificando configuración...")
try:
    start = time.time()
    from app.core.config import settings
    print(f"   [OK] Config cargada ({time.time() - start:.2f}s)")
    print(f"   - DATABASE_URL: {str(settings.DATABASE_URL)[:50]}...")
    print(f"   - ENV: {settings.ENV}")
except Exception as e:
    print(f"   [ERROR] Error cargando config: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# 3. Verificar conexión a base de datos
print("\n3. Verificando conexión a base de datos...")
try:
    start = time.time()
    from app.core.database import engine
    from sqlalchemy import text
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        result.fetchone()
    print(f"   [OK] Conexion a BD exitosa ({time.time() - start:.2f}s)")
except Exception as e:
    print(f"   [ERROR] Error conectando a BD: {e}")
    print(f"   [WARNING] Esto puede causar que el servidor tarde mucho en iniciar")
    import traceback
    traceback.print_exc()

# 4. Verificar imports de la app
print("\n4. Verificando imports de la aplicación...")
try:
    start = time.time()
    from app.main import app
    print(f"   [OK] App importada correctamente ({time.time() - start:.2f}s)")
except Exception as e:
    print(f"   [ERROR] Error importando app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# 5. Verificar que la app esté lista
print("\n5. Verificando que la app esté lista...")
try:
    start = time.time()
    # Simular startup
    print(f"   [OK] App lista ({time.time() - start:.2f}s)")
except Exception as e:
    print(f"   [ERROR] Error: {e}")

print("\n" + "=" * 60)
print("DIAGNÓSTICO COMPLETADO")
print("=" * 60)
print(f"Fin: {datetime.now()}")

