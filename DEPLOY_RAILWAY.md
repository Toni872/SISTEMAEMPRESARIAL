# Guía de Deployment en Railway

Railway es una plataforma que permite desplegar tanto el frontend como el backend en el mismo proyecto, junto con bases de datos PostgreSQL y Redis gestionadas.

## 🚀 Ventajas de Railway

- ✅ Frontend y Backend en el mismo proyecto
- ✅ PostgreSQL y Redis como servicios gestionados
- ✅ Detección automática de frameworks (Next.js, FastAPI)
- ✅ Variables de entorno gestionadas fácilmente
- ✅ Plan gratuito generoso ($5 de crédito mensual)
- ✅ Deploy automático desde GitHub

## 📋 Estructura del Proyecto en Railway

Railway detectará automáticamente múltiples servicios en tu repositorio:

1. **Backend** (FastAPI) - desde `backend/`
2. **Frontend** (Next.js) - desde `frontend-next/`
3. **PostgreSQL** - servicio gestionado
4. **Redis** - servicio gestionado

## 🔧 Pasos para Deployar

### 1. Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Autoriza Railway para acceder a tus repositorios

### 2. Crear Nuevo Proyecto

1. Haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Elige tu repositorio: `Toni872/SISTEMAEMPRESARIAL`
4. Railway detectará automáticamente los servicios

### 3. Configurar Servicios

Railway debería detectar automáticamente:
- **Backend** (FastAPI) en `backend/`
- **Frontend** (Next.js) en `frontend-next/`

Si no los detecta automáticamente:

#### Backend Service
1. Haz clic en **"New"** → **"GitHub Repo"**
2. Selecciona el mismo repositorio
3. En **"Root Directory"**, selecciona `backend`
4. Railway detectará que es Python/FastAPI

#### Frontend Service
1. Haz clic en **"New"** → **"GitHub Repo"**
2. Selecciona el mismo repositorio
3. En **"Root Directory"**, selecciona `frontend-next`
4. Railway detectará que es Next.js

### 4. Añadir Bases de Datos

#### PostgreSQL
1. Haz clic en **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway creará automáticamente las variables de entorno:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

#### Redis
1. Haz clic en **"New"** → **"Database"** → **"Redis"**
2. Railway creará automáticamente:
   - `REDIS_URL`

### 5. Configurar Variables de Entorno

Ve a cada servicio y configura las variables de entorno:

#### Backend Service - Variables de Entorno

```bash
# Base de datos (se conecta automáticamente al PostgreSQL de Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (se conecta automáticamente al Redis de Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Seguridad
SECRET_KEY=tu-secret-key-super-segura-generada-aleatoriamente
MIN_SECRET_KEY_LENGTH=32

# Entorno
ENV=production
ENVIRONMENT=production

# CORS - IMPORTANTE: Usa la URL de tu frontend en Railway
CORS_ORIGINS=https://tu-frontend.railway.app,https://tu-dominio-custom.com

# API URL para el frontend
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app

# Sentry (opcional)
SENTRY_DSN=tu-sentry-dsn-si-lo-usas

# Verifactu (si lo usas)
VERIFACTU_API_URL=tu-url-verifactu
VERIFACTU_CLIENT_ID=tu-client-id
VERIFACTU_CLIENT_SECRET=tu-client-secret
VERIFACTU_CERT_PATH=/path/to/cert.pem
VERIFACTU_KEY_PATH=/path/to/key.pem
```

**Nota**: Railway permite usar referencias a otros servicios con `${{Service.VARIABLE}}`

#### Frontend Service - Variables de Entorno

```bash
# API URL del backend
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app

# Entorno
NODE_ENV=production

# Sentry (opcional)
NEXT_PUBLIC_SENTRY_DSN=tu-sentry-dsn-frontend
```

### 6. Configurar Puertos

Railway automáticamente asigna puertos y los expone a través de la variable `PORT`. 

