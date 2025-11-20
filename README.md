# 🏢 Sistema ERP Empresarial

Sistema ERP completo desarrollado con **FastAPI** (Backend) y **Next.js 16** (Frontend) para la gestión integral de empresas españolas.

[![CI/CD](https://github.com/tuusuario/sistemaempresarial/actions/workflows/ci.yml/badge.svg)](https://github.com/tuusuario/sistemaempresarial/actions/workflows/ci.yml)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Seguridad](#-seguridad)
- [CI/CD](#-cicd)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

### 📊 Gestión de Ventas
- ✅ Gestión completa de productos
- ✅ Creación y seguimiento de ventas
- ✅ Facturación automática
- ✅ Plantillas de factura personalizables
- ✅ Facturas recurrentes programadas

### 💰 Gestión de Compras
- ✅ Gestión de proveedores
- ✅ Órdenes de compra
- ✅ Exportación a PDF y Excel
- ✅ Filtros avanzados (fecha, proveedor, estado)
- ✅ Integración con Modelo 303 (IVA soportado)

### 📑 Fiscalidad Española
- ✅ **Modelo 303** - Declaración trimestral de IVA
- ✅ **Modelo 111** - Retenciones IRPF
- ✅ Generación de PDFs profesionales
- ✅ Cálculo automático de IVA repercutido y soportado
- ✅ Integración con compras para IVA soportado

### 🛡️ Verifactu (AEAT)
- ✅ Registro de facturas conforme a normativa AEAT
- ✅ Cálculo de hash SHA-256 para integridad
- ✅ Generación de XML Facturae 3.2
- ✅ Códigos QR para verificación
- ✅ Gestión de certificados electrónicos
- ✅ Integración con servicios AEAT (preparado)

### 📈 Dashboard
- ✅ Métricas en tiempo real
- ✅ Gráficos y visualizaciones
- ✅ Resumen de ventas y compras
- ✅ Indicadores clave de negocio

---

## 🛠️ Tecnologías

### Backend
- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migraciones de base de datos
- **Pydantic** - Validación de datos
- **JWT** - Autenticación segura
- **ReportLab** - Generación de PDFs
- **OpenPyXL** - Exportación a Excel

### Frontend
- **Next.js 16** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **Zustand** - Gestión de estado
- **Radix UI** - Componentes accesibles
- **Recharts** - Gráficos y visualizaciones

### DevOps
- **Docker** - Containerización
- **GitHub Actions** - CI/CD
- **PostgreSQL** - Base de datos
- **Redis** - Caché (opcional)

---

## 🚀 Instalación

### Prerrequisitos

- **Python 3.11+**
- **Node.js 20+**
- **PostgreSQL 15+**
- **Docker** (opcional)

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/sistemaempresarial.git
cd sistemaempresarial

# Instalar dependencias del frontend
cd frontend-next
npm install

# Instalar dependencias del backend
cd ../backend
pip install -r requirements.txt

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones
```

### Con Docker

```bash
# Iniciar servicios (PostgreSQL, Redis, pgAdmin)
docker-compose up -d

# Iniciar backend
cd backend
uvicorn app.main:app --reload

# Iniciar frontend (en otra terminal)
cd frontend-next
npm run dev
```

---

## ⚙️ Configuración

### Variables de Entorno

Copia `backend/env.example` a `backend/.env` y configura:

```env
# Base de datos
DATABASE_URL=postgresql://postgres:password@localhost:5432/erp_db

# JWT
SECRET_KEY=tu-clave-secreta-min-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3001,http://localhost:3000
```

Ver `backend/env.example` para todas las opciones.

### Base de Datos

```bash
# Crear base de datos
createdb erp_db

# Ejecutar migraciones
cd backend
alembic upgrade head

# Crear usuario de prueba (opcional)
python scripts/create_test_user_fixed.py
```

---

## 💻 Uso

### Desarrollo

```bash
# Backend (puerto 8000)
cd backend
uvicorn app.main:app --reload

# Frontend (puerto 3001)
cd frontend-next
npm run dev
```

### Acceso

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Usuario de Prueba

```
Email: test@example.com
Contraseña: testpassword123
```

---

## 📁 Estructura del Proyecto

```
sistemaempresarial/
├── backend/                 # Backend FastAPI
│   ├── app/
│   │   ├── api/            # Endpoints de la API
│   │   ├── core/           # Configuración y utilidades
│   │   ├── crud/           # Operaciones de base de datos
│   │   ├── models/         # Modelos SQLAlchemy
│   │   └── utils/          # Utilidades (PDF, Verifactu, etc.)
│   ├── alembic/            # Migraciones
│   ├── scripts/            # Scripts de utilidad
│   └── requirements.txt    # Dependencias Python
│
├── frontend-next/          # Frontend Next.js
│   ├── src/
│   │   ├── app/            # Páginas y rutas
│   │   ├── components/     # Componentes React
│   │   └── lib/            # Utilidades y API client
│   └── package.json        # Dependencias Node.js
│
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│
└── README.md              # Este archivo
```

---

## 📚 API Documentation

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Información del usuario actual

#### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/{id}` - Obtener producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

#### Ventas
- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Crear venta
- `GET /api/sales/{id}` - Obtener venta

#### Compras
- `GET /api/purchases` - Listar compras
- `POST /api/purchases` - Crear compra
- `GET /api/purchases/{id}/export/pdf` - Exportar PDF
- `GET /api/purchases/export/excel` - Exportar Excel

#### Fiscalidad
- `POST /api/tax/model-303/calculate` - Calcular Modelo 303
- `POST /api/tax/model-303/generate` - Generar declaración
- `POST /api/tax/model-111/calculate` - Calcular Modelo 111
- `GET /api/tax/declarations/{id}/pdf` - Descargar PDF

#### Verifactu
- `POST /api/verifactu/sales/{id}/register` - Registrar factura
- `GET /api/verifactu/registry` - Listar registros
- `GET /api/verifactu/validate-integrity` - Validar integridad

**Documentación completa:** http://localhost:8000/docs

---

## 🔒 Seguridad

### Implementado

- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Rate Limiting** para prevenir abuso
- ✅ **CORS** configurado de forma segura
- ✅ **Security Headers** (XSS, Clickjacking, etc.)
- ✅ **Validación de inputs** con Pydantic
- ✅ **Roles y permisos** (ADMIN, MANAGER, USER, READONLY)
- ✅ **Timeout en requests** (30 segundos)

### Headers de Seguridad

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (en producción)

---

## 🔄 CI/CD

El proyecto incluye **GitHub Actions** para:

- ✅ Build automático del frontend
- ✅ Tests del backend
- ✅ Linting y validación de código
- ✅ Security scanning con Trivy
- ✅ Dependency checking
- ✅ Verificación de builds

Ver `.github/workflows/ci.yml` para más detalles.

---

## 🧪 Testing

```bash
# Backend
cd backend
pytest tests/ -v

# Frontend
cd frontend-next
npm run lint
npm run build
```

---

## 📖 Documentación Adicional

- [Análisis Completo del Proyecto](./ANALISIS_COMPLETO_PROYECTO.md)
- [Resumen de Correcciones](./RESUMEN_CORRECCIONES_APLICADAS.md)
- [Guía de Prueba - Compras](./GUIA_PRUEBA_COMPRAS.md)
- [Configuración Verifactu](./VERIFACTU_CONFIGURACION.md)
- [Roadmap](./ROADMAP_SIGUIENTE_PASO.md)

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 👤 Autor

**Antonio Lloret Sánchez**

---

## 🙏 Agradecimientos

- FastAPI por el excelente framework
- Next.js por la increíble experiencia de desarrollo
- La comunidad open source

---

## 📊 Estado del Proyecto

**Versión:** 1.0.0  
**Estado:** 🟢 En Desarrollo Activo  
**Última Actualización:** Noviembre 2025

---

## 🆘 Soporte

Para problemas o preguntas:
1. Revisa la [documentación](./ANALISIS_COMPLETO_PROYECTO.md)
2. Abre un [issue](https://github.com/tuusuario/sistemaempresarial/issues)
3. Consulta los [logs](./GUIA_PRUEBA_COMPRAS.md)

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub**

