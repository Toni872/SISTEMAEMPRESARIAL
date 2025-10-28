# 🏢 Sistema ERP Empresarial

Sistema de gestión empresarial completo desarrollado con las últimas tecnologías. Integra gestión de ventas, compras, inventario, usuarios y reportes avanzados con análisis predictivo.

## 🚀 Características Principales

- **Landing Page Premium**: Diseño moderno con Material-UI y gradientes profesionales
- **Dashboard Ejecutivo**: Visualización de métricas clave en tiempo real
- **Gestión de Ventas**: Órdenes, facturas y clientes
- **Gestión de Compras**: Proveedores y órdenes de compra
- **Control de Inventario**: Productos con stock y alertas
- **Gestión de Usuarios**: Roles y permisos (ADMIN, MANAGER, USER)
- **Reportes Avanzados**: Analytics integrados con gráficos
- **API GraphQL**: Backend moderno con NestJS

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript**
- **Material-UI v5** (Diseño premium Apple-style)
- **Apollo Client** (GraphQL)
- **Zustand** (Estado global)
- **Vite** (Build tool)

### Backend
- **NestJS 10**
- **GraphQL** (Apollo Server)
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** (Reverse proxy)

## 📦 Instalación y Uso

### Prerrequisitos
- Docker y Docker Compose instalados
- Git

### Inicio Rápido

1. **Clonar el repositorio**
```bash
git clone https://github.com/Toni872/SISTEMAEMPRESARIAL.git
cd SISTEMAEMPRESARIAL
```

2. **Iniciar el proyecto con Docker**
```bash
docker-compose up -d
```

3. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- GraphQL Playground: http://localhost:3001/graphql
- Swagger: http://localhost:3001/api

### Credenciales de Acceso

```
Email: admin@erp.com
Password: admin123
```

## 📁 Estructura del Proyecto

```
sistemaempresarial/
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── pages/         # Páginas principales
│   │   ├── components/     # Componentes reutilizables
│   │   ├── store/          # Gestión de estado
│   │   └── lib/            # Utilidades y configuraciones
│   └── public/             # Assets estáticos
├── backend/                # API NestJS
│   ├── src/
│   │   ├── modules/       # Módulos del sistema
│   │   └── schema.gql     # Schema GraphQL
│   └── prisma/            # Base de datos
└── docker-compose.yml     # Configuración Docker
```

## 🎨 Capturas de Pantalla

### Landing Page
- Diseño premium con gradientes modernos
- Responsive y optimizado
- Botón de acceso directo

### Dashboard
- Métricas en tiempo real
- Gráficos interactivos
- Status de módulos

### Gestión de Ventas
- Órdenes de venta
- Facturación
- Gestión de clientes

## 🧪 Endpoints Principales

### GraphQL
```graphql
# Login
mutation Login {
  login(loginInput: { email: "admin@erp.com", password: "admin123" }) {
    accessToken
    user { id email firstName lastName role }
  }
}

# Obtener productos
query GetProducts {
  products { id name price stock }
}

# Dashboard
query GetDashboard {
  dashboard { totalSales totalOrders recentOrders }
}
```

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
docker-compose down
docker-compose up -d --build
```

### Error de base de datos
```bash
cd backend
npx prisma migrate dev
npm run seed
```

### Limpiar contenedores
```bash
docker-compose down -v
docker-compose up -d --build
```

## 📝 Notas de Desarrollo

- El proyecto usa puerto 3001 para el backend (no 3000)
- La autenticación JWT es requerida para todas las queries GraphQL
- Los datos de seed se crean automáticamente al iniciar

## 👥 Colaboradores

Desarrollado con ❤️ para gestión empresarial eficiente.

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 🚀 Para Compartir con Compañeros

Comparte este README y el link del repositorio:
https://github.com/Toni872/SISTEMAEMPRESARIAL

Para que vean el proyecto, simplemente:
1. Clonen el repo
2. Ejecuten `docker-compose up -d`
3. Abran http://localhost:5173
4. Login con las credenciales indicadas arriba

¡Listo para explorar! 🎉

