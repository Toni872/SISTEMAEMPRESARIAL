# Test GraphQL API
Write-Host "Testing GraphQL API..." -ForegroundColor Cyan

$body = '{"query":"mutation{login(loginInput:{email:\"admin@empresa.com\",password:\"admin123\"}){access_token user{id email role}}}"}'

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/graphql" -Method POST -ContentType "application/json" -Body $body
    
    Write-Host "SUCCESS - Login trabajó correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Token:" -ForegroundColor Yellow
    Write-Host $response.data.login.access_token
    Write-Host ""
    Write-Host "Usuario:" -ForegroundColor Yellow
    Write-Host "  Email: $($response.data.login.user.email)"
    Write-Host "  Role: $($response.data.login.user.role)"
    Write-Host ""
    Write-Host "El servidor GraphQL esta funcionando correctamente!" -ForegroundColor Green
    
}
catch {
    Write-Host "ERROR - No se pudo conectar" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
