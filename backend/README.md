# Sistema ERP - Backend

Sistema de Planificación de Recursos Empresariales (ERP) desarrollado con NestJS, GraphQL y PostgreSQL.

## Inicio Rápido

### Requisitos Previos

- Node.js 18 o superior
- Docker Desktop
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servicios de base de datos
docker-compose up -d

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Poblar base de datos con datos iniciales
npx prisma db seed

# Iniciar servidor en modo desarrollo
npm run start:dev
```

### Acceso a la Aplicación

- **Backend API:** <http://localhost:3000>
- **GraphQL Playground:** <http://localhost:3000/graphql>
- **Health Check:** <http://localhost:3000/api/health>

## Estructura del Proyecto

```
backend/
├── docs/                          # Documentación técnica completa
│   ├── INDEX.md                   # Índice de navegación
│   ├── README.md                  # Guía principal técnica
│   ├── API_REFERENCE.md           # Referencia completa de API
│   ├── AUTHENTICATION_GUIDE.md    # Guía de autenticación y JWT
│   ├── PERMISSIONS_MATRIX.md      # Matriz de permisos por rol
│   ├── DATABASE_SCHEMA.md         # Esquema de base de datos
│   └── TESTING_GUIDE.md           # Guía de pruebas con Postman
├── src/                           # Código fuente
│   ├── auth/                      # Módulo de autenticación
│   ├── products/                  # Módulo de productos
│   ├── sales/                     # Módulo de ventas
│   ├── purchase/                  # Módulo de compras
│   ├── users/                     # Módulo de usuarios
│   └── accounting/                # Módulo de reportes
├── prisma/                        # Configuración de Prisma ORM
│   ├── schema.prisma             # Esquema de base de datos
│   ├── migrations/               # Migraciones
│   └── seed.ts                   # Datos iniciales
├── ERP_System_Postman_Collection.json  # Colección de Postman
├── docker-compose.yml            # Configuración de Docker
└── package.json                  # Dependencias del proyecto
```

## Tecnologías Principales

- **Framework:** NestJS 10.3.2
- **API:** GraphQL con Apollo Server 4+
- **Base de Datos:** PostgreSQL 15
- **ORM:** Prisma 5.22.0
- **Autenticación:** JWT (JSON Web Tokens)
- **Caché:** Redis
- **Lenguaje:** TypeScript (strict mode)

## Módulos del Sistema

### 1. Autenticación (Auth)

- Login con JWT
- Gestión de sesiones
- Control de acceso basado en roles (RBAC)

### 2. Productos

- CRUD de productos
- Gestión de inventario
- Control de stock mínimo
- Categorización

### 3. Ventas

- Gestión de clientes
- Órdenes de venta
- Estados de órdenes (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Cálculo automático de impuestos

### 4. Compras

- Gestión de proveedores
- Órdenes de compra
- Recepción de mercancía
- Actualización automática de inventario

### 5. Usuarios

- Administración de usuarios del sistema
- Roles: ADMIN, MANAGER, USER, READONLY
- Activación/desactivación de cuentas

### 6. Reportes y Contabilidad

- Resumen financiero
- Ventas mensuales
- Top productos más vendidos
- Valor de inventario

## Comandos Principales

```bash
# Desarrollo
npm run start:dev          # Iniciar en modo desarrollo con hot-reload
npm run build              # Compilar para producción
npm run start:prod         # Iniciar en modo producción

# Base de Datos
npx prisma generate        # Generar cliente Prisma
npx prisma migrate dev     # Crear y aplicar migraciones
npx prisma migrate deploy  # Aplicar migraciones en producción
npx prisma db seed         # Poblar base de datos
npx prisma studio          # Abrir Prisma Studio

# Testing
npm run test               # Ejecutar tests unitarios
npm run test:cov           # Tests con coverage
npm run test:e2e           # Tests end-to-end

