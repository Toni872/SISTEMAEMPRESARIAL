# Esquema de Base de Datos - Sistema ERP

## Información General

### Sistema de Gestión de Base de Datos

- **DBMS:** PostgreSQL 15
- **ORM:** Prisma 5.22.0
- **Charset:** UTF-8
- **Timezone:** UTC

### Ubicación del Esquema

El esquema de la base de datos está definido en: `backend/prisma/schema.prisma`

## Estructura de Tablas

### Diagrama de Relaciones

```
User (1) ──────────┐
                   │
Product (1) ───────┼─────────┐
                   │         │
Customer (1) ──────┼────┐    │
                   │    │    │
Supplier (1) ──────┼────┼────┼────┐
                   │    │    │    │
                   ↓    ↓    ↓    ↓
          SalesOrder    SalesOrderItem
          PurchaseOrder PurchaseOrderItem
                   ↓
          StockMovement
```

## Tablas del Sistema

### 1. User

Almacena información de usuarios del sistema con diferentes niveles de acceso.

**Tabla:** `User`

| Campo      | Tipo         | Restricciones           | Descripción                        |
|------------|--------------|-------------------------|------------------------------------|
| id         | Int          | PRIMARY KEY, AUTOINCREMENT | Identificador único del usuario    |
| email      | String       | UNIQUE, NOT NULL        | Email único del usuario            |
| password   | String       | NOT NULL                | Contraseña encriptada (bcrypt)     |
| firstName  | String       | NOT NULL                | Nombre del usuario                 |
| lastName   | String       | NOT NULL                | Apellido del usuario               |
| role       | UserRole     | NOT NULL, DEFAULT USER  | Rol del usuario en el sistema      |
| isActive   | Boolean      | DEFAULT true            | Estado de activación del usuario   |
| createdAt  | DateTime     | DEFAULT now()           | Fecha de creación del registro     |
| updatedAt  | DateTime     | AUTO UPDATE             | Fecha de última actualización      |

**Índices:**

- PRIMARY KEY: id
- UNIQUE: email
- INDEX: role
- INDEX: isActive

**Relaciones:**

- Ninguna directa (usuario del sistema)

**Enum: UserRole**

```prisma
enum UserRole {
  ADMIN       // Acceso total al sistema
  MANAGER     // Acceso a gestión sin eliminación
  USER        // Acceso operativo limitado
  READONLY    // Solo lectura sin acceso a queries
}
```

### 2. Product

Catálogo de productos del inventario.

**Tabla:** `Product`

| Campo       | Tipo     | Restricciones           | Descripción                           |
|-------------|----------|-------------------------|---------------------------------------|
| id          | Int      | PRIMARY KEY, AUTOINCREMENT | Identificador único del producto      |
| name        | String   | NOT NULL                | Nombre del producto                   |
| sku         | String   | UNIQUE, NOT NULL        | Código SKU único                      |
| description | String   | NULLABLE                | Descripción detallada                 |
| price       | Float    | NOT NULL                | Precio de venta                       |
| cost        | Float    | NOT NULL                | Costo de adquisición                  |
| stock       | Int      | DEFAULT 0               | Cantidad en inventario                |
| minStock    | Int      | DEFAULT 0               | Nivel mínimo de stock (alerta)        |
| category    | String   | NULLABLE                | Categoría del producto                |
| isActive    | Boolean  | DEFAULT true            | Estado de activación                  |
| createdAt   | DateTime | DEFAULT now()           | Fecha de creación                     |
| updatedAt   | DateTime | AUTO UPDATE             | Fecha de última actualización         |

**Índices:**

- PRIMARY KEY: id
- UNIQUE: sku
- INDEX: category
- INDEX: isActive
- INDEX: stock (para consultas de stock bajo)

**Relaciones:**

- salesOrderItems (1:N) → SalesOrderItem
- purchaseOrderItems (1:N) → PurchaseOrderItem
- stockMovements (1:N) → StockMovement

**Validaciones:**

- price >= 0
- cost >= 0
- stock >= 0
- minStock >= 0

### 3. Customer

Información de clientes para módulo de ventas.

