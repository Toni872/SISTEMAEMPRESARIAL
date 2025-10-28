# Matriz de Permisos - Sistema ERP

## Introducción

Este documento define la matriz completa de permisos para todos los roles del Sistema ERP. Cada operación está clasificada según los roles que tienen autorización para ejecutarla.

## Roles del Sistema

### ADMIN (Administrador)

**Descripción:** Rol con acceso completo al sistema. Tiene permisos para todas las operaciones sin restricciones.

**Casos de uso:**

- Gestión completa del sistema
- Configuración de usuarios y permisos
- Acceso a información sensible
- Operaciones de eliminación de datos

### MANAGER (Gerente)

**Descripción:** Rol con permisos de gestión operativa. Puede realizar la mayoría de operaciones excepto eliminación de recursos críticos y gestión de usuarios.

**Casos de uso:**

- Supervisión de operaciones
- Gestión de inventario
- Creación y modificación de órdenes
- Acceso a reportes financieros

### USER (Usuario Regular)

**Descripción:** Rol con permisos básicos para operaciones del día a día. Enfocado en operaciones de ventas y consultas.

**Casos de uso:**

- Creación de órdenes de venta
- Consulta de productos y clientes
- Gestión básica de inventario

### READONLY (Solo Lectura)

**Descripción:** Rol con acceso limitado solo a consultas específicas. No puede realizar modificaciones.

**Casos de uso:**

- Auditoría
- Consultas específicas autorizadas
- Acceso temporal para revisión

## Matriz de Permisos por Módulo

### Módulo de Autenticación

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| login | ✓ | ✓ | ✓ | ✓ | Público |
| register | ✓ | ✓ | ✓ | ✓ | Público en desarrollo |
| me (obtener usuario actual) | ✓ | ✓ | ✓ | ✓ | Requiere autenticación |
| changePassword (propia) | ✓ | ✓ | ✓ | ✓ | Solo propia contraseña |

### Módulo de Productos

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| Listar productos (products) | ✓ | ✓ | ✓ | ✗ | Con paginación |
| Obtener producto por ID | ✓ | ✓ | ✓ | ✗ | - |
| Obtener producto por SKU | ✓ | ✓ | ✓ | ✗ | - |
| Listar productos con stock bajo | ✓ | ✓ | ✓ | ✗ | - |
| Crear producto | ✓ | ✓ | ✗ | ✗ | - |
| Actualizar producto | ✓ | ✓ | ✗ | ✗ | - |
| Eliminar producto | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |

**Reglas especiales:**

- El SKU debe ser único en el sistema
- El stock no puede ser negativo
- El precio debe ser mayor que el costo

### Módulo de Ventas - Clientes

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| Listar clientes | ✓ | ✓ | ✓ | ✗ | Con paginación |
| Obtener cliente por ID | ✓ | ✓ | ✓ | ✗ | - |
| Crear cliente | ✓ | ✓ | ✓ | ✗ | - |
| Actualizar cliente | ✓ | ✓ | ✗ | ✗ | - |
| Eliminar cliente | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |

**Reglas especiales:**

- El email debe ser único si se proporciona
- No se pueden eliminar clientes con órdenes asociadas

### Módulo de Ventas - Órdenes

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| Listar órdenes de venta | ✓ | ✓ | ✓ | ✗ | Con paginación y filtros |
| Obtener orden por ID | ✓ | ✓ | ✓ | ✗ | - |
| Crear orden de venta | ✓ | ✓ | ✓ | ✗ | - |
| Actualizar orden de venta | ✓ | ✓ | ✗ | ✗ | - |
| Cancelar orden de venta | ✓ | ✓ | ✗ | ✗ | - |

**Reglas especiales:**

- Solo se pueden actualizar órdenes en estado PENDING o CONFIRMED
- El usuario se registra automáticamente como creador
- El cálculo de impuestos (16% IVA) es automático
- El número de orden se genera automáticamente

**Restricciones de estados:**

| Estado Actual | Puede cambiar a | Roles permitidos |
|---------------|----------------|------------------|
| PENDING | CONFIRMED, CANCELLED | ADMIN, MANAGER |
| CONFIRMED | PROCESSING, CANCELLED | ADMIN, MANAGER |
| PROCESSING | SHIPPED, CANCELLED | ADMIN, MANAGER |
| SHIPPED | DELIVERED | ADMIN, MANAGER |
| DELIVERED | - | No modificable |
| CANCELLED | - | No modificable |

### Módulo de Compras - Proveedores

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| Listar proveedores | ✓ | ✓ | ✓ | ✗ | Con paginación |
| Obtener proveedor por ID | ✓ | ✓ | ✓ | ✗ | - |
| Crear proveedor | ✓ | ✓ | ✗ | ✗ | - |
| Actualizar proveedor | ✓ | ✓ | ✗ | ✗ | - |
| Eliminar proveedor | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |

**Reglas especiales:**

