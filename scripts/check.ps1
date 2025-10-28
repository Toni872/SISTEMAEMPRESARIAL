# Script de verificación del sistema ERP
Write-Host "🔍 Verificando estado del Sistema ERP..." -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "🐳 Estado de contenedores Docker:" -ForegroundColor Yellow
try {
    $containers = docker ps --filter "name=erp-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    if ($containers) {
        Write-Host $containers -ForegroundColor Green
    }
    else {
        Write-Host "❌ No hay contenedores ERP ejecutándose" -ForegroundColor Red
        Write-Host "Ejecuta: docker-compose up -d postgres redis" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Error verificando Docker" -ForegroundColor Red
}

Write-Host ""

# Verificar Backend
Write-Host "📡 Verificando Backend (Puerto 3000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend funcionando correctamente" -ForegroundColor Green
        Write-Host "   🔗 API: http://localhost:3000" -ForegroundColor White
        Write-Host "   🎮 GraphQL: http://localhost:3000/graphql" -ForegroundColor White
        Write-Host "   📚 Docs: http://localhost:3000/api/docs" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
    Write-Host "Ejecuta: cd backend; npm run start:dev" -ForegroundColor White
}

Write-Host ""

# Verificar Frontend
Write-Host "🎨 Verificando Frontend (Puerto 5173):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:5173' -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend funcionando correctamente" -ForegroundColor Green
        Write-Host "   🔗 App: http://localhost:5173" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Frontend no responde" -ForegroundColor Red
    Write-Host "Ejecuta: cd frontend; npm run dev" -ForegroundColor White
}

Write-Host ""

# Verificar Base de Datos
Write-Host "🗄️ Verificando conexión a Base de Datos:" -ForegroundColor Yellow
try {
    docker exec erp-postgres psql -U erp_user -d erp_db -c "SELECT 1;" | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de datos accesible" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Error conectando a la base de datos" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ No se puede conectar a PostgreSQL" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   .\scripts\dev.ps1           - Iniciar desarrollo" -ForegroundColor White
Write-Host "   .\scripts\docker.ps1 up     - Iniciar entorno Docker" -ForegroundColor White
Write-Host "   .\scripts\check.ps1         - Ver este estado" -ForegroundColor White
Write-Host "   npm run dev                 - Iniciar ambos servidores" -ForegroundColor White