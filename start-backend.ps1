# Script para iniciar el backend del ERP
# Uso: .\start-backend.ps1

Write-Host "🚀 Iniciando Backend del ERP..." -ForegroundColor Green
Write-Host ""

# Verificar si Docker está disponible
$dockerAvailable = Get-Command docker -ErrorAction SilentlyContinue

if ($dockerAvailable) {
    Write-Host "✅ Docker encontrado. Usando Docker Compose..." -ForegroundColor Cyan
    Write-Host ""
    
    # Iniciar backend con Docker Compose
    docker-compose -f docker-compose.backend.yml up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Backend iniciado correctamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Información útil:" -ForegroundColor Yellow
        Write-Host "  - Backend API: http://localhost:8000" -ForegroundColor White
        Write-Host "  - Documentación: http://localhost:8000/docs" -ForegroundColor White
        Write-Host "  - Ver logs: docker-compose -f docker-compose.backend.yml logs -f backend" -ForegroundColor White
        Write-Host "  - Detener: docker-compose -f docker-compose.backend.yml down" -ForegroundColor White
        Write-Host ""
        Write-Host "⏳ Esperando a que el backend esté listo..." -ForegroundColor Cyan
        
        # Esperar a que el backend responda
        $maxAttempts = 30
        $attempt = 0
        $backendReady = $false
        
        while ($attempt -lt $maxAttempts -and -not $backendReady) {
            Start-Sleep -Seconds 2
            $attempt++
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -TimeoutSec 2 -ErrorAction Stop
                if ($response.StatusCode -eq 200) {
                    $backendReady = $true
                }
            } catch {
                Write-Host "  Intento $attempt/$maxAttempts..." -ForegroundColor Gray
            }
        }
        
        if ($backendReady) {
            Write-Host ""
            Write-Host "✅ Backend listo! Puedes acceder a:" -ForegroundColor Green
            Write-Host "   http://localhost:8000/docs" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "⚠️  El backend está iniciando pero aún no responde." -ForegroundColor Yellow
            Write-Host "   Verifica los logs: docker-compose -f docker-compose.backend.yml logs -f backend" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "❌ Error al iniciar el backend con Docker." -ForegroundColor Red
        Write-Host "   Verifica que Docker esté corriendo y que docker-compose.backend.yml exista." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Docker no encontrado. Iniciando backend manualmente..." -ForegroundColor Yellow
    Write-Host ""
    
    # Verificar si estamos en el directorio correcto
    if (-not (Test-Path "backend")) {
        Write-Host "❌ Error: No se encuentra el directorio 'backend'" -ForegroundColor Red
        Write-Host "   Ejecuta este script desde la raíz del proyecto." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "📝 Pasos para iniciar manualmente:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. cd backend" -ForegroundColor White
    Write-Host "2. python -m venv venv (si no existe)" -ForegroundColor White
    Write-Host "3. .\venv\Scripts\Activate.ps1" -ForegroundColor White
    Write-Host "4. pip install -r requirements.txt" -ForegroundColor White
    Write-Host "5. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -ForegroundColor White
    Write-Host ""
        Write-Host "Ver backend/INICIAR_BACKEND.md para mas detalles" -ForegroundColor Cyan
}

