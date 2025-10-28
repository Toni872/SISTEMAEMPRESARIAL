# Guía de Autenticación - Sistema ERP

## Descripción General

El Sistema ERP implementa autenticación basada en JSON Web Tokens (JWT) con control de acceso basado en roles (RBAC - Role-Based Access Control). Este sistema proporciona seguridad a nivel de endpoint y operación, garantizando que los usuarios solo puedan acceder a las funcionalidades correspondientes a su rol.

## Arquitectura de Seguridad

### Componentes Principales

1. **AuthModule** - Módulo de autenticación NestJS
2. **JwtStrategy** - Estrategia Passport para validación de tokens
3. **GqlAuthGuard** - Guard de GraphQL para proteger resolvers
4. **RolesGuard** - Guard para verificación de roles
5. **CurrentUser Decorator** - Decorador para obtener usuario actual

### Flujo de Autenticación

```
Cliente                    Servidor                     Base de Datos
  |                           |                               |
  |  1. Login (email/pass)    |                               |
  |-------------------------->|                               |
  |                           | 2. Validar credenciales       |
  |                           |------------------------------>|
  |                           |                               |
  |                           | 3. Usuario encontrado         |
  |                           |<------------------------------|
  |                           |                               |
  |                           | 4. Generar JWT token          |
  |                           |                               |
  |  5. Retornar token        |                               |
  |<--------------------------|                               |
  |                           |                               |
  |  6. Request con token     |                               |
  |  Authorization: Bearer... |                               |
  |-------------------------->|                               |
  |                           | 7. Validar token              |
  |                           | 8. Verificar rol              |
  |                           |                               |
  |  9. Respuesta autorizada  |                               |
  |<--------------------------|                               |
```

## JSON Web Tokens (JWT)

### Estructura del Token

Un JWT consta de tres partes separadas por puntos:

```
header.payload.signature
```

