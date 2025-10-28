# Gestión del entorno virtual con Docker
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("up", "down", "restart", "logs", "status", "clean", "setup")]
    [string]$Action
)

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

switch ($Action) {
    "up" {
        Write-ColorOutput Green "🚀 Iniciando entorno virtual ERP..."
        docker-compose up -d
        
        Write-ColorOutput Yellow "⏳ Esperando que los servicios estén listos..."
        Start-Sleep -Seconds 15
        
        Write-ColorOutput Cyan "📊 Estado de los servicios:"
        docker-compose ps
        
        Write-ColorOutput Green "✅ Entorno listo!"
        Write-ColorOutput White "📡 Backend: http://localhost:3000"
        Write-ColorOutput White "🎨 Frontend: http://localhost:5173" 
        Write-ColorOutput White "🗄️ pgAdmin: http://localhost:8080 (admin@erp.local / admin123)"
        Write-ColorOutput White "📊 GraphQL: http://localhost:3000/graphql"
    }
    
    "down" {
        Write-ColorOutput Yellow "🛑 Deteniendo entorno virtual..."
        docker-compose down
        Write-ColorOutput Green "✅ Entorno detenido"
    }
    
    "restart" {
        Write-ColorOutput Yellow "🔄 Reiniciando entorno virtual..."
        docker-compose restart
        Write-ColorOutput Green "✅ Entorno reiniciado"
    }
    
    "logs" {
        Write-ColorOutput Cyan "📋 Mostrando logs del entorno..."
        docker-compose logs -f
    }
    
    "status" {
        Write-ColorOutput Cyan "📊 Estado del entorno virtual:"
        docker-compose ps
        Write-Output ""
        Write-ColorOutput Cyan "🔍 Uso de recursos:"
        docker stats --no-stream
    }
    
    "clean" {
        Write-ColorOutput Yellow "🧹 Limpiando entorno virtual..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        Write-ColorOutput Green "✅ Limpieza completada"
    }
    
    "setup" {
        Write-ColorOutput Cyan "🔧 Configurando entorno virtual inicial..."
        
        # Copiar archivos de configuración
        if (!(Test-Path "backend\.env")) {
            Copy-Item "backend\.env.example" "backend\.env"
            Write-ColorOutput Green "✅ Archivo .env del backend creado"
        }
        
        if (!(Test-Path "frontend\.env")) {
            Copy-Item "frontend\.env.example" "frontend\.env"
            Write-ColorOutput Green "✅ Archivo .env del frontend creado"
        }
        
        # Construir imágenes
        Write-ColorOutput Yellow "📦 Construyendo imágenes Docker..."
        docker-compose build
        
        # Iniciar servicios
        Write-ColorOutput Yellow "🚀 Iniciando servicios..."
        docker-compose up -d postgres redis
        
        Write-ColorOutput Yellow "⏳ Esperando PostgreSQL..."
        Start-Sleep -Seconds 10
        
        # Ejecutar migraciones
        Write-ColorOutput Yellow "🔄 Ejecutando migraciones de base de datos..."
        docker-compose exec postgres psql -U erp_user -d erp_db -c "SELECT version();"
        
        Write-ColorOutput Green "✅ Entorno virtual configurado!"
        Write-ColorOutput White "Ahora puedes ejecutar: .\scripts\docker.ps1 up"
    }
}