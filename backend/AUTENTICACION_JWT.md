# 🔐 Sistema de Autenticación JWT

## ✅ Implementación Completada

### Archivos Creados

1. **auth.service.ts** - Servicio de autenticación
   - `login()` - Login con email/password
   - `validateUser()` - Validación de usuario
   - `changePassword()` - Cambio de contraseña

2. **jwt.strategy.ts** - Estrategia Passport JWT
   - Valida tokens JWT
   - Extrae payload y busca usuario

3. **jwt-auth.guard.ts** - Guard GraphQL
   - Protege resolvers
   - Extrae usuario del contexto

4. **current-user.decorator.ts** - Decorador personalizado
   - `@CurrentUser()` para obtener usuario actual

5. **dto/auth.dto.ts** - Tipos GraphQL
   - `LoginInput` - Entrada de login
   - `AuthPayload` - Respuesta con token
   - `UserPayload` - Datos del usuario
   - `ChangePasswordInput` - Cambio de contraseña

6. **auth.resolver.ts** - Resolvers GraphQL
   - `login` mutation
   - `me` query (protegida)
   - `changePassword` mutation (protegida)

7. **auth.module.ts** - Configuración del módulo
   - JWT con expiración de 7 días
   - Passport strategy
   - Providers exportados

---

## 🧪 Cómo Probar

### 1️⃣ Asegúrate que el servidor esté corriendo

```powershell
cd backend
npm run start:dev
```

### 2️⃣ Abre GraphQL Playground

<http://localhost:3000/graphql>

---

## 📝 Pruebas a Realizar

### **TEST 1: Login con usuario admin**

```graphql
mutation {
  login(input: {
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
```

**Respuesta esperada:**

```json
{
  "data": {
    "login": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "email": "admin@empresa.com",
        "firstName": "Admin",
        "lastName": "Sistema",
        "role": "admin"
      }
    }
  }
}
```

### **TEST 2: Obtener información del usuario actual (protegido)**

**IMPORTANTE:** Primero debes agregar el token en los headers HTTP

1. Copia el `access_token` de la respuesta anterior
2. En la parte inferior de GraphQL Playground, agrega en **HTTP HEADERS**:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. Ejecuta esta query:

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

**Respuesta esperada:**

```json
{
  "data": {
    "me": {
      "id": 1,
      "email": "admin@empresa.com",
      "firstName": "Admin",
      "lastName": "Sistema",
      "role": "admin"
    }
  }
}
```

### **TEST 3: Query sin token (debe fallar)**

Quita el header de Authorization y ejecuta:

```graphql
query {
  me {
    id
    email
  }
}
```

**Respuesta esperada (error):**

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### **TEST 4: Cambiar contraseña**

Con el token en los headers:

```graphql
mutation {
  changePassword(input: {
    oldPassword: "admin123"
    newPassword: "nuevaPassword123"
  })
}
```

**Respuesta esperada:**

```json
{
  "data": {
    "changePassword": true
  }
}
```

### **TEST 5: Login con nueva contraseña**

```graphql
mutation {
  login(input: {
    email: "admin@empresa.com"
    password: "nuevaPassword123"
  }) {
    access_token
    user {
      email
    }
  }
}
```

### **TEST 6: Login con credenciales incorrectas**

```graphql
mutation {
  login(input: {
    email: "admin@empresa.com"
    password: "contraseñaIncorrecta"
  }) {
    access_token
  }
}
```

**Respuesta esperada (error):**

```json
{
  "errors": [
    {
      "message": "Credenciales inválidas"
    }
  ]
}
```

---

## 🔍 Verificar en Base de Datos

Puedes verificar los usuarios en la base de datos:

```powershell
cd backend
npx prisma studio
```

O con el cliente psql:

```powershell
docker exec -it erp-postgres psql -U erp_user -d erp_db -c "SELECT id, email, role FROM \"User\";"
```

---

## 🔑 Usuarios de Prueba

De los datos seed que creamos:

```
Email: admin@empresa.com
Password: admin123
Role: admin
```

---

## 🛡️ Cómo Proteger Otros Resolvers

Para proteger cualquier resolver o mutation, solo agrega el guard:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver()
export class ProductsResolver {
    
    @Query(() => [Product])
    @UseGuards(JwtAuthGuard)  // 👈 Protege este resolver
    async products(@CurrentUser() user: any) {  // 👈 Obtiene el usuario actual
        console.log('Usuario actual:', user);
        // Tu lógica aquí
    }
}
```

---

## 📌 Próximos Pasos

Una vez que verifiques que la autenticación funciona:

1. ✅ **Proteger los resolvers importantes**
   - Products
   - Orders
   - Customers
   - etc.

2. ✅ **Implementar autorización por roles**
   - Guard personalizado para verificar roles
   - Decorador `@Roles('admin', 'user')`

3. ✅ **Refresh tokens**
   - Token de actualización de larga duración
   - Endpoint para renovar access token

4. ✅ **Registro de usuarios**
   - Mutation `register`
   - Validación de email único

5. ✅ **Recuperación de contraseña**
   - Token temporal por email
   - Reset password endpoint

---

## 🎯 Estado Actual

✅ Sistema de autenticación JWT completamente funcional
✅ Login con email/password y bcrypt
✅ Tokens con expiración de 7 días
✅ Guards para proteger resolvers GraphQL
✅ Decorador para obtener usuario actual
✅ Cambio de contraseña

**¡Listo para probar! 🚀**
