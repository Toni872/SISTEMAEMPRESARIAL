# 🔧 Solución: GraphQL Playground no carga

## 📌 El Problema

Apollo Server 4+ ya no incluye GraphQL Playground por defecto. Se queda en "Loading GraphQL Playground".

## ✅ Soluciones Alternativas

### **Opción 1: Usar Postman o Insomnia (RECOMENDADO)**

#### **Con Postman:**

1. Abre Postman
2. Crea un nuevo request POST
3. URL: `http://localhost:3000/graphql`
4. Body → GraphQL
5. Escribe tu query

**Ejemplo de Login:**

```graphql
mutation {
  login(loginInput: {
    email: "admin@empresa.com"
    password: "admin123"
  }) {
    access_token
    user {
      id
      email
      role
    }
  }
}
```

#### **Con Insomnia:**

1. Descarga: <https://insomnia.rest/download>
2. New Request → GraphQL
3. URL: `http://localhost:3000/graphql`
4. Escribe tu query

---

### **Opción 2: Usar cURL o PowerShell**

```powershell
# Login
$body = @{
    query = 'mutation { login(loginInput: { email: \"admin@empresa.com\", password: \"admin123\" }) { access_token user { id email role } } }'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/graphql" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

### **Opción 3: Apollo Studio Sandbox (Online)**

1. Ve a: <https://studio.apollographql.com/sandbox>
2. Ingresa: `http://localhost:3000/graphql`
3. Click "Connect"
4. Ya puedes hacer queries

---

### **Opción 4: Instalar GraphQL Playground (Solución permanente)**

```powershell
cd backend
npm install apollo-server-plugin-landing-page-graphql-playground
```

Luego actualiza `app.module.ts`:

```typescript
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-plugin-landing-page-graphql-playground';

// En GraphQLModule.forRootAsync:
useFactory: (config: ConfigService) => ({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: false, // Desactivar el playground por defecto
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
    csrfPrevention: false,
}),
```

---

### **Opción 5: Altair GraphQL Client (Aplicación de escritorio)**

1. Descarga: <https://altairgraphql.dev/>
2. Instala la aplicación
3. URL: `http://localhost:3000/graphql`

---

## 🧪 Pruebas Rápidas sin UI

### **Test 1: Verificar que el servidor funciona**

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/health"
```

### **Test 2: Login con PowerShell**

```powershell
$loginQuery = @'
{
  "query": "mutation { login(loginInput: { email: \"admin@empresa.com\", password: \"admin123\" }) { access_token user { id email role } } }"
}
'@

$response = Invoke-WebRequest -Uri "http://localhost:3000/graphql" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginQuery

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### **Test 3: Registro con PowerShell**

```powershell
$registerQuery = @'
{
  "query": "mutation { register(registerInput: { email: \"test@test.com\", username: \"testuser\", password: \"test123456\", firstName: \"Test\", lastName: \"User\" }) { access_token user { id email role } } }"
}
'@

$response = Invoke-WebRequest -Uri "http://localhost:3000/graphql" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerQuery

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### **Test 4: Query con Token**

```powershell
# Primero obtén el token del login anterior
$token = "TU_TOKEN_AQUI"

$meQuery = @'
{
  "query": "query { me { id email firstName lastName role } }"
}
'@

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri "http://localhost:3000/graphql" `
    -Method POST `
    -Headers $headers `
    -Body $meQuery

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 🎯 Mi Recomendación

**Para desarrollo activo:**

- Usa **Apollo Studio Sandbox** (no requiere instalación)
- O instala **Insomnia** o **Postman** (más potentes)

**Para pruebas rápidas:**

- Usa los scripts de PowerShell de arriba

**Para integrar en tu proyecto:**

- Instala el plugin de playground (Opción 4)

---

## 📚 URLs Útiles

- **Apollo Studio Sandbox**: <https://studio.apollographql.com/sandbox>
- **Postman**: <https://www.postman.com/downloads/>
- **Insomnia**: <https://insomnia.rest/download>
- **Altair**: <https://altairgraphql.dev/>

---

## ✅ Mientras tanto, el servidor funciona perfectamente

El problema es solo visual (la UI del playground). El servidor GraphQL está funcionando correctamente y puedes hacer queries usando cualquiera de las opciones anteriores.

```
✅ Servidor corriendo: http://localhost:3000
✅ GraphQL endpoint: http://localhost:3000/graphql
✅ Health check: http://localhost:3000/api/health
```

---

**🎯 Recomendación inmediata: Usa Apollo Studio Sandbox mientras instalamos el playground**
