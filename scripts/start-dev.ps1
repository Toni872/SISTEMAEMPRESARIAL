# Script de inicio para desarrollo local
Write-Host "🚀 Iniciando ERP System en modo desarrollo..." -ForegroundColor Green
Write-Host ""

# Detener procesos existentes si están corriendo
Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Variables de entorno para el backend
$env:DATABASE_URL = "postgresql://postgres:erp_password@localhost:5432/erp_db"
$env:REDIS_URL = "redis://localhost:6379"
$env:JWT_SECRET = "your-super-secret-jwt-key-change-in-production"
$env:PORT = "3000"
$env:NODE_ENV = "development"
$env:LOG_LEVEL = "info"
$env:THROTTLE_TTL = "60"
$env:THROTTLE_LIMIT = "100"

# Variables para el frontend
$env:VITE_API_URL = "http://localhost:3000"
$env:VITE_WS_URL = "ws://localhost:3000"
$env:VITE_GRAPHQL_URL = "http://localhost:3000/graphql"

# Verificar que PostgreSQL está corriendo
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$postgresRunning = docker ps --filter "name=erp-postgres-dev" --format "{{.Names}}" 2>$null
if (-not $postgresRunning) {
    Write-Host "❌ PostgreSQL no está corriendo. Iniciando..." -ForegroundColor Red
    docker-compose -f docker-compose.dev.yml up -d postgres redis
    Start-Sleep -Seconds 5
}

Write-Host "✅ PostgreSQL está corriendo" -ForegroundColor Green
Write-Host ""

# Iniciar backend en segundo plano
Write-Host "📦 Iniciando Backend..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    cd backend
    npm run start:dev
}
Write-Host "Backend iniciado (PID: $($backendJob.Id))" -ForegroundColor Green
Write-Host ""

# Esperar un poco para que el backend se inicie
Write-Host "⏳ Esperando a que el backend se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar que el backend está respondiendo
$backendReady = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            break
        }
    }
    catch {
        Start-Sleep -Seconds 2
    }
}

if ($backendReady) {
    Write-Host "✅ Backend está listo en http://localhost:3000" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Backend aún no está listo, pero continuando..." -ForegroundColor Yellow
}
Write-Host ""

# Iniciar frontend
Write-Host "📦 Iniciando Frontend..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    cd frontend
    npm run dev
}
Write-Host "Frontend iniciado (PID: $($frontendJob.Id))" -ForegroundColor Green
Write-Host ""

# Esperar a que el frontend se inicie
Write-Host "⏳ Esperando a que el frontend se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host ""

# Mostrar información
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "✨ SERVIDORES INICIADOS ✨" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs de acceso:" -ForegroundColor Yellow
Write-Host "  • Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  • Backend:   http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • GraphQL:   http://localhost:3000/graphql" -ForegroundColor Cyan
Write-Host "  • API Docs: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host "  • PgAdmin:   http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Credenciales:" -ForegroundColor Yellow
Write-Host "  Email:    admin@erp.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Para detener los servidores, ejecuta:" -ForegroundColor Red
Write-Host "   Get-Process node | Stop-Process" -ForegroundColor White
Write-Host ""

# Mantener el script corriendo
Write-Host "Presiona Ctrl+C para detener los servidores..." -ForegroundColor Yellow
Write-Host ""

# Monitorear los jobs
while ($true) {
    Start-Sleep -Seconds 5
    $backendStatus = Get-Job -Id $backendJob.Id | Select-Object -ExpandProperty State
    $frontendStatus = Get-Job -Id $frontendJob.Id | Select-Object -ExpandProperty State
    
    if ($backendStatus -eq "Failed" -or $frontendStatus -eq "Failed") {
        Write-Host "❌ Uno de los servidores ha fallado" -ForegroundColor Red
        Get-Job | Format-Table
        break
    }
}


