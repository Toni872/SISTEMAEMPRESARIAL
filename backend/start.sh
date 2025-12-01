#!/bin/bash
# Script de inicio para Railway
# Lee PORT de las variables de entorno o usa 8000 por defecto

PORT=${PORT:-8000}
echo "Iniciando servidor FastAPI en puerto $PORT..."

exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"




