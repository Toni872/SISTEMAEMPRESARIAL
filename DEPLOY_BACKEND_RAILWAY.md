# 🚂 Desplegar Backend en Railway

Railway es una excelente opción para desplegar aplicaciones FastAPI. Es fácil de usar, tiene un plan gratuito generoso y soporta Docker.

## ✅ Ventajas de Railway

- ✅ Plan gratuito con $5 de crédito mensual
- ✅ Soporte nativo para Docker
- ✅ Base de datos PostgreSQL incluida
- ✅ Variables de entorno fáciles de configurar
- ✅ Despliegue automático desde GitHub
- ✅ Logs en tiempo real
- ✅ SSL/HTTPS automático

## 📋 Prerrequisitos

1. Cuenta en [Railway](https://railway.app) (puedes usar GitHub para registrarte)
2. Repositorio en GitHub

## 🚀 Pasos para Desplegar

### Paso 1: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Selecciona tu repositorio `SISTEMAEMPRESARIAL`
5. Railway detectará automáticamente el Dockerfile

### Paso 2: Configurar el Servicio

1. Railway creará un servicio automáticamente
2. Si no detecta el Dockerfile, click en **"New"** → **"GitHub Repo"**
3. Selecciona el repositorio y el directorio `backend`

### Paso 3: Configurar Variables de Entorno

Ve a **Variables** y agrega:

```env
# Base de datos (Railway creará una PostgreSQL automáticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
SECRET_KEY=tu-secret-key-super-segura-aqui-minimo-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Entorno
ENV=production
DEBUG=False

# CORS (agrega tu dominio de Vercel)
BACKEND_CORS_ORIGINS=["http://localhost:3001","http://localhost:3000","https://frontend-next-silk.vercel.app"]

# Verifactu (opcional, configurar después)
VERIFACTU_CERTIFICATES_DIR=certificates
AEAT_BASE_URL=https://sede.agenciatributaria.gob.es/verifactu/api
```

**Nota:** Railway creará automáticamente una base de datos PostgreSQL. Usa `${{Postgres.DATABASE_URL}}` para conectarte.

### Paso 4: Agregar Base de Datos PostgreSQL

1. En tu proyecto Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente la base de datos
4. La variable `DATABASE_URL` se configurará automáticamente

### Paso 5: Configurar el Puerto

Railway usa la variable `PORT` automáticamente. Asegúrate de que tu aplicación escuche en ese puerto:

En `backend/app/main.py` o en el Dockerfile, Railway inyectará `PORT` automáticamente.

Si necesitas ajustar el Dockerfile:

```dockerfile
# Railway usa PORT automáticamente
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### Paso 6: Ejecutar Migraciones

1. Ve a la pestaña **"Deployments"**
2. Click en el último despliegue
3. Click en **"View Logs"**
4. O puedes usar Railway CLI:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ejecutar migraciones
railway run alembic upgrade head
```

### Paso 7: Obtener la URL

1. Ve a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Railway te dará una URL como: `https://tu-proyecto.up.railway.app`
4. Copia esta URL

### Paso 8: Configurar CORS

Actualiza `BACKEND_CORS_ORIGINS` en las variables de entorno con tu dominio de Railway:

```env
BACKEND_CORS_ORIGINS=["http://localhost:3001","http://localhost:3000","https://frontend-next-silk.vercel.app","https://tu-proyecto.up.railway.app"]
```

## 🔗 Conectar Frontend en Vercel

1. Ve a Vercel: https://vercel.com/toni872s-projects/frontend-next-silk/settings/environment-variables
2. Agrega:

```
NEXT_PUBLIC_API_URL=https://tu-proyecto.up.railway.app
```

3. Redesplega el frontend

## 🔄 Despliegue Automático

Railway despliega automáticamente cada vez que haces push a `master` o `main`.

## 📊 Monitoreo

- **Logs:** Disponibles en tiempo real en la pestaña "Deployments"
- **Métricas:** CPU, RAM, Red en la pestaña "Metrics"
- **Base de datos:** Puedes conectarte con cualquier cliente PostgreSQL usando las credenciales de Railway

## 💰 Costos

- **Plan gratuito:** $5 de crédito mensual (suficiente para desarrollo/testing)
- **Plan Pro:** $20/mes para producción

## 🐛 Troubleshooting

### Error: "Database connection failed"
- Verifica que la variable `DATABASE_URL` esté configurada
- Asegúrate de que la base de datos PostgreSQL esté creada y conectada

### Error: "Port already in use"
- Railway maneja el puerto automáticamente, no necesitas configurarlo manualmente

### Las migraciones no se ejecutan
- Ejecuta manualmente: `railway run alembic upgrade head`
- O agrega un script de inicio en el Dockerfile

### CORS errors
- Verifica que `BACKEND_CORS_ORIGINS` incluya tu dominio de Vercel
- Asegúrate de que el formato sea correcto (lista JSON)

---

**¿Necesitas ayuda?** Revisa la [documentación de Railway](https://docs.railway.app)

