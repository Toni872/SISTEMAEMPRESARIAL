"""
Vercel Serverless Function wrapper para FastAPI
Este archivo permite que FastAPI funcione como serverless function en Vercel
"""
import sys
import os
from pathlib import Path

# Añadir el directorio backend al path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Configurar variables de entorno si es necesario
os.environ.setdefault("ENV", "production")

from app.main import app
from mangum import Mangum

# Crear el handler de Mangum una sola vez (singleton)
handler_instance = Mangum(app, lifespan="off")

# Vercel espera un handler llamado 'handler' que recibe (event, context)
def handler(event, context):
    """
    Handler para Vercel serverless functions
    Convierte el request de Vercel al formato ASGI de FastAPI
    """
    return handler_instance(event, context)

# Exportar para Vercel
__all__ = ["handler"]

