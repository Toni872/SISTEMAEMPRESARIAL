# 🎨 Guía de Integración Webflow + ERP

## ✅ Backend Creado

He creado el módulo de integración Webflow en tu ERP. Ahora tienes estas APIs disponibles:

### **Endpoints REST:**

```
GET  /api/webflow/products              # Listar productos
POST /api/webflow/order                 # Crear orden
POST /api/webflow/validate-cart         # Validar carrito
GET  /api/webflow/order/:id/status      # Estado de orden
POST /api/webflow/webhook/order         # Webhook de Webflow
```

### **Queries GraphQL:**

```graphql
query WebflowProducts {
  webflowProducts(skip: 0, take: 100) {
    id
    name
    description
    sku
    price
    stock
    category
  }
}

mutation CreateWebflowOrder {
  createWebflowOrder(order: {
    items: [...]
    customer: {...}
    totalAmount: 1000
  }) {
    orderNumber
    status
    totalAmount
    estimatedDelivery
  }
}
```

---

## 🎨 Ahora en Webflow: Tu Tarea de Diseño

Visita tu sitio: <https://sistema-erp-94dc85.design.webflow.com/>

### **Paso 1: Configurar Collection (CMS)**

1. En Webflow, ve a **CMS Collections**
2. Crea una nueva collection llamada **"Products"**
3. Agrega estos campos:
   - `title` (Text)
   - `sku` (Text)
   - `price` (Number)
   - `description` (Plain Text, multi-line)
   - `stock` (Number)
   - `category` (Text)
   - `image` (Image)

### **Paso 2: Página de Catálogo**

1. Crea una página llamada **"Shop"** o **"Catálogo"**
2. Inserta un **CMS List** con la collection Products
3. Arma tarjetas con:
   - Imagen del producto
   - Nombre
   - Precio
   - Botón "Ver detalles"
4. Aplica estilos con el editor visual

### **Paso 3: Página de Detalle de Producto**

1. Crea una página dinámica usando **Dynamic Template**
2. Muestra:
   - Galería de imágenes
   - Nombre, precio, SKU
   - Descripción
   - Selector de cantidad
   - Botón "Agregar al carrito" o "Solicitar cotización"

### **Paso 4: Conexión con API**

Ahora viene la parte técnica. Necesitas agregar JavaScript personalizado en Webflow:

#### **A) Cargar Productos desde tu ERP**

En la página de Catálogo, agrega este código en **Settings > Custom Code > Before </body> tag**:

```html
<script>
async function loadProductsFromERP() {
  try {
    const response = await fetch('http://localhost:3001/api/webflow/products');
    const products = await response.json();
    
    console.log('Productos cargados:', products);
    
    // Aquí debes mapear los productos a tu CMS collection
    // O mostrarlos directamente con JavaScript
    
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', loadProductsFromERP);
</script>
```

#### **B) Validar Stock en Tiempo Real**

En la página de Detalle de Producto:

```html
<script>
async function checkStock(sku) {
  const response = await fetch(`http://localhost:3001/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetProductStock($sku: String!) {
          webflowProductBySku(sku: $sku) {
            stock
          }
        }
      `,
      variables: { sku }
    })
  });
  
  const data = await response.json();
  const stock = data.data.webflowProductBySku?.stock || 0;
  
  return stock;
}

// Mostrar stock disponible
checkStock('LAP-ENT-004').then(stock => {
  document.getElementById('stock-display').textContent = 
    stock > 0 ? `En stock: ${stock}` : 'Sin stock';
});
</script>
```

#### **C) Crear Orden (Checkout)**

Para el formulario de checkout:

```html
<script>
async function createOrder(orderData) {
  const response = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation CreateOrder($order: WebflowOrderInput!) {
          createWebflowOrder(order: $order) {
            orderNumber
            status
            totalAmount
            estimatedDelivery
            message
          }
        }
      `,
      variables: {
        order: orderData
      }
    })
  });
  
  const result = await response.json();
  return result.data.createWebflowOrder;
}

// Ejemplo de uso al hacer submit del formulario
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const orderData = {
    items: [
      {
        productId: 1,
        sku: 'LAP-ENT-004',
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200
      }
    ],
    customer: {
      email: document.getElementById('email').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      phone: document.getElementById('phone').value
    },
    subtotal: 1200,
    taxAmount: 0,
    totalAmount: 1200,
    source: 'WEBFLOW'
  };
  
  const order = await createOrder(orderData);
  alert(`Orden creada: ${order.orderNumber}`);
  
  // Redirigir a página de confirmación
  window.location.href = `/thank-you?order=${order.orderNumber}`;
});
</script>
```

---

## 🎨 Diseño Sugerido para Webflow

### **Homepage:**

```
┌─────────────────────────────────────────┐
│        HERO SECTION                      │
│  "Sistema ERP Empresarial"               │
│  Botón CTA: "Ver Catálogo"              │
├─────────────────────────────────────────┤
│        PRODUCTOS DESTACADOS              │
│  Grid de 3-6 productos                  │
│  (Conectar con API)                     │
├─────────────────────────────────────────┤
│        BENEFICIOS / FEATURES             │
│  • Inventario en tiempo real            │
│  • Entrega rápida                       │
│  • Soporte 24/7                         │
├─────────────────────────────────────────┤
│        TESTIMONIOS                       │
│  "Excelente servicio" - Cliente X       │
└─────────────────────────────────────────┘
```

### **Página de Catálogo:**

```
┌─────────────────────────────────────────┐
│        HEADER                            │
│  Título: "Nuestros Productos"           │
├─────────────────────────────────────────┤
│  [Filtros: Categoría, Precio, Stock]   │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐               │
│  │     │ │     │ │     │               │
│  │ IMG │ │ IMG │ │ IMG │  (Grid)       │
│  │     │ │     │ │     │               │
│  │TXT  │ │TXT  │ │TXT  │               │
│  │€100 │ │€500 │ │€200 │               │
│  └─────┘ └─────┘ └─────┘               │
├─────────────────────────────────────────┤
│        PAGINACIÓN                        │
└─────────────────────────────────────────┘
```

---

## 🧪 Prueba la Integración

1. **Probar API:**

```bash
curl http://localhost:3001/api/webflow/products
```

2. **Ver en GraphQL Playground:**
<http://localhost:3001/graphql>

Ejecuta esta query:

```graphql
query {
  webflowProducts(take: 10) {
    id
    name
    price
    stock
  }
}
```

3. **Probar crear orden:**

```bash
curl -X POST http://localhost:3001/api/webflow/order \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": 1, "sku": "LAP-ENT-004", "quantity": 1, "unitPrice": 1200, "totalPrice": 1200}],
    "customer": {"email": "test@example.com", "firstName": "Test"},
    "subtotal": 1200,
    "totalAmount": 1200
  }'
```

---

## 🚀 Próximos Pasos

1. **Ahora mismo en Webflow:**
   - Diseña la estructura visual
   - Crea las collections
   - Arma las páginas

2. **Luego (con JavaScript):**
   - Conecta las APIs
   - Agrega interacciones
   - Prueba el flujo completo

3. **Producción:**
   - Cambia `localhost` por tu dominio real
   - Configura HTTPS
   - Implementa webhooks reales

---

## 📞 Ayuda

Si tienes dudas sobre cómo agregar el código en Webflow:

1. Settings de la página → Custom Code
2. Agrega en "Before </body> tag"
3. Guarda y publica

¿Quieres que te ayude con alguna parte específica del diseño o código?
