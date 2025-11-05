# 🚀 Despliegue del Backend en Vercel

Esta guía explica cómo desplegar el backend NestJS en Vercel usando Serverless Functions.

## ✅ Lo que Vercel SÍ soporta

- ✅ **Backend NestJS completo** como Serverless Functions
- ✅ **API REST y GraphQL** funcionando
- ✅ **Autenticación JWT** completa
- ✅ **Base de datos PostgreSQL** (Vercel Postgres o externa)
- ✅ **Todas las funciones del backend** (CRUD, queries, mutations)
- ✅ **Módulos de IA, Dashboard, Integración**, etc.

## ⚠️ Limitaciones a considerar

- ⚠️ **Redis**: Necesita servicio externo (Upstash Redis recomendado)
- ⚠️ **WebSockets**: Limitado en serverless (necesita servicio externo)
- ⚠️ **Modelos IA (Python/FastAPI)**: Requiere servicio separado
- ⚠️ **Bull Queues**: Requiere Redis externo

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Git repository conectado (GitHub, GitLab, etc.)
3. PostgreSQL (Vercel Postgres o servicio externo como Supabase, Railway, etc.)

## 🛠️ Paso 1: Configurar Base de Datos

### Opción A: Vercel Postgres (Recomendado)

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a la pestaña **Storage**
3. Crea una base de datos **Postgres**
4. Copia la `DATABASE_URL` de conexión

### Opción B: Base de datos externa

Usa cualquier servicio PostgreSQL:
- Supabase
- Railway
- Neon
- AWS RDS
- Tu propio servidor

## 🔧 Paso 2: Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, ve a **Settings > Environment Variables** y añade:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=tu-secret-super-seguro-aqui
JWT_EXPIRES_IN=7d

# CORS (URLs del frontend separadas por comas)
CORS_ORIGIN=https://tu-frontend.vercel.app,https://otro-frontend.vercel.app

# Redis (opcional - si usas Upstash)
REDIS_URL=rediss://default:password@host:port

# Environment
NODE_ENV=production
PORT=3000

# Throttling
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## 📦 Paso 3: Preparar el Build

El backend ya está configurado con:
- ✅ `vercel.json` - Configuración de rutas
- ✅ `api/index.ts` - Handler serverless
- ✅ Scripts de build en `package.json`

## 🚀 Paso 4: Desplegar

### Opción A: Desde Vercel CLI

```bash
cd backend
npm install -g vercel
vercel login
vercel --prod
```

### Opción B: Desde Dashboard de Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **Add New Project**
3. Importa tu repositorio
4. Configura:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install && npx prisma generate`
5. Añade las variables de entorno
6. Click **Deploy**

## 🔄 Paso 5: Ejecutar Migraciones

Después del primer despliegue, ejecuta las migraciones de Prisma:

```bash
# Opción 1: Desde local
cd backend
DATABASE_URL=tu-database-url npx prisma migrate deploy

# Opción 2: Desde Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Opción 3: Usar Vercel Functions (crear endpoint temporal)
```

## 🧪 Paso 6: Verificar el Despliegue

Una vez desplegado, prueba los endpoints:

```bash
# Health Check
curl https://tu-backend.vercel.app/api/health

# GraphQL
curl -X POST https://tu-backend.vercel.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## 🔗 Paso 7: Conectar Frontend

Actualiza las variables de entorno del frontend en Vercel:

```env
VITE_GRAPHQL_URL=https://tu-backend.vercel.app/graphql
VITE_API_BASE_URL=https://tu-backend.vercel.app/api
VITE_WS_URL=wss://tu-backend.vercel.app (si usas WebSockets)
```

## 📝 Estructura del Proyecto en Vercel

```
backend/
├── api/
│   └── index.ts          # Handler serverless para Vercel
├── src/                  # Código fuente NestJS
├── prisma/              # Schema y migraciones
├── vercel.json          # Configuración de Vercel
├── package.json
└── tsconfig.json
```

## 🔍 Troubleshooting

### Error: "Cannot find module"

**Solución**: Asegúrate de que `npx prisma generate` se ejecuta en el build.

Añade al `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && npm run build"
  }
}
```

### Error: "Database connection failed"

**Solución**: 
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos acepta conexiones externas
- Verifica el firewall de la base de datos

### Error: "Cold start timeout"

**Solución**: 
- Vercel tiene un timeout de 10s en el plan Hobby
- Considera usar Vercel Pro para timeouts más largos
- Optimiza el código para cargar más rápido

### Error: CORS

**Solución**: Verifica que `CORS_ORIGIN` incluya todas las URLs del frontend.

## 📊 Monitoreo

Vercel proporciona:
- **Logs en tiempo real** en el dashboard
- **Analytics** de requests
- **Métricas de performance**

## 🔐 Seguridad en Producción

1. ✅ Usa `JWT_SECRET` fuerte y único
2. ✅ Configura CORS correctamente
3. ✅ Usa HTTPS (automático en Vercel)
4. ✅ Mantén las dependencias actualizadas
5. ✅ Usa variables de entorno para secrets

## 💰 Costos

- **Hobby Plan (Gratis)**:
  - 100GB bandwidth/mes
  - 100 horas de función serverless/mes
  - Timeout de 10s por función
  
- **Pro Plan ($20/mes)**:
  - Unlimited bandwidth
  - Unlimited función serverless horas
  - Timeout de 60s por función

## 📚 Recursos Adicionales

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions/serverless-functions)
- [NestJS on Vercel](https://docs.nestjs.com/recipes/vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

## ✅ Checklist de Despliegue

- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones ejecutadas
- [ ] Build exitoso
- [ ] Health check responde
- [ ] GraphQL playground funciona
- [ ] Frontend conectado correctamente
- [ ] CORS configurado
- [ ] JWT funcionando
- [ ] Logs verificados

---

**¡Listo!** Tu backend NestJS ahora está funcionando como Serverless Functions en Vercel. 🎉

