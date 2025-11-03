# 🎨 Webflow + ERP - Inicio Rápido

## ✅ Backend Listo y Funcionando

La integración Webflow con tu ERP está **operativa**. Prueba estos endpoints:

### **APIs Disponibles:**

```bash
# 1. Ver productos en stock
GET http://localhost:3001/api/webflow/products

# 2. Crear orden
POST http://localhost:3001/api/webflow/order
{
  "items": [
    {
      "productId": 8,
      "sku": "LAP-ENT-004",
      "quantity": 1,
      "unitPrice": 1200,
      "totalPrice": 1200
    }
  ],
  "customer": {
    "email": "cliente@example.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  },
  "subtotal": 1200,
  "taxAmount": 0,
  "totalAmount": 1200,
  "source": "WEBFLOW"
}

# 3. Validar carrito
POST http://localhost:3001/api/webflow/validate-cart
{
  [
    { "sku": "LAP-ENT-004", "quantity": 1 }
  ]
}

# 4. Estado de orden
GET http://localhost:3001/api/webflow/order/{orderNumber}/status
```

---

## 🎨 Ahora en Webflow

### **Paso 1: Crear Collection "Products"**

1. Ve a **CMS Collections** en Webflow
2. Click **"Add New Collection"**
3. Nombre: **"Products"**
4. Agrega estos campos:
   - `name` (Text) - Nombre del producto
   - `sku` (Text) - SKU/Código
   - `price` (Number) - Precio
   - `description` (Plain Text, multi-line) - Descripción
   - `stock` (Number) - Stock disponible
   - `category` (Text) - Categoría
   - `image` (Image) - Imagen principal
   - `product_id` (Number) - ID del ERP

### **Paso 2: Crear Landing Page**

Usa el **visual editor** de Webflow para diseñar:

**Hero Section:**

- Título: "Sistema ERP Empresarial"
- Subtítulo: "Gestión completa de tu negocio"
- CTA: Botón "Ver Catálogo" → link a /shop

**Sección Productos Destacados:**

- Headline: "Nuestros Productos"
- Grid de 4 productos
- Usa un **CMS List** con la collection Products

**Footer:**

- Links, contacto, redes sociales

### **Paso 3: Página de Catálogo (/shop)**

1. Crea página **"Shop"**
2. Agrega **"CMS List"**
3. Collection: **Products**
4. Diseña tarjetas:

   ```
   ┌─────────────┐
   │   [IMAGE]   │
   │             │
   │   {name}    │
   │   €{price}  │
   │   [Ver →]   │
   └─────────────┘
   ```

### **Paso 4: Cargar Productos desde ERP**

En la página de **Shop**, Settings → **Custom Code → Before </body>**:

```html
<script>
// Conectar con tu ERP
const ERP_API = 'http://localhost:3001/api/webflow/products';

async function loadProductsFromERP() {
  try {
    console.log('Cargando productos desde ERP...');
    
    const response = await fetch(ERP_API);
    const products = await response.json();
    
    console.log('Productos recibidos:', products);
    
    // Aquí puedes mostrar los productos con JavaScript
    // O mapearlos a tu CMS collection manualmente
    
    displayProducts(products);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayProducts(products) {
  // Ejemplo: Mostrar en consola
  products.forEach(product => {
    console.log(`${product.name} - €${product.price} - Stock: ${product.stock}`);
  });
  
  // TODO: Insertar en el DOM de Webflow
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', loadProductsFromERP);
</script>
```

### **Paso 5: Formulario de Pedido**

Crea un formulario con:

- Nombre, apellido, email
- Producto, cantidad
- Botón "Solicitar Cotización"

Script del formulario:

```html
<script>
document.getElementById('order-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    items: [
      {
        productId: 8,  // LAP-ENT-004
        sku: 'LAP-ENT-004',
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200
      }
    ],
    customer: {
      email: document.getElementById('email').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value
    },
    subtotal: 1200,
    totalAmount: 1200,
    source: 'WEBFLOW'
  };
  
  try {
    const response = await fetch('http://localhost:3001/api/webflow/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    alert(`✅ Orden creada: ${result.orderNumber}`);
    
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error creando orden');
  }
});
</script>
```

---

## 🧪 Probar Todo

### **1. Probar API desde navegador:**

```
Abre: http://localhost:3001/api/webflow/products
```

### **2. Probar en GraphQL Playground:**

```
Abre: http://localhost:3001/graphql

Query:
query {
  webflowProducts(take: 5) {
    id
    name
    price
    stock
  }
}
```

### **3. Probar crear orden:**

```bash
curl -X POST http://localhost:3001/api/webflow/order \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": 8, "sku": "LAP-ENT-004", "quantity": 1, "unitPrice": 1200, "totalPrice": 1200}],
    "customer": {"email": "test@test.com", "firstName": "Test"},
    "subtotal": 1200,
    "totalAmount": 1200
  }'
```

---

## 📚 Recursos Webflow

1. **Webflow University**: <https://university.webflow.com/>
2. **Templates**: <https://webflow.com/templates>
3. **Made in Webflow**: <https://webflow.com/made-in-webflow>

---

## 🎯 Próximos Pasos

1. **Diseña tu landing** en Webflow (visual, sin código)
2. **Agrega el JavaScript** para conectar con APIs
3. **Prueba el flujo** end-to-end
4. **Publica** cuando esté listo

¿Necesitas ayuda con alguna parte del diseño o código?
