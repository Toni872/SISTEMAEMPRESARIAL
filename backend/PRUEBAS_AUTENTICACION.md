# 🧪 Guía de Pruebas - Sistema de Autenticación y Autorización

## 🎯 Objetivo

Verificar el funcionamiento completo del sistema de autenticación JWT, registro de usuarios, y control de acceso por roles.

---

## 🚀 Preparación

### 1. Servidor corriendo

Asegúrate que el backend esté en ejecución:

```powershell
cd backend
npm run start:dev
```

Deberías ver:

```
🚀 Application is running on: http://localhost:3000
🎮 GraphQL Playground: http://localhost:3000/graphql
```

### 2. Abrir GraphQL Playground

Navega a: <http://localhost:3000/graphql>

---

## 📝 PRUEBAS PASO A PASO

### ✅ TEST 1: Registro de Nuevo Usuario

**Query a ejecutar:**

```graphql
mutation {
  register(registerInput: {
    email: "carlos@test.com"
    username: "carlos123"
    password: "password123"
    firstName: "Carlos"
    lastName: "Rodríguez"
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
```

**Resultado esperado:**

- ✅ Status 200
- ✅ Devuelve `access_token`
- ✅ Usuario con `role: "USER"`
- ✅ Campos firstName y lastName poblados

**Copia el `access_token` para las siguientes pruebas**

---

### ✅ TEST 2: Registro con Email Duplicado (debe fallar)

**Query a ejecutar:**

```graphql
mutation {
  register(registerInput: {
    email: "carlos@test.com"
    username: "otrousuario"
    password: "password123"
  }) {
    access_token
  }
}
```

**Resultado esperado:**

- ❌ Error: "El email ya está registrado"
- ✅ Validación funcionando correctamente

---

### ✅ TEST 3: Registro con Username Duplicado (debe fallar)

**Query a ejecutar:**

```graphql
mutation {
  register(registerInput: {
    email: "nuevo@test.com"
    username: "carlos123"
    password: "password123"
  }) {
    access_token
  }
}
```

**Resultado esperado:**

- ❌ Error: "El nombre de usuario ya está en uso"
- ✅ Validación funcionando correctamente

---

### ✅ TEST 4: Login con Usuario Recién Creado

**Query a ejecutar:**

