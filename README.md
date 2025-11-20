# 🏢 Sistema ERP Empresarial

Sistema ERP completo desarrollado con **FastAPI** (Backend) y **Next.js 16** (Frontend) para la gestión integral de empresas españolas.

🔗 **Demo en vivo:** https://frontend-next-fexvo2996-toni872s-projects.vercel.app

[![CI/CD](https://github.com/tuusuario/sistemaempresarial/actions/workflows/ci.yml/badge.svg)](https://github.com/tuusuario/sistemaempresarial/actions/workflows/ci.yml)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)

> **Nota para recruiters:** Este proyecto demuestra competencia end-to-end en desarrollo full-stack, desde diseño de base de datos hasta implementación de UI moderna con Next.js 16, integrando funcionalidades fiscales españolas (Modelo 303, Modelo 111, Verifactu), gestión completa de ventas/compras, y las mejores prácticas de la industria.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Seguridad](#-seguridad)
- [Logging y Manejo de Errores](#-logging-y-manejo-de-errores)
- [CI/CD](#-cicd)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🎯 Descripción del Proyecto

Sistema ERP completo diseñado para empresas españolas que necesitan centralizar y automatizar sus operaciones. Construido con arquitectura escalable y tecnologías modernas, el sistema integra gestión de ventas, compras, inventario, usuarios, modelos fiscales españoles (Modelo 303, Modelo 111) y cumplimiento con normativa AEAT (Verifactu).

**Problema que resuelve:** Las empresas pequeñas y medianas españolas necesitan sistemas de gestión accesibles pero potentes que cumplan con la normativa fiscal española. Este ERP ofrece funcionalidades enterprise con integración fiscal completa, análisis en tiempo real y automatización inteligente de procesos.

---

## ✨ Características

### 📊 Gestión de Ventas
- ✅ Gestión completa de productos con SKU y categorías
- ✅ Creación y seguimiento de ventas
- ✅ Facturación automática
- ✅ Plantillas de factura personalizables
- ✅ Facturas recurrentes programadas
- ✅ Exportación a PDF y Excel
- ✅ Estadísticas y métricas en tiempo real

### 💰 Gestión de Compras
- ✅ Gestión completa de proveedores
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

### 📈 Dashboard
- ✅ Métricas en tiempo real
- ✅ Gráficos y visualizaciones interactivas
- ✅ Resumen de ventas y compras
- ✅ Indicadores clave de negocio (KPI)
- ✅ Estadísticas por período

### 🔐 Autenticación y Seguridad
- ✅ Autenticación JWT con refresh tokens
- ✅ Verificación de email
- ✅ Roles y permisos (ADMIN, MANAGER, USER, READONLY)
- ✅ Rate limiting por IP
- ✅ Security headers (XSS, Clickjacking, etc.)
- ✅ Logging estructurado con request ID
- ✅ Manejo global de errores

### 🎨 Frontend Moderno
- ✅ Diseño profesional con Tailwind CSS
- ✅ Componentes accesibles con Radix UI
- ✅ Animaciones fluidas con Framer Motion
- ✅ Interfaz responsive y optimizada
- ✅ Sidebar con categorías y menús desplegables
- ✅ Gestión de estado eficiente

---

## 🛠️ Tecnologías

### Backend
- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migraciones de base de datos
- **Pydantic** - Validación de datos
- **JWT** - Autenticación segura con python-jose
- **bcrypt** - Hash de contraseñas
- **ReportLab** - Generación de PDFs
- **OpenPyXL** - Exportación a Excel
- **Cryptography** - Gestión de certificados electrónicos
- **Requests** - Cliente HTTP para integraciones
- **SlowAPI** - Rate limiting

### Frontend
- **Next.js 16** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **Radix UI** - Componentes accesibles
- **Recharts** - Gráficos y visualizaciones
- **Lucide Icons** - Iconos modernos

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de servicios
- **GitHub Actions** - CI/CD
- **PostgreSQL** - Base de datos
- **Trivy** - Security scanning

---

## 🚀 Instalación

### Prerrequisitos

- **Python 3.11+**
- **Node.js 20+**
- **PostgreSQL 15+**
- **Docker** (opcional, recomendado)

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/Toni872/SISTEMAEMPRESARIAL.git
cd SISTEMAEMPRESARIAL

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
# Iniciar servicios (PostgreSQL)
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

# Entorno
ENV=development
```

Ver `backend/env.example` para todas las opciones disponibles.

### Base de Datos

```bash
# Crear base de datos
createdb erp_db

# Ejecutar migraciones
cd backend
alembic upgrade head

# Crear usuario de prueba (opcional)
python scripts/create_test_user.py
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
│   ├── logs/               # Logs de la aplicación
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
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│
└── README.md               # Este archivo
```

---

## 📚 API Documentation

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Información del usuario actual
- `POST /api/auth/logout` - Cerrar sesión

#### Productos
- `GET /api/products` - Listar productos (con filtros)
- `POST /api/products` - Crear producto
- `GET /api/products/{id}` - Obtener producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `GET /api/products/low-stock` - Productos con stock bajo

#### Ventas
- `GET /api/sales` - Listar ventas (con filtros)
- `POST /api/sales` - Crear venta
- `GET /api/sales/{id}` - Obtener venta
- `PUT /api/sales/{id}` - Actualizar venta
- `DELETE /api/sales/{id}` - Eliminar venta
- `GET /api/sales/stats` - Estadísticas de ventas

#### Compras
- `GET /api/purchases` - Listar compras (con filtros)
- `POST /api/purchases` - Crear compra
- `GET /api/purchases/{id}` - Obtener compra
- `PUT /api/purchases/{id}` - Actualizar compra
- `DELETE /api/purchases/{id}` - Eliminar compra
- `GET /api/purchases/{id}/export/pdf` - Exportar compra a PDF
- `GET /api/purchases/export/pdf` - Exportar lista a PDF
- `GET /api/purchases/export/excel` - Exportar lista a Excel

#### Proveedores
- `GET /api/purchases/suppliers` - Listar proveedores
- `POST /api/purchases/suppliers` - Crear proveedor
- `GET /api/purchases/suppliers/{id}` - Obtener proveedor
- `PUT /api/purchases/suppliers/{id}` - Actualizar proveedor
- `DELETE /api/purchases/suppliers/{id}` - Eliminar proveedor

#### Fiscalidad
- `POST /api/tax/model-303/calculate` - Calcular Modelo 303
- `POST /api/tax/model-303/generate` - Generar declaración Modelo 303
- `POST /api/tax/model-111/calculate` - Calcular Modelo 111
- `POST /api/tax/model-111/generate` - Generar declaración Modelo 111
- `GET /api/tax/declarations` - Listar declaraciones
- `GET /api/tax/declarations/{id}` - Obtener declaración
- `GET /api/tax/declarations/{id}/pdf` - Descargar PDF

#### Verifactu
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

**Documentación completa:** http://localhost:8000/docs

---

## 🔒 Seguridad

### Implementado

- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Rate Limiting** para prevenir abuso (slowapi)
- ✅ **CORS** configurado de forma segura
- ✅ **Security Headers** (XSS, Clickjacking, etc.)
- ✅ **Validación de inputs** con Pydantic
- ✅ **Roles y permisos** (ADMIN, MANAGER, USER, READONLY)
- ✅ **Timeout en requests** (30 segundos)
- ✅ **Request ID** único para tracking
- ✅ **Logging estructurado** para auditoría

### Headers de Seguridad

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (en producción)
- `X-Request-ID` (tracking único)

---

## 📊 Logging y Manejo de Errores

### Sistema de Logging Estructurado

- ✅ **Logging en JSON** para producción
- ✅ **Logging con colores** para desarrollo
- ✅ **Archivos separados** por día y nivel
- ✅ **Request ID** único por request
- ✅ **Información contextual** rica (user_id, endpoint, IP)

### Manejo Global de Errores

- ✅ **Excepciones personalizadas** con códigos de error consistentes
- ✅ **Handlers globales** para todas las excepciones
- ✅ **Respuestas de error** estandarizadas con request ID
- ✅ **Logging automático** de todos los errores

### Tipos de Excepciones

- `NotFoundError` (404) - Recurso no encontrado
- `ValidationError` (422) - Error de validación
- `AuthenticationError` (401) - Error de autenticación
- `AuthorizationError` (403) - Error de autorización
- `BusinessLogicError` (400) - Error de lógica de negocio
- `ConflictError` (409) - Conflicto, recurso ya existe
- `DatabaseError` (500) - Error de base de datos
- `ExternalServiceError` (502) - Error en servicio externo

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

## 🚧 Roadmap

### ✅ Completado

- ✅ Arquitectura base con FastAPI y Next.js 16
- ✅ Sistema de autenticación JWT completo
- ✅ CRUD completo para todos los módulos
- ✅ Dashboard con métricas en tiempo real
- ✅ Diseño responsive con Tailwind CSS
- ✅ Dockerización completa
- ✅ Modelos fiscales españoles (303 y 111)
- ✅ Sistema Verifactu completo
- ✅ Exportación PDF/Excel
- ✅ Logging estructurado
- ✅ Manejo global de errores
- ✅ Deploy en Vercel

### 🔄 En Progreso

- ⏳ Tests unitarios y E2E
- ⏳ Documentación de API completa con Swagger
- ⏳ Integración completa frontend-backend

### 📋 Próximas Features

- ⏳ Integración bancaria para conciliación automática
- ⏳ OCR de gastos para automatizar registro de compras
- ⏳ Sistema de notificaciones push
- ⏳ Integración con servicios de pago (Stripe)
- ⏳ App móvil (React Native)
- ⏳ Multi-idioma (i18n)
- ⏳ Reportes personalizados con builder
- ⏳ Integración con WhatsApp Business API

---

## 📖 Documentación Adicional

- [Análisis Completo del Proyecto](./ANALISIS_COMPLETO_PROYECTO.md)
- [Resumen de Correcciones](./RESUMEN_CORRECCIONES_APLICADAS.md)
- [Mejoras de Logging y Errores](./MEJORAS_LOGGING_ERRORES.md)
- [Resumen de Mejoras Implementadas](./RESUMEN_MEJORAS_IMPLEMENTADAS.md)
- [Guía de Prueba - Compras](./SWAGGER_TEST_COMPRAS.md)
- [Configuración Verifactu](./VERIFACTU_PRODUCCION.md)
- [Roadmap](./ROADMAP_SIGUIENTE_PASO.md)

---

## 🎓 Decisiones Técnicas

### ¿Por qué FastAPI?

- **Performance:** Uno de los frameworks más rápidos de Python
- **Type Safety:** Validación automática con Pydantic
- **Documentación:** Swagger/OpenAPI automático
- **Moderno:** Basado en estándares modernos (async/await)
- **Fácil:** Sintaxis simple y clara

### ¿Por qué Next.js 16?

- **SSR/SSG:** Mejor SEO y performance inicial
- **App Router:** Arquitectura moderna y escalable
- **Server Components:** Menor bundle size y mejor UX
- **Optimizaciones:** Image optimization, code splitting automático
- **Vercel:** Deploy sin configuración adicional

### ¿Por qué SQLAlchemy?

- **Flexibilidad:** Control total sobre queries
- **Mature:** Biblioteca estable y probada
- **Type Safety:** Soporte completo para type hints
- **Migraciones:** Alembic para gestión de esquemas
- **Performance:** Optimizaciones avanzadas disponibles

### ¿Por qué PostgreSQL?

- **Robustez:** Base de datos enterprise-grade
- **Features:** JSON, arrays, full-text search
- **Open Source:** Sin costos de licencia
- **Ecosystem:** Excelente soporte y herramientas
- **Escalabilidad:** Maneja grandes volúmenes de datos

---

## 🐛 Troubleshooting

### Error: Puerto ya en uso

```bash
# Cambiar puertos en docker-compose.yml o en los comandos
# Backend: uvicorn app.main:app --port 8001
# Frontend: npm run dev -- -p 3002
```

### Error: Base de datos no conecta

```bash
# Verificar que PostgreSQL está corriendo
docker ps

# Ver logs de PostgreSQL
docker logs <container_name>

# Reiniciar servicios
docker-compose restart
```

### Error: JWT inválido

```bash
# Verificar que JWT_SECRET en .env coincide
# Limpiar localStorage del navegador
# Usar el botón "Cerrar sesión" y volver a iniciar
```

### Frontend en blanco después de deploy

```bash
# Limpiar caché del navegador (Ctrl + Shift + R)
# Verificar que el build fue exitoso
npm run build
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es parte de mi portfolio profesional. El código está disponible para revisión y evaluación, pero no para uso comercial sin autorización.

---

## 👨‍💻 Desarrollador

**Antonio Lloret Sánchez**

Full Stack Developer | React • Next.js • FastAPI • Python • TypeScript

🌐 **Portfolio:** Sistema ERP Empresarial  
💼 **LinkedIn:** [linkedin.com/in/antonio-lloret-sánchez-080166156](https://www.linkedin.com/in/antonio-lloret-sánchez-080166156)  
💻 **GitHub:** [@Toni872](https://github.com/Toni872)  
📧 **Email:** antohachi@gmail.com

---

## 🙏 Agradecimientos

Construido con ❤️ utilizando las mejores herramientas open-source:

- **FastAPI Team** por el excelente framework
- **Next.js Team** por SSR y optimizaciones
- **React Team** por la increíble biblioteca
- **PostgreSQL** por ser la BD más confiable
- **shadcn** por los componentes hermosos
- **La comunidad open source** por su apoyo constante

---

## 📞 Contacto

¿Preguntas sobre el proyecto? ¿Interesado en colaborar?

¡Contáctame! Estoy abierto a oportunidades de trabajo remoto full-stack.

📧 **Email:** antohachi@gmail.com  
💼 **LinkedIn:** [www.linkedin.com/in/antonio-lloret-sánchez-080166156](https://www.linkedin.com/in/antonio-lloret-sánchez-080166156)  
💻 **GitHub:** [github.com/Toni872](https://github.com/Toni872)

---

## 📊 Estado del Proyecto

**Versión:** 1.0.0  
**Estado:** 🟢 En Desarrollo Activo  
**Última Actualización:** Diciembre 2024

### Funcionalidades Completadas

- ✅ Sistema de autenticación completo
- ✅ Gestión de productos y ventas
- ✅ Gestión de compras y proveedores
- ✅ Modelos fiscales (303 y 111)
- ✅ Verifactu completo
- ✅ Exportación PDF/Excel
- ✅ Logging estructurado
- ✅ Manejo global de errores
- ✅ Documentación completa

### Próximas Funcionalidades

- ⏳ Integración bancaria
- ⏳ OCR de gastos
- ⏳ Tests unitarios completos
- ⏳ Métricas y monitoreo

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub**