# Docker
docker-compose up -d       # Iniciar servicios
docker-compose down        # Detener servicios
docker-compose logs -f     # Ver logs en tiempo real
docker ps                  # Ver contenedores activos
```

## Usuarios de Prueba

El sistema incluye 4 usuarios de prueba con diferentes roles:

| Email              | Password  | Rol      | Permisos                                    |
|--------------------|-----------|----------|---------------------------------------------|
| <admin@erp.com>      | admin123  | ADMIN    | Acceso total al sistema                     |
| <manager@erp.com>    | admin123  | MANAGER  | Todo excepto DELETE y gestión de usuarios   |
| <user@erp.com>       | admin123  | USER     | Lectura de productos, crear/ver ventas      |
| <readonly@erp.com>   | admin123  | READONLY | Sin acceso (para futuras integraciones)     |

## Documentación Completa

Toda la documentación técnica profesional se encuentra en la carpeta `/docs`:

### Documentos Disponibles

1. **[INDEX.md](docs/INDEX.md)** - Índice principal con navegación completa
2. **[README.md](docs/README.md)** - Guía técnica detallada del sistema
3. **[API_REFERENCE.md](docs/API_REFERENCE.md)** - Referencia de los 53 endpoints GraphQL
4. **[AUTHENTICATION_GUIDE.md](docs/AUTHENTICATION_GUIDE.md)** - Guía de autenticación y seguridad
5. **[PERMISSIONS_MATRIX.md](docs/PERMISSIONS_MATRIX.md)** - Matriz completa de permisos
6. **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Esquema de base de datos
7. **[TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Guía de pruebas con Postman

### Guías de Inicio Rápido

**Para Desarrolladores:**
Seguir la ruta de aprendizaje de 5 días en [docs/INDEX.md](docs/INDEX.md#para-desarrolladores-nuevos)

**Para Testers/QA:**
Consultar la guía rápida de testing en [docs/INDEX.md](docs/INDEX.md#para-testersqa)

**Para Administradores:**
Ver la guía de deployment en [docs/INDEX.md](docs/INDEX.md#para-administradores-de-sistema)

## Testing con Postman

El proyecto incluye una colección completa de Postman con 53 requests pre-configurados:

1. Abrir Postman
2. Importar archivo: `ERP_System_Postman_Collection.json`
3. Verificar que el servidor esté corriendo
4. Seguir la guía de testing: [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)

## Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```bash
# Base de Datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_db?schema=public"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="1d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Aplicación
PORT=3000
NODE_ENV="development"
```

## Troubleshooting

### Servidor no inicia

```bash
# Verificar que Docker esté corriendo
docker ps

# Reiniciar servicios
docker-compose restart

# Ver logs
docker-compose logs -f
```

### Error de conexión a base de datos

```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Verificar DATABASE_URL en .env
cat .env | grep DATABASE_URL

# Reiniciar contenedor
docker-compose restart postgres
```

### Error "Token inválido"

```bash
# Verificar JWT_SECRET en .env
# Hacer login nuevamente para obtener token fresco
```

### Base de datos vacía

```bash
# Ejecutar seed
npx prisma db seed
```

## Soporte

Para más información, consultar:

- **Documentación completa:** [docs/INDEX.md](docs/INDEX.md)
- **Referencia de API:** [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
- **Guía de testing:** [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)

## Licencia

Propiedad del Sistema ERP - Todos los derechos reservados

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2025

## Buenas prácticas profesionales

- **Variables de entorno**: Define todas las credenciales en un archivo `.env`. Nunca subas `.env` a tu repositorio. Incluye siempre `.env.example` para referencia del equipo.
- **Entornos separados**: Usa distintas configuraciones y archivos `.env` para `development`, `testing` y `production`.
- **Despliegue limpio y seguro**: Utiliza los Dockerfiles y docker-compose incluidos para aislar dependencias y servicios, tanto en desarrollo como en producción.
- **Migraciones y seeds controlados**: Siempre versiona tus migraciones en `prisma/migrations/` y emplea los comandos de seed documentados tras cada migración relevante.
- **Manejo de secretos**: Nunca expongas secretos en el código. Usa variables de entorno y, en producción, secretos gestionados por el orquestador o infraestructura segura.
- **Documentación actualizada**: Mantén actualizado este README y los de cada submódulo para onboarding y troubleshooting efectivo.