**Ejemplo de token:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZXJwLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.signature_hash
```

### Payload del Token

El payload contiene la información del usuario autenticado:

```json
{
  "sub": 1,
  "email": "admin@erp.com",
  "role": "ADMIN",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Campos:**

- `sub`: Subject - ID del usuario
- `email`: Email del usuario
- `role`: Rol del usuario (ADMIN, MANAGER, USER, READONLY)
- `iat`: Issued At - Timestamp de creación
- `exp`: Expiration - Timestamp de expiración

### Configuración de JWT

**Variables de entorno (.env):**

```
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1d
```

**Duración del token:**

- Desarrollo: 1 día
- Producción recomendada: 8 horas

## Sistema de Roles

### Roles Disponibles

El sistema implementa 4 roles jerárquicos:

#### 1. ADMIN (Administrador)

**Permisos:**

- Acceso total al sistema
- Crear, leer, actualizar y eliminar cualquier recurso
- Gestionar usuarios del sistema
- Acceder a todos los reportes y estadísticas
- Configurar sistema

**Casos de uso:**

- Administrador del sistema
- Gerente de TI
- Owner del negocio

#### 2. MANAGER (Gerente)

**Permisos:**

- Crear, leer y actualizar recursos
- NO puede eliminar recursos
- Ver reportes y estadísticas
- Gestionar productos, ventas y compras

**Restricciones:**

- No puede eliminar productos
- No puede gestionar usuarios
- No puede eliminar órdenes

**Casos de uso:**

- Gerente de operaciones
- Jefe de almacén
- Supervisor de ventas

#### 3. USER (Usuario Operativo)

**Permisos:**

- Leer productos
- Crear y gestionar órdenes de venta
- Ver clientes
- Consultar órdenes de compra (solo lectura)

**Restricciones:**

- No puede crear/modificar productos
- No puede crear órdenes de compra
- No puede eliminar nada
- No puede acceder a reportes financieros
- No puede gestionar usuarios

**Casos de uso:**

- Vendedor
- Ejecutivo de cuenta
- Operador de punto de venta

#### 4. READONLY (Solo Lectura)

**Permisos:**

- NO tiene acceso a queries de GraphQL
- Rol reservado para integraciones futuras

**Restricciones:**

- No puede realizar ninguna operación

**Casos de uso:**

- Integraciones API externas
- Sistemas de monitoreo
- Auditoría externa

### Matriz de Permisos Resumida

| Módulo      | ADMIN | MANAGER | USER | READONLY |
|-------------|-------|---------|------|----------|
| Productos   | CRUD  | CRU     | R    | -        |
| Ventas      | CRUD  | CRU     | CR   | -        |
| Compras     | CRUD  | CRU     | R    | -        |
| Usuarios    | CRUD  | -       | -    | -        |
| Reportes    | R     | R       | -    | -        |

**Leyenda:**

- C: Create (Crear)
- R: Read (Leer)
- U: Update (Actualizar)
- D: Delete (Eliminar)
- -: Sin acceso

## Implementación Técnica

### Login y Obtención de Token

**Endpoint GraphQL:**

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
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

**Ejemplo de request:**

```json
{
  "email": "admin@erp.com",
  "password": "admin123"
}
```

**Ejemplo de response:**

```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "email": "admin@erp.com",
        "firstName": "Admin",
        "lastName": "Sistema",
        "role": "ADMIN"
      }
    }
  }
}
```

### Uso del Token en Requests

**Header HTTP requerido:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo en Postman:**

1. Ir a pestaña "Authorization"
2. Seleccionar tipo "Bearer Token"
3. Pegar el token en el campo "Token"

**Ejemplo en código JavaScript:**

```javascript
const response = await fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    query: `
      query {
        products {
          id
          name
          price
        }
      }
    `
  })
});
```

**Ejemplo en cURL:**

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"query":"{ products { id name } }"}'
```

### Obtener Usuario Actual

**Query GraphQL:**

```graphql
query GetCurrentUser {
  me {
    id
    email
    firstName
    lastName
    role
    isActive
    createdAt
  }
}
```

**Uso:**
Esta query retorna la información del usuario autenticado basado en el token JWT proporcionado.

### Cambio de Contraseña

**Mutation GraphQL:**

```graphql
mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changeMyPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    id
    email
  }
}
```

**Validaciones:**

- La contraseña antigua debe ser correcta
- La nueva contraseña debe tener mínimo 6 caracteres
- Las contraseñas se encriptan con bcrypt (rounds: 10)

## Implementación en Código

### Decoradores de Autenticación

**@UseGuards(GqlAuthGuard)** - Requiere autenticación

```typescript
@Query(() => [Product])
@UseGuards(GqlAuthGuard)
async products() {
  return this.productsService.findAll();
}
```

**@Roles(...roles)** - Requiere rol específico

```typescript
@Mutation(() => Product)
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
async createProduct(@Args('input') input: CreateProductInput) {
  return this.productsService.create(input);
}
```

**@CurrentUser()** - Obtener usuario autenticado

```typescript
@Query(() => User)
@UseGuards(GqlAuthGuard)
async me(@CurrentUser() user: User) {
  return user;
}
```

### Ejemplo Completo de Resolver

```typescript
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { User } from './models/user.model';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  // Endpoint público - No requiere autenticación
  @Query(() => [Product])
  async publicProducts() {
    return this.productsService.findAll();
  }

  // Requiere autenticación - Cualquier usuario autenticado
  @Query(() => [Product])
  @UseGuards(GqlAuthGuard)
  async products() {
    return this.productsService.findAll();
  }

  // Requiere rol ADMIN o MANAGER
  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async createProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() user: User
  ) {
    console.log(`Product created by: ${user.email}`);
    return this.productsService.create(input);
  }

  // Solo ADMIN puede eliminar
  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteProduct(@Args('id') id: number) {
    return this.productsService.delete(id);
  }
}
```

## Seguridad y Mejores Prácticas

### Almacenamiento de Contraseñas

**Nunca almacenar contraseñas en texto plano.**

El sistema utiliza bcrypt para hash de contraseñas:

```typescript
import * as bcrypt from 'bcrypt';

