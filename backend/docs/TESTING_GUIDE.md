# Guía de Pruebas - Sistema ERP

## Objetivo

Este documento proporciona instrucciones detalladas para realizar pruebas completas del Sistema ERP utilizando Postman como herramienta de testing de la API GraphQL.

## Requisitos Previos

### Software Necesario

- Postman versión 9.0 o superior
- Acceso al servidor del Sistema ERP (<http://localhost:3000>)
- Docker Desktop (para base de datos PostgreSQL y Redis)

### Servicios en Ejecución

Antes de iniciar las pruebas, verificar que los siguientes servicios estén activos:

```bash
# Verificar contenedores Docker
docker ps

# Debería mostrar:
# - PostgreSQL en puerto 5432
# - Redis en puerto 6379

# Verificar servidor NestJS
# El servidor debe estar corriendo en http://localhost:3000
```

## Configuración de Postman

### Importación de la Colección

1. Abrir Postman
2. Click en botón "Import" en la barra superior
3. Seleccionar archivo: `backend/ERP_System_Postman_Collection.json`
4. Confirmar importación

La colección contiene 53 requests organizadas en 6 carpetas:

- Authentication (6 requests)
- Products (7 requests)
- Sales (10 requests)
- Purchase (11 requests)
- Users (9 requests)
- Accounting (4 requests)

### Configuración de Variables

La colección incluye variables pre-configuradas:

**Variables de Colección:**

- `baseUrl`: <http://localhost:3000/graphql>
- `authToken`: Se actualiza automáticamente al hacer login

**Verificación:**

1. Click derecho en la colección
2. Seleccionar "Edit"
3. Ir a pestaña "Variables"
4. Verificar que baseUrl esté configurado correctamente

## Metodología de Pruebas

### Flujo de Pruebas Recomendado

Las pruebas deben ejecutarse en el siguiente orden:

1. Autenticación y Autorización
2. Gestión de Productos
3. Gestión de Clientes y Órdenes de Venta
4. Gestión de Proveedores y Órdenes de Compra
5. Gestión de Usuarios (solo ADMIN)
6. Reportes y Contabilidad
7. Validación de Permisos

### Convenciones de Pruebas

**Datos de Prueba:**

- Utilizar datos realistas pero identificables
- Incluir prefijo "TEST" en nombres cuando sea apropiado
- No utilizar datos de producción

**Validación de Respuestas:**

- Verificar código de estado HTTP
- Validar estructura de respuesta JSON
- Confirmar datos retornados
- Verificar mensajes de error

## Casos de Prueba

### Módulo 1: Autenticación

#### Caso 1.1: Login Exitoso - ADMIN

**Objetivo:** Verificar que un administrador puede autenticarse correctamente

**Precondiciones:**

- Usuario <admin@erp.com> existe en la base de datos
- Contraseña correcta: admin123

**Pasos:**

1. Abrir request "Login - ADMIN"
2. Verificar que el email sea "<admin@erp.com>"
3. Verificar que el password sea "admin123"
4. Ejecutar request (Send)

**Resultado Esperado:**

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

**Validaciones:**

- Status Code: 200 OK
- Campo accessToken presente y no vacío
- Campo user.role = "ADMIN"
- Variable authToken actualizada automáticamente

#### Caso 1.2: Login con Credenciales Inválidas

**Objetivo:** Verificar que el sistema rechaza credenciales incorrectas

**Pasos:**

1. Modificar password a "wrongpassword"
2. Ejecutar request

**Resultado Esperado:**

```json
{
  "errors": [
    {
      "message": "Invalid credentials",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

**Validaciones:**

- Status Code: 401 Unauthorized
- Mensaje de error apropiado
- No se retorna token

#### Caso 1.3: Obtener Usuario Actual

**Objetivo:** Verificar que se puede obtener información del usuario autenticado

**Precondiciones:**

- Estar autenticado (token válido en authToken)

**Pasos:**

1. Abrir request "Get Current User (Me)"
2. Ejecutar request

**Resultado Esperado:**

- Información completa del usuario autenticado
- Sin campo password por seguridad

#### Caso 1.4: Cambio de Contraseña

**Objetivo:** Verificar que un usuario puede cambiar su propia contraseña

**Pasos:**

1. Abrir request "Change My Password"
2. Configurar oldPassword y newPassword
3. Ejecutar request
4. Intentar login con nueva contraseña

**Validaciones:**

- Cambio exitoso
- Login con nueva contraseña funciona
- Login con contraseña antigua falla

### Módulo 2: Productos

#### Caso 2.1: Listar Productos con Paginación

**Objetivo:** Verificar que la paginación funciona correctamente

**Pasos:**

1. Abrir request "Get All Products"
2. Configurar skip=0, take=5
3. Ejecutar request
4. Configurar skip=5, take=5
5. Ejecutar nuevamente

**Validaciones:**

- Primera página retorna productos 1-5
- Segunda página retorna productos 6-10
- No hay duplicados entre páginas

#### Caso 2.2: Crear Producto - ADMIN

**Objetivo:** Verificar que ADMIN puede crear productos

**Precondiciones:**

- Autenticado como ADMIN

**Datos de Prueba:**

```json
{
  "name": "TEST - Laptop Dell",
  "sku": "TEST-LAP-001",
  "description": "Laptop de prueba",
  "price": 1500.00,
  "cost": 1100.00,
  "stock": 25,
  "minStock": 5,
  "category": "Tecnología"
}
```

**Validaciones:**

- Producto creado exitosamente
- ID asignado automáticamente
- Todos los campos guardados correctamente
- SKU es único

#### Caso 2.3: Intentar Crear Producto - USER

**Objetivo:** Verificar que USER no puede crear productos

**Precondiciones:**

- Autenticado como USER (<user@erp.com>)

**Pasos:**

1. Login como USER
2. Intentar crear producto

**Resultado Esperado:**

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

#### Caso 2.4: Actualizar Stock de Producto

**Objetivo:** Verificar actualización de stock

**Pasos:**

1. Obtener producto por ID
2. Registrar stock actual
3. Actualizar con nuevo stock
4. Verificar cambio

**Validaciones:**

- Stock actualizado correctamente
- Otros campos sin modificar

#### Caso 2.5: Productos con Stock Bajo

**Objetivo:** Verificar listado de productos con stock crítico

**Pasos:**

1. Crear producto con stock <= minStock
2. Ejecutar query lowStockProducts
3. Verificar que aparece en la lista

### Módulo 3: Ventas

#### Caso 3.1: Crear Cliente

**Objetivo:** Verificar creación de cliente

**Datos de Prueba:**

```json
{
  "name": "TEST - Empresa ABC S.A.",
  "email": "test@empresa.com",
  "phone": "+52 55 1234 5678",
  "address": "Av. Test 123",
  "city": "Ciudad de México",
  "country": "México"
}
```

**Validaciones:**

- Cliente creado con ID único
- Email válido y único
- Todos los campos guardados

#### Caso 3.2: Crear Orden de Venta

**Objetivo:** Verificar creación de orden de venta con cálculos automáticos

**Precondiciones:**

- Cliente creado (ID conocido)
- Productos existentes

**Datos de Prueba:**

```json
{
  "customerId": 1,
  "notes": "TEST - Orden de prueba",
  "deliveryDate": "2025-10-15",
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "unitPrice": 1200.00
    },
    {
      "productId": 2,
      "quantity": 10,
      "unitPrice": 25.50
    }
  ]
}
```

**Validaciones:**

- Orden creada exitosamente
- orderNumber generado automáticamente (formato: SO-2025-XXXXX)
- Cálculos correctos:
  - subtotal = (5 × 1200) + (10 × 25.50) = 6255.00
  - taxAmount = 6255 × 0.16 = 1000.80
  - totalAmount = 6255 + 1000.80 = 7255.80
- Estado inicial: PENDING

#### Caso 3.3: Actualizar Estado de Orden

**Objetivo:** Verificar transiciones de estado válidas

**Pasos:**

1. Crear orden (estado PENDING)
2. Actualizar a CONFIRMED
3. Actualizar a PROCESSING
4. Actualizar a SHIPPED
5. Actualizar a DELIVERED

**Validaciones:**

- Cada transición exitosa
- No se permite saltar estados
- Estado DELIVERED es final

#### Caso 3.4: Cancelar Orden

**Objetivo:** Verificar cancelación de orden

**Pasos:**

1. Crear orden
2. Ejecutar mutation cancelSalesOrder

**Validaciones:**

- Estado cambia a CANCELLED
- No se permite modificar orden cancelada

### Módulo 4: Compras

#### Caso 4.1: Crear Proveedor

**Objetivo:** Verificar creación de proveedor

**Datos de Prueba:**

```json
{
  "name": "TEST - Proveedor XYZ",
  "email": "ventas@xyz.com",
  "phone": "+52 81 9876 5432",
  "address": "Parque Industrial",
  "city": "Monterrey",
  "country": "México"
}
```

#### Caso 4.2: Crear Orden de Compra

**Objetivo:** Verificar creación de orden de compra

**Precondiciones:**

- Proveedor creado
- Productos existentes

**Datos de Prueba:**

```json
{
  "supplierId": 1,
  "notes": "TEST - Orden de compra",
  "expectedDeliveryDate": "2025-10-20",
  "items": [
    {
      "productId": 1,
      "quantity": 50,
      "unitPrice": 900.00
    }
  ]
}
```

**Validaciones:**

- orderNumber generado (formato: PO-2025-XXXXX)
- Cálculos automáticos correctos

#### Caso 4.3: Recibir Orden de Compra (Crítico)

**Objetivo:** Verificar recepción de orden y actualización de stock

**Precondiciones:**

- Orden de compra creada
- Conocer stock actual de productos

**Pasos:**

1. Obtener producto por ID y registrar stock actual
2. Crear orden de compra con 50 unidades
3. Ejecutar receivePurchaseOrder
4. Obtener producto nuevamente y verificar stock

**Validaciones:**

- Estado de orden cambia a RECEIVED
- Stock incrementado: stock_nuevo = stock_anterior + 50
- receivedDate registrado
- Registro en StockMovement creado con tipo 'IN'

**Ejemplo:**

```
Stock antes: 25
Cantidad en orden: 50
Stock después esperado: 75
```

### Módulo 5: Usuarios

**Nota:** Todos los casos requieren rol ADMIN

#### Caso 5.1: Listar Usuarios

**Objetivo:** Verificar listado de usuarios del sistema

**Validaciones:**

- Se muestran todos los usuarios activos
- Campo password no aparece en respuesta
- Filtros funcionan correctamente

#### Caso 5.2: Crear Usuario

**Objetivo:** Verificar creación de nuevo usuario

**Datos de Prueba:**

```json
{
  "email": "test.user@erp.com",
  "password": "testpass123",
  "firstName": "Usuario",
  "lastName": "Test",
  "role": "USER"
}
```

**Validaciones:**

- Usuario creado correctamente
- Contraseña encriptada en BD
- Rol asignado correctamente

#### Caso 5.3: Desactivar Usuario

**Objetivo:** Verificar que usuario desactivado no puede autenticarse

**Pasos:**

1. Crear usuario de prueba
2. Intentar login (debe funcionar)
3. Desactivar usuario
4. Intentar login nuevamente (debe fallar)

#### Caso 5.4: Estadísticas de Usuarios

**Objetivo:** Verificar cálculo de estadísticas

**Validaciones:**

- totalUsers correcto
- Conteo por rol correcto
- activeUsers vs inactivos correcto

### Módulo 6: Reportes

**Nota:** Requiere rol ADMIN o MANAGER

#### Caso 6.1: Resumen Financiero

**Objetivo:** Verificar cálculos financieros

**Pasos:**

1. Crear varias órdenes de venta y compra
2. Ejecutar query financialSummary
3. Verificar cálculos manualmente

**Validaciones:**

- totalSales = suma de todas las órdenes de venta
- totalPurchases = suma de todas las órdenes de compra
- netProfit = totalSales - totalPurchases
- profitMargin = (netProfit / totalSales) × 100

#### Caso 6.2: Ventas Mensuales

**Objetivo:** Verificar distribución de ventas por mes

**Validaciones:**

- Retorna 12 meses
- Sumas correctas por mes
- Ordenado cronológicamente

#### Caso 6.3: Top Productos

**Objetivo:** Verificar ranking de productos más vendidos

**Validaciones:**

- Ordenado por totalRevenue descendente
- Cálculos de cantidad correctos
- Respeta límite especificado

#### Caso 6.4: Valor de Inventario

**Objetivo:** Verificar cálculo de valor total

**Validaciones:**

- totalValue = Σ(stock × cost)
- Conteo de productos correcto
- Detección de stock bajo correcta

## Validación de Permisos

### Test de Autorización por Rol

#### Test 1: MANAGER no puede eliminar productos

**Pasos:**

1. Login como MANAGER
2. Intentar eliminar producto

**Resultado Esperado:** Error 403 Forbidden

#### Test 2: USER no puede crear productos

**Pasos:**

1. Login como USER
2. Intentar crear producto

**Resultado Esperado:** Error 403 Forbidden

#### Test 3: USER puede crear órdenes de venta

**Pasos:**

1. Login como USER
2. Crear orden de venta

**Resultado Esperado:** Éxito

#### Test 4: USER no puede crear órdenes de compra

**Pasos:**

1. Login como USER
2. Intentar crear orden de compra

**Resultado Esperado:** Error 403 Forbidden

#### Test 5: READONLY no puede consultar productos

**Pasos:**

1. Login como READONLY
2. Intentar listar productos

**Resultado Esperado:** Error 403 Forbidden

## Casos de Prueba de Errores

### Validación de Datos

#### Error 1: SKU Duplicado

**Objetivo:** Verificar que no se permiten SKUs duplicados

**Pasos:**

1. Crear producto con SKU "TEST-001"
2. Intentar crear otro producto con mismo SKU

**Resultado Esperado:** Error de validación

#### Error 2: Stock Negativo

**Objetivo:** Verificar que no se permite stock negativo

**Pasos:**

1. Intentar crear producto con stock = -10

**Resultado Esperado:** Error de validación

#### Error 3: Email Duplicado

**Objetivo:** Verificar unicidad de emails

**Pasos:**

1. Crear cliente con email
2. Crear otro cliente con mismo email

**Resultado Esperado:** Error

### Manejo de Recursos No Existentes

#### Error 4: Producto No Encontrado

**Pasos:**

1. Intentar obtener producto con ID = 99999

**Resultado Esperado:**

```json
{
  "errors": [
    {
      "message": "Product not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

## Registro de Resultados

### Template de Reporte de Prueba

```
CASO DE PRUEBA: [Nombre]
FECHA: [DD/MM/YYYY]
EJECUTADO POR: [Nombre]
AMBIENTE: [Desarrollo/Producción]

RESULTADO: [PASS/FAIL]

OBSERVACIONES:
- [Observación 1]
- [Observación 2]

EVIDENCIA:
- [Screenshot/Log]
```

### Criterios de Éxito

Una prueba se considera exitosa cuando:

1. La respuesta coincide con el resultado esperado
2. El código de estado HTTP es correcto
3. Los datos se persisten correctamente en la base de datos
4. No hay errores en los logs del servidor
5. El tiempo de respuesta es aceptable (< 2 segundos)

## Troubleshooting

### Problema: Token Expirado

**Síntoma:** Error "Unauthorized" en requests autenticados

**Solución:**

1. Ejecutar nuevamente el login
2. Verificar que authToken se actualizó
3. Continuar con las pruebas

### Problema: Base de Datos Vacía

**Síntoma:** No hay productos, clientes o usuarios

**Solución:**

```bash
npx prisma db seed
```

### Problema: Puerto en Uso

**Síntoma:** Servidor no inicia

**Solución:**

1. Verificar procesos en puerto 3000
2. Detener proceso existente
3. Reiniciar servidor

### Problema: Conexión a Base de Datos

**Síntoma:** Error "Cannot connect to database"

**Solución:**

```bash
docker-compose restart
```

## Checklist de Pruebas Completas

### Pre-Testing

- [ ] Docker containers corriendo
- [ ] Servidor NestJS iniciado
- [ ] Colección de Postman importada
- [ ] Variables configuradas

### Autenticación

- [ ] Login exitoso para cada rol
- [ ] Login con credenciales inválidas falla
- [ ] Token se guarda automáticamente
- [ ] Query "me" funciona
- [ ] Cambio de contraseña funciona

### Productos

- [ ] Listar productos
- [ ] Crear producto (ADMIN/MANAGER)
- [ ] Actualizar producto
- [ ] Eliminar producto (ADMIN only)
- [ ] Productos con stock bajo
- [ ] Validación de SKU único

### Ventas

- [ ] Crear cliente
- [ ] Listar clientes
- [ ] Crear orden de venta
- [ ] Cálculos automáticos correctos
- [ ] Actualizar estado de orden
- [ ] Cancelar orden

### Compras

- [ ] Crear proveedor
- [ ] Crear orden de compra
- [ ] Recibir orden (verificar stock)
- [ ] Stock se incrementa correctamente
- [ ] StockMovement creado

### Usuarios

- [ ] Listar usuarios (ADMIN)
- [ ] Crear usuario
- [ ] Desactivar usuario
- [ ] Usuario desactivado no puede autenticarse
- [ ] Estadísticas de usuarios

### Reportes

- [ ] Resumen financiero
- [ ] Ventas mensuales
- [ ] Top productos
- [ ] Valor de inventario

### Permisos

- [ ] ADMIN tiene acceso total
- [ ] MANAGER no puede eliminar
- [ ] USER no puede crear productos
- [ ] USER puede crear ventas
- [ ] READONLY no tiene acceso

## Conclusión

Este documento proporciona una guía completa para realizar pruebas exhaustivas del Sistema ERP. Se recomienda ejecutar todos los casos de prueba antes de cada release y documentar los resultados apropiadamente.

Para reportar bugs o inconsistencias encontradas durante las pruebas, incluir:

- Caso de prueba ejecutado
- Datos de entrada utilizados
- Resultado esperado vs resultado obtenido
- Logs del servidor
- Screenshots cuando sea relevante
