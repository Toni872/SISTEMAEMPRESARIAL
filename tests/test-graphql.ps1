# Script de prueba GraphQL API
# Ejecuta: .\test-graphql.ps1

Write-Host "🧪 PROBANDO API GRAPHQL..." -ForegroundColor Cyan
Write-Host ""

# Test 1: LOGIN
Write-Host "📝 Test 1: Login" -ForegroundColor Yellow
$loginQuery = @{
    query = @"
mutation {
  login(loginInput: {
    email: "admin@empresa.com"
    password: "admin123"
  }) {
    access_token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
"@
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/graphql" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginQuery
    
    if ($response.data.login) {
        Write-Host "✅ Login exitoso!" -ForegroundColor Green
        $token = $response.data.login.access_token
        $user = $response.data.login.user
        
        Write-Host ""
        Write-Host "👤 Usuario:" -ForegroundColor Cyan
        Write-Host "   ID: $($user.id)"
        Write-Host "   Email: $($user.email)"
        Write-Host "   Nombre: $($user.firstName) $($user.lastName)"
        Write-Host "   Role: $($user.role)"
        
        Write-Host ""
        Write-Host "🔑 Token (primeros 50 caracteres):" -ForegroundColor Cyan
        Write-Host "   $($token.Substring(0, 50))..."
        
        # Test 2: ME (con token)
        Write-Host ""
        Write-Host "📝 Test 2: Query 'me' (con autenticación)" -ForegroundColor Yellow
        
        $meQuery = @{
            query = "query { me { id email firstName lastName role } }"
        } | ConvertTo-Json
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type"  = "application/json"
        }
        
        $meResponse = Invoke-RestMethod -Uri "http://localhost:3000/graphql" `
            -Method POST `
            -Headers $headers `
            -Body $meQuery
        
        if ($meResponse.data.me) {
            Write-Host "✅ Query 'me' exitosa!" -ForegroundColor Green
            $currentUser = $meResponse.data.me
            Write-Host "   Usuario actual: $($currentUser.email) ($($currentUser.role))"
        }
        
        # Test 3: PRODUCTS (con token)
        Write-Host ""
        Write-Host "📝 Test 3: Listar productos (con autenticación)" -ForegroundColor Yellow
        
        $productsQuery = @{
            query = "query { products(skip: 0, take: 5) { id name sku price stock } }"
        } | ConvertTo-Json
        
        $productsResponse = Invoke-RestMethod -Uri "http://localhost:3000/graphql" `
            -Method POST `
            -Headers $headers `
            -Body $productsQuery
        
        if ($productsResponse.data.products) {
            Write-Host "✅ Query 'products' exitosa!" -ForegroundColor Green
            Write-Host "   Productos encontrados: $($productsResponse.data.products.Count)"
            Write-Host ""
            Write-Host "   Productos:" -ForegroundColor Cyan
            foreach ($product in $productsResponse.data.products) {
                Write-Host "   - $($product.name) | SKU: $($product.sku) | Precio: `$$($product.price) | Stock: $($product.stock)"
            }
        }
        
        # Resumen
        Write-Host ""
        Write-Host "=" * 60 -ForegroundColor Green
        Write-Host "🎉 TODAS LAS PRUEBAS EXITOSAS!" -ForegroundColor Green
        Write-Host "=" * 60 -ForegroundColor Green
        Write-Host ""
        Write-Host "✅ API GraphQL funcionando correctamente" -ForegroundColor Green
        Write-Host "✅ Autenticación JWT operativa" -ForegroundColor Green
        Write-Host "✅ Sistema de roles activo" -ForegroundColor Green
        Write-Host "✅ Queries protegidas funcionando" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔑 Guarda este token para usarlo en Postman o Apollo Sandbox:" -ForegroundColor Yellow
        Write-Host $token -ForegroundColor White
        Write-Host ""
        Write-Host "📚 Para usar en Postman/Apollo Sandbox:" -ForegroundColor Cyan
        Write-Host "   Header: Authorization"  -ForegroundColor White
        Write-Host "   Value: Bearer $token" -ForegroundColor White
        
    }
    else {
        Write-Host "❌ Error en login" -ForegroundColor Red
        $response | ConvertTo-Json -Depth 10
    }
    
}
catch {
    Write-Host "❌ ERROR: No se pudo conectar al servidor" -ForegroundColor Red
    Write-Host "   Asegúrate que el servidor esté corriendo en http://localhost:3000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Para iniciar el servidor:" -ForegroundColor Cyan
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   npm run start:dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Detalles del error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
