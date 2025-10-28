# Índice de Documentación - Sistema ERP

## Introducción

Bienvenido a la documentación técnica completa del Sistema ERP. Esta documentación ha sido diseñada para proporcionar toda la información necesaria para desarrolladores, administradores de sistemas y usuarios técnicos que trabajen con el sistema.

## Estructura de la Documentación

La documentación está organizada en las siguientes secciones principales:

### 1. Guías Principales

#### [README.md](./README.md)

Documento principal que proporciona:

- Descripción general del sistema
- Tecnologías utilizadas
- Requisitos del sistema
- Instalación y configuración
- Comandos principales
- Troubleshooting básico

**Audiencia:** Desarrolladores nuevos en el proyecto, administradores de sistemas

**Tiempo de lectura:** 15-20 minutos

---

#### [API_REFERENCE.md](./API_REFERENCE.md)

Referencia completa de la API GraphQL con:

- Listado de todos los 53 endpoints
- Schemas de entrada y salida
- Ejemplos de uso para cada operación
- Códigos de error
- Best practices

**Audiencia:** Desarrolladores frontend, integradores de API

**Tiempo de lectura:** 45-60 minutos (referencia)

---

### 2. Seguridad y Permisos

#### [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)

Guía completa de autenticación que cubre:

- Arquitectura de seguridad JWT
- Flujo de autenticación
- Estructura y configuración de tokens
- Sistema de roles (ADMIN, MANAGER, USER, READONLY)
- Implementación técnica
- Integración con frontend
- Troubleshooting de autenticación

**Audiencia:** Desarrolladores backend y frontend, arquitectos de seguridad

**Tiempo de lectura:** 25-30 minutos

---

#### [PERMISSIONS_MATRIX.md](./PERMISSIONS_MATRIX.md)

Matriz detallada de permisos que incluye:

- Descripción de los 4 roles del sistema
- Tabla completa de permisos por módulo
- Permisos específicos por operación
- Reglas de negocio
- Implementación en código
- Casos de uso y ejemplos

**Audiencia:** Administradores del sistema, desarrolladores

**Tiempo de lectura:** 20-25 minutos

---

### 3. Base de Datos

#### [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

Documentación completa del esquema de base de datos:

- Descripción de las 9 tablas del sistema
- Diagramas de relaciones
- Índices y constraints
- Enums y validaciones
- Scripts de migración
- Comandos de backup y restauración
- Consultas SQL útiles
- Diagrama ERD

**Audiencia:** Desarrolladores backend, administradores de base de datos, arquitectos de datos

**Tiempo de lectura:** 35-40 minutos

---

### 4. Testing

#### [TESTING_GUIDE.md](./TESTING_GUIDE.md)

Guía exhaustiva de pruebas que proporciona:

- Configuración de Postman
- Metodología de pruebas
- 53 casos de prueba detallados
- Validación de permisos por rol
- Casos de prueba de errores
- Checklist de testing completo
- Troubleshooting

**Audiencia:** QA Engineers, desarrolladores, testers

**Tiempo de lectura:** 60-90 minutos (incluye ejecución de pruebas)

---

## Guías de Inicio Rápido

### Para Desarrolladores Nuevos

**Ruta de aprendizaje recomendada:**

1. **Día 1:** Configuración del entorno
   - Leer: [README.md](./README.md) - Sección "Instalación y Configuración"
   - Ejecutar: Instalación de dependencias y Docker
   - Verificar: Servidor corriendo en localhost:3000

2. **Día 2:** Entender la arquitectura
   - Leer: [README.md](./README.md) - Sección "Arquitectura del Sistema"
   - Leer: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Secciones principales
   - Revisar: Código de los módulos principales

3. **Día 3:** Autenticación y seguridad
   - Leer: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
   - Leer: [PERMISSIONS_MATRIX.md](./PERMISSIONS_MATRIX.md)
   - Practicar: Login con diferentes roles

4. **Día 4:** API y endpoints
   - Leer: [API_REFERENCE.md](./API_REFERENCE.md)
   - Usar: GraphQL Playground en localhost:3000/graphql
   - Probar: Queries y mutations básicas

5. **Día 5:** Testing
   - Leer: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
   - Configurar: Postman con la colección
   - Ejecutar: Casos de prueba principales

---

### Para Testers/QA

**Inicio rápido en testing:**

1. **Configuración (30 minutos)**
   - Instalar Postman
   - Importar colección: `backend/ERP_System_Postman_Collection.json`
   - Verificar servidor corriendo

