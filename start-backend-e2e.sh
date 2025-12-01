#!/bin/bash
# Script para iniciar backend en modo E2E (sin rate limiting)
# Uso: ./start-backend-e2e.sh

echo "Iniciando backend en modo E2E..."
echo "Rate limiting deshabilitado para tests E2E"

export E2E_MODE=true
docker-compose -f docker-compose.backend.yml up -d

echo "Backend iniciado en modo E2E"
echo "Para ver logs: docker-compose -f docker-compose.backend.yml logs -f backend"






