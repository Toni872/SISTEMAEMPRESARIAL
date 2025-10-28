# Setup completo del proyecto ERP
Write-Host "🔧 Configuración inicial del Sistema ERP" -ForegroundColor Cyan

# Instalar dependencias del proyecto raíz
Write-Host "📦 Instalando dependencias principales..." -ForegroundColor Yellow
npm install

# Instalar dependencias del backend
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\..\backend"
npm install

# Instalar dependencias del frontend  
Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\..\frontend"
npm install

# Volver al directorio raíz
Set-Location "$PSScriptRoot\.."

Write-Host "✅ Instalación de dependencias completada!" -ForegroundColor Green

# Verificar si Docker está disponible
Write-Host "🐳 Verificando Docker..." -ForegroundColor Blue
try {
    docker --version | Out-Null
    Write-Host "✅ Docker detectado" -ForegroundColor Green
    
    $response = Read-Host "¿Quieres iniciar la base de datos PostgreSQL con Docker? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host "🐳 Iniciando base de datos PostgreSQL..." -ForegroundColor Blue
        docker-compose up -d
        
        Write-Host "⏳ Esperando que la base de datos esté lista..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host "🔄 Generando cliente Prisma..." -ForegroundColor Blue
        Set-Location "$PSScriptRoot\..\backend"
        npx prisma generate
        npx prisma db push
        
        $seedResponse = Read-Host "¿Quieres ejecutar el seed de datos de prueba? (s/n)"
        if ($seedResponse -eq "s" -or $seedResponse -eq "S") {
            Write-Host "🌱 Ejecutando seed de datos..." -ForegroundColor Blue
            npx prisma db seed
        }
    }
}
catch {
    Write-Host "⚠️  Docker no detectado. Necesitarás configurar PostgreSQL manualmente." -ForegroundColor Yellow
}

Set-Location "$PSScriptRoot\.."

Write-Host ""
Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host "Ahora puedes ejecutar:" -ForegroundColor Cyan
Write-Host "  .\scripts\dev.ps1    - Para iniciar los servidores" -ForegroundColor White
Write-Host "  npm run dev          - Alternativa desde la raíz" -ForegroundColor White