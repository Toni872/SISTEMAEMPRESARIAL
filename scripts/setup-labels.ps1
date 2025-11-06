# Script para configurar labels en GitHub
# Requiere: GitHub CLI (gh) instalado y autenticado

Write-Host "🏷️  Configurando Labels en GitHub..." -ForegroundColor Cyan
Write-Host ""

# Verificar que gh está instalado
try {
    gh --version | Out-Null
} catch {
    Write-Host "❌ GitHub CLI no está instalado" -ForegroundColor Red
    Write-Host "   Instálalo con: winget install GitHub.cli" -ForegroundColor Yellow
    exit 1
}

# Verificar autenticación
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás autenticado en GitHub CLI" -ForegroundColor Red
    Write-Host "   Ejecuta: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI configurado correctamente" -ForegroundColor Green
Write-Host ""

# Definir labels
$labels = @(
    # Por Tipo
    @{name="bug"; color="d73a4a"; description="Algo no funciona correctamente"},
    @{name="enhancement"; color="a2eeef"; description="Nueva funcionalidad o mejora"},
    @{name="documentation"; color="0075ca"; description="Mejoras en documentación"},
    @{name="refactor"; color="fbca04"; description="Mejora del código"},
    @{name="test"; color="1d76db"; description="Relacionado con tests"},
    @{name="security"; color="ee0701"; description="Vulnerabilidad de seguridad"},
    @{name="performance"; color="5319e7"; description="Mejora de rendimiento"},
    
    # Para Contribuidores
    @{name="good first issue"; color="7057ff"; description="Perfecto para nuevos contribuidores"},
    @{name="help wanted"; color="008672"; description="Se necesita ayuda externa"},
    @{name="beginner friendly"; color="0e8a16"; description="Apropiado para principiantes"},
    
    # Por Prioridad
    @{name="priority: critical"; color="b60205"; description="Debe resolverse inmediatamente"},
    @{name="priority: high"; color="d93f0b"; description="Alta prioridad"},
    @{name="priority: medium"; color="fbca04"; description="Prioridad media"},
    @{name="priority: low"; color="0e8a16"; description="Baja prioridad"},
    
    # Por Estado
    @{name="needs-triage"; color="d4c5f9"; description="Necesita revisión inicial"},
    @{name="needs-discussion"; color="c5def5"; description="Requiere discusión"},
    @{name="in-progress"; color="0052cc"; description="En progreso"},
    @{name="blocked"; color="e99695"; description="Bloqueado"},
    @{name="ready-for-review"; color="0e8a16"; description="Listo para revisión"},
    @{name="changes-requested"; color="fbca04"; description="Cambios solicitados"},
    
    # Por Componente
    @{name="frontend"; color="bfdadc"; description="Frontend/React"},
    @{name="backend"; color="d4c5f9"; description="Backend/NestJS"},
    @{name="database"; color="5319e7"; description="Prisma/PostgreSQL"},
    @{name="graphql"; color="e10098"; description="GraphQL"},
    @{name="auth"; color="c2e0c6"; description="Autenticación"},
    @{name="dashboard"; color="fef2c0"; description="Dashboard"},
    @{name="sales"; color="bfdadc"; description="Módulo de ventas"},
    @{name="purchases"; color="c5def5"; description="Módulo de compras"},
    @{name="products"; color="d4c5f9"; description="Módulo de productos"},
    @{name="ai-engine"; color="5319e7"; description="Motor de IA"},
    
    # Por Acción
    @{name="wontfix"; color="ffffff"; description="No se trabajará en esto"},
    @{name="duplicate"; color="cfd3d7"; description="Duplicado"},
    @{name="invalid"; color="e4e669"; description="No es válido"},
    @{name="question"; color="d876e3"; description="Pregunta"}
)

$created = 0
$errors = 0
$total = $labels.Count

Write-Host "📋 Creando $total labels..." -ForegroundColor Cyan
Write-Host ""

foreach ($label in $labels) {
    try {
        $result = gh label create $label.name --color $label.color --description $label.description --force 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ $($label.name)" -ForegroundColor Green
            $created++
        } else {
            Write-Host "  ℹ️  $($label.name) (ya existe, actualizado)" -ForegroundColor Yellow
            $created++
        }
    } catch {
        Write-Host "  ❌ Error creando '$($label.name)': $_" -ForegroundColor Red
        $errors++
    }
    
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "📊 Resumen:" -ForegroundColor Cyan
Write-Host "  ✅ Creados/Actualizados: $created/$total" -ForegroundColor Green
if ($errors -gt 0) {
    Write-Host "  ❌ Errores: $errors" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 ¡Labels configurados!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Ve a tu repositorio en GitHub" -ForegroundColor White
Write-Host "  2. Click en 'Issues' → 'Labels'" -ForegroundColor White
Write-Host "  3. Verifica que todos los labels estén creados" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Crea un issue de prueba para ver los templates" -ForegroundColor Yellow
Write-Host "   https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/issues/new/choose" -ForegroundColor Gray
Write-Host ""

