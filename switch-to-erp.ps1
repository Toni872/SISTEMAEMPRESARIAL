# Script para volver del proyecto Vilok al proyecto ERP
Write-Host "🔄 Cambiando al proyecto ERP..." -ForegroundColor Cyan

# Detener contenedores de Vilok (Supabase)
Write-Host "`n🛑 Deteniendo proyecto Vilok..." -ForegroundColor Yellow

# Lista de contenedores de Supabase
$supabaseContainers = @(
    'supabase_studio_vilok',
    'supabase_pg_meta_vilok',
    'supabase_storage_vilok',
    'supabase_rest_vilok',
    'supabase_realtime_vilok',
    'supabase_inbucket_vilok',
    'supabase_auth_vilok',
    'supabase_kong_vilok',
    'supabase_vector_vilok',
    'supabase_analytics_vilok',
    'supabase_db_vilok'
)

foreach ($container in $supabaseContainers) {
    $running = docker ps --filter "name=$container" --format "{{.Names}}"
    if ($running) {
        docker stop $container
        Write-Host "  ✓ Detenido: $container" -ForegroundColor Gray
    }
}

Write-Host "✅ Proyecto Vilok detenido" -ForegroundColor Green

# Iniciar ERP
Write-Host "`n🚀 Iniciando proyecto ERP..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "`n✅ Proyecto ERP iniciado!" -ForegroundColor Green
Write-Host "`n🌐 Accede a: http://localhost:5173" -ForegroundColor Yellow







