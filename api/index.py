"""
Vercel Serverless Function wrapper para FastAPI
Este archivo permite que FastAPI funcione como serverless function en Vercel
"""
import sys
import os
import json
from pathlib import Path
import traceback

# Añadir el directorio backend al path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Configurar variables de entorno si es necesario
os.environ.setdefault("ENV", "production")

# Validar variables de entorno críticas antes de importar
required_vars = ["DATABASE_URL", "SECRET_KEY"]
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    error_msg = f"❌ Variables de entorno faltantes: {', '.join(missing_vars)}"
    print(error_msg, file=sys.stderr)
    # No fallar aquí, dejar que FastAPI maneje el error

try:
    from app.main import app
    from mangum import Mangum
    
    # Crear el handler de Mangum una sola vez (singleton)
    handler_instance = Mangum(app, lifespan="off")
except Exception as e:
    print(f"❌ Error al inicializar FastAPI: {e}", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    # Crear un handler de error básico
    def error_handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": True,
                "error_code": "INITIALIZATION_ERROR",
                "detail": f"Error al inicializar la aplicación: {str(e)}",
                "message": "Error interno del servidor. Revisa los logs del backend o contacta al administrador."
            })
        }
    handler_instance = error_handler

# Vercel espera un handler llamado 'handler' que recibe (event, context)
def handler(event, context):
    """
    Handler para Vercel serverless functions
    Convierte el request de Vercel al formato ASGI de FastAPI
    """
    try:
        return handler_instance(event, context)
    except Exception as e:
        print(f"❌ Error en handler de Vercel: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": True,
                "error_code": "HANDLER_ERROR",
                "detail": f"Error en el handler: {str(e)}",
                "message": "Error interno del servidor. Revisa los logs del backend o contacta al administrador."
            })
        }

# Exportar para Vercel
__all__ = ["handler"]

