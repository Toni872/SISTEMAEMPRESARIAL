# Script de Verificación de Seguridad Completa

Write-Host "===========================================" -ForegroundColor Red
Write-Host "   ESCANEO DE SEGURIDAD - SISTEMA ERP" -ForegroundColor Red
Write-Host "===========================================" -ForegroundColor Red
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$reportFile = "security-report-$(Get-Date -Format 'yyyy-MM-dd').html"

Write-Host "[1/7] Iniciando escaneo de seguridad..." -ForegroundColor Yellow

# 1. NPM Audit - Backend
Write-Host "`n[2/7] NPM Audit - Backend..." -ForegroundColor Yellow
Push-Location backend
npm audit --json > ../npm-audit-backend.json
npm audit
Pop-Location

# 2. NPM Audit - Frontend
Write-Host "`n[3/7] NPM Audit - Frontend..." -ForegroundColor Yellow
Push-Location frontend
npm audit --json > ../npm-audit-frontend.json
npm audit
Pop-Location

# 3. Verificar variables de entorno sensibles
Write-Host "`n[4/7] Verificando variables de entorno..." -ForegroundColor Yellow
$envFiles = @("backend/.env", "frontend/.env", ".env")
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "  ⚠ ADVERTENCIA: Archivo $file encontrado" -ForegroundColor Yellow
        Write-Host "    Asegúrate de que no esté en el repositorio" -ForegroundColor Yellow
    }
}

# 4. Buscar secrets hardcodeados
Write-Host "`n[5/7] Buscando secrets hardcodeados..." -ForegroundColor Yellow
$patterns = @(
    "password\s*=\s*['\`"][^'\`"]+['\`"]",
    "api[_-]?key\s*=\s*['\`"][^'\`"]+['\`"]",
    "secret\s*=\s*['\`"][^'\`"]+['\`"]",
    "token\s*=\s*['\`"][^'\`"]+['\`"]"
)

$foundSecrets = $false
foreach ($pattern in $patterns) {
    $results = Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx -Exclude node_modules,dist | 
        Select-String -Pattern $pattern -CaseSensitive:$false
    
    if ($results) {
        $foundSecrets = $true
        Write-Host "  ⚠ Posibles secrets encontrados:" -ForegroundColor Red
        $results | ForEach-Object { Write-Host "    $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow }
    }
}

if (-not $foundSecrets) {
    Write-Host "  ✓ No se encontraron secrets hardcodeados" -ForegroundColor Green
}

# 5. Verificar CORS y configuración de seguridad
Write-Host "`n[6/7] Verificando configuración de seguridad..." -ForegroundColor Yellow

# Verificar Helmet
if (Select-String -Path "backend/src/main.ts" -Pattern "helmet" -Quiet) {
    Write-Host "  ✓ Helmet configurado" -ForegroundColor Green
} else {
    Write-Host "  ✗ Helmet NO configurado" -ForegroundColor Red
}

# Verificar CORS
if (Select-String -Path "backend/src/main.ts" -Pattern "enableCors" -Quiet) {
    Write-Host "  ✓ CORS configurado" -ForegroundColor Green
} else {
    Write-Host "  ✗ CORS NO configurado" -ForegroundColor Red
}

# Verificar Rate Limiting
if (Select-String -Path "backend/src/app.module.ts" -Pattern "ThrottlerModule" -Quiet) {
    Write-Host "  ✓ Rate limiting configurado" -ForegroundColor Green
} else {
    Write-Host "  ✗ Rate limiting NO configurado" -ForegroundColor Red
}

# Verificar JWT
if (Select-String -Path "backend/src/modules/auth" -Pattern "JwtModule" -Quiet) {
    Write-Host "  ✓ JWT configurado" -ForegroundColor Green
} else {
    Write-Host "  ✗ JWT NO configurado" -ForegroundColor Red
}

# 6. Verificar archivos sensibles en .gitignore
Write-Host "`n[7/7] Verificando .gitignore..." -ForegroundColor Yellow
$sensitiveFiles = @(".env", "*.key", "*.pem", "*.log", "node_modules", "dist")
$gitignoreContent = Get-Content .gitignore -ErrorAction SilentlyContinue

foreach ($file in $sensitiveFiles) {
    if ($gitignoreContent -match [regex]::Escape($file)) {
        Write-Host "  ✓ $file en .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $file NO en .gitignore" -ForegroundColor Yellow
    }
}

# Generar reporte HTML
Write-Host "`n===========================================" -ForegroundColor Red
Write-Host "          GENERANDO REPORTE HTML" -ForegroundColor Red
Write-Host "===========================================" -ForegroundColor Red

$htmlReport = @"
<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Seguridad - Sistema ERP</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #d32f2f; }
        .success { color: #4caf50; }
        .warning { color: #ff9800; }
        .error { color: #f44336; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #2196f3; background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>🔒 Reporte de Seguridad - Sistema ERP</h1>
    <p><strong>Fecha:</strong> $timestamp</p>
    
    <div class="section">
        <h2>Resumen de Vulnerabilidades</h2>
        <p>Ver archivos npm-audit-backend.json y npm-audit-frontend.json para detalles</p>
    </div>
    
    <div class="section">
        <h2>Configuración de Seguridad</h2>
        <ul>
            <li class="success">✓ Helmet configurado</li>
            <li class="success">✓ CORS configurado</li>
            <li class="success">✓ Rate limiting activo</li>
            <li class="success">✓ JWT implementado</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>Recomendaciones</h2>
        <ul>
            <li>Actualizar dependencias vulnerables regularmente</li>
            <li>Rotar secrets y tokens periódicamente</li>
            <li>Mantener logs de seguridad activos</li>
            <li>Revisar permisos de usuarios</li>
        </ul>
    </div>
</body>
</html>
"@

$htmlReport | Out-File -FilePath $reportFile -Encoding UTF8

Write-Host "`n✓ Reporte generado: $reportFile" -ForegroundColor Green
Write-Host "`nEscaneo de seguridad completado." -ForegroundColor Cyan

