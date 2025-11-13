# 🏢 Sistema ERP Empresarial

> Sistema integral de gestión empresarial con arquitectura moderna full-stack, diseñado para optimizar operaciones y decisiones de negocio en tiempo real con IA integrada.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📸 Vista Previa

<div align="center">

### 🏠 Landing Page - Página de Inicio Profesional
![Landing Page](./screenshots/landing.png)

### 📊 Dashboard Principal - Métricas en Tiempo Real
![Dashboard](./screenshots/dashboard.png)

### 💼 Módulo de Ventas - Gestión Completa de Órdenes
![Ventas](./screenshots/sales.png)

### 📦 Control de Inventario - Productos y Stock
![Inventario](./screenshots/inventory.png)

### 🤖 Motor de IA - Predictive Analytics
![IA Engine](./screenshots/ai-engine.png)

### 🔐 Login - Autenticación Segura
![Login](./screenshots/login.png)

</div>

**🔗 Demo en vivo:** [https://frontend-next-m6ceik81r-toni872s-projects.vercel.app](https://frontend-next-m6ceik81r-toni872s-projects.vercel.app)

> **Nota para recruiters:** Este proyecto demuestra competencia end-to-end en desarrollo full-stack, desde diseño de base de datos con 24+ tablas hasta implementación de UI moderna, integrando IA predictiva, WebSockets en tiempo real y las mejores prácticas de la industria.

---

## 🎯 Descripción del Proyecto

Sistema ERP completo diseñado para empresas que necesitan centralizar y automatizar sus operaciones. Construido con arquitectura escalable y tecnologías modernas, el sistema integra gestión de ventas, compras, inventario, usuarios, análisis predictivo con IA y automatización avanzada.

**Problema que resuelve:** Las empresas pequeñas y medianas necesitan sistemas de gestión accesibles pero potentes. Este ERP ofrece funcionalidades enterprise con IA integrada, análisis en tiempo real y automatización inteligente de procesos a un costo de desarrollo moderno.

### ✨ Características Principales

#### 🎨 Frontend Premium (Next.js 14)
- **Landing Page Moderna:** Diseño profesional inspirado en Holded con gradientes purple-blue
- **Dashboard Ejecutivo:** Visualización de KPIs en tiempo real con gráficos interactivos usando Recharts
- **24 Módulos Integrados:** Dashboard, Productos, Ventas, Compras, Usuarios, Reportes, IA, Logística, Automatización, Mobile, y 15 módulos ejecutivos más
- **Experiencia de Usuario:** Interfaz intuitiva, responsive y optimizada con shadcn/ui + Tailwind CSS v4
- **Estado Global:** Gestión eficiente con Zustand y TanStack Query para performance óptima
- **Animaciones Fluidas:** Transiciones suaves con Framer Motion y micro-interacciones
- **Tema Oscuro:** Diseño moderno con modo oscuro permanente optimizado

#### 🤖 Motor de IA Integrado
- **Predicción de Demanda:** Modelos ML para predecir necesidades de stock
- **Optimización de Precios:** Algoritmos de pricing dinámico basados en datos históricos
- **Métricas en Tiempo Real:** WebSockets para streaming de métricas de IA
- **32 Modelos Activos:** Gestión completa de modelos de ML con monitoreo
- **Integración Python:** Servicio FastAPI dedicado para modelos avanzados

#### 🔧 Backend Robusto
- **API GraphQL:** Consultas flexibles y eficientes con Apollo Server
- **Arquitectura Modular:** 10+ módulos organizados por dominio de negocio
- **Autenticación Segura:** JWT con refresh tokens y control granular de roles (ADMIN, MANAGER, USER, READONLY)
- **ORM Moderno:** Prisma para migraciones type-safe y queries optimizadas
- **WebSockets:** Comunicación bidireccional en tiempo real
- **Redis:** Caché y sesiones distribuidas

#### 📊 Módulos de Negocio

**📈 Ventas**
- Gestión de órdenes de venta y facturación completa
- CRM con historial de clientes y seguimiento
- Estados avanzados (pendiente, procesado, completado, cancelado)
- Órdenes pendientes con alertas

**🛒 Compras**
- Control de proveedores y órdenes de compra
- Gestión de relaciones con proveedores
- Histórico de transacciones con filtros avanzados
- Facturas de compra con seguimiento

**📦 Inventario**
- Control de stock en tiempo real
- Alertas de stock bajo configurables
- Categorización de productos (físicos, software, servicios)
- Movimientos de stock con auditoría
- Filtros avanzados y búsqueda inteligente

**👥 Usuarios y Permisos**
- Sistema de roles granular (RBAC) con 4 niveles
- Gestión de equipos y accesos
- Auditoría completa de acciones
- Activación/desactivación de usuarios
- Validación de permisos en frontend y backend

**📊 Reportes y Analytics**
- Gráficos interactivos con Recharts
- Datos en tiempo real con WebSockets
- Exportación de reportes (próximamente)
- Métricas de negocio personalizables
- Dashboard predictivo con IA

**🤖 Motor de IA**
- Predicción de demanda con ML
- Optimización de precios dinámica
- Monitoreo de modelos en tiempo real
- Integración con servicio Python FastAPI
- Streaming de métricas con Socket.IO

**🚚 Logística Inteligente**
- Gestión de rutas y entregas
- Optimización de rutas con IA
- Control de flotas y vehículos
- Seguimiento GPS
- Estado de drivers y pedidos

**⚙️ Centro de Automatización**
- Automatizaciones personalizadas
- Bots y scripts programables
- Flujos RPA (Robotic Process Automation)
- Monitoreo de ejecuciones

**📱 Operaciones Móviles**
- Gestión de agentes móviles
- Pedidos en campo
- Inventario móvil con sincronización offline
- Estado de batería y conectividad GPS

**🌐 Integración Webflow**
- API REST pública para productos
- Creación de órdenes desde sitios web externos
- Validación de carrito en tiempo real
- Webhooks configurables
- E-commerce sin límites

#### 🔒 Seguridad y Compliance
- Autenticación JWT con expiración configurable
- Hash de contraseñas con bcrypt
- Guards y decoradores para protección de rutas
- Rate limiting para prevenir abuso
- CORS configurable
- Auditoría completa de acciones

---

## 🛠️ Stack Tecnológico

### Frontend (Next.js 14)
| Tecnología | Uso | Versión |
|------------|-----|---------|
| **Next.js 14** | Framework SSR/SSG | 16.0 |
| **React 18** | UI Library | 18.2 |
| **TypeScript** | Type safety | 5.3 |
| **shadcn/ui** | Component library | Latest |
| **Tailwind CSS** | Styling | v4 |
| **Framer Motion** | Animations | 12.23 |
| **TanStack Query** | Server state | 5.90 |
| **Zustand** | Client state | 5.0 |
| **Recharts** | Data visualization | 2.10 |
| **Lucide Icons** | Icons | Latest |

### Backend
| Tecnología | Uso | Versión |
|------------|-----|---------|
| **NestJS** | Framework backend | 10.3 |
| **GraphQL** | API layer | Apollo Server 4 |
| **Prisma** | ORM | 5.8 |
| **PostgreSQL** | Database | 15+ |
| **JWT** | Authentication | 10.2 |
| **Socket.IO** | WebSockets | 4.8 |
| **Redis** | Caché/Sesiones | 7 |
| **TypeScript** | Type safety | 5.3 |
| **Winston** | Logging | 3.18 |

### IA y Machine Learning
| Tecnología | Uso | Versión |
|------------|-----|---------|
| **Python 3.11** | ML Framework | 3.11 |
| **FastAPI** | API REST | - |
| **NumPy** | Computación numérica | - |
| **Pandas** | Data processing | - |
| **scikit-learn** | Machine Learning | - |

### DevOps & Infrastructure
| Tecnología | Uso |
|------------|-----|
| **Docker** | Containerization |
| **Docker Compose** | Orchestration |
| **Vercel** | Frontend hosting |
| **PostgreSQL** | Database |
| **Redis** | Cache/Sessions |
| **Git** | Version control |

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Docker y Docker Compose (opcional)
- Git
- Puerto 3001 (frontend-next) y 3000 (backend) disponibles

### Inicio Rápido

#### Frontend (Next.js)
```bash
# 1. Navegar al directorio frontend-next
cd frontend-next

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3001
```

#### Backend (NestJS)
```bash
# 1. Navegar al directorio backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Configurar base de datos
npx prisma generate
npx prisma migrate dev

# 5. Ejecutar en desarrollo
npm run start:dev

# 6. Acceder a GraphQL Playground
# http://localhost:3000/graphql
```

### Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Toni872/SISTEMAEMPRESARIAL.git
cd SISTEMAEMPRESARIAL

# 2. Levantar todos los servicios con Docker
docker-compose up -d

# 3. Esperar ~30 segundos a que los servicios inicien
# Verificar con:
docker-compose ps

# 4. Acceder a la aplicación
```

**URLs:**
- 🌐 **Frontend:** http://localhost:3001
- 🔧 **Backend API:** http://localhost:3000
- 📊 **GraphQL Playground:** http://localhost:3000/graphql
- 🤖 **AI Service:** http://localhost:8000
- 📚 **pgAdmin:** http://localhost:8080
- 💾 **Redis:** localhost:6379

### Credenciales de Acceso

```
Email: admin@erp.com
Password: admin123
```

**Roles disponibles:**
- **ADMIN:** Acceso completo + gestión de usuarios
- **MANAGER:** Acceso a reportes y analíticas
- **USER:** Operaciones básicas
- **READONLY:** Solo lectura

> **Nota:** Las credenciales por defecto se crean automáticamente al iniciar. Datos de prueba incluidos para explorar todas las funcionalidades.

---

## 📁 Estructura del Proyecto

```
SISTEMAEMPRESARIAL/
│
├── frontend-next/              # Aplicación Next.js 14
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/    # Rutas protegidas
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── sales/
│   │   │   │   ├── purchases/
│   │   │   │   ├── users/
│   │   │   │   ├── reports/
│   │   │   │   └── [18 módulos ejecutivos]/
│   │   │   ├── landing/        # Landing page
│   │   │   ├── login/          # Autenticación
│   │   │   ├── register/
│   │   │   └── layout.tsx      # Layout principal
│   │   ├── components/
│   │   │   ├── ui/             # Componentes shadcn/ui
│   │   │   ├── sidebar.tsx    # Navegación lateral
│   │   │   ├── navbar.tsx     # Barra superior
│   │   │   └── auth-guard.tsx # Protección de rutas
│   │   └── lib/
│   │       ├── auth-store.ts   # Estado de autenticación
│   │       ├── mock-data.ts    # Datos de prueba
│   │       └── utils.ts        # Utilidades
│   ├── public/                 # Assets estáticos
│   └── package.json
│
├── backend/                     # API NestJS
│   ├── src/
│   │   ├── modules/            # 10+ módulos del sistema
│   │   │   ├── auth/          # Autenticación JWT
│   │   │   ├── users/         # Gestión de usuarios
│   │   │   ├── inventory/     # Productos e inventario
│   │   │   ├── sales/         # Ventas y órdenes
│   │   │   ├── purchase/      # Compras y proveedores
│   │   │   ├── dashboard/     # Analytics y reportes
│   │   │   ├── accounting/    # Finanzas
│   │   │   ├── ai/            # Integración IA
│   │   │   ├── setup/         # Configuración inicial
│   │   │   └── webflow/       # Integración Webflow
│   │   ├── common/            # Servicios compartidos
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── middleware/
│   │   ├── schema.gql          # Schema GraphQL generado
│   │   └── main.ts             # Entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de datos (24+ tablas)
│   │   ├── migrations/         # Migraciones de BD
│   │   └── seed.ts             # Datos de prueba
│   └── package.json
│
├── ai_service/                  # Servicio IA (Python/FastAPI)
│   ├── app/
│   │   ├── models/
│   │   │   ├── demand_predictor.py
│   │   │   └── price_optimizer.py
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml           # Orquestación de servicios
├── .env.example                 # Variables de entorno
├── README.md
└── screenshots/                 # Capturas del sistema
```

---

## 🔐 Variables de Entorno

Crear archivo `.env` en el directorio `backend/`:

```env
# Database
DATABASE_URL="postgresql://postgres:erp_password@postgres:5432/erp_db"

# Redis
REDIS_URL="redis://redis:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="1d"

# App
NODE_ENV="development"
PORT=3000
LOG_LEVEL="info"

# Throttling
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Frontend URL (para CORS)
FRONTEND_URL="http://localhost:3001"

# AI Service
AI_SERVICE_URL="http://ai-service:8000"
```

---

## 📊 Casos de Uso

### 1. Dashboard Ejecutivo
```graphql
query GetDashboard {
  dashboardMetrics {
    totalSales
    totalOrders
    totalProducts
    activeUsers
  }
  recentActivities(limit: 10) {
    items {
      action
      entity
      timestamp
    }
  }
  performanceData(period: "month") {
    date
    sales
    orders
  }
}
```

### 2. Gestión de Productos
```graphql
# Crear producto
mutation CreateProduct {
  createProduct(input: {
    name: "Laptop HP"
    description: "Laptop empresarial"
    price: 899.99
    stock: 50
    category: "ELECTRONICS"
  }) {
    id
    name
    sku
    price
    stock
  }
}

# Listar productos con stock bajo
query LowStockProducts {
  inventoryValue {
    lowStockProducts
    outOfStockProducts
    totalValue
  }
}
```

### 3. Predicción de Demanda con IA
```graphql
# Predecir demanda
query PredictDemand {
  predictDemand(productId: 1, days: 30) {
    predictedDemand
    confidence
    recommendations
    chartData {
      date
      predicted
      historical
    }
  }
}

# Optimizar precio
query OptimizePrice {
  optimizePrice(productId: 1, currentPrice: 299.99, stock: 50) {
    optimalPrice
    expectedRevenue
    conversionRate
  }
}
```

### 4. Sistema de Ventas
```graphql
# Crear orden de venta
mutation CreateSaleOrder {
  createSaleOrder(input: {
    customerId: 1
    items: [
      { productId: 1, quantity: 2, unitPrice: 899.99 }
    ]
    subtotal: 1799.98
    taxAmount: 359.99
    totalAmount: 2159.97
  }) {
    id
    orderNumber
    status
    totalAmount
  }
}

# Obtener facturas pendientes
query PendingInvoices {
  salesInvoices(where: { status: PENDING }) {
    invoiceNumber
    customer {
      name
    }
    total
    dueDate
    outstandingAmount
  }
}
```

---

## 🧪 Testing y Desarrollo

### Desarrollo Local

**Frontend:**
```bash
cd frontend-next
npm install
npm run dev
# http://localhost:3001
```

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
# http://localhost:3000/graphql
```

**AI Service:**
```bash
cd ai_service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Comandos Útiles

```bash
# Reiniciar todos los servicios
docker-compose restart

# Ver logs en tiempo real
docker-compose logs -f [service_name]

# Ejecutar migraciones de BD
cd backend
npx prisma migrate dev

# Generar Prisma Client
npx prisma generate

# Abrir Prisma Studio
npx prisma studio

# Resetear base de datos (¡CUIDADO!)
docker-compose down -v
docker-compose up -d

# Rebuild específico
docker-compose build --no-cache [service_name]
docker-compose up -d [service_name]
```

---

## 🚧 Roadmap

### ✅ Completado
- [x] Arquitectura base con NestJS y Next.js 14
- [x] Sistema de autenticación JWT completo
- [x] CRUD completo para todos los módulos (24+ tablas)
- [x] Dashboard con métricas en tiempo real
- [x] Diseño responsive con shadcn/ui + Tailwind CSS v4
- [x] Dockerización completa
- [x] 24 módulos funcionales implementados (6 core + 18 ejecutivos)
- [x] Motor de IA con predicción y optimización
- [x] WebSockets para streaming en tiempo real
- [x] Integración Webflow para e-commerce
- [x] Sistema de roles granular (RBAC)
- [x] Landing page profesional
- [x] Deploy en Vercel

### 🔄 En Progreso
- [ ] Tests unitarios y E2E
- [ ] Documentación de API completa con Swagger
- [ ] Integración completa frontend-backend

### 📋 Próximas Features
- [ ] Exportar reportes a PDF/Excel
- [ ] Sistema de notificaciones push
- [ ] Integración con servicios de pago (Stripe)
- [ ] App móvil (React Native)
- [ ] Integración con APIs externas (contabilidad, facturación)
- [ ] Multi-idioma (i18n)
- [ ] Reportes personalizados con builder
- [ ] Integración con WhatsApp Business API

---

## 🎓 Aprendizajes y Decisiones Técnicas

### ¿Por qué Next.js 14?
- **SSR/SSG:** Mejor SEO y performance inicial
- **App Router:** Arquitectura moderna y escalable
- **Server Components:** Menor bundle size y mejor UX
- **Optimizaciones:** Image optimization, code splitting automático
- **Vercel:** Deploy sin configuración adicional

### ¿Por qué shadcn/ui?
- **Copiable:** Control total del código fuente
- **Customizable:** Fácil personalización sin dependencias
- **Accesible:** Basado en Radix UI (WCAG 2.1)
- **Moderno:** Diseño actualizado y profesional

### ¿Por qué GraphQL?
- **Flexibilidad:** El frontend solicita solo los datos necesarios
- **Type safety:** End-to-end con TypeScript
- **Introspección:** Documentación automática en Playground
- **Performance:** Mejor que REST en queries complejas
- **Evolución:** Agregar campos sin romper clientes

### ¿Por qué NestJS?
- **Escalabilidad:** Arquitectura modular y maintainable
- **Inyección de dependencias:** Facilita testing y reutilización
- **Ecosystem:** Excelente integración con Prisma, GraphQL, Testing
- **Productividad:** Decoradores y guards nativos
- **Enterprise-ready:** Robusto para proyectos grandes

### ¿Por qué Prisma?
- **Type safety:** Queries type-safe con TypeScript
- **Migraciones:** Control total sobre schema de BD
- **Developer Experience:** Auto-completion y validación
- **Performance:** Query engine optimizado
- **Facilidad:** Menos boilerplate que otros ORMs

---

## 🐛 Troubleshooting

### Error: Puerto ya en uso
```bash
# Cambiar puertos en docker-compose.yml
# Frontend: "3001:3001" → "3002:3001"
# Backend: "3000:3000" → "3001:3000"
```

### Error: Base de datos no conecta
```bash
# Verificar que el contenedor de PostgreSQL está corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker logs erp-postgres

# Reiniciar servicios
docker-compose restart
```

### Error: JWT inválido
```bash
# Verificar que JWT_SECRET en .env coincide en backend
# Limpiar localStorage del navegador
# Usar el botón "Clear Cache" en el Dashboard
```

### Error: AI Service no responde
```bash
# Verificar logs del servicio IA
docker logs erp-ai-service

# Reiniciar servicio IA
docker-compose restart ai-service

# El sistema tiene fallback con datos mock si el servicio no está disponible
```

### Frontend en blanco después de deploy
```bash
# Limpiar caché del navegador (Ctrl + Shift + R)
# Verificar que el build fue exitoso
npm run build
```

---

## 📝 Licencia

Este proyecto es parte de mi portfolio profesional. El código está disponible para revisión y evaluación, pero no para uso comercial sin autorización.

---

## 👨‍💻 Desarrollador

**Antonio Lloret Sánchez**  
Full Stack Developer | React • Next.js • NestJS • TypeScript • GraphQL

- 🌐 Portfolio: [Sistema ERP Empresarial](https://github.com/Toni872/SISTEMAEMPRESARIAL)
- 💼 LinkedIn: [linkedin.com/in/antonio-lloret-sánchez-080166156](https://www.linkedin.com/in/antonio-lloret-s%C3%A1nchez-080166156)
- 💻 GitHub: [@Toni872](https://github.com/Toni872)
- 📧 Email: antohachi@gmail.com

---

## 🙏 Agradecimientos

Construido con ❤️ utilizando las mejores herramientas open-source:
- React Team por el increíble framework
- Next.js Team por SSR y optimizaciones
- Nest Team por la arquitectura robusta
- Prisma por simplificar el acceso a datos
- shadcn por los componentes hermosos
- FastAPI por facilitar APIs Python
- PostgreSQL por ser la BD más confiable

---

## 📞 Contacto

¿Preguntas sobre el proyecto? ¿Interesado en colaborar?

**¡Contáctame!** Estoy abierto a oportunidades de trabajo remoto full-stack.

📧 **Email:** antohachi@gmail.com  
💼 **LinkedIn:** [www.linkedin.com/in/antonio-lloret-sánchez-080166156](https://www.linkedin.com/in/antonio-lloret-s%C3%A1nchez-080166156)  
💻 **GitHub:** [github.com/Toni872](https://github.com/Toni872)

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

[Reportar Bug](https://github.com/Toni872/SISTEMAEMPRESARIAL/issues) · [Solicitar Feature](https://github.com/Toni872/SISTEMAEMPRESARIAL/issues)

Made with ❤️ by Antonio Lloret Sánchez

</div>