2. **Familiarización (45 minutos)**
   - Leer: [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Secciones 1-3
   - Entender: Flujo de autenticación
   - Revisar: Variables de Postman

3. **Ejecución de pruebas (2-3 horas)**
   - Seguir: Casos de prueba del 1.1 al 6.4
   - Documentar: Resultados de cada caso
   - Reportar: Bugs encontrados

---

### Para Administradores de Sistema

**Guía de deployment:**

1. **Preparación (1 hora)**
   - Leer: [README.md](./README.md) - Sección "Requisitos del Sistema"
   - Preparar: Servidor con Docker
   - Configurar: Variables de entorno

2. **Instalación (1 hora)**
   - Ejecutar: Docker Compose
   - Verificar: Contenedores activos
   - Inicializar: Base de datos con seed

3. **Configuración de seguridad (1 hora)**
   - Leer: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Sección "Seguridad"
   - Cambiar: JWT_SECRET en producción
   - Crear: Usuarios administrativos

4. **Backup y monitoreo (1 hora)**
   - Leer: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Sección "Backup y Restauración"
   - Configurar: Backup automático
   - Implementar: Monitoreo de logs

---

## Referencia Rápida

### Comandos Esenciales

**Desarrollo:**

```bash
# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo
npm run start:dev

# Ver logs en tiempo real
docker logs -f nest-erp-backend
```

**Base de Datos:**

```bash
# Generar cliente Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar seed
npx prisma db seed

# Abrir Prisma Studio
npx prisma studio
```

**Docker:**

```bash
# Iniciar servicios
docker-compose up -d

# Ver estado de contenedores
docker ps

# Ver logs
docker logs postgres-erp
docker logs redis-erp

# Reiniciar servicios
docker-compose restart
```

**Testing:**

```bash
# Ejecutar tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

---

### Endpoints Principales

**Autenticación:**

- `login` - Autenticar usuario
- `me` - Obtener usuario actual
- `changeMyPassword` - Cambiar contraseña

**Productos:**

- `products` - Listar productos
- `product(id)` - Obtener producto por ID
- `createProduct` - Crear producto (ADMIN/MANAGER)
- `updateProduct` - Actualizar producto (ADMIN/MANAGER)
- `deleteProduct` - Eliminar producto (ADMIN only)

**Ventas:**

- `salesOrders` - Listar órdenes de venta
- `createSalesOrder` - Crear orden de venta
- `updateSalesOrderStatus` - Actualizar estado
- `cancelSalesOrder` - Cancelar orden

**Compras:**

- `purchaseOrders` - Listar órdenes de compra
- `createPurchaseOrder` - Crear orden de compra
- `receivePurchaseOrder` - Recibir orden (actualiza stock)

**Usuarios:**

- `users` - Listar usuarios (ADMIN only)
- `createUser` - Crear usuario (ADMIN only)
- `updateUser` - Actualizar usuario (ADMIN only)
- `deactivateUser` - Desactivar usuario (ADMIN only)

**Reportes:**

- `financialSummary` - Resumen financiero (ADMIN/MANAGER)
- `salesByMonth` - Ventas mensuales (ADMIN/MANAGER)
- `topProducts` - Productos más vendidos (ADMIN/MANAGER)
- `inventoryValue` - Valor de inventario (ADMIN/MANAGER)

---

### Usuarios de Prueba

**ADMIN:**

- Email: <admin@erp.com>
- Password: admin123
- Permisos: Todos

**MANAGER:**

- Email: <manager@erp.com>
- Password: admin123
- Permisos: Todo excepto DELETE y gestión de usuarios

**USER:**

- Email: <user@erp.com>
- Password: admin123
- Permisos: Lectura de productos, crear/ver ventas

**READONLY:**

- Email: <readonly@erp.com>
- Password: admin123
- Permisos: Ninguno (para futuras integraciones)

---

### Puertos y URLs

**Aplicación:**

- Backend API: <http://localhost:3000>
- GraphQL Playground: <http://localhost:3000/graphql>
- Health Check: <http://localhost:3000/health>

**Bases de Datos:**

- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Prisma Studio: <http://localhost:5555> (cuando está activo)

---

### Variables de Entorno Principales

```
# Base de Datos
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erp_db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Aplicación
PORT=3000
NODE_ENV=development
```

---

## Troubleshooting Rápido

### Problema: Servidor no inicia

**Solución:**

1. Verificar que Docker esté corriendo
2. Ejecutar `docker-compose up -d`
3. Verificar logs: `npm run start:dev`

### Problema: Error de autenticación

**Solución:**

1. Verificar token en header Authorization
2. Ejecutar login nuevamente
3. Verificar JWT_SECRET en .env

### Problema: Error de conexión a base de datos

**Solución:**

1. Verificar PostgreSQL: `docker ps`
2. Reiniciar container: `docker-compose restart`
3. Verificar DATABASE_URL en .env

### Problema: Productos no aparecen

**Solución:**

1. Ejecutar seed: `npx prisma db seed`
2. Verificar en Prisma Studio: `npx prisma studio`
3. Revisar permisos del usuario

---

## Soporte y Recursos

### Documentación Externa

**NestJS:**

- Documentación oficial: <https://docs.nestjs.com>
- GraphQL con NestJS: <https://docs.nestjs.com/graphql/quick-start>

**Prisma:**

- Documentación oficial: <https://www.prisma.io/docs>
- Prisma Client API: <https://www.prisma.io/docs/reference/api-reference/prisma-client-reference>

**GraphQL:**

- Documentación oficial: <https://graphql.org/learn>
- Apollo Server: <https://www.apollographql.com/docs/apollo-server>

**PostgreSQL:**

- Documentación oficial: <https://www.postgresql.org/docs>

### Herramientas Recomendadas

**Desarrollo:**

- Visual Studio Code con extensiones:
  - Prisma
  - GraphQL
  - ESLint
  - Prettier

**Testing:**

- Postman (incluido en el proyecto)
- GraphQL Playground (integrado)
- Prisma Studio

**Base de Datos:**

- pgAdmin 4
- DBeaver
- TablePlus

---

## Glosario

**ERP:** Enterprise Resource Planning - Sistema de Planificación de Recursos Empresariales

**JWT:** JSON Web Token - Estándar para tokens de autenticación

**RBAC:** Role-Based Access Control - Control de Acceso Basado en Roles

**GraphQL:** Lenguaje de consulta para APIs

**ORM:** Object-Relational Mapping - Mapeo Objeto-Relacional

**Prisma:** ORM de nueva generación para Node.js y TypeScript

**NestJS:** Framework progresivo de Node.js para aplicaciones del lado del servidor

**Mutation:** Operación de escritura en GraphQL (Create, Update, Delete)

**Query:** Operación de lectura en GraphQL

**Resolver:** Función que resuelve un campo en GraphQL

**Guard:** Middleware de NestJS para autorización

**Decorator:** Anotación de TypeScript para añadir metadatos

**Seed:** Datos iniciales para poblar la base de datos

**Migration:** Script de cambios en el esquema de base de datos

---

## Actualizaciones de Documentación

**Versión Actual:** 1.0.0

**Última Actualización:** Enero 2025

**Próximas Mejoras:**

- Guía de deployment en producción
- Documentación de módulos específicos
- Guía de desarrollo y contribución
- Mejores prácticas y patrones de código

---

## Navegación Rápida por Módulo

### Módulo de Autenticación

- Guía: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- Permisos: [PERMISSIONS_MATRIX.md](./PERMISSIONS_MATRIX.md)
- API: [API_REFERENCE.md](./API_REFERENCE.md#autenticación)

### Módulo de Productos

- API: [API_REFERENCE.md](./API_REFERENCE.md#productos)
- Schema: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md#2-product)
- Tests: [TESTING_GUIDE.md](./TESTING_GUIDE.md#módulo-2-productos)

### Módulo de Ventas

- API: [API_REFERENCE.md](./API_REFERENCE.md#ventas)
- Schema: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md#5-salesorder)
- Tests: [TESTING_GUIDE.md](./TESTING_GUIDE.md#módulo-3-ventas)

### Módulo de Compras

- API: [API_REFERENCE.md](./API_REFERENCE.md#compras)
- Schema: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md#7-purchaseorder)
- Tests: [TESTING_GUIDE.md](./TESTING_GUIDE.md#módulo-4-compras)

### Módulo de Usuarios

- API: [API_REFERENCE.md](./API_REFERENCE.md#usuarios)
- Schema: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md#1-user)
- Tests: [TESTING_GUIDE.md](./TESTING_GUIDE.md#módulo-5-usuarios)
- Permisos: [PERMISSIONS_MATRIX.md](./PERMISSIONS_MATRIX.md#gestión-de-usuarios)

### Módulo de Reportes

- API: [API_REFERENCE.md](./API_REFERENCE.md#reportes-contabilidad)
- Tests: [TESTING_GUIDE.md](./TESTING_GUIDE.md#módulo-6-reportes)
- Permisos: [PERMISSIONS_MATRIX.md](./PERMISSIONS_MATRIX.md#reportes-y-contabilidad)

---

## Contacto y Contribuciones

Para reportar problemas, sugerir mejoras o contribuir a la documentación, por favor seguir las guías de contribución del proyecto.

---

**Última revisión:** Enero 2025  
**Mantenido por:** Equipo de Desarrollo ERP
