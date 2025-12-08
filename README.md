# 🏢 Sistema ERP Empresarial

<div align="center">

![ERP Logo](https://img.shields.io/badge/ERP-Sistema%20Empresarial-blue?style=for-the-badge)

**Sistema ERP completo full-stack para gestión integral de empresas españolas**

[Características](#-características) • [Tecnologías](#-tecnologías) • [Instalación](#-instalación) • [Configuración](#-configuración) • [Uso](#-uso)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)](https://www.python.org/)

</div>

---

## 📖 Acerca del Proyecto

**Sistema ERP Empresarial** es una plataforma completa diseñada para empresas españolas que necesitan centralizar y automatizar sus operaciones empresariales. El proyecto aborda un problema real del sector: la necesidad de sistemas de gestión accesibles pero potentes que cumplan con la normativa fiscal española, ofreciendo funcionalidades enterprise con integración fiscal completa.

### 🎯 Objetivo

Proporcionar a las empresas pequeñas y medianas españolas un sistema ERP completo que integre gestión de ventas, compras, inventario, usuarios, modelos fiscales españoles (Modelo 303, Modelo 111) y cumplimiento con normativa AEAT (Verifactu), todo en una plataforma moderna, escalable y fácil de usar.

---

## ✨ Características

### 📊 Gestión de Ventas
- ✅ CRUD completo de productos con SKU y categorías
- ✅ Creación y seguimiento de ventas
- ✅ Facturación automática
- ✅ Plantillas de factura personalizables
- ✅ Facturas recurrentes programadas
- ✅ Exportación a PDF y Excel
- ✅ Estadísticas y métricas en tiempo real
- ✅ Filtros avanzados y búsqueda

### 💰 Gestión de Compras
- ✅ CRUD completo de proveedores
- ✅ Órdenes de compra con múltiples items
- ✅ Estados de compra (PENDING, APPROVED, RECEIVED, CANCELLED)
- ✅ Exportación a PDF y Excel
- ✅ Filtros avanzados (fecha, proveedor, estado, búsqueda)
- ✅ Integración con Modelo 303 (IVA soportado)

### 📑 Fiscalidad Española
- ✅ **Modelo 303** - Declaración trimestral de IVA
  - Cálculo automático de IVA repercutido (ventas)
  - Cálculo automático de IVA soportado (compras)
  - Generación de PDFs profesionales
  - Detalles por tipo de IVA (21%, 10%, 4%, exento)
- ✅ **Modelo 111** - Retenciones IRPF
  - Gestión de retenciones por proveedor
  - Cálculo automático de retenciones
  - Generación de PDFs profesionales
- ✅ Historial completo de declaraciones
- ✅ Descarga de PDFs de declaraciones

### 🛡️ Verifactu (AEAT)
- ✅ Registro de facturas conforme a normativa AEAT
- ✅ Cálculo de hash SHA-256 para integridad
- ✅ Cadena de hashes para trazabilidad completa
- ✅ Generación de XML Facturae 3.2
- ✅ Códigos QR para verificación
- ✅ Gestión de certificados electrónicos
- ✅ Validación de integridad de la cadena
- ✅ Integración con servicios AEAT (preparado para producción)
- ✅ Marca de envío a AEAT

### 📈 Dashboard y Analytics
- ✅ Métricas en tiempo real
- ✅ Gráficos y visualizaciones interactivas
- ✅ Resumen de ventas y compras
- ✅ Indicadores clave de negocio (KPI)
- ✅ Estadísticas por período
- ✅ Exportación de reportes

### 🔐 Autenticación y Seguridad
- ✅ Autenticación JWT con refresh tokens
- ✅ Verificación de email
- ✅ Sistema de roles (ADMIN, MANAGER, USER, READONLY)
- ✅ Rate limiting por IP
- ✅ Security headers (XSS, Clickjacking, etc.)
- ✅ Logging estructurado con request ID
- ✅ Manejo global de errores
- ✅ Validación de inputs con Pydantic

### 🎨 Frontend Moderno
- ✅ Diseño profesional con Tailwind CSS
- ✅ Componentes accesibles con Radix UI
- ✅ Animaciones fluidas con Framer Motion
- ✅ Interfaz responsive y optimizada
- ✅ Sidebar con categorías y menús desplegables
- ✅ Gestión de estado eficiente
- ✅ Dark mode (preparado)

### 📄 Gestión Documental
- ✅ Plantillas de factura personalizables
- ✅ Generación de PDFs profesionales
- ✅ Exportación a Excel
- ✅ Historial completo de documentos

---

## 🛠️ Tecnologías

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos utility-first
- **Radix UI** - Componentes UI accesibles
- **Framer Motion** - Animaciones fluidas
- **Recharts** - Gráficos y visualizaciones
- **Lucide Icons** - Iconos modernos
- **Zustand** - Gestión de estado
- **TanStack Query** - Gestión de estado del servidor

### Backend
- **FastAPI** - Framework web moderno y rápido
- **Python 3.12** - Lenguaje de programación
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migraciones de base de datos
- **Pydantic** - Validación de datos
- **JWT** - Autenticación segura con python-jose
- **bcrypt** - Hash de contraseñas

### Utilidades
- **ReportLab** - Generación de PDFs
- **OpenPyXL** - Exportación a Excel
- **Cryptography** - Gestión de certificados electrónicos
- **Requests** - Cliente HTTP para integraciones
- **SlowAPI** - Rate limiting
- **Sentry** - Error tracking

### Deployment
- **Vercel** - Hosting y CI/CD
- **Neon.tech** - PostgreSQL serverless
- **Mangum** - Adaptador serverless para FastAPI

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js 20+**
- **Python 3.12+**
- **PostgreSQL 15+** (o cuenta de Neon.tech)
- **npm** o **yarn**
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Toni872/SISTEMAEMPRESARIAL.git
cd SISTEMAEMPRESARIAL
```

2. **Instalar dependencias del frontend**

```bash
cd frontend-next
npm install
```

3. **Instalar dependencias del backend**

```bash
cd ../backend
pip install -r requirements.txt
```

4. **Configurar variables de entorno**

```bash
# Backend
cd ../backend
cp env.example .env
# Editar .env con tus configuraciones

# Frontend (opcional, para desarrollo local)
cd ../frontend-next
# Crear .env.local si es necesario
```

5. **Configurar la base de datos**

```bash
# Crear base de datos
createdb erp_db

# Ejecutar migraciones
cd backend
alembic upgrade head

# Crear usuario administrador (opcional)
python scripts/create_admin_production.py
```

6. **Ejecutar en desarrollo**

```bash
# Terminal 1: Backend (puerto 8000)
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend (puerto 3001)
cd frontend-next
npm run dev
```

7. **Abrir en el navegador**

```
Frontend: http://localhost:3001
Backend API: http://localhost:8000
Swagger UI: http://localhost:8000/docs
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en `backend/` con las siguientes variables:

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

# Entorno
ENV=development
NODE_ENV=development

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-password
SMTP_FROM=noreply@erp.com
```

### Generar SECRET_KEY

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# OpenSSL
openssl rand -base64 32
```

### Configurar Base de Datos

#### Opción 1: PostgreSQL Local

```bash
# Crear base de datos
createdb erp_db

# Ejecutar migraciones
cd backend
alembic upgrade head
```

#### Opción 2: Neon.tech (Recomendado para producción)

1. Crear cuenta en [Neon.tech](https://neon.tech/)
2. Crear nuevo proyecto
3. Copiar la `DATABASE_URL` de conexión
4. Añadir a `.env`:

```env
DATABASE_URL=postgresql://usuario:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 📁 Estructura del Proyecto

```
SISTEMAEMPRESARIAL/
├── backend/                 # Backend FastAPI
│   ├── app/
│   │   ├── api/            # Endpoints de la API
│   │   │   ├── auth/       # Autenticación
│   │   │   ├── products/   # Productos
│   │   │   ├── sales/      # Ventas
│   │   │   ├── purchases/  # Compras
│   │   │   ├── tax/        # Modelos fiscales
│   │   │   ├── verifactu/  # Verifactu/AEAT
│   │   │   ├── invoice_templates/ # Plantillas
│   │   │   ├── recurring_invoices/ # Facturas recurrentes
│   │   │   └── dashboard/  # Dashboard
│   │   ├── core/           # Configuración y utilidades
│   │   │   ├── config.py   # Configuración
│   │   │   ├── database.py # Conexión BD
│   │   │   ├── security.py # JWT y seguridad
│   │   │   ├── logging_config.py # Logging estructurado
│   │   │   └── exceptions.py # Excepciones personalizadas
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
│   │   │   ├── (dashboard)/ # Rutas protegidas
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── sales/
│   │   │   │   ├── purchases/
│   │   │   │   ├── tax/
│   │   │   │   └── verifactu/
│   │   │   ├── login/      # Autenticación
│   │   │   └── layout.tsx  # Layout principal
│   │   ├── components/     # Componentes React
│   │   │   ├── ui/         # Componentes UI
│   │   │   ├── sidebar.tsx # Navegación lateral
│   │   │   └── ...
│   │   └── lib/            # Utilidades y API client
│   └── package.json        # Dependencias Node.js
│
├── api/                    # Vercel serverless functions
│   └── index.py           # Handler de FastAPI para Vercel
│
├── vercel.json             # Configuración de Vercel
└── README.md               # Este archivo
```

---

## 🎮 Scripts Disponibles

### Frontend

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (puerto 3001)

# Producción
npm run build        # Construye la aplicación
npm start           # Inicia servidor de producción

# Calidad de código
npm run lint        # Ejecuta ESLint
```

### Backend

```bash
# Desarrollo
uvicorn app.main:app --reload    # Inicia servidor con hot reload

# Producción
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Migraciones
alembic upgrade head              # Aplicar migraciones
alembic revision --autogenerate  # Crear nueva migración

# Scripts
python scripts/create_tables.py              # Crear tablas
python scripts/create_admin_production.py    # Crear usuario admin
```

---

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Información del usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `POST /api/products` - Crear producto
- `GET /api/products/{id}` - Obtener producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `GET /api/products/low-stock` - Productos con stock bajo

### Ventas
- `GET /api/sales` - Listar ventas (con filtros)
- `POST /api/sales` - Crear venta
- `GET /api/sales/{id}` - Obtener venta
- `PUT /api/sales/{id}` - Actualizar venta
- `DELETE /api/sales/{id}` - Eliminar venta
- `GET /api/sales/stats` - Estadísticas de ventas

### Compras
- `GET /api/purchases` - Listar compras (con filtros)
- `POST /api/purchases` - Crear compra
- `GET /api/purchases/{id}` - Obtener compra
- `PUT /api/purchases/{id}` - Actualizar compra
- `DELETE /api/purchases/{id}` - Eliminar compra
- `GET /api/purchases/{id}/export/pdf` - Exportar compra a PDF
- `GET /api/purchases/export/pdf` - Exportar lista a PDF
- `GET /api/purchases/export/excel` - Exportar lista a Excel

### Proveedores
- `GET /api/purchases/suppliers` - Listar proveedores
- `POST /api/purchases/suppliers` - Crear proveedor
- `GET /api/purchases/suppliers/{id}` - Obtener proveedor
- `PUT /api/purchases/suppliers/{id}` - Actualizar proveedor
- `DELETE /api/purchases/suppliers/{id}` - Eliminar proveedor

### Fiscalidad
- `POST /api/tax/model-303/calculate` - Calcular Modelo 303
- `POST /api/tax/model-303/generate` - Generar declaración Modelo 303
- `POST /api/tax/model-111/calculate` - Calcular Modelo 111
- `POST /api/tax/model-111/generate` - Generar declaración Modelo 111
- `GET /api/tax/declarations` - Listar declaraciones
- `GET /api/tax/declarations/{id}` - Obtener declaración
- `GET /api/tax/declarations/{id}/pdf` - Descargar PDF

### Verifactu
- `POST /api/verifactu/sales/{id}/register` - Registrar factura en Verifactu
- `GET /api/verifactu/sales/{id}/xml` - Obtener XML de factura
- `GET /api/verifactu/registry` - Listar registros
- `POST /api/verifactu/registry/{id}/mark-sent` - Marcar como enviado a AEAT
- `GET /api/verifactu/validate-integrity` - Validar integridad de la cadena
- `POST /api/verifactu/aeat/send/{id}` - Enviar registro a AEAT
- `GET /api/verifactu/aeat/status/{id}` - Estado del envío a AEAT
- `GET /api/verifactu/certificates` - Listar certificados
- `POST /api/verifactu/certificates` - Subir certificado
- `DELETE /api/verifactu/certificates/{id}` - Eliminar certificado

**Documentación completa:** http://localhost:8000/docs (Swagger UI)

---

## 🚢 Deployment

### Vercel (Recomendado)

1. **Conectar repositorio a Vercel**
   - Ir a [Vercel](https://vercel.com/)
   - Importar proyecto desde GitHub
   - Configurar root directory: `.` (raíz del proyecto)

2. **Configurar variables de entorno**
   - Añadir todas las variables de `.env` en el dashboard de Vercel:
     - `DATABASE_URL`
     - `SECRET_KEY`
     - `ENV=production`
     - `NODE_ENV=production`
     - `BACKEND_CORS_ORIGINS` (URL de producción)

3. **Configurar dominio personalizado** (opcional)
   - Añadir dominio en settings
   - Configurar DNS según instrucciones

4. **Deploy automático**
   - Cada push a `master` desplegará automáticamente

### Configuración de Vercel

El proyecto incluye `vercel.json` que configura:
- Build del frontend Next.js
- Serverless functions para el backend FastAPI
- Routing: `/api/*` → Backend, resto → Frontend

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

## 🔒 Seguridad

### Implementado

- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Rate Limiting** para prevenir abuso
- ✅ **CORS** configurado de forma segura
- ✅ **Security Headers** (XSS, Clickjacking, etc.)
- ✅ **Validación de inputs** con Pydantic
- ✅ **Roles y permisos** (ADMIN, MANAGER, USER, READONLY)
- ✅ **Request ID** único para tracking
- ✅ **Logging estructurado** para auditoría

---

## 📚 Documentación Adicional

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es privado y está bajo una licencia ISC.

---

## 👤 Autor

**Antonio Lloret**

- 📧 Email: [antohachi@gmail.com](mailto:antohachi@gmail.com)
- 📱 WhatsApp: [+34 687 723 287](https://wa.me/34687723287)
- 💻 GitHub: [@Toni872](https://github.com/Toni872)
- 🔗 Proyecto: [SISTEMAEMPRESARIAL](https://github.com/Toni872/SISTEMAEMPRESARIAL)

---

## 📞 Contacto

¿Tienes alguna pregunta, sugerencia o te interesa colaborar en el proyecto?

- 📧 **Email**: [antohachi@gmail.com](mailto:antohachi@gmail.com)
- 📱 **WhatsApp**: [+34 687 723 287](https://wa.me/34687723287)
- 💬 **GitHub Issues**: [Abrir un issue](https://github.com/Toni872/SISTEMAEMPRESARIAL/issues)

---

## 🙏 Agradecimientos

- FastAPI Team
- Next.js Team
- React Team
- PostgreSQL Team
- Todos los mantenedores de las librerías open source utilizadas

---

<div align="center">

**⭐ Si este proyecto te ha sido útil, considera darle una estrella ⭐**

Desarrollado con ❤️ usando Next.js, FastAPI y TypeScript

</div>
