# Script para configurar labels en GitHub
Write-Host "Configurando Labels en GitHub..." -ForegroundColor Cyan

# Verificar gh
try {
    gh --version | Out-Null
} catch {
    Write-Host "ERROR: GitHub CLI no instalado" -ForegroundColor Red
    Write-Host "Instalar con: winget install GitHub.cli" -ForegroundColor Yellow
    exit 1
}

Write-Host "Creando labels..." -ForegroundColor Green

# Por Tipo
gh label create "bug" --color "d73a4a" --description "Algo no funciona" --force
gh label create "enhancement" --color "a2eeef" --description "Nueva funcionalidad" --force
gh label create "documentation" --color "0075ca" --description "Mejoras en docs" --force
gh label create "refactor" --color "fbca04" --description "Mejora del codigo" --force
gh label create "test" --color "1d76db" --description "Tests" --force
gh label create "security" --color "ee0701" --description "Seguridad" --force
gh label create "performance" --color "5319e7" --description "Rendimiento" --force

# Para Contribuidores
gh label create "good first issue" --color "7057ff" --description "Para nuevos contribuidores" --force
gh label create "help wanted" --color "008672" --description "Se necesita ayuda" --force
gh label create "beginner friendly" --color "0e8a16" --description "Para principiantes" --force

# Por Prioridad
gh label create "priority: critical" --color "b60205" --description "Critico" --force
gh label create "priority: high" --color "d93f0b" --description "Alta prioridad" --force
gh label create "priority: medium" --color "fbca04" --description "Prioridad media" --force
gh label create "priority: low" --color "0e8a16" --description "Baja prioridad" --force

# Por Estado
gh label create "needs-triage" --color "d4c5f9" --description "Necesita revision" --force
gh label create "needs-discussion" --color "c5def5" --description "Requiere discusion" --force
gh label create "in-progress" --color "0052cc" --description "En progreso" --force
gh label create "blocked" --color "e99695" --description "Bloqueado" --force
gh label create "ready-for-review" --color "0e8a16" --description "Listo para revision" --force
gh label create "changes-requested" --color "fbca04" --description "Cambios solicitados" --force

# Por Componente
gh label create "frontend" --color "bfdadc" --description "Frontend/React" --force
gh label create "backend" --color "d4c5f9" --description "Backend/NestJS" --force
gh label create "database" --color "5319e7" --description "Prisma/PostgreSQL" --force
gh label create "graphql" --color "e10098" --description "GraphQL" --force
gh label create "auth" --color "c2e0c6" --description "Autenticacion" --force
gh label create "dashboard" --color "fef2c0" --description "Dashboard" --force
gh label create "sales" --color "bfdadc" --description "Ventas" --force
gh label create "purchases" --color "c5def5" --description "Compras" --force
gh label create "products" --color "d4c5f9" --description "Productos" --force
gh label create "ai-engine" --color "5319e7" --description "Motor de IA" --force

# Por Accion
gh label create "wontfix" --color "ffffff" --description "No se trabajara" --force
gh label create "duplicate" --color "cfd3d7" --description "Duplicado" --force
gh label create "invalid" --color "e4e669" --description "No valido" --force
gh label create "question" --color "d876e3" --description "Pregunta" --force

Write-Host ""
Write-Host "Labels configurados correctamente!" -ForegroundColor Green
Write-Host "Ve a: https://github.com/Toni872/SISTEMAEMPRESARIAL/labels" -ForegroundColor Cyan

