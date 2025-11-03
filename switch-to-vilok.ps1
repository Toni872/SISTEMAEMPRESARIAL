# Script para cambiar del proyecto ERP al proyecto Vilok
Write-Host "🔄 Cambiando al proyecto Vilok..." -ForegroundColor Cyan

# Detener contenedores de ERP
Write-Host "`n🛑 Deteniendo proyecto ERP..." -ForegroundColor Yellow
docker-compose down

# Opcional: Pausar servicios específicos si es necesario
# docker stop erp-frontend erp-backend erp-postgres erp-redis erp-pgadmin erp-ai-service

Write-Host "✅ Proyecto ERP detenido" -ForegroundColor Green

# Indicar dónde ir para iniciar Vilok
Write-Host "`n📁 Navega a tu carpeta de Vilok y ejecuta:" -ForegroundColor Cyan
Write-Host "   cd C:\ruta\a\vilok" -ForegroundColor White
Write-Host "   docker-compose up -d" -ForegroundColor White

Write-Host "`n🚀 Para volver al ERP, navega a esta carpeta y ejecuta:" -ForegroundColor Cyan
Write-Host "   cd C:\Users\Antonio\Desktop\sistemaempresarial" -ForegroundColor White
Write-Host "   docker-compose up -d" -ForegroundColor White