**Tabla:** `Customer`

| Campo     | Tipo     | Restricciones           | Descripción                      |
|-----------|----------|-------------------------|----------------------------------|
| id        | Int      | PRIMARY KEY, AUTOINCREMENT | Identificador único del cliente  |
| name      | String   | NOT NULL                | Nombre o razón social            |
| email     | String   | UNIQUE, NOT NULL        | Email del cliente                |
| phone     | String   | NULLABLE                | Teléfono de contacto             |
| address   | String   | NULLABLE                | Dirección física                 |
| city      | String   | NULLABLE                | Ciudad                           |
| country   | String   | NULLABLE                | País                             |
| isActive  | Boolean  | DEFAULT true            | Estado de activación             |
| createdAt | DateTime | DEFAULT now()           | Fecha de creación                |
| updatedAt | DateTime | AUTO UPDATE             | Fecha de última actualización    |

**Índices:**

- PRIMARY KEY: id
- UNIQUE: email
- INDEX: isActive
- INDEX: name

**Relaciones:**

- salesOrders (1:N) → SalesOrder

### 4. Supplier

Información de proveedores para módulo de compras.

**Tabla:** `Supplier`

| Campo     | Tipo     | Restricciones           | Descripción                         |
|-----------|----------|-------------------------|-------------------------------------|
| id        | Int      | PRIMARY KEY, AUTOINCREMENT | Identificador único del proveedor   |
| name      | String   | NOT NULL                | Nombre o razón social               |
| email     | String   | UNIQUE, NOT NULL        | Email del proveedor                 |
| phone     | String   | NULLABLE                | Teléfono de contacto                |
| address   | String   | NULLABLE                | Dirección física                    |
| city      | String   | NULLABLE                | Ciudad                              |
| country   | String   | NULLABLE                | País                                |
| isActive  | Boolean  | DEFAULT true            | Estado de activación                |
| createdAt | DateTime | DEFAULT now()           | Fecha de creación                   |
| updatedAt | DateTime | AUTO UPDATE             | Fecha de última actualización       |

**Índices:**

- PRIMARY KEY: id
- UNIQUE: email
- INDEX: isActive
- INDEX: name

**Relaciones:**

- purchaseOrders (1:N) → PurchaseOrder

### 5. SalesOrder

Órdenes de venta a clientes.

**Tabla:** `SalesOrder`

| Campo        | Tipo            | Restricciones           | Descripción                          |
|--------------|-----------------|-------------------------|--------------------------------------|
| id           | Int             | PRIMARY KEY, AUTOINCREMENT | Identificador único de la orden      |
| orderNumber  | String          | UNIQUE, NOT NULL        | Número de orden (SO-YYYY-XXXXX)      |
| customerId   | Int             | FOREIGN KEY, NOT NULL   | ID del cliente                       |
| orderDate    | DateTime        | DEFAULT now()           | Fecha de emisión de la orden         |
| status       | SalesOrderStatus| DEFAULT PENDING         | Estado actual de la orden            |
| subtotal     | Float           | NOT NULL                | Subtotal antes de impuestos          |
| taxAmount    | Float           | NOT NULL                | Monto de impuestos (16%)             |
| totalAmount  | Float           | NOT NULL                | Total incluyendo impuestos           |
| notes        | String          | NULLABLE                | Notas u observaciones                |
| deliveryDate | DateTime        | NULLABLE                | Fecha prevista de entrega            |
| deliveredAt  | DateTime        | NULLABLE                | Fecha real de entrega                |
| createdAt    | DateTime        | DEFAULT now()           | Fecha de creación                    |
| updatedAt    | DateTime        | AUTO UPDATE             | Fecha de última actualización        |

**Índices:**

- PRIMARY KEY: id
- UNIQUE: orderNumber
- FOREIGN KEY: customerId → Customer(id)
- INDEX: status
- INDEX: orderDate
- INDEX: deliveryDate

**Relaciones:**

- customer (N:1) → Customer
- items (1:N) → SalesOrderItem

**Enum: SalesOrderStatus**

```prisma
enum SalesOrderStatus {
  PENDING      // Orden creada, pendiente de confirmación
  CONFIRMED    // Orden confirmada
  PROCESSING   // En proceso de preparación
  SHIPPED      // Enviada al cliente
  DELIVERED    // Entregada al cliente
  CANCELLED    // Cancelada
}
```

**Transiciones de Estado Válidas:**

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
   ↓          ↓            ↓          ↓
CANCELLED  CANCELLED  CANCELLED  CANCELLED
```

**Validaciones:**

- subtotal >= 0
- taxAmount >= 0
- totalAmount >= 0
- totalAmount = subtotal + taxAmount

### 6. SalesOrderItem

Líneas de detalle de órdenes de venta.

**Tabla:** `SalesOrderItem`

| Campo        | Tipo     | Restricciones           | Descripción                       |
|--------------|----------|-------------------------|-----------------------------------|
| id           | Int      | PRIMARY KEY, AUTOINCREMENT | Identificador único del item      |
| salesOrderId | Int      | FOREIGN KEY, NOT NULL   | ID de la orden de venta           |
| productId    | Int      | FOREIGN KEY, NOT NULL   | ID del producto                   |
| quantity     | Int      | NOT NULL                | Cantidad solicitada               |
| unitPrice    | Float    | NOT NULL                | Precio unitario al momento        |
| totalPrice   | Float    | NOT NULL                | Total de la línea                 |
| createdAt    | DateTime | DEFAULT now()           | Fecha de creación                 |
| updatedAt    | DateTime | AUTO UPDATE             | Fecha de última actualización     |

**Índices:**

- PRIMARY KEY: id
- FOREIGN KEY: salesOrderId → SalesOrder(id) ON DELETE CASCADE
- FOREIGN KEY: productId → Product(id)
- INDEX: salesOrderId
- INDEX: productId

**Relaciones:**

- salesOrder (N:1) → SalesOrder
- product (N:1) → Product

**Validaciones:**

- quantity > 0
- unitPrice >= 0
- totalPrice = quantity × unitPrice

**Comportamiento ON DELETE:**

- Si se elimina SalesOrder, se eliminan todos sus items (CASCADE)

### 7. PurchaseOrder

Órdenes de compra a proveedores.

**Tabla:** `PurchaseOrder`

| Campo                | Tipo               | Restricciones           | Descripción                          |
|----------------------|--------------------|-------------------------|--------------------------------------|
| id                   | Int                | PRIMARY KEY, AUTOINCREMENT | Identificador único de la orden      |
| orderNumber          | String             | UNIQUE, NOT NULL        | Número de orden (PO-YYYY-XXXXX)      |
| supplierId           | Int                | FOREIGN KEY, NOT NULL   | ID del proveedor                     |
| orderDate            | DateTime           | DEFAULT now()           | Fecha de emisión de la orden         |
| status               | PurchaseOrderStatus| DEFAULT PENDING         | Estado actual de la orden            |
| subtotal             | Float              | NOT NULL                | Subtotal antes de impuestos          |
| taxAmount            | Float              | NOT NULL                | Monto de impuestos (16%)             |
| totalAmount          | Float              | NOT NULL                | Total incluyendo impuestos           |
| notes                | String             | NULLABLE                | Notas u observaciones                |
| expectedDeliveryDate | DateTime           | NULLABLE                | Fecha esperada de recepción          |
| receivedDate         | DateTime           | NULLABLE                | Fecha real de recepción              |
| createdAt            | DateTime           | DEFAULT now()           | Fecha de creación                    |
| updatedAt            | DateTime           | AUTO UPDATE             | Fecha de última actualización        |

**Índices:**

- PRIMARY KEY: id
- UNIQUE: orderNumber
- FOREIGN KEY: supplierId → Supplier(id)
- INDEX: status
- INDEX: orderDate
- INDEX: expectedDeliveryDate

**Relaciones:**

- supplier (N:1) → Supplier
- items (1:N) → PurchaseOrderItem

**Enum: PurchaseOrderStatus**

```prisma
enum PurchaseOrderStatus {
  PENDING      // Orden creada, pendiente de envío
  SENT         // Enviada al proveedor
  CONFIRMED    // Confirmada por proveedor
  RECEIVED     // Mercancía recibida
  CANCELLED    // Cancelada
}
```

**Transiciones de Estado Válidas:**

```
PENDING → SENT → CONFIRMED → RECEIVED
   ↓       ↓         ↓
CANCELLED CANCELLED CANCELLED
```

**Validaciones:**

- subtotal >= 0
- taxAmount >= 0
- totalAmount >= 0
- totalAmount = subtotal + taxAmount

### 8. PurchaseOrderItem

Líneas de detalle de órdenes de compra.

**Tabla:** `PurchaseOrderItem`

| Campo           | Tipo     | Restricciones           | Descripción                       |
|-----------------|----------|-------------------------|-----------------------------------|
| id              | Int      | PRIMARY KEY, AUTOINCREMENT | Identificador único del item      |
| purchaseOrderId | Int      | FOREIGN KEY, NOT NULL   | ID de la orden de compra          |
| productId       | Int      | FOREIGN KEY, NOT NULL   | ID del producto                   |
| quantity        | Int      | NOT NULL                | Cantidad solicitada               |
| unitPrice       | Float    | NOT NULL                | Precio unitario de compra         |
| totalPrice      | Float    | NOT NULL                | Total de la línea                 |
| createdAt       | DateTime | DEFAULT now()           | Fecha de creación                 |
| updatedAt       | DateTime | AUTO UPDATE             | Fecha de última actualización     |

**Índices:**

- PRIMARY KEY: id
- FOREIGN KEY: purchaseOrderId → PurchaseOrder(id) ON DELETE CASCADE
- FOREIGN KEY: productId → Product(id)
- INDEX: purchaseOrderId
- INDEX: productId

**Relaciones:**

- purchaseOrder (N:1) → PurchaseOrder
- product (N:1) → Product

**Validaciones:**

- quantity > 0
- unitPrice >= 0
- totalPrice = quantity × unitPrice

**Comportamiento ON DELETE:**

- Si se elimina PurchaseOrder, se eliminan todos sus items (CASCADE)

### 9. StockMovement

Registro de movimientos de inventario.

**Tabla:** `StockMovement`

| Campo        | Tipo     | Restricciones           | Descripción                          |
|--------------|----------|-------------------------|--------------------------------------|
| id           | Int      | PRIMARY KEY, AUTOINCREMENT | Identificador único del movimiento   |
| productId    | Int      | FOREIGN KEY, NOT NULL   | ID del producto                      |
| type         | String   | NOT NULL                | Tipo de movimiento (IN/OUT/ADJUST)   |
| quantity     | Int      | NOT NULL                | Cantidad movida                      |
| previousStock| Int      | NOT NULL                | Stock antes del movimiento           |
| newStock     | Int      | NOT NULL                | Stock después del movimiento         |
| reason       | String   | NULLABLE                | Razón del movimiento                 |
| reference    | String   | NULLABLE                | Referencia externa (orden number)    |
| createdAt    | DateTime | DEFAULT now()           | Fecha del movimiento                 |

**Índices:**

- PRIMARY KEY: id
- FOREIGN KEY: productId → Product(id)
- INDEX: productId
- INDEX: type
- INDEX: createdAt

**Relaciones:**

- product (N:1) → Product

**Tipos de Movimiento:**

- `IN`: Entrada de inventario (compras, ajustes positivos)
- `OUT`: Salida de inventario (ventas, ajustes negativos)
- `ADJUST`: Ajuste de inventario (correcciones)

**Validaciones:**

- quantity != 0
- previousStock >= 0
- newStock >= 0
- Para tipo IN: newStock = previousStock + quantity
- Para tipo OUT: newStock = previousStock - quantity

## Migraciones

### Gestión de Migraciones

**Crear nueva migración:**

```bash
npx prisma migrate dev --name descripcion_del_cambio
```

**Aplicar migraciones en producción:**

```bash
npx prisma migrate deploy
```

**Ver estado de migraciones:**

```bash
npx prisma migrate status
```

### Historial de Migraciones

Las migraciones se almacenan en: `backend/prisma/migrations/`

Cada migración contiene:

- Archivo SQL con los cambios
- Timestamp de creación
- Descripción del cambio

## Seeds (Datos Iniciales)

### Script de Seed

Ubicación: `backend/prisma/seed.ts`

**Ejecutar seed:**

```bash
npx prisma db seed
```

### Datos Creados por Seed

**Usuarios:**

- <admin@erp.com> (ADMIN)
- <manager@erp.com> (MANAGER)
- <user@erp.com> (USER)
- <readonly@erp.com> (READONLY)

Contraseña para todos: `admin123`

**Productos:**

- 10 productos de ejemplo en diversas categorías
- Stock variado para pruebas
- Precios y costos realistas

**Clientes y Proveedores:**

- 3 clientes de ejemplo
- 2 proveedores de ejemplo

## Backup y Restauración

### Crear Backup

**Backup completo:**

```bash
docker exec -t postgres-erp pg_dump -U postgres erp_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Backup de esquema solamente:**

```bash
docker exec -t postgres-erp pg_dump -U postgres --schema-only erp_db > schema_backup.sql
```

**Backup de datos solamente:**

```bash
docker exec -t postgres-erp pg_dump -U postgres --data-only erp_db > data_backup.sql
```

### Restaurar Backup

**Restauración completa:**

```bash
docker exec -i postgres-erp psql -U postgres erp_db < backup_file.sql
```

**Restauración con recreación de base de datos:**

```bash
docker exec -i postgres-erp psql -U postgres -c "DROP DATABASE IF EXISTS erp_db;"
docker exec -i postgres-erp psql -U postgres -c "CREATE DATABASE erp_db;"
docker exec -i postgres-erp psql -U postgres erp_db < backup_file.sql
```

## Optimización y Mantenimiento

### Índices Recomendados

Todos los índices necesarios ya están definidos en el esquema Prisma. Para verificar índices existentes:

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;
```

### Análisis de Tablas

**Ver tamaño de tablas:**

```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Vacuum y Analyze:**

```sql
VACUUM ANALYZE;
```

### Monitoreo de Rendimiento

**Consultas lentas:**

```sql
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Integridad Referencial

### Políticas de Eliminación

**ON DELETE CASCADE:**

- SalesOrderItem: Si se elimina SalesOrder, se eliminan items
- PurchaseOrderItem: Si se elimina PurchaseOrder, se eliminan items

**ON DELETE RESTRICT (por defecto):**

- No se puede eliminar Product si tiene órdenes asociadas
- No se puede eliminar Customer si tiene órdenes
- No se puede eliminar Supplier si tiene órdenes

### Validaciones a Nivel de Base de Datos

**Constraints definidos:**

- PRIMARY KEY en todas las tablas
- UNIQUE en emails y SKUs
- FOREIGN KEY con validación de integridad
- NOT NULL en campos críticos
- DEFAULT values para campos opcionales

## Seguridad

### Consideraciones de Seguridad

1. **Contraseñas:**
   - Almacenadas con bcrypt (rounds: 10)
   - Nunca devueltas en queries GraphQL

2. **Soft Delete:**
   - Uso de campo `isActive` en lugar de DELETE físico
   - Preserva historial y relaciones

3. **Auditoría:**
   - Campos `createdAt` y `updatedAt` en todas las tablas
   - StockMovement registra todos los cambios de inventario

4. **Acceso:**
   - Prisma Client gestiona conexiones de forma segura
   - Connection pooling automático
   - Prepared statements (protección contra SQL injection)

## Conexión a Base de Datos

### Configuración de Prisma

**DATABASE_URL en .env:**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_db?schema=public"
```

**Formato:**

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### Pool de Conexiones

Configuración por defecto de Prisma:

- Connection limit: 10
- Timeout: 5 segundos
- Pool timeout: 10 segundos

## Consultas Útiles

### Verificar Integridad

**Productos sin stock:**

```sql
SELECT id, name, sku, stock, minStock
FROM "Product"
WHERE stock < minStock
  AND "isActive" = true;
```

**Órdenes pendientes:**

```sql
SELECT id, "orderNumber", status, "orderDate"
FROM "SalesOrder"
WHERE status IN ('PENDING', 'CONFIRMED', 'PROCESSING')
ORDER BY "orderDate" ASC;
```

**Valor total de inventario:**

```sql
SELECT
    SUM(stock * cost) as total_value,
    COUNT(*) as total_products
FROM "Product"
WHERE "isActive" = true;
```

**Top productos vendidos:**

```sql
SELECT
    p.name,
    SUM(soi.quantity) as total_quantity,
    SUM(soi."totalPrice") as total_revenue
FROM "SalesOrderItem" soi
JOIN "Product" p ON soi."productId" = p.id
GROUP BY p.id, p.name
ORDER BY total_revenue DESC
LIMIT 10;
```

## Diagrama Entidad-Relación (ERD)

```
┌─────────────────────┐
│       User          │
│─────────────────────│
│ PK id               │
│    email (unique)   │
│    password         │
│    firstName        │
│    lastName         │
│    role             │
│    isActive         │
└─────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│     Customer        │         │      Supplier       │
│─────────────────────│         │─────────────────────│
│ PK id               │         │ PK id               │
│    name             │         │    name             │
│    email (unique)   │         │    email (unique)   │
│    phone            │         │    phone            │
│    address          │         │    address          │
│    city             │         │    city             │
│    country          │         │    country          │
│    isActive         │         │    isActive         │
└─────────────────────┘         └─────────────────────┘
        │                                 │
        │ 1:N                             │ 1:N
        ↓                                 ↓
┌─────────────────────┐         ┌─────────────────────┐
│    SalesOrder       │         │   PurchaseOrder     │
│─────────────────────│         │─────────────────────│
│ PK id               │         │ PK id               │
│    orderNumber      │         │    orderNumber      │
│ FK customerId       │         │ FK supplierId       │
│    orderDate        │         │    orderDate        │
│    status           │         │    status           │
│    subtotal         │         │    subtotal         │
│    taxAmount        │         │    taxAmount        │
│    totalAmount      │         │    totalAmount      │
│    deliveryDate     │         │    expectedDelivery │
│    deliveredAt      │         │    receivedDate     │
└─────────────────────┘         └─────────────────────┘
        │                                 │
        │ 1:N                             │ 1:N
        ↓                                 ↓
┌─────────────────────┐         ┌─────────────────────┐
│  SalesOrderItem     │         │ PurchaseOrderItem   │
│─────────────────────│         │─────────────────────│
│ PK id               │         │ PK id               │
│ FK salesOrderId     │         │ FK purchaseOrderId  │
│ FK productId        │─┐       │ FK productId        │─┐
│    quantity         │ │       │    quantity         │ │
│    unitPrice        │ │       │    unitPrice        │ │
│    totalPrice       │ │       │    totalPrice       │ │
└─────────────────────┘ │       └─────────────────────┘ │
                        │                               │
                        │       ┌─────────────────────┐ │
                        │       │      Product        │ │
                        │       │─────────────────────│ │
                        └──────→│ PK id               │←┘
                                │    name             │
                                │    sku (unique)     │
                                │    description      │
                                │    price            │
                                │    cost             │
                                │    stock            │
                                │    minStock         │
                                │    category         │
                                │    isActive         │
                                └─────────────────────┘
                                        │
                                        │ 1:N
                                        ↓
                                ┌─────────────────────┐
                                │   StockMovement     │
                                │─────────────────────│
                                │ PK id               │
                                │ FK productId        │
                                │    type             │
                                │    quantity         │
                                │    previousStock    │
                                │    newStock         │
                                │    reason           │
                                │    reference        │
                                │    createdAt        │
                                └─────────────────────┘
```

## Conclusión

Este esquema de base de datos proporciona una estructura robusta y escalable para el Sistema ERP, con:

- Integridad referencial completa
- Índices optimizados para consultas frecuentes
- Auditoría automática con timestamps
- Soft delete para preservar historial
- Validaciones a nivel de base de datos
- Relaciones bien definidas entre módulos
