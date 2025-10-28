# API Reference - Sistema ERP

## Visión General

Esta documentación proporciona una referencia completa de todos los endpoints GraphQL disponibles en el Sistema ERP. La API está organizada en 6 módulos principales, cada uno con sus respectivos queries y mutations.

## Convenciones de la API

### Estructura de Request

Todas las requests GraphQL se envían como POST a:

```
POST http://localhost:3000/graphql
Content-Type: application/json
```

### Autenticación

La mayoría de endpoints requieren autenticación mediante token JWT en el header:

```
Authorization: Bearer <token>
```

Los únicos endpoints públicos son:

- login
- register

### Paginación

Los endpoints que retornan listas implementan paginación mediante los parámetros:

- `skip`: Número de registros a omitir (default: 0)
- `take`: Número de registros a retornar (default: 10, máximo: 100)

### Filtros

Los endpoints de listado soportan filtros opcionales:

- `search`: Búsqueda de texto en campos relevantes
- `category`: Filtro por categoría (cuando aplica)
- `status`: Filtro por estado (cuando aplica)
- `role`: Filtro por rol de usuario (cuando aplica)
- `isActive`: Filtro por estado activo/inactivo

## Módulo de Autenticación

### Mutations

#### login

Autentica un usuario y retorna un token JWT.

**Permisos:** Público

**Input:**

```graphql
input LoginInput {
  email: String!
  password: String!
}
```

**Output:**

```graphql
type AuthResponse {
  accessToken: String!
  user: User!
}
```

**Ejemplo:**

