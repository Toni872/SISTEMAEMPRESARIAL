# Script para iniciar backend en modo E2E (sin rate limiting)
# Uso: .\start-backend-e2e.ps1

Write-Host "Iniciando backend en modo E2E..." -ForegroundColor Green
Write-Host "Rate limiting deshabilitado para tests E2E" -ForegroundColor Yellow

$env:E2E_MODE = "true"
docker-compose -f docker-compose.backend.yml up -d

Write-Host "Backend iniciado en modo E2E" -ForegroundColor Green
Write-Host "Para ver logs: docker-compose -f docker-compose.backend.yml logs -f backend" -ForegroundColor Cyan






