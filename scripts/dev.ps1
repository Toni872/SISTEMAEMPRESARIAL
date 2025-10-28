# Desarrollo - Iniciar ambos servidores
Write-Host "🚀 Iniciando servidor ERP..." -ForegroundColor Cyan

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Verificar puertos
if (Test-Port 3000) {
    Write-Host "⚠️  Puerto 3000 ya está en uso" -ForegroundColor Yellow
}

if (Test-Port 5173) {
    Write-Host "⚠️  Puerto 5173 ya está en uso" -ForegroundColor Yellow
}

Write-Host "📡 Iniciando Backend (puerto 3000)..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-Command", "cd '$PSScriptRoot\..\backend'; npm run start:dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "🎨 Iniciando Frontend (puerto 5173)..." -ForegroundColor Blue
Start-Process PowerShell -ArgumentList "-Command", "cd '$PSScriptRoot\..\frontend'; npm run dev" -WindowStyle Normal

Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")