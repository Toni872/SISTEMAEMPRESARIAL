# 🌐 Integración Webflow E-commerce + ERP Sistema

## 📋 Resumen Ejecutivo

Conectar tu **tienda Webflow** (frontend público) con tu **ERP Sistema** (backend privado) para crear un flujo completo de e-commerce B2B/B2C.

---

## 🏗️ Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────┐
│                    E-COMMERCE PÚBLICO                       │
│                   (Webflow Visual Editor)                   │
│                                                             │
│  • Landing page moderna y visual                            │
│  • Catálogo de productos con filtros                        │
│  • Carrito de compras                                       │
│  • Checkout y pagos                                         │
│  • Área de cliente (mi cuenta)                              │
├─────────────────────────────────────────────────────────────┤
│                      API BRIDGE                             │
│              (REST/GraphQL Integration)                     │
├─────────────────────────────────────────────────────────────┤
│                    ERP BACKEND PRIVADO                      │
│              (Este sistema NestJS/GraphQL)                  │
│                                                             │
│  • Inventario en tiempo real                                │
│  • Gestión de órdenes B2B                                  │
│  • Facturación automática                                   │
│  • Gestión de clientes                                      │
│  • Reportes y analytics                                     │
│  • Logística y envíos                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Casos de Uso: Qué Hacer con Webflow

### **1. Landing Page Corporativa Premium**
```
Propósito: Generar leads y mostrar tu empresa profesionalmente

Incluye:
✓ Hero section con valor propuesto
✓ Sección de servicios/productos destacados
✓ Portfolio de proyectos
✓ Testimonios de clientes
✓ Formulario de contacto/lead generation
✓ Integración con CRM (capturar emails)
```

**Conectado al ERP:**
- Leads → Se guardan en `Customer` table
- Formularios → Se sincronizan con módulo de Ventas
- Solicitudes → Generan automáticamente `SalesOrder` potenciales

---

### **2. E-commerce B2B (Business to Business)**
```
Propósito: Vender productos/servicios a otras empresas

Características:
✓ Catálogo con precios por volumen
✓ Descuentos por clientes registrados
✓ Cotizaciones personalizadas
✓ Órdenes grandes con aprobación
✓ Facturación a 30/60 días
```

**Flujo de Integración:**

```
1. Cliente en Webflow:
   → Navega catálogo (datos desde ERP GraphQL API)
   → Agrega productos al carrito
   → Solicita cotización personalizada

2. Webflow → API Bridge:
   → POST /api/webflow/cart-data
   → Envía: { products: [...], customerId, totalAmount }

3. ERP Procesa:
   → Crea SalesOrder con status "QUOTE_REQUEST"
   → Asigna a vendedor
   → Notifica por email

4. Vendedor en ERP:
   → Revisa cotización
   → Ajusta precios/descuentos
   → Aprueba/Rechaza

5. Cliente recibe:
   → Email con cotización personalizada
   → Link para aprobar y pagar
```

---

### **3. E-commerce B2C (Business to Consumer)**
```
Propósito: Vender productos directamente al consumidor final

Características:
✓ Catálogo optimizado para búsqueda
✓ Carrito persistente
✓ Checkout rápido
✓ Pagos con tarjeta/Stripe/PayPal
✓ Seguimiento de pedidos
```

**Flujo de Integración:**

```
1. Cliente en Webflow:
   → Browse productos
   → Agrega al carrito
   → Checkout (Stripe/Webflow Payments)

2. Webflow Webhooks:
   → order.completed → POST /api/webflow/orders
   → Envía: { orderId, items, customer, total }

3. ERP Automatiza:
   → Crea SalesOrder "CONFIRMED"
   → Genera SalesInvoice
   → Descuenta stock automáticamente
   → Dispara Shipment si es físico

4. Cliente recibe:
   → Email de confirmación
   → Invoice PDF
   → Tracking de envío
```

---

### **4. Portal de Clientes B2B**
```
Propósito: Dashboard privado para clientes empresariales

Secciones:
✓ Historial de pedidos
✓ Estado de facturas
✓ Descargar facturas PDF
✓ Solicitar RMA/Devoluciones
✓ Gestión de cuentas corrient
✓ Nuevos pedidos

Frontend: Webflow (visual hermoso)
Backend: Este ERP (datos reales)
```

---

### **5. Marketplace Multi-Vendor**
```
Propósito: Plataforma donde múltiples vendedores venden

Características:
✓ Multi-tenancy
✓ Cada vendor tiene su catálogo
✓ Comisiones automáticas
✓ Reportes por vendor

Webflow: Muestra productos de TODOS los vendors
ERP: Separa inventario, ventas y comisiones por vendor
```

---

## 🔌 APIs que Necesitas Desarrollar

### **GraphQL Endpoints para Webflow:**

```graphql
# 1. Catálogo de productos públicos
query WebflowProducts {
  products(isActive: true, skip: 0, take: 100) {
    id
    name
    description
    price
    sku
    category
    stock
    images
  }
}

# 2. Stock en tiempo real
query ProductStock($sku: String!) {
  productBySku(sku: $sku) {
    stock
    minStock
  }
}

# 3. Crear orden desde Webflow
mutation CreateOrderFromWebflow($order: WebflowOrderInput!) {
  createWebflowOrder(order: $order) {
    orderNumber
    status
    totalAmount
    estimatedDelivery
  }
}

# 4. Validar cupones/descuentos
query ValidateCoupon($code: String!) {
  validateCoupon(code: $code) {
    valid
    discountPercent
    discountAmount
  }
}

# 5. Tracking de envío
query OrderTracking($orderNumber: String!) {
  orderByNumber(orderNumber: $orderNumber) {
    status
    trackingNumber
    estimatedDelivery
    shippingCarrier
  }
}
```

---

### **REST Endpoints Adicionales:**

```bash
# Webhooks desde Webflow
POST /api/webflow/webhook/order-created
POST /api/webflow/webhook/order-updated
POST /api/webflow/webhook/payment-processed
POST /api/webflow/webhook/order-cancelled

# Sincronización bidireccional
GET  /api/webflow/sync/products     # Sincronizar productos
POST /api/webflow/sync/inventory    # Actualizar stock
GET  /api/webflow/customers/:id     # Info de cliente
```

---

## 📦 Módulos ERP a Crear/Ampliar

### **1. Módulo Webflow Integration** (Nuevo)
```typescript
backend/src/modules/webflow/
├── webflow.service.ts          # Lógica de sincronización
├── webflow.resolver.ts         # GraphQL resolvers
├── webflow.controller.ts       # REST endpoints para webhooks
├── webflow.webhook.handler.ts  # Procesar eventos Webflow
└── dto/webflow.dto.ts          # DTOs de integración
```

**Funcionalidades:**
- Sincronizar productos ER → Webflow
- Recibir webhooks de nuevas órdenes
- Actualizar stock en tiempo real
- Generar facturas automáticamente
- Enviar confirmaciones de envío

---

### **2. Módulo E-commerce Settings** (Nuevo)
```typescript
backend/src/modules/ecommerce/
├── ecommerce.service.ts
├── coupons.service.ts          # Gestión de cupones
├── shipping.service.ts         # Cálculo de envíos
├── pricing.service.ts          # Reglas de precios (B2B/B2C)
└── dto/
    ├── coupon.dto.ts
    ├── shipping.dto.ts
    └── pricing.dto.ts
```

---

### **3. Ampliar Módulo Ventas**
```typescript
# Agregar campos para e-commerce
model SalesOrder {
  // ... campos existentes
  source            String?    // 'WEBFLOW', 'MANUAL', 'API'
  webflowOrderId    String?    @unique
  shippingAddress   Json?      // Dirección de envío detallada
  shippingMethod    String?    // 'standard', 'express', 'free'
  shippingCarrier   String?    // 'DHL', 'Fedex', etc
  trackingNumber    String?
  
  // Campos B2B
  approvedBy        Int?
  approvedAt        DateTime?
  terms             String?    // Términos de pago
}
```

---

## 🎨 Diseño de Webflow - Secciones Sugeridas

### **Homepage:**
1. Hero con CTA principal
2. Productos destacados (top 6 del ERP)
3. Testimonios de clientes
4. CTA secundario
5. Footer con links

### **Catálogo de Productos:**
1. Filtros: categoría, precio, stock
2. Grid responsive
3. Tarjetas con imagen, nombre, precio, "Ver detalles"
4. Paginación

### **Detalle de Producto:**
1. Galería de imágenes
2. Nombre, precio, SKU
3. Descripción rica
4. Stock available (vivo desde ERP)
5. Botón "Agregar al carrito" o "Solicitar cotización" (según B2B/B2C)

### **Checkout:**
1. Resumen del carrito
2. Información de envío
3. Método de pago
4. Resumen final
5. Confirmación

---

## 🔄 Sincronización Bidireccional

### **ERP → Webflow (Productos):**
```typescript
// Cron job cada 15 minutos
@Cron('*/15 * * * *')
async syncProductsToWebflow() {
  const products = await this.prisma.product.findMany({
    where: { isActive: true }
  });
  
  // Actualizar stock, precios, descripciones
  for (const product of products) {
    await this.webflowService.updateProduct(product);
  }
}
```

### **Webflow → ERP (Órdenes):**
```typescript
// Webhook handler
@Post('/webhook/order-created')
async handleOrderCreated(@Body() webflowOrder: WebflowOrderDto) {
  // Convertir orden Webflow a formato ERP
  const salesOrder = this.mapWebflowToEROrder(webflowOrder);
  
  // Crear en ERP
  const order = await this.salesService.createOrder(salesOrder);
  
  // Descontar inventario
  await this.inventoryService.updateStock(order.items);
  
  // Enviar confirmación
  await this.notificationService.sendOrderConfirmation(order);
}
```

---

## 💰 Modelos de Negocio

### **B2B: Cotizaciones Personalizadas**
```
Cliente navega → Agrega productos → "Solicitar Cotización"
ERP genera → Vendedor ajusta → Cliente aprueba → Pago
```

### **B2C: Checkout Directo**
```
Cliente navega → Agrega productos → Checkout → Pago → Confirmación
ERP: Automa todo (orden, invoice, shipping)
```

### **Híbrido:**
```
Productos "retail" → Checkout directo
Productos "enterprise" → Solicitud de cotización
```

---

## 📊 Métricas y Analytics

### **Dashboard Webflow Integration:**
```typescript
KPIs:
- Órdenes generadas desde Webflow hoy
- Conversión Webflow vs manual
- Productos más visitados
- Tiempo medio de checkout
- Abandono de carrito
- Revenue por source
```

---

## 🚀 Plan de Implementación

### **Fase 1: MVP (2 semanas)**
- [ ] API básica de productos públicos
- [ ] Webhook para recibir órdenes
- [ ] Crear órdenes en ERP automáticamente
- [ ] Landing page simple en Webflow

### **Fase 2: Catálogo Completo (1 semana)**
- [ ] Grid de productos con filtros
- [ ] Detalle de producto
- [ ] Sincronización de stock en tiempo real
- [ ] Carrrito persistente

### **Fase 3: Checkout (2 semanas)**
- [ ] Checkout flow completo
- [ ] Integración con Stripe/PayPal
- [ ] Confirmaciones automáticas
- [ ] Tracking básico

### **Fase 4: Portal Cliente (2 semanas)**
- [ ] Área de cliente
- [ ] Historial de pedidos
- [ ] Descarga de facturas PDF
- [ ] Re-pedidos rápidos

### **Fase 5: Avanzado (3 semanas)**
- [ ] Cupones y descuentos
- [ ] Precios B2B personalizados
- [ ] Multi-shipping
- [ ] Marketplace si aplica

---

## 💡 Ejemplos de Éxito

**Patrones similares:**
- Shopify Plus + ERP interno
- WooCommerce + SAP
- Magento + Oracle NetSuite

**Tu caso:**
- Webflow (visual, SEO, hosted) + ERP NestJS (control total)

---

## 🎯 Recomendación Inicial

**Empieza con un proyecto pequeño:**

1. **Landing page en Webflow** (1 semana)
   - Hero, productos destacados, contacto
   - Integra formulario → CRM en ERP

2. **Catálogo básico** (1 semana)
   - Grid de productos desde API
   - Detalle de producto

3. **Webhook simple** (1 semana)
   - Recibe órdenes manuales
   - Crea en ERP

**Luego evalúa:**
- ¿Cuántas órdenes generas?
- ¿Funciona el flujo?
- ¿Vale la pena el checkout automático?

---

## 🛠️ Próximos Pasos

1. Diseña landing en Webflow
2. Conecto API de productos
3. Test de webhook
4. Mides resultados
5. Decides si expandes o pivotas

---

¿Quieres que empiece con algún módulo específico? Por ejemplo:
- Crear el módulo `webflow.service.ts` 
- Diseñar la API de productos públicos
- Configurar webhooks básicos


