# 🗄️ Datos de Prueba - Sistema ERP

## 📊 **Resumen de Datos Cargados**

El sistema ERP viene pre-cargado con datos de prueba para facilitar el desarrollo y testing.

### **👤 Usuarios (Users)**

| Email | Contraseña | Rol | Nombre |
|-------|-----------|-----|--------|
| <admin@erp.com> | Admin123! | admin | Admin User |

### **👥 Clientes (Customers)**

| ID | Nombre | Email | Teléfono | Límite Crédito |
|----|--------|-------|----------|----------------|
| 1 | Empresa ABC S.A. | <contacto@abc.com> | +34 123 456 789 | €50,000 |
| 2 | Distribuidora XYZ | <ventas@xyz.com> | +34 987 654 321 | €75,000 |

### **🏭 Proveedores (Suppliers)**

| ID | Nombre | Email | Teléfono | Términos de Pago |
|----|--------|-------|----------|------------------|
| 1 | Proveedor Tech Solutions | <info@techsolutions.com> | +34 111 222 333 | 30 días |
| 2 | Suministros Globales S.L. | <ventas@suministros.com> | +34 444 555 666 | 45 días |

### **📦 Productos (Products)**

| ID | SKU | Nombre | Categoría | Precio | Stock | Stock Mín | Proveedor |
|----|-----|--------|-----------|---------|-------|-----------|-----------|
| 1 | LAPTOP-001 | Laptop Dell XPS 13 | Electrónica | €1,299.99 | 15 | 5 | Tech Solutions |
| 2 | MOUSE-001 | Mouse Logitech MX Master | Accesorios | €99.99 | 50 | 10 | Tech Solutions |
| 3 | KEYBOARD-001 | Teclado Mecánico RGB | Accesorios | €149.99 | 30 | 10 | Tech Solutions |
| 4 | MONITOR-001 | Monitor LG 27" 4K | Electrónica | €399.99 | 20 | 5 | Suministros Globales |
| 5 | CHAIR-001 | Silla Ergonómica Pro | Mobiliario | €299.99 | 25 | 5 | Suministros Globales |

### **🛒 Órdenes de Venta (Sales Orders)**

| Número | Cliente | Estado | Total | Productos |
|--------|---------|--------|-------|-----------|
| SO-2024-001 | Empresa ABC S.A. | pending | €1,399.98 | 1x Laptop Dell XPS 13, 1x Mouse Logitech |

**Detalles de la orden:**

- Item 1: Laptop Dell XPS 13 - Cantidad: 1 - Precio: €1,299.99
- Item 2: Mouse Logitech MX Master - Cantidad: 1 - Precio: €99.99

### **📥 Órdenes de Compra (Purchase Orders)**

| Número | Proveedor | Estado | Total | Productos |
|--------|-----------|--------|-------|-----------|
| PO-2024-001 | Tech Solutions | pending | €13,299.90 | 10x Laptop Dell XPS 13 |

**Detalles de la orden:**

- Item 1: Laptop Dell XPS 13 - Cantidad: 10 - Costo: €1,329.99 c/u

### **📊 Movimientos de Stock (Stock Movements)**

Se han registrado movimientos automáticos de stock para:

- Entrada de 10 Laptops (Orden de compra PO-2024-001)
- Salida de 1 Laptop y 1 Mouse (Orden de venta SO-2024-001)

## 🔍 **Cómo Acceder a los Datos**

### **1. Prisma Studio** (Recomendado)

```bash
cd backend
npx prisma studio
```

Abre en: <http://localhost:5555>

**Ventajas:**

- Interfaz visual intuitiva
- Edición directa de datos
- Relaciones visualizadas
- Búsqueda y filtrado fácil

### **2. GraphQL Playground**

Accede a: <http://localhost:3000/graphql>

**Query de ejemplo para ver productos:**

```graphql
query {
  products {
    id
    sku
    name
    price
    stock
    supplier {
      name
    }
  }
}
```

### **3. PostgreSQL CLI**

```bash
docker exec -it erp-postgres psql -U erp_user -d erp_db
```

**Queries útiles:**

```sql
-- Ver todos los productos
SELECT id, sku, name, price, stock FROM "Product";

-- Ver clientes con su balance
SELECT name, email, "currentBalance", "creditLimit" FROM "Customer";

-- Ver órdenes de venta
SELECT "orderNumber", status, "totalAmount" FROM "SalesOrder";

-- Ver proveedores
SELECT name, "contactEmail", "paymentTerms" FROM "Supplier";
```

### **4. REST API**

Endpoints disponibles (requiere autenticación para algunos):

- `GET http://localhost:3000/api/products` - Listar productos
- `GET http://localhost:3000/api/products/:id` - Ver producto específico
- `GET http://localhost:3000/api/health` - Estado del servidor

## 🎯 **Escenarios de Prueba Sugeridos**

### **Escenario 1: Gestión de Productos**

1. Ver lista de productos en Prisma Studio
2. Crear un nuevo producto usando GraphQL
3. Actualizar el stock de un producto
4. Buscar productos con stock bajo

### **Escenario 2: Proceso de Venta**

1. Ver clientes disponibles
2. Crear una nueva orden de venta
3. Verificar que el stock se reduce automáticamente
4. Consultar las órdenes del cliente

### **Escenario 3: Proceso de Compra**

1. Ver proveedores disponibles
2. Crear una orden de compra
3. Verificar que el stock aumenta
4. Consultar el historial de compras

### **Escenario 4: Reportes**

1. Dashboard con estadísticas generales
2. Productos con bajo stock
3. Órdenes pendientes
4. Balance de clientes

## 🔄 **Resetear Datos de Prueba**

Si necesitas volver a cargar los datos iniciales:

```bash
cd backend

# Opción 1: Solo recargar seed
npx prisma db seed

# Opción 2: Reset completo (¡cuidado! borra todo)
npx prisma migrate reset
```

## 📝 **Notas Importantes**

1. **Contraseñas**: Todas las contraseñas están hasheadas con bcrypt
2. **Timestamps**: Todos los registros tienen `createdAt` y `updatedAt`
3. **Relaciones**: Los datos están relacionados correctamente (productos-proveedores, órdenes-clientes, etc.)
4. **Validaciones**: El seed incluye validaciones básicas
5. **Stock**: Los movimientos de stock están sincronizados con las órdenes

## 🎨 **Próximos Pasos**

1. **Explorar las relaciones** entre entidades en Prisma Studio
2. **Probar queries complejas** en GraphQL
3. **Crear nuevos registros** para entender el flujo
4. **Experimentar con actualizaciones** y eliminaciones
5. **Verificar el hot reload** modificando datos y viendo cambios en el frontend

## 🆘 **Troubleshooting**

**No veo datos en Prisma Studio:**

- Verifica que el seed se ejecutó: `npx prisma db seed`
- Revisa la conexión a la base de datos en el archivo `.env`

**Error al ejecutar queries en GraphQL:**

- Asegúrate de que el backend esté ejecutándose
- Verifica los logs del servidor backend

**Los datos no aparecen en el frontend:**

- Revisa que las APIs estén configuradas correctamente
- Abre la consola del navegador para ver errores
