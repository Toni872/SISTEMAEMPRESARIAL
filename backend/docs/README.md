# Sistema ERP - Documentación Técnica

## Información General

**Proyecto:** Sistema ERP Empresarial  
**Versión:** 1.0.0  
**Fecha de Última Actualización:** Octubre 3, 2025  
**Estado:** Producción - Backend Completado

## Descripción del Proyecto

Sistema de planificación de recursos empresariales (ERP) desarrollado con arquitectura moderna, diseñado para gestionar operaciones comerciales incluyendo inventario, ventas, compras, usuarios y contabilidad. El sistema implementa autenticación basada en roles JWT y una API GraphQL completa.

## Arquitectura del Sistema

### Stack Tecnológico

**Backend:**

- NestJS 10.3.2
- GraphQL con Apollo Server 4.x
- TypeScript (strict mode)
- Node.js 18+

**Base de Datos:**

- PostgreSQL 15
- Prisma ORM 5.22.0
- Redis (caché)

**Autenticación:**

- JWT (JSON Web Tokens)
- bcrypt para hash de contraseñas
- Tiempo de expiración: 7 días

**Validación:**

- class-validator
- class-transformer

### Módulos Implementados

El sistema está organizado en 6 módulos principales de negocio:

1. **Authentication (Auth)** - Gestión de autenticación y autorización
2. **Products** - Administración de inventario y productos
3. **Sales** - Gestión de ventas y clientes
4. **Purchase** - Administración de compras y proveedores
5. **Users** - Gestión de usuarios del sistema
6. **Accounting** - Reportes financieros y análisis

## Requisitos del Sistema

### Requisitos de Software

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker >= 20.10.0
- Docker Compose >= 2.0.0
- PostgreSQL 15 (provisto vía Docker)
- Redis >= 7.0 (provisto vía Docker)

### Requisitos de Hardware Mínimos

- CPU: 2 cores
- RAM: 4 GB
- Almacenamiento: 10 GB disponibles

## Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone <repository-url>
cd sistemaempresarial/backend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crear archivo `.env` en el directorio raíz del backend:

```env
# Database Configuration
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistemaerp"

# JWT Configuration
JWT_SECRET="your-secret-key-here"

# Application Configuration
PORT=3000
NODE_ENV="development"

# Redis Configuration (Optional)
REDIS_HOST="localhost"
REDIS_PORT=6379
```

### Paso 4: Iniciar Servicios de Infraestructura

```bash
docker-compose up -d
```

Este comando iniciará los contenedores de PostgreSQL y Redis.

### Paso 5: Ejecutar Migraciones de Base de Datos

```bash
npx prisma migrate dev
```

### Paso 6: Ejecutar Seed de Datos Iniciales

```bash
npx prisma db seed
```

Este comando creará:

- 4 usuarios de prueba (ADMIN, MANAGER, USER, READONLY)
- 5 productos de ejemplo

### Paso 7: Iniciar el Servidor

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints del Sistema

### GraphQL Endpoint

- **URL:** `http://localhost:3000/graphql`
- **Método:** POST
- **Content-Type:** application/json

### Health Check

- **URL:** `http://localhost:3000/api/health`
- **Método:** GET

## Sistema de Autenticación

### Flujo de Autenticación

1. El cliente envía credenciales (email/password) al endpoint de login
2. El servidor valida las credenciales contra la base de datos
3. Si son válidas, genera un token JWT con la información del usuario
4. El cliente almacena el token y lo incluye en requests subsecuentes
5. El servidor valida el token en cada request protegido

### Estructura del Token JWT

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1696329600,
  "exp": 1696934400
}
```

### Headers Requeridos

Todas las requests autenticadas deben incluir el header:

```
Authorization: Bearer <token>
```

## Sistema de Autorización

### Roles Disponibles

El sistema implementa cuatro niveles de roles:

**ADMIN**

- Acceso completo a todas las operaciones
- Puede crear, leer, actualizar y eliminar cualquier recurso
- Acceso a gestión de usuarios
- Acceso a todos los reportes

**MANAGER**

- Acceso a operaciones de gestión
- Puede crear y actualizar la mayoría de recursos
- No puede eliminar recursos críticos
- Acceso a reportes financieros

**USER**

- Acceso a operaciones básicas
- Puede crear órdenes de venta
- Puede consultar productos y clientes
- No puede acceder a módulo de compras ni reportes

**READONLY**

- Solo lectura limitada
- No puede realizar modificaciones
- Acceso restringido a consultas básicas

### Matriz de Permisos

Ver documento: [PERMISSIONS_MATRIX.md](./PERMISSIONS_MATRIX.md)

## Comandos Principales

### Desarrollo

```bash
# Iniciar servidor en modo desarrollo
npm run start:dev

# Compilar TypeScript
npm run build

# Ejecutar en modo producción
npm run start:prod
```

### Base de Datos

```bash
# Crear nueva migración
npx prisma migrate dev --name <migration-name>

# Aplicar migraciones
npx prisma migrate deploy

# Resetear base de datos (PRECAUCIÓN)
npx prisma migrate reset

# Abrir Prisma Studio (GUI)
npx prisma studio

# Ejecutar seed
npx prisma db seed
```

### Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas end-to-end
npm run test:e2e
```

### Docker