- **Backend**: Railway detectará que usa el puerto 8000, pero usará `$PORT` automáticamente
- **Frontend**: Next.js usará `$PORT` automáticamente

### 7. Configurar Dominios (Opcional)

1. Ve a cada servicio
2. Haz clic en **"Settings"** → **"Generate Domain"**
3. Railway generará una URL única: `tu-servicio.railway.app`
4. Puedes configurar un dominio personalizado después

### 8. Deploy

Railway desplegará automáticamente cuando:
- Haces push a la rama conectada (por defecto `master`)
- Haces cambios manualmente desde el dashboard

## 🔗 Conectar Servicios

### Backend → PostgreSQL
Railway automáticamente inyecta `DATABASE_URL` cuando conectas el servicio PostgreSQL al backend.

### Backend → Redis
Railway automáticamente inyecta `REDIS_URL` cuando conectas el servicio Redis al backend.

### Frontend → Backend
Usa la variable `NEXT_PUBLIC_API_URL` apuntando a la URL del backend en Railway.

## 📝 Actualizar Código para Railway

### Backend - Usar PORT de Railway

El backend ya está configurado para usar `PORT` si está disponible. Verifica `backend/app/main.py`:

```python
import os
port = int(os.getenv("PORT", 8000))
```

Si no está configurado así, Railway lo manejará automáticamente.

### Frontend - Next.js y PORT

Next.js automáticamente usa `PORT` cuando está disponible. No necesitas cambios adicionales.

## 🧪 Verificar Deployment

1. **Backend**: Visita `https://tu-backend.railway.app/docs` (Swagger UI)
2. **Frontend**: Visita `https://tu-frontend.railway.app`
3. **Logs**: Revisa los logs en tiempo real desde el dashboard de Railway

## 🔍 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que el servicio PostgreSQL esté conectado al backend
- Verifica que `DATABASE_URL` esté configurada correctamente
- Revisa los logs del backend

### Error: "CORS error"
- Asegúrate de que `CORS_ORIGINS` incluya la URL del frontend
- Verifica que `NEXT_PUBLIC_API_URL` apunte al backend correcto

### Error: "Port already in use"
- Railway maneja los puertos automáticamente, no deberías tener este error
- Si ocurre, verifica que estés usando `$PORT` en lugar de un puerto fijo

### Build falla
- Revisa los logs de build en Railway
- Verifica que todas las dependencias estén en `requirements.txt` (backend) y `package.json` (frontend)
- Asegúrate de que el directorio raíz esté configurado correctamente

## 💰 Planes y Precios

- **Plan Gratuito**: $5 de crédito mensual (suficiente para desarrollo/testing)
- **Plan Developer**: $20/mes - Más recursos y mejor rendimiento
- **Plan Team**: Para equipos

## 📚 Referencias

- [Documentación de Railway](https://docs.railway.app)
- [Railway - Python/FastAPI](https://docs.railway.app/guides/python)
- [Railway - Next.js](https://docs.railway.app/guides/nextjs)
- [Railway - PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Railway - Redis](https://docs.railway.app/databases/redis)

## ✅ Checklist Pre-Deployment

- [ ] Cuenta de Railway creada
- [ ] Repositorio conectado
- [ ] Servicios detectados/creados (Backend, Frontend)
- [ ] PostgreSQL añadido y conectado al backend
- [ ] Redis añadido y conectado al backend
- [ ] Variables de entorno configuradas
- [ ] `CORS_ORIGINS` incluye la URL del frontend
- [ ] `NEXT_PUBLIC_API_URL` apunta al backend
- [ ] Dominios generados (opcional)
- [ ] Primer deploy exitoso
- [ ] Verificación de endpoints funcionando

## 🎯 Próximos Pasos

1. Desplegar en Railway siguiendo esta guía
2. Configurar dominio personalizado (opcional)
3. Configurar CI/CD para deploys automáticos
4. Configurar monitoreo y alertas
5. Configurar backups de la base de datos