// Hashear contraseña al crear usuario
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar contraseña al hacer login
const isValid = await bcrypt.compare(password, user.password);
```

**Configuración:**

- Salt rounds: 10
- Algoritmo: bcrypt
- No se retorna el campo password en ninguna query

### Protección del Token

**Recomendaciones:**

1. **En Frontend:**
   - Almacenar en memoria (variable de estado)
   - Evitar localStorage si es posible (vulnerable a XSS)
   - Si se usa localStorage, implementar HttpOnly cookies

2. **En Tránsito:**
   - Usar HTTPS en producción
   - Nunca enviar tokens por URL (query parameters)
   - Siempre usar header Authorization

3. **Expiración:**
   - Configurar tiempo de expiración apropiado
   - Implementar refresh tokens para sesiones largas
   - Invalidar tokens al logout

### Validación de Tokens

El sistema valida automáticamente:

1. **Firma del token:** Verifica integridad con JWT_SECRET
2. **Expiración:** Rechaza tokens expirados
3. **Formato:** Valida estructura del payload
4. **Usuario activo:** Verifica que user.isActive = true

### Manejo de Errores de Autenticación

**Error: Token no proporcionado**

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

**Error: Token inválido o expirado**

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

**Error: Permisos insuficientes**

```json
{
  "errors": [
    {
      "message": "Forbidden resource",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

**Error: Usuario desactivado**

```json
{
  "errors": [
    {
      "message": "User is not active",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

## Configuración de Usuarios Iniciales

### Usuarios por Defecto (Seed)

El sistema crea 4 usuarios de prueba:

**Usuario ADMIN:**

```
Email: admin@erp.com
Password: admin123
Rol: ADMIN
```

**Usuario MANAGER:**

```
Email: manager@erp.com
Password: admin123
Rol: MANAGER
```

**Usuario USER:**

```
Email: user@erp.com
Password: admin123
Rol: USER
```

**Usuario READONLY:**

```
Email: readonly@erp.com
Password: admin123
Rol: READONLY
```

### Crear Nuevos Usuarios

**Solo ADMIN puede crear usuarios**

```graphql
mutation CreateUser {
  createUser(input: {
    email: "nuevo@erp.com"
    password: "securepass123"
    firstName: "Nuevo"
    lastName: "Usuario"
    role: USER
  }) {
    id
    email
    role
  }
}
```

## Testing de Autenticación

### Test 1: Login Exitoso

```graphql
mutation {
  login(email: "admin@erp.com", password: "admin123") {
    accessToken
    user {
      role
    }
  }
}
```

**Verificar:**

- Status 200
- accessToken presente
- user.role correcto

### Test 2: Login Fallido

```graphql
mutation {
  login(email: "admin@erp.com", password: "wrongpass") {
    accessToken
  }
}
```

**Verificar:**

- Error UNAUTHENTICATED
- No retorna token

### Test 3: Acceso sin Token

```graphql
query {
  products {
    id
  }
}
```

**Sin header Authorization**

**Verificar:**

- Error UNAUTHENTICATED

### Test 4: Acceso con Token Válido

```graphql
query {
  products {
    id
  }
}
```

**Con header: Authorization: Bearer TOKEN**

**Verificar:**

- Status 200
- Datos retornados

### Test 5: Verificación de Roles

**Como USER, intentar crear producto:**

```graphql
mutation {
  createProduct(input: {
    name: "Test"
    sku: "TEST-001"
    price: 100
    cost: 50
    stock: 10
  }) {
    id
  }
}
```

**Verificar:**

- Error FORBIDDEN
- Mensaje de permisos insuficientes

## Troubleshooting

### Problema: "Unauthorized" en todas las requests

**Causas posibles:**

1. Token no incluido en header
2. Token expirado
3. JWT_SECRET incorrecto

**Solución:**

1. Verificar header Authorization
2. Hacer login nuevamente para obtener token fresco
3. Verificar variable JWT_SECRET en .env

### Problema: "Forbidden resource"

**Causa:**
El usuario no tiene el rol requerido para la operación

**Solución:**

1. Verificar rol del usuario: Query "me"
2. Usar usuario con permisos adecuados
3. Consultar matriz de permisos

### Problema: Token expira muy rápido

**Solución:**
Modificar JWT_EXPIRES_IN en .env:

```
JWT_EXPIRES_IN=7d  # 7 días
JWT_EXPIRES_IN=12h # 12 horas
JWT_EXPIRES_IN=1d  # 1 día (recomendado)
```

### Problema: Usuario no puede cambiar contraseña

**Verificaciones:**

1. oldPassword es correcta
2. newPassword cumple requisitos (min 6 caracteres)
3. Usuario está autenticado

## Integración con Frontend

### Ejemplo React con Apollo Client

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Login
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        role
      }
    }
  }
`;

const handleLogin = async (email: string, password: string) => {
  const { data } = await client.mutate({
    mutation: LOGIN_MUTATION,
    variables: { email, password }
  });
  
  localStorage.setItem('token', data.login.accessToken);
  localStorage.setItem('user', JSON.stringify(data.login.user));
};
```

### Ejemplo con Fetch API

```typescript
class AuthService {
  private token: string | null = null;

  async login(email: string, password: string) {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              accessToken
              user { id email role }
            }
          }
        `,
        variables: { email, password }
      })
    });

    const { data } = await response.json();
    this.token = data.login.accessToken;
    return data.login;
  }

  async request(query: string, variables?: any) {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ query, variables })
    });

    return response.json();
  }

  logout() {
    this.token = null;
  }
}
```

## Conclusión

El sistema de autenticación del ERP proporciona:

- Seguridad robusta con JWT
- Control granular de acceso con RBAC
- Fácil integración con frontends
- Manejo apropiado de errores
- Escalabilidad para futuras mejoras

Para más información sobre permisos específicos por módulo, consultar: `PERMISSIONS_MATRIX.md`
