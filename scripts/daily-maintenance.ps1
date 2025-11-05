# Script de Mantenimiento Diario Automatizado
# Ejecutar este script cada día para mantener el proyecto limpio y actualizado

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   MANTENIMIENTO DIARIO - SISTEMA ERP" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logFile = "maintenance-log-$(Get-Date -Format 'yyyy-MM-dd').txt"

function Write-Log {
    param($Message, $Level = "INFO")
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

Write-Log "Iniciando mantenimiento diario..." "INFO"

# 1. Verificar estado de Git
Write-Host "`n[1/10] Verificando estado de Git..." -ForegroundColor Yellow
git status --porcelain | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Log "Git status: OK" "SUCCESS"
}
else {
    Write-Log "Git status: ERROR" "ERROR"
}

# 2. Actualizar dependencias - Backend
Write-Host "`n[2/10] Actualizando dependencias del Backend..." -ForegroundColor Yellow
Push-Location backend
try {
    npm outdated 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    npm update 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Backend dependencies updated" "SUCCESS"
}
catch {
    Write-Log "Error updating backend dependencies: $_" "ERROR"
}
finally {
    Pop-Location
}

# 3. Actualizar dependencias - Frontend
Write-Host "`n[3/10] Actualizando dependencias del Frontend..." -ForegroundColor Yellow
Push-Location frontend
try {
    npm outdated 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    npm update 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Frontend dependencies updated" "SUCCESS"
}
catch {
    Write-Log "Error updating frontend dependencies: $_" "ERROR"
}
finally {
    Pop-Location
}

# 4. Escaneo de seguridad - Backend
Write-Host "`n[4/10] Escaneando seguridad del Backend..." -ForegroundColor Yellow
Push-Location backend
try {
    npm audit --audit-level=moderate 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Backend security scan completed" "SUCCESS"
}
catch {
    Write-Log "Backend security scan warning: $_" "WARN"
}
finally {
    Pop-Location
}

# 5. Escaneo de seguridad - Frontend
Write-Host "`n[5/10] Escaneando seguridad del Frontend..." -ForegroundColor Yellow
Push-Location frontend
try {
    npm audit --audit-level=moderate 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Frontend security scan completed" "SUCCESS"
}
catch {
    Write-Log "Frontend security scan warning: $_" "WARN"
}
finally {
    Pop-Location
}

# 6. Linting - Backend
Write-Host "`n[6/10] Ejecutando linter en Backend..." -ForegroundColor Yellow
Push-Location backend
try {
    npm run lint 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Backend linting completed" "SUCCESS"
}
catch {
    Write-Log "Backend linting found issues: $_" "WARN"
}
finally {
    Pop-Location
}

# 7. Linting - Frontend
Write-Host "`n[7/10] Ejecutando linter en Frontend..." -ForegroundColor Yellow
Push-Location frontend
try {
    npm run lint 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Frontend linting completed" "SUCCESS"
}
catch {
    Write-Log "Frontend linting found issues: $_" "WARN"
}
finally {
    Pop-Location
}

# 8. Tests - Backend
Write-Host "`n[8/10] Ejecutando tests del Backend..." -ForegroundColor Yellow
Push-Location backend
try {
    npm run test 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Backend tests completed" "SUCCESS"
}
catch {
    Write-Log "Backend tests failed: $_" "ERROR"
}
finally {
    Pop-Location
}

# 9. Build check - Backend
Write-Host "`n[9/10] Verificando build del Backend..." -ForegroundColor Yellow
Push-Location backend
try {
    npm run build 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Backend build successful" "SUCCESS"
}
catch {
    Write-Log "Backend build failed: $_" "ERROR"
}
finally {
    Pop-Location
}

# 10. Build check - Frontend
Write-Host "`n[10/10] Verificando build del Frontend..." -ForegroundColor Yellow
Push-Location frontend
try {
    npm run build 2>&1 | Tee-Object -FilePath "../$logFile" -Append
    Write-Log "Frontend build successful" "SUCCESS"
}
catch {
    Write-Log "Frontend build failed: $_" "ERROR"
}
finally {
    Pop-Location
}

# Resumen
Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "          RESUMEN DEL MANTENIMIENTO" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

$successCount = (Get-Content $logFile | Select-String -Pattern "\[SUCCESS\]").Count
$errorCount = (Get-Content $logFile | Select-String -Pattern "\[ERROR\]").Count
$warnCount = (Get-Content $logFile | Select-String -Pattern "\[WARN\]").Count

Write-Host "`nResultados:" -ForegroundColor White
Write-Host "  ✓ Tareas exitosas: $successCount" -ForegroundColor Green
Write-Host "  ⚠ Advertencias: $warnCount" -ForegroundColor Yellow
Write-Host "  ✗ Errores: $errorCount" -ForegroundColor Red

Write-Host "`nLog guardado en: $logFile" -ForegroundColor Cyan
Write-Host "`nMantenimiento completado: $timestamp" -ForegroundColor Green

# Si hay errores críticos, mostrar alerta
if ($errorCount -gt 0) {
    Write-Host "`n⚠ ATENCIÓN: Se encontraron errores críticos. Revisa el log." -ForegroundColor Red
    exit 1
}

exit 0

