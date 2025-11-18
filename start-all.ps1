# Script para iniciar Frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Sistema ERP Empresarial" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "frontend-next")) {
    Write-Host "ERROR: Ejecuta este script desde el directorio raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Iniciar Frontend en una nueva ventana
Write-Host "🚀 Iniciando Frontend (Next.js)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend-next'; Write-Host 'Frontend iniciando en http://localhost:3001' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ Frontend iniciado" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "   Landing:  http://localhost:3001/landing" -ForegroundColor White
Write-Host "   Login:    http://localhost:3001/login" -ForegroundColor White
Write-Host ""
Write-Host "💡 Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow

