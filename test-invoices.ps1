# Script para probar Sales Invoices
Write-Host "🚀 Iniciando pruebas de Sales Invoices..." -ForegroundColor Cyan

# 1. Detener procesos existentes
Write-Host "`n📋 Paso 1: Limpiando procesos anteriores..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Deteniendo procesos Node.js..." -ForegroundColor Gray
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 2. Regenerar Prisma Client
Write-Host "`n📦 Paso 2: Regenerando Prisma Client..." -ForegroundColor Yellow
Set-Location -Path "backend"
Write-Host "   Ejecutando: npx prisma generate" -ForegroundColor Gray
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️  Error al generar Prisma Client" -ForegroundColor Red
    Write-Host "   Continuando de todas formas..." -ForegroundColor Gray
}

# 3. Iniciar backend en modo desarrollo
Write-Host "`n🔥 Paso 3: Iniciando backend en modo desarrollo..." -ForegroundColor Yellow
Write-Host "   Puerto: 3000" -ForegroundColor Gray
Write-Host "   GraphQL Playground: http://localhost:3000/graphql" -ForegroundColor Green
Write-Host "`n📝 Instrucciones:" -ForegroundColor Cyan
Write-Host "   1. Espera a que el servidor inicie completamente" -ForegroundColor White
Write-Host "   2. Abre http://localhost:3000/graphql en tu navegador" -ForegroundColor White
Write-Host "   3. Usa las queries del archivo: test-sales-invoices.graphql" -ForegroundColor White
Write-Host "   4. Lee la guía completa en: GUIA_SALES_INVOICES.md" -ForegroundColor White
Write-Host "`n⚡ Queries rápidas:" -ForegroundColor Cyan
Write-Host "   Login: mutation { login(email: ""admin@erp.com"", password: ""admin123"") { access_token } }" -ForegroundColor Gray
Write-Host "   Listar: query { salesInvoices { id invoiceNumber total } }" -ForegroundColor Gray
Write-Host "`n🔄 Iniciando servidor..." -ForegroundColor Yellow
Write-Host "   Presiona Ctrl+C para detener`n" -ForegroundColor Gray

# Ejecutar
npm run start:dev
