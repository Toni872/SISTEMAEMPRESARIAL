# 🔗 Enlaces del Sistema ERP

## 🌐 Interfaces Web

### 1. Frontend (Next.js)
- **URL Principal**: http://localhost:3001
- **Landing**: http://localhost:3001/landing
- **Login**: http://localhost:3001/login
- **Dashboard**: http://localhost:3001/dashboard
- **Productos**: http://localhost:3001/products
- **Ventas**: http://localhost:3001/sales
- **Test Refresh Token**: http://localhost:3001/test-refresh

### 2. Backend API (FastAPI)
- **URL Principal**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Root**: http://localhost:8000/

### 3. pgAdmin (Gestión de Base de Datos)
- **URL**: http://localhost:8080
- **Email**: admin@erp.com
- **Password**: admin123

## 📊 Base de Datos

### 1. PostgreSQL (ERP Principal)
- **Host**: localhost
- **Port**: 5432
- **Database**: erp_db
- **User**: postgres
- **Password**: erp_password
- **Connection String**: `postgresql://postgres:erp_password@localhost:5432/erp_db`

### 2. PostgreSQL (FastAPI Backend)
- **Host**: localhost
- **Port**: 5433
- **Database**: erp_fastapi_db
- **User**: postgres
- **Password**: erp_password
- **Connection String**: `postgresql://postgres:erp_password@localhost:5433/erp_fastapi_db`

## 🔧 Otros Servicios

### Redis (Caché)
- **Host**: localhost
- **Port**: 6379
- **(Sin interfaz web)**

## 📝 Credenciales de Prueba

### Frontend
- **Admin**: admin@example.com / admin1234
- **User**: user@example.com / user1234

### pgAdmin
- **Email**: admin@erp.com
- **Password**: admin123

## 🚀 Endpoints Principales del Backend

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/verify-email` - Verificar email
- `POST /api/auth/resend-verification` - Reenviar verificación

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `GET /api/products/count` - Contar productos
- `GET /api/products/low-stock` - Productos con stock bajo

### Ventas
- `GET /api/sales` - Listar ventas
- `GET /api/sales/{id}` - Obtener venta
- `POST /api/sales` - Crear venta
- `PUT /api/sales/{id}` - Actualizar venta
- `DELETE /api/sales/{id}` - Eliminar venta
- `GET /api/sales/stats` - Estadísticas de ventas

## 📋 Comandos Útiles

### Iniciar servicios
```bash
# Backend con base de datos
docker-compose -f docker-compose.backend.yml up -d

# Infraestructura completa (DB, Redis, pgAdmin)
docker-compose up -d

# Frontend
cd frontend-next && npm run dev
```

### Ver logs
```bash
# Backend
docker logs erp-backend-fastapi -f

# Base de datos
docker logs erp-postgres-fastapi -f
```

### Conectar a base de datos
```bash
# Desde terminal
psql -h localhost -p 5433 -U postgres -d erp_fastapi_db
# Password: erp_password
```

