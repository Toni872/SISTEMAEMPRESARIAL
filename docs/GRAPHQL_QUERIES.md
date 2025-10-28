# 🚀 Queries y Mutations de GraphQL - Sistema ERP

## 📦 **Productos (Products)**

### Obtener todos los productos

```graphql
query GetAllProducts {
  products {
    id
    sku
    name
    description
    price
    cost
    stock
    minStock
    maxStock
    category
    unit
    barcode
    imageUrl
    isActive
    createdAt
    updatedAt
  }
}
```

### Obtener un producto por ID

```graphql
query GetProductById {
  product(id: 1) {
    id
    sku
    name
    description
    price
    cost
    stock
    category
    supplier {
      id
      name
      contactEmail
    }
  }
}
```

### Crear un nuevo producto

```graphql
mutation CreateProduct {
  createProduct(
    createProductInput: {
      sku: "PROD-006"
      name: "Nuevo Producto Test"
      description: "Producto creado desde GraphQL"
      price: 150.00
      cost: 100.00
      stock: 50
      minStock: 10
      maxStock: 200
      category: "Electrónica"
      unit: "unidad"
      supplierId: 1
      isActive: true
    }
  ) {
    id
    sku
    name
    price
    stock
    createdAt
  }
}
```

### Actualizar un producto

```graphql
mutation UpdateProduct {
  updateProduct(
    id: 1
    updateProductInput: {
      price: 199.99
      stock: 75
    }
  ) {
    id
    name
    price
    stock
    updatedAt
  }
}
```

### Eliminar un producto

```graphql
mutation DeleteProduct {
  deleteProduct(id: 6) {
    id
    name
  }
}
```

### Buscar productos con bajo stock

```graphql
query GetLowStockProducts {
  lowStockProducts {
    id
    sku
    name
    stock
    minStock
    category
  }
}
```

## 🛒 **Ventas (Sales)**

### Obtener todas las órdenes de venta

```graphql
query GetAllSalesOrders {
  salesOrders {
    id
    orderNumber
    status
    totalAmount
    customer {
      id
      name
      email
    }
    items {
      id
      quantity
      unitPrice
      subtotal
      product {
        name
        sku
      }
    }
    createdAt
  }
}
```

### Crear orden de venta

```graphql
mutation CreateSalesOrder {
  createSalesOrder(
    createSalesOrderInput: {
      customerId: 1
      status: "pending"
      items: [
        {
          productId: 1
          quantity: 2
          unitPrice: 299.99
        }
        {
          productId: 2
          quantity: 1
          unitPrice: 199.99
        }
      ]
    }
  ) {
    id
    orderNumber
    totalAmount
    status
    items {
      quantity
      unitPrice
      subtotal
      product {
        name
      }
    }
  }
}
```

## 📥 **Compras (Purchase)**

### Obtener todas las órdenes de compra

```graphql
query GetAllPurchaseOrders {
  purchaseOrders {
    id
    orderNumber
    status
    totalAmount
    supplier {
      id
      name
      contactEmail
    }
    items {
      quantity
      unitPrice
      subtotal
      product {
        name
        sku
      }
    }
    createdAt
  }
}
```

## 👥 **Usuarios (Users)**

### Obtener todos los usuarios

```graphql
query GetAllUsers {
  users {
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

### Crear usuario

```graphql
mutation CreateUser {
  createUser(
    createUserInput: {
      email: "nuevo@ejemplo.com"
      password: "Password123!"
      firstName: "Nuevo"
      lastName: "Usuario"
      role: "user"
    }
  ) {
    id
    email
    firstName
    lastName
    role
  }
}
```

## 🏢 **Clientes (Customers)**

### Obtener todos los clientes

```graphql
query GetAllCustomers {
  customers {
    id
    name
    email
    phone
    address
    taxId
    creditLimit
    currentBalance
    isActive
    salesOrders {
      id
      orderNumber
      totalAmount
    }
  }
}
```

## 🏭 **Proveedores (Suppliers)**

### Obtener todos los proveedores

```graphql
query GetAllSuppliers {
  suppliers {
    id
    name
    contactEmail
    contactPhone
    address
    taxId
    paymentTerms
    isActive
    products {
      id
      name
      sku
    }
  }
}
```

## 📊 **Queries Complejas**

### Dashboard con estadísticas

```graphql
query DashboardStats {
  products {
    id
  }
  lowStockProducts {
    id
    name
    stock
    minStock
  }
  salesOrders {
    id
    totalAmount
    status
  }
  customers {
    id
    currentBalance
  }
}
```

### Reporte de ventas por cliente

```graphql
query SalesReportByCustomer {
  customers {
    id
    name
    email
    currentBalance
    salesOrders {
      id
      orderNumber
      totalAmount
      status
      createdAt
      items {
        quantity
        unitPrice
        product {
          name
        }
      }
    }
  }
}
```

## 🔐 **Autenticación**

### Login (cuando esté implementado)

```graphql
mutation Login {
  login(
    loginInput: {
      email: "admin@erp.com"
      password: "Admin123!"
    }
  ) {
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

## 💡 **Tips de Uso:**

1. **Introspección**: GraphQL Playground tiene autocompletado. Presiona `Ctrl+Space` para ver opciones.
2. **Documentación**: Haz clic en "DOCS" o "SCHEMA" en el panel derecho para ver la documentación completa.
3. **Variables**: Usa variables para queries dinámicas en el panel inferior.
4. **Múltiples queries**: Puedes tener múltiples queries en pestañas diferentes.

## 🎯 **Queries Recomendadas para Probar Ahora:**

1. Obtener todos los productos (ya hay 5 de prueba)
2. Buscar productos con bajo stock
3. Ver las órdenes de venta existentes
4. Crear un nuevo producto
5. Ver estadísticas del dashboard