- No se pueden eliminar proveedores con órdenes asociadas
- El email debe ser único si se proporciona

### Módulo de Compras - Órdenes

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| Listar órdenes de compra | ✓ | ✓ | ✓ | ✗ | Con paginación y filtros |
| Obtener orden por ID | ✓ | ✓ | ✓ | ✗ | - |
| Crear orden de compra | ✓ | ✓ | ✗ | ✗ | - |
| Actualizar orden de compra | ✓ | ✓ | ✗ | ✗ | - |
| Recibir orden de compra | ✓ | ✓ | ✗ | ✗ | Actualiza stock |
| Cancelar orden de compra | ✓ | ✓ | ✗ | ✗ | - |

**Reglas especiales:**

- Solo ADMIN y MANAGER pueden crear órdenes de compra
- La recepción de orden incrementa automáticamente el stock
- Se crea registro en StockMovement al recibir orden
- El número de orden se genera automáticamente

**Restricciones de estados:**

| Estado Actual | Puede cambiar a | Roles permitidos |
|---------------|----------------|------------------|
| PENDING | APPROVED, CANCELLED | ADMIN, MANAGER |
| APPROVED | ORDERED, CANCELLED | ADMIN, MANAGER |
| ORDERED | RECEIVED, CANCELLED | ADMIN, MANAGER |
| RECEIVED | - | No modificable |
| CANCELLED | - | No modificable |

**Operación especial - receivePurchaseOrder:**

Esta operación realiza múltiples acciones:

1. Cambia estado de orden a RECEIVED
2. Incrementa stock de productos según cantidades
3. Crea registros StockMovement tipo 'IN'
4. Registra fecha de recepción

### Módulo de Usuarios

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| Listar usuarios | ✓ | ✓ | ✗ | ✗ | Con paginación y filtros |
| Obtener usuario por ID | ✓ | ✓ | ✗ | ✗ | - |
| Obtener estadísticas de usuarios | ✓ | ✓ | ✗ | ✗ | - |
| Crear usuario | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |
| Actualizar usuario | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |
| Cambiar contraseña de otro usuario | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |
| Activar usuario | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |
| Desactivar usuario | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |
| Eliminar usuario | ✓ | ✗ | ✗ | ✗ | Solo ADMIN |

**Reglas especiales:**

- No se puede eliminar el propio usuario
- No se puede cambiar el rol del propio usuario
- Los usuarios desactivados no pueden iniciar sesión
- El email debe ser único
- La contraseña debe tener mínimo 6 caracteres
- MANAGER puede ver usuarios pero no modificarlos

### Módulo de Contabilidad

| Operación | ADMIN | MANAGER | USER | READONLY | Notas |
|-----------|-------|---------|------|----------|-------|
| Resumen financiero | ✓ | ✓ | ✗ | ✗ | - |
| Ventas mensuales | ✓ | ✓ | ✗ | ✗ | - |
| Top productos | ✓ | ✓ | ✗ | ✗ | - |
| Valor de inventario | ✓ | ✓ | ✗ | ✗ | - |

**Reglas especiales:**

- Todos los reportes son de solo lectura
- No hay mutations en este módulo
- Los datos se calculan en tiempo real
- Se pueden aplicar filtros de fecha

## Resumen de Permisos por Rol

### ADMIN - Resumen General

**Acceso Total:**

- Todos los módulos: 100% de operaciones
- Puede crear, leer, actualizar y eliminar cualquier recurso
- Único rol con acceso a gestión de usuarios
- Acceso a todos los reportes financieros

**Total de operaciones permitidas:** 53/53 (100%)

### MANAGER - Resumen General

**Acceso Alto:**

- Todos los módulos excepto Users (solo lectura)
- Puede crear, leer y actualizar la mayoría de recursos
- No puede eliminar recursos críticos
- Acceso completo a reportes financieros

**Total de operaciones permitidas:** 43/53 (81%)

**Restricciones principales:**

- No puede eliminar productos, clientes, proveedores
- No puede gestionar usuarios (solo consultar)
- No puede cambiar configuraciones críticas del sistema

### USER - Resumen General

**Acceso Medio:**

- Enfocado en operaciones de ventas
- Puede crear órdenes de venta
- Puede consultar productos, clientes, proveedores
- No puede realizar compras ni ver reportes

**Total de operaciones permitidas:** 18/53 (34%)

**Restricciones principales:**

- No puede crear ni modificar productos
- No puede crear órdenes de compra
- No puede actualizar ni cancelar órdenes de venta
- No acceso a módulo de usuarios
- No acceso a reportes financieros

### READONLY - Resumen General

**Acceso Mínimo:**

- Solo operaciones de autenticación
- Sin acceso a consultas de datos
- Diseñado para casos especiales de auditoría

**Total de operaciones permitidas:** 4/53 (8%)

**Restricciones principales:**

- No puede consultar productos, clientes, proveedores
- No puede crear ningún recurso
- No puede ver órdenes ni reportes

## Matriz Consolidada