```bash
# Iniciar contenedores
docker-compose up -d

# Detener contenedores
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar contenedores
docker-compose restart
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/              # Autenticación y autorización
│   │   ├── inventory/
│   │   │   └── products/      # Gestión de productos
│   │   ├── sales/             # Ventas y clientes
│   │   ├── purchase/          # Compras y proveedores
│   │   ├── users/             # Gestión de usuarios
│   │   └── accounting/        # Reportes financieros
│   ├── common/
│   │   ├── guards/            # Guards de autenticación y autorización
│   │   └── decorators/        # Decorators personalizados
│   ├── config/                # Configuración de servicios
│   ├── app.module.ts          # Módulo principal
│   └── main.ts                # Punto de entrada
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── migrations/            # Migraciones de base de datos
│   └── seed.ts                # Datos iniciales
├── docs/                      # Documentación técnica
├── docker-compose.yml         # Configuración de Docker
├── .env                       # Variables de entorno
├── package.json               # Dependencias del proyecto
└── tsconfig.json              # Configuración de TypeScript
```

## Índice de Documentación

### Documentación de API

- [API Reference](./API_REFERENCE.md) - Documentación completa de endpoints GraphQL
- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - Guía de autenticación y autorización
- [Permissions Matrix](./PERMISSIONS_MATRIX.md) - Matriz detallada de permisos por rol

### Documentación de Módulos

- [Auth Module](./modules/AUTH_MODULE.md) - Módulo de autenticación
- [Products Module](./modules/PRODUCTS_MODULE.md) - Módulo de productos
- [Sales Module](./modules/SALES_MODULE.md) - Módulo de ventas
- [Purchase Module](./modules/PURCHASE_MODULE.md) - Módulo de compras
- [Users Module](./modules/USERS_MODULE.md) - Módulo de usuarios
- [Accounting Module](./modules/ACCOUNTING_MODULE.md) - Módulo de contabilidad

### Guías Técnicas

- [Testing Guide](./TESTING_GUIDE.md) - Guía de pruebas con Postman
- [Database Schema](./DATABASE_SCHEMA.md) - Esquema de base de datos
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Guía de despliegue
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Guía para desarrolladores

## Usuarios de Prueba

El sistema incluye usuarios predefinidos para pruebas:

| Email | Password | Rol | Estado |
|-------|----------|-----|--------|
| <admin@erp.com> | admin123 | ADMIN | Activo |
| <manager@erp.com> | manager123 | MANAGER | Activo |
| <user@erp.com> | user123 | USER | Activo |
| <readonly@erp.com> | readonly123 | READONLY | Activo |

**Nota de Seguridad:** Estos usuarios deben ser eliminados o modificados antes del despliegue en producción.

## Manejo de Errores

El sistema implementa un manejo de errores estandarizado:

### Códigos de Error HTTP

- 200: Operación exitosa
- 201: Recurso creado exitosamente
- 400: Solicitud incorrecta
- 401: No autenticado
- 403: No autorizado (sin permisos)
- 404: Recurso no encontrado
- 500: Error interno del servidor

### Estructura de Errores GraphQL

```json
{
  "errors": [
    {
      "message": "Descripción del error",
      "extensions": {
        "code": "CODIGO_ERROR",
        "statusCode": 400
      }
    }
  ]
}
```

## Mejores Prácticas

### Seguridad

1. Nunca exponer el JWT_SECRET en el código
2. Usar HTTPS en producción
3. Implementar rate limiting
4. Validar todas las entradas del usuario
5. Sanitizar datos antes de consultas a base de datos
6. Cambiar contraseñas por defecto en producción

### Rendimiento

1. Implementar paginación en todas las consultas de listado
2. Usar índices de base de datos apropiados
3. Implementar caché para consultas frecuentes
4. Optimizar consultas N+1 con DataLoader
5. Monitorear uso de memoria y CPU

### Mantenimiento

1. Ejecutar migraciones en orden
2. Mantener backup regular de la base de datos
3. Revisar logs periódicamente
4. Actualizar dependencias regularmente
5. Documentar cambios significativos

## Monitoreo y Logs

### Logs del Sistema

Los logs se generan en la consola con el siguiente formato:

```
[Nest] 12345 - 10/03/2025, 10:30:45 LOG [ModuleName] Message
```

### Niveles de Log

- LOG: Información general
- ERROR: Errores críticos
- WARN: Advertencias
- DEBUG: Información de debugging
- VERBOSE: Información detallada

## Solución de Problemas

### El servidor no inicia

**Problema:** Error al iniciar el servidor

**Soluciones:**

1. Verificar que Docker esté corriendo
2. Verificar que PostgreSQL esté accesible
3. Verificar variables de entorno en `.env`
4. Verificar que el puerto 3000 esté disponible

### Error de conexión a base de datos

**Problema:** Cannot connect to PostgreSQL

**Soluciones:**

1. Verificar que el contenedor de PostgreSQL esté corriendo: `docker ps`
2. Verificar la cadena de conexión en DATABASE_URL
3. Reiniciar contenedores: `docker-compose restart`

### Errores de migración

**Problema:** Migration failed

**Soluciones:**

1. Verificar el estado de migraciones: `npx prisma migrate status`
2. Resetear base de datos si es desarrollo: `npx prisma migrate reset`
3. Aplicar migraciones manualmente: `npx prisma migrate deploy`

## Soporte y Contacto

Para reportar problemas o solicitar asistencia:

- Revisar la documentación técnica en `/docs`
- Consultar los logs del sistema
- Verificar la sección de solución de problemas

## Licencia

Este proyecto está bajo licencia MIT.

## Changelog

### Version 1.0.0 - Octubre 3, 2025

**Características Implementadas:**

- Sistema completo de autenticación JWT
- 6 módulos de negocio operacionales
- 53 endpoints GraphQL
- Sistema de permisos basado en roles
- Documentación técnica completa

**Base de Datos:**

- 9 modelos de datos principales
- Relaciones completamente definidas
- Migraciones aplicadas

**Testing:**

- Colección de Postman con 53 requests
- Usuarios de prueba creados
- Validación de permisos completa