```graphql
mutation Login {
  login(loginInput: {
    email: "admin@erp.com"
    password: "admin123"
  }) {
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

#### register

Registra un nuevo usuario en el sistema.

**Permisos:** Público (en desarrollo) / ADMIN (en producción)

**Input:**

```graphql
input RegisterInput {
  email: String!
  password: String!
  firstName: String
  lastName: String
  role: Role
}
```

**Output:**

```graphql
type AuthResponse {
  accessToken: String!
  user: User!
}
```

**Ejemplo:**

```graphql
mutation Register {
  register(registerInput: {
    email: "newuser@erp.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
    role: USER
  }) {
    accessToken
    user {
      id
      email
      role
    }
  }
}
```

#### changePassword

Permite al usuario autenticado cambiar su contraseña.

**Permisos:** Usuario autenticado

**Input:**

```graphql
input ChangePasswordInput {
  oldPassword: String!
  newPassword: String!
}
```

**Output:**

```graphql
type User {
  id: Int!
  email: String!
}
```

**Ejemplo:**

```graphql
mutation ChangePassword {
  changePassword(changePasswordInput: {
    oldPassword: "oldpass123"
    newPassword: "newpass123"
  }) {
    id
    email
  }
}
```

### Queries

#### me

Retorna la información del usuario autenticado actualmente.

**Permisos:** Usuario autenticado

**Output:**

```graphql
type User {
  id: Int!
  email: String!
  firstName: String
  lastName: String
  role: Role!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Ejemplo:**

```graphql
query Me {
  me {
    id
    email
    firstName
    lastName
    role
    isActive
  }
}
```

## Módulo de Productos

### Queries

#### products

Retorna una lista paginada de productos con filtros opcionales.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `skip`: Int (default: 0)
- `take`: Int (default: 10)
- `search`: String (opcional)
- `category`: String (opcional)

**Output:**

```graphql
type Product {
  id: Int!
  name: String!
  sku: String!
  description: String
  price: Float!
  cost: Float!
  stock: Int!
  minStock: Int!
  category: String
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Ejemplo:**

```graphql
query GetProducts {
  products(skip: 0, take: 20, search: "laptop", category: "Tecnología") {
    id
    name
    sku
    price
    stock
    minStock
  }
}
```

#### product

Retorna un producto específico por ID.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `id`: Int!

**Output:** Product

**Ejemplo:**

```graphql
query GetProduct {
  product(id: 1) {
    id
    name
    sku
    description
    price
    cost
    stock
  }
}
```

#### productBySku

Retorna un producto específico por SKU.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `sku`: String!

**Output:** Product

**Ejemplo:**

```graphql
query GetProductBySku {
  productBySku(sku: "LAP-ENT-001") {
    id
    name
    price
    stock
  }
}
```

#### lowStockProducts

Retorna productos donde el stock es menor o igual al stock mínimo.

**Permisos:** ADMIN, MANAGER, USER

**Output:** [Product!]!

**Ejemplo:**

```graphql
query LowStockProducts {
  lowStockProducts {
    id
    name
    sku
    stock
    minStock
  }
}
```

### Mutations

#### createProduct

Crea un nuevo producto en el sistema.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input CreateProductInput {
  name: String!
  sku: String!
  description: String
  price: Float!
  cost: Float!
  stock: Int!
  minStock: Int!
  category: String
}
```

**Output:** Product

**Ejemplo:**

```graphql
mutation CreateProduct {
  createProduct(createProductInput: {
    name: "Dell XPS 15"
    sku: "LAP-DELL-001"
    description: "Laptop empresarial de alta gama"
    price: 1500.00
    cost: 1100.00
    stock: 25
    minStock: 5
    category: "Laptops"
  }) {
    id
    name
    sku
    price
  }
}
```

#### updateProduct

Actualiza un producto existente.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input UpdateProductInput {
  id: Int!
  name: String
  sku: String
  description: String
  price: Float
  cost: Float
  stock: Int
  minStock: Int
  category: String
  isActive: Boolean
}
```

**Output:** Product

**Ejemplo:**

```graphql
mutation UpdateProduct {
  updateProduct(updateProductInput: {
    id: 1
    price: 1600.00
    stock: 30
  }) {
    id
    name
    price
    stock
  }
}
```

#### removeProduct

Elimina un producto del sistema.

**Permisos:** ADMIN

**Parámetros:**

- `id`: Int!

**Output:** Product

**Ejemplo:**

```graphql
mutation DeleteProduct {
  removeProduct(id: 5) {
    id
    name
  }
}
```

## Módulo de Ventas

### Queries - Customers

#### customers

Retorna lista paginada de clientes.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `skip`: Int (default: 0)
- `take`: Int (default: 10)
- `search`: String (opcional)

**Output:**

```graphql
type Customer {
  id: Int!
  name: String!
  email: String
  phone: String
  address: String
  city: String
  country: String
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Ejemplo:**

```graphql
query GetCustomers {
  customers(skip: 0, take: 20, search: "tech") {
    id
    name
    email
    phone
    city
  }
}
```

#### customer

Retorna un cliente específico por ID.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `id`: Int!

**Output:** Customer

### Queries - Sales Orders

#### salesOrders

Retorna lista paginada de órdenes de venta.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `skip`: Int (default: 0)
- `take`: Int (default: 10)
- `status`: OrderStatus (opcional)

**Output:**

```graphql
type SalesOrder {
  id: Int!
  orderNumber: String!
  customerId: Int!
  customerName: String!
  userId: Int!
  userName: String!
  status: OrderStatus!
  subtotal: Float!
  taxAmount: Float!
  totalAmount: Float!
  notes: String
  orderDate: DateTime!
  deliveryDate: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  items: [SalesOrderItem!]!
}
```

**Ejemplo:**

```graphql
query GetSalesOrders {
  salesOrders(skip: 0, take: 10, status: PENDING) {
    id
    orderNumber
    customerName
    status
    totalAmount
    orderDate
    items {
      productName
      quantity
      unitPrice
      totalPrice
    }
  }
}
```

#### salesOrder

Retorna una orden de venta específica por ID.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `id`: Int!

**Output:** SalesOrder

### Mutations - Customers

#### createCustomer

Crea un nuevo cliente.

**Permisos:** ADMIN, MANAGER, USER

**Input:**

```graphql
input CreateCustomerInput {
  name: String!
  email: String
  phone: String
  address: String
  city: String
  country: String
}
```

**Output:** Customer

#### updateCustomer

Actualiza un cliente existente.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input UpdateCustomerInput {
  id: Int!
  name: String
  email: String
  phone: String
  address: String
  city: String
  country: String
  isActive: Boolean
}
```

**Output:** Customer

#### removeCustomer

Elimina un cliente.

**Permisos:** ADMIN

**Parámetros:**

- `id`: Int!

**Output:** Customer

### Mutations - Sales Orders

#### createSalesOrder

Crea una nueva orden de venta.

**Permisos:** ADMIN, MANAGER, USER

**Input:**

```graphql
input CreateSalesOrderInput {
  customerId: Int!
  notes: String
  deliveryDate: String
  items: [CreateSalesOrderItemInput!]!
}

input CreateSalesOrderItemInput {
  productId: Int!
  quantity: Int!
  unitPrice: Float!
}
```

**Output:** SalesOrder

**Nota:** El sistema calcula automáticamente:

- `subtotal`: Suma de (quantity × unitPrice)
- `taxAmount`: subtotal × 0.16 (IVA del 16%)
- `totalAmount`: subtotal + taxAmount
- `orderNumber`: Formato "SO-YYYY-XXXXX"

**Ejemplo:**

```graphql
mutation CreateSalesOrder {
  createSalesOrder(createSalesOrderInput: {
    customerId: 1
    notes: "Entrega urgente"
    deliveryDate: "2025-10-15"
    items: [
      {
        productId: 1
        quantity: 5
        unitPrice: 1200.00
      },
      {
        productId: 3
        quantity: 10
        unitPrice: 25.50
      }
    ]
  }) {
    id
    orderNumber
    customerName
    status
    subtotal
    taxAmount
    totalAmount
  }
}
```

#### updateSalesOrder

Actualiza una orden de venta existente.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input UpdateSalesOrderInput {
  id: Int!
  status: OrderStatus
  notes: String
  deliveryDate: String
}
```

**Output:** SalesOrder

#### cancelSalesOrder

Cancela una orden de venta.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `id`: Int!

**Output:** SalesOrder

**Nota:** Cambia el estado a CANCELLED.

## Módulo de Compras

### Queries - Suppliers

#### suppliers

Retorna lista paginada de proveedores.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `skip`: Int (default: 0)
- `take`: Int (default: 10)
- `search`: String (opcional)

**Output:**

```graphql
type Supplier {
  id: Int!
  name: String!
  email: String
  phone: String
  address: String
  city: String
  country: String
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### supplier

Retorna un proveedor específico por ID.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `id`: Int!

**Output:** Supplier

### Queries - Purchase Orders

#### purchaseOrders

Retorna lista paginada de órdenes de compra.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `skip`: Int (default: 0)
- `take`: Int (default: 10)
- `status`: PurchaseOrderStatus (opcional)

**Output:**

```graphql
type PurchaseOrder {
  id: Int!
  orderNumber: String!
  supplierId: Int!
  supplierName: String!
  userId: Int!
  userName: String!
  status: PurchaseOrderStatus!
  subtotal: Float!
  taxAmount: Float!
  totalAmount: Float!
  notes: String
  orderDate: DateTime!
  expectedDate: DateTime
  receivedDate: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  items: [PurchaseOrderItem!]!
}
```

#### purchaseOrder

Retorna una orden de compra específica por ID.

**Permisos:** ADMIN, MANAGER, USER

**Parámetros:**

- `id`: Int!

**Output:** PurchaseOrder

### Mutations - Suppliers

#### createSupplier

Crea un nuevo proveedor.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input CreateSupplierInput {
  name: String!
  email: String
  phone: String
  address: String
  city: String
  country: String
}
```

**Output:** Supplier

#### updateSupplier

Actualiza un proveedor existente.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input UpdateSupplierInput {
  id: Int!
  name: String
  email: String
  phone: String
  address: String
  city: String
  country: String
  isActive: Boolean
}
```

**Output:** Supplier

#### removeSupplier

Elimina un proveedor.

**Permisos:** ADMIN

**Parámetros:**

- `id`: Int!

**Output:** Supplier

### Mutations - Purchase Orders

#### createPurchaseOrder

Crea una nueva orden de compra.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input CreatePurchaseOrderInput {
  supplierId: Int!
  notes: String
  expectedDeliveryDate: String
  items: [CreatePurchaseOrderItemInput!]!
}

input CreatePurchaseOrderItemInput {
  productId: Int!
  quantity: Int!
  unitPrice: Float!
}
```

**Output:** PurchaseOrder

**Nota:** El sistema calcula automáticamente subtotal, taxAmount y totalAmount.

#### updatePurchaseOrder

Actualiza una orden de compra existente.

**Permisos:** ADMIN, MANAGER

**Input:**

```graphql
input UpdatePurchaseOrderInput {
  id: Int!
  status: PurchaseOrderStatus
  notes: String
  expectedDate: String
}
```

**Output:** PurchaseOrder

#### receivePurchaseOrder

Marca una orden de compra como recibida y actualiza el stock de productos.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `id`: Int!

**Output:** PurchaseOrder

**Nota Importante:** Esta operación:

1. Cambia el estado a RECEIVED
2. Incrementa el stock de cada producto según las cantidades de la orden
3. Crea registros en StockMovement con tipo 'IN'
4. Registra la fecha de recepción

**Ejemplo:**

```graphql
mutation ReceivePurchaseOrder {
  receivePurchaseOrder(id: 1) {
    id
    orderNumber
    status
    receivedDate
  }
}
```

#### cancelPurchaseOrder

Cancela una orden de compra.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `id`: Int!

**Output:** PurchaseOrder

## Módulo de Usuarios

### Queries

#### users

Retorna lista paginada de usuarios del sistema.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `skip`: Int (default: 0)
- `take`: Int (default: 10)
- `search`: String (opcional)
- `role`: Role (opcional)
- `isActive`: Boolean (opcional)

**Output:**

```graphql
type User {
  id: Int!
  email: String!
  firstName: String
  lastName: String
  role: Role!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Nota:** El campo password nunca es retornado por seguridad.

#### user

Retorna un usuario específico por ID.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `id`: Int!

**Output:** User

#### userStats

Retorna estadísticas de usuarios del sistema.

**Permisos:** ADMIN, MANAGER

**Output:**

```graphql
type UserStats {
  totalUsers: Int!
  activeUsers: Int!
  adminUsers: Int!
  managerUsers: Int!
  regularUsers: Int!
}
```

**Ejemplo:**

```graphql
query GetUserStats {
  userStats {
    totalUsers
    activeUsers
    adminUsers
    managerUsers
    regularUsers
  }
}
```

### Mutations

#### createUser

Crea un nuevo usuario en el sistema.

**Permisos:** ADMIN

**Input:**

```graphql
input CreateUserInput {
  email: String!
  password: String!
  firstName: String
  lastName: String
  role: Role!
}
```

**Output:** User

#### updateUser

Actualiza un usuario existente.

**Permisos:** ADMIN

**Input:**

```graphql
input UpdateUserInput {
  id: Int!
  email: String
  firstName: String
  lastName: String
  role: Role
}
```

**Output:** User

**Nota:** Esta mutation no permite cambiar la contraseña. Usar changeUserPassword para eso.

#### changeUserPassword

Permite a un administrador cambiar la contraseña de cualquier usuario.

**Permisos:** ADMIN

**Input:**

```graphql
input ChangeUserPasswordInput {
  id: Int!
  newPassword: String!
}
```

**Output:** User

#### activateUser

Activa un usuario desactivado.

**Permisos:** ADMIN

**Parámetros:**

- `id`: Int!

**Output:** User

**Nota:** Cambia isActive a true.

#### deactivateUser

Desactiva un usuario. El usuario no podrá iniciar sesión.

**Permisos:** ADMIN

**Parámetros:**

- `id`: Int!

**Output:** User

**Nota:** Cambia isActive a false.

#### removeUser

Elimina permanentemente un usuario del sistema.

**Permisos:** ADMIN

**Parámetros:**

- `id`: Int!

**Output:** User

**Advertencia:** Esta operación es irreversible.

## Módulo de Contabilidad

### Queries

#### financialSummary

Retorna un resumen financiero del sistema para un rango de fechas.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `startDate`: String! (formato: YYYY-MM-DD)
- `endDate`: String! (formato: YYYY-MM-DD)

**Output:**

```graphql
type FinancialSummary {
  totalSales: Float!
  totalPurchases: Float!
  netProfit: Float!
  profitMargin: Float!
  totalOrders: Int!
  pendingOrders: Int!
}
```

**Ejemplo:**

```graphql
query FinancialSummary {
  financialSummary(
    startDate: "2025-01-01"
    endDate: "2025-12-31"
  ) {
    totalSales
    totalPurchases
    netProfit
    profitMargin
    totalOrders
    pendingOrders
  }
}
```

**Cálculos:**

- netProfit = totalSales - totalPurchases
- profitMargin = (netProfit / totalSales) × 100

#### monthlySales

Retorna las ventas mensuales de un año específico.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `year`: Int!

**Output:**

```graphql
type MonthlySales {
  month: String!
  total: Float!
  orderCount: Int!
}
```

**Ejemplo:**

```graphql
query MonthlySales {
  monthlySales(year: 2025) {
    month
    total
    orderCount
  }
}
```

**Nota:** Retorna datos de 12 meses.

#### topProducts

Retorna los productos más vendidos por ingresos totales.

**Permisos:** ADMIN, MANAGER

**Parámetros:**

- `limit`: Int (default: 10)

**Output:**

```graphql
type TopProduct {
  productId: Int!
  productName: String!
  totalQuantity: Int!
  totalRevenue: Float!
}
```

**Ejemplo:**

```graphql
query TopProducts {
  topProducts(limit: 10) {
    productId
    productName
    totalQuantity
    totalRevenue
  }
}
```

**Nota:** Los productos se ordenan por totalRevenue descendente.

#### inventoryValue

Retorna el valor total del inventario y estadísticas relacionadas.

**Permisos:** ADMIN, MANAGER

**Output:**

```graphql
type InventoryValue {
  totalValue: Float!
  totalProducts: Int!
  lowStockProducts: Int!
  outOfStockProducts: Int!
}
```

**Ejemplo:**

```graphql
query InventoryValue {
  inventoryValue {
    totalValue
    totalProducts
    lowStockProducts
    outOfStockProducts
  }
}
```

**Cálculos:**

- totalValue = Σ(stock × cost) para todos los productos activos
- lowStockProducts = Productos donde stock ≤ minStock
- outOfStockProducts = Productos donde stock = 0

## Tipos de Datos Enumerados

### Role

Roles de usuario disponibles en el sistema.

```graphql
enum Role {
  ADMIN
  MANAGER
  USER
  READONLY
}
```

### OrderStatus

Estados posibles para órdenes de venta.

```graphql
enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### PurchaseOrderStatus

Estados posibles para órdenes de compra.

```graphql
enum PurchaseOrderStatus {
  PENDING
  APPROVED
  ORDERED
  RECEIVED
  CANCELLED
}
```

### StockMovementType

Tipos de movimientos de inventario.

```graphql
enum StockMovementType {
  IN      # Entrada de stock
  OUT     # Salida de stock
  ADJUSTMENT  # Ajuste de inventario
}
```

## Códigos de Error

### Errores de Autenticación

- `UNAUTHENTICATED`: Usuario no autenticado (código 401)
- `UNAUTHORIZED`: Usuario sin permisos suficientes (código 403)
- `INVALID_CREDENTIALS`: Credenciales inválidas en login

### Errores de Validación

- `BAD_USER_INPUT`: Datos de entrada inválidos (código 400)
- `VALIDATION_ERROR`: Error de validación de campos

### Errores de Recursos

- `NOT_FOUND`: Recurso no encontrado (código 404)
- `ALREADY_EXISTS`: Recurso ya existe (por ejemplo, SKU duplicado)

### Errores del Servidor

- `INTERNAL_SERVER_ERROR`: Error interno del servidor (código 500)

## Mejores Prácticas

### Paginación

Siempre use paginación para consultas de listado:

```graphql
query GetProducts {
  products(skip: 0, take: 20) {
    id
    name
  }
}
```

### Selección de Campos

Solo solicite los campos que necesita:

```graphql
# Bueno - Solo campos necesarios
query GetProducts {
  products {
    id
    name
    price
  }
}

# Evitar - Solicitar todos los campos innecesariamente
query GetProducts {
  products {
    id
    name
    sku
    description
    price
    cost
    stock
    minStock
    category
    isActive
    createdAt
    updatedAt
  }
}
```

### Manejo de Errores

Siempre verifique el campo `errors` en la respuesta:

```javascript
const response = await client.query({ query: GET_PRODUCTS });

if (response.errors) {
  // Manejar errores
  console.error('GraphQL Errors:', response.errors);
} else {
  // Procesar datos
  const products = response.data.products;
}
```

### Caché

Los queries son cacheables. Las mutations invalidan la caché relacionada.

## Limitaciones y Consideraciones

### Límites de Rate

El sistema implementa rate limiting:

- Máximo 100 requests por minuto por usuario autenticado
- Máximo 20 requests por minuto para endpoints públicos

### Tamaño de Payload

- Máximo 1MB por request
- Máximo 100 items por operación batch

### Concurrencia

El sistema maneja concurrencia mediante:

- Transacciones de base de datos para operaciones críticas
- Optimistic locking para prevenir conflictos

## Versionado

Versión actual de la API: **1.0.0**

El versionado sigue [Semantic Versioning](https://semver.org/):

- Major: Cambios incompatibles
- Minor: Nueva funcionalidad compatible
- Patch: Correcciones de bugs

## Soporte

Para reportar problemas con la API:

1. Verificar la documentación
2. Revisar los mensajes de error retornados
3. Consultar los logs del servidor
4. Contactar al equipo de desarrollo con los detalles completos del request