### Leyenda

- ✓ = Permitido
- ✗ = No permitido
- (R) = Solo lectura
- (W) = Lectura y escritura
- (D) = Incluye eliminación

### Por Tipo de Operación

| Tipo de Operación | ADMIN | MANAGER | USER | READONLY |
|-------------------|-------|---------|------|----------|
| Crear (Create) | ✓ | ✓ (limitado) | ✓ (muy limitado) | ✗ |
| Leer (Read) | ✓ | ✓ | ✓ (limitado) | ✗ |
| Actualizar (Update) | ✓ | ✓ (limitado) | ✗ | ✗ |
| Eliminar (Delete) | ✓ | ✗ | ✗ | ✗ |

### Por Módulo

| Módulo | ADMIN | MANAGER | USER | READONLY |
|--------|-------|---------|------|----------|
| Auth | R/W | R/W | R/W | R/W |
| Products | R/W/D | R/W | R | ✗ |
| Sales - Customers | R/W/D | R/W | R/W | ✗ |
| Sales - Orders | R/W/D | R/W | R/W (crear solo) | ✗ |
| Purchase - Suppliers | R/W/D | R/W | R | ✗ |
| Purchase - Orders | R/W/D | R/W | R | ✗ |
| Users | R/W/D | R | ✗ | ✗ |
| Accounting | R | R | ✗ | ✗ |

## Políticas de Seguridad

### Autenticación Requerida

Todas las operaciones excepto login y register requieren:

- Token JWT válido en el header Authorization
- Token no expirado (7 días de validez)
- Usuario activo (isActive = true)

### Validación de Roles

El sistema valida roles mediante:

1. Extracción de rol del token JWT
2. Verificación contra decorador @Roles en el endpoint
3. Guard RolesGuard que ejecuta la validación

### Casos Especiales

#### Operaciones sobre datos propios

Los usuarios pueden:

- Cambiar su propia contraseña (changePassword)
- Ver su propia información (me)
- Actualizar su propio perfil (limitado)

#### Restricciones de eliminación

No se pueden eliminar recursos con dependencias:

- Productos con órdenes asociadas
- Clientes con órdenes asociadas
- Proveedores con órdenes asociadas
- Usuario propio

#### Auditoría

Todas las operaciones sensibles se registran con:

- Usuario que ejecuta la operación
- Timestamp de la operación
- IP de origen (si está configurado)

## Implementación Técnica

### Guards

El sistema implementa dos guards principales:

**JwtAuthGuard:**

- Valida existencia y validez del token
- Extrae información del usuario
- Inyecta usuario en el contexto de la request

**RolesGuard:**

- Valida que el usuario tenga al menos uno de los roles requeridos
- Se ejecuta después de JwtAuthGuard
- Retorna 403 Forbidden si no tiene permisos

### Decorators

**@Roles(...roles):**

```typescript
@Roles(Role.ADMIN, Role.MANAGER)
@Query(() => [Product])
async products() { ... }
```

**@CurrentUser():**

```typescript
@Mutation(() => SalesOrder)
async createSalesOrder(
  @CurrentUser() user: User,
  @Args('input') input: CreateSalesOrderInput
) { ... }
```

### Ejemplo de Implementación

```typescript
@Resolver()
export class ProductsResolver {
  
  // Solo ADMIN, MANAGER y USER pueden ver productos
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @Query(() => [Product])
  async products() { ... }
  
  // Solo ADMIN y MANAGER pueden crear productos
  @Roles(Role.ADMIN, Role.MANAGER)
  @Mutation(() => Product)
  async createProduct() { ... }
  
  // Solo ADMIN puede eliminar productos
  @Roles(Role.ADMIN)
  @Mutation(() => Product)
  async removeProduct() { ... }
}
```

## Actualización de Permisos

Para modificar permisos:

1. Actualizar el decorator @Roles en el resolver correspondiente
2. Actualizar esta matriz de permisos
3. Actualizar tests de autorización
4. Notificar a los usuarios afectados
5. Documentar en el changelog

## Recomendaciones

### Para Administradores

- Asignar el rol mínimo necesario para cada usuario
- Revisar periódicamente los roles asignados
- Auditar operaciones sensibles regularmente
- Cambiar contraseñas de usuarios de prueba en producción

### Para Desarrolladores

- Siempre usar decoradores @Roles en nuevos endpoints
- Validar permisos a nivel de código además de guards
- Documentar cualquier excepción a la matriz
- Implementar tests para cada combinación de rol/operación

### Para Usuarios

- No compartir credenciales
- Solicitar solo los permisos necesarios
- Reportar accesos no autorizados
- Cambiar contraseñas periódicamente

## Historial de Cambios

### Versión 1.0.0 - Octubre 3, 2025

- Implementación inicial de matriz de permisos
- Definición de 4 roles: ADMIN, MANAGER, USER, READONLY
- 53 operaciones clasificadas
- Políticas de seguridad establecidas