```graphql
mutation {
  login(loginInput: {
    email: "carlos@test.com"
    password: "password123"
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

**Resultado esperado:**

- ✅ Status 200
- ✅ Devuelve nuevo `access_token`
- ✅ Información del usuario

---

### ✅ TEST 5: Login con Admin (role ADMIN)

**Query a ejecutar:**

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

**Resultado esperado:**

- ✅ `role: "ADMIN"`
- **Copia este token para pruebas de admin**

---

### ✅ TEST 6: Obtener Usuario Actual (me)

**Paso 1:** En la parte inferior del Playground, agrega en **HTTP HEADERS**:

```json
{
  "Authorization": "Bearer TU_TOKEN_AQUI"
}
```

**Paso 2:** Ejecuta la query:

```graphql
query {
  me {
    id
    email
    firstName
    lastName
    role
  }
}
```

**Resultado esperado:**

- ✅ Devuelve información del usuario autenticado
- ✅ Los datos coinciden con el token

---

### ✅ TEST 7: Query sin Token (debe fallar)

**Paso 1:** **Quita el header** `Authorization` de HTTP HEADERS

**Paso 2:** Ejecuta:

```graphql
query {
  me {
    id
    email
  }
}
```

**Resultado esperado:**

- ❌ Error: "Unauthorized"
- ✅ Protección funcionando

---

### ✅ TEST 8: Cambiar Contraseña

**Paso 1:** Agrega el token en HTTP HEADERS:

```json
{
  "Authorization": "Bearer TOKEN_DE_CARLOS"
}
```

**Paso 2:** Ejecuta:

```graphql
mutation {
  changePassword(changePasswordInput: {
    oldPassword: "password123"
    newPassword: "nuevaPassword456"
  })
}
```

**Resultado esperado:**

- ✅ Devuelve `true`
- ✅ Contraseña actualizada

**Paso 3:** Verifica haciendo login con la nueva contraseña:

```graphql
mutation {
  login(loginInput: {
    email: "carlos@test.com"
    password: "nuevaPassword456"
  }) {
    access_token
  }
}
```

---

### ✅ TEST 9: Consultar Productos como USER

**Paso 1:** Login como USER y copia el token:

```graphql
mutation {
  login(loginInput: {
    email: "carlos@test.com"
    password: "nuevaPassword456"
  }) {
    access_token
  }
}
```

**Paso 2:** Agrega el token en headers y ejecuta:

```graphql
query {
  products(skip: 0, take: 5) {
    id
    name
    sku
    price
    stock
  }
}
```

**Resultado esperado:**

- ✅ Devuelve lista de productos
- ✅ USER tiene permiso de lectura

---

### ✅ TEST 10: USER Intenta Crear Producto (debe fallar)

**Con el mismo token de USER en headers:**

```graphql
mutation {
  createProduct(createProductInput: {
    name: "Producto Test"
    description: "Descripción test"
    sku: "TEST-001"
    price: 50.00
    stock: 10
    minStock: 5
    category: "TEST"
  }) {
    id
    name
  }
}
```

**Resultado esperado:**

- ❌ Error de autorización (Forbidden)
- ✅ USER no puede crear productos
- ✅ Control de roles funcionando

---

### ✅ TEST 11: ADMIN Crea Producto (debe funcionar)

**Paso 1:** Login como ADMIN:

```graphql
mutation {
  login(loginInput: {
    email: "admin@empresa.com"
    password: "admin123"
  }) {
    access_token
  }
}
```

**Paso 2:** Usa el token de ADMIN en headers y ejecuta:

```graphql
mutation {
  createProduct(createProductInput: {
    name: "Laptop Dell XPS 15"
    description: "Laptop de alta gama"
    sku: "LAP-DELL-001"
    price: 1299.99
    cost: 900.00
    stock: 25
    minStock: 5
    category: "ELECTRONICS"
  }) {
    id
    name
    sku
    price
    stock
  }
}
```

**Resultado esperado:**

- ✅ Producto creado exitosamente
- ✅ ADMIN tiene todos los permisos

---

### ✅ TEST 12: USER Intenta Eliminar Producto (debe fallar)

**Con token de USER:**

```graphql
mutation {
  removeProduct(id: 1)
}
```

**Resultado esperado:**

- ❌ Error de autorización
- ✅ Solo ADMIN puede eliminar

---

### ✅ TEST 13: ADMIN Elimina Producto (debe funcionar)

**Con token de ADMIN:**

```graphql
mutation {
  removeProduct(id: 1) {
    id
    name
  }
}
```

**Resultado esperado:**

- ✅ Producto eliminado
- ✅ ADMIN tiene permiso total

---

### ✅ TEST 14: Consultar Productos con Stock Bajo

**Como ADMIN o MANAGER:**

```graphql
query {
  lowStockProducts {
    id
    name
    sku
    stock
    minStock
  }
}
```

**Resultado esperado:**

- ✅ Devuelve productos con stock bajo
- ✅ Solo ADMIN y MANAGER tienen acceso

---

### ✅ TEST 15: USER Intenta Ver Stock Bajo (debe fallar)

**Con token de USER:**

```graphql
query {
  lowStockProducts {
    id
    name
    stock
  }
}
```

**Resultado esperado:**

- ❌ Error de autorización
- ✅ USER no tiene este permiso

---

## 📊 Resumen de Permisos

### 🔐 **Productos (Products)**

| Acción | ADMIN | MANAGER | USER | READONLY |
|--------|-------|---------|------|----------|
| Listar productos | ✅ | ✅ | ✅ | ✅ |
| Ver producto | ✅ | ✅ | ✅ | ✅ |
| Buscar por SKU | ✅ | ✅ | ✅ | ✅ |
| Crear producto | ✅ | ✅ | ❌ | ❌ |
| Actualizar producto | ✅ | ✅ | ❌ | ❌ |
| Actualizar stock | ✅ | ✅ | ❌ | ❌ |
| Eliminar producto | ✅ | ❌ | ❌ | ❌ |
| Ver stock bajo | ✅ | ✅ | ❌ | ❌ |

---

## 🎯 Checklist de Verificación

### Autenticación

- [ ] ✅ Registro de usuario funciona
- [ ] ✅ Login funciona
- [ ] ✅ Token JWT se genera correctamente
- [ ] ✅ Query `me` devuelve usuario actual
- [ ] ✅ Cambio de contraseña funciona
- [ ] ✅ Validación de email duplicado
- [ ] ✅ Validación de username duplicado

### Autorización

- [ ] ✅ USER puede consultar productos
- [ ] ✅ USER NO puede crear productos
- [ ] ✅ USER NO puede eliminar productos
- [ ] ✅ ADMIN puede crear productos
- [ ] ✅ ADMIN puede eliminar productos
- [ ] ✅ Queries protegidas requieren token
- [ ] ✅ RolesGuard bloquea accesos no autorizados

### Seguridad

- [ ] ✅ Contraseñas hasheadas con bcrypt
- [ ] ✅ Tokens expiran después de 7 días
- [ ] ✅ Requests sin token son rechazados
- [ ] ✅ Validaciones de input funcionan

---

## 🚨 Errores Comunes y Soluciones

### Error: "Unauthorized"

**Causa:** Token faltante o inválido  
**Solución:** Verifica que el header `Authorization` esté presente y el formato sea correcto:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error: "Forbidden resource"

**Causa:** El usuario no tiene el rol requerido  
**Solución:** Usa un usuario con el rol adecuado (ADMIN para operaciones sensibles)

### Error: "El email ya está registrado"

**Causa:** Email duplicado  
**Solución:** Usa un email diferente o verifica en la base de datos

---

## 🎉 Si Todas las Pruebas Pasan

**¡Felicidades! Tu sistema de autenticación y autorización está completamente funcional:**

- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Protección de endpoints
- ✅ Control de acceso por roles
- ✅ Validaciones de seguridad
- ✅ Cambio de contraseña
- ✅ Guards funcionando correctamente

---

## 📚 Recursos Adicionales

- **Documentación completa:** `AUTENTICACION_COMPLETA.md`
- **GraphQL Schema:** `backend/src/schema.gql`
- **Usuarios de prueba:** `backend/DATOS_PRUEBA.md`

---

**🎯 Sistema listo para desarrollo continuo! 🚀**
