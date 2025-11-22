# 🎨 Desplegar Backend en Render

Render es otra excelente opción para desplegar aplicaciones FastAPI. Tiene un plan gratuito y es muy fácil de usar.

## ✅ Ventajas de Render

- ✅ Plan gratuito disponible
- ✅ Soporte para Docker
- ✅ Base de datos PostgreSQL gratuita (con limitaciones)
- ✅ SSL/HTTPS automático
- ✅ Despliegue automático desde GitHub
- ✅ Logs en tiempo real

## 📋 Prerrequisitos

1. Cuenta en [Render](https://render.com) (puedes usar GitHub para registrarte)
2. Repositorio en GitHub

## 🚀 Pasos para Desplegar

### Paso 1: Crear Servicio Web

1. Ve a [render.com](https://render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `SISTEMAEMPRESARIAL`

### Paso 2: Configurar el Servicio

**Configuración básica:**

- **Name:** `sistema-empresarial-backend` (o el nombre que prefieras)
- **Region:** `Frankfurt` (más cercano a España) o `Oregon` (más estable)
- **Branch:** `master` o `main`
- **Root Directory:** `backend`
- **Runtime:** `Docker`
- **Build Command:** (dejar vacío, Render usa Docker)
- **Start Command:** (dejar vacío, Render usa el CMD del Dockerfile)

### Paso 3: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

```env
# Base de datos (configurar después de crear la DB)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
SECRET_KEY=tu-secret-key-super-segura-aqui-minimo-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Entorno
ENV=production
DEBUG=False

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3001","http://localhost:3000","https://frontend-next-silk.vercel.app"]

# Verifactu (opcional)
VERIFACTU_CERTIFICATES_DIR=certificates
AEAT_BASE_URL=https://sede.agenciatributaria.gob.es/verifactu/api
```

### Paso 4: Crear Base de Datos PostgreSQL

1. En el dashboard de Render, click en **"New +"** → **"PostgreSQL"**
2. Configura:
   - **Name:** `sistema-empresarial-db`
   - **Database:** `erp_db`
   - **User:** (se generará automáticamente)
   - **Region:** Misma región que tu servicio web
   - **Plan:** `Free` (para desarrollo) o `Starter` (para producción)
3. Click en **"Create Database"**
4. Una vez creada, ve a **"Connections"** y copia la **"Internal Database URL"**
5. Pégala en la variable `DATABASE_URL` de tu servicio web

### Paso 5: Ajustar Dockerfile (si es necesario)

Render usa el puerto definido en la variable `PORT`. Asegúrate de que tu aplicación lo use:

```dockerfile
# Render inyecta PORT automáticamente
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### Paso 6: Desplegar

1. Click en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. Puedes ver el progreso en los logs en tiempo real

### Paso 7: Ejecutar Migraciones

Una vez desplegado, ejecuta las migraciones:

**Opción A: Desde Render Shell**

1. Ve a tu servicio web
2. Click en **"Shell"**
3. Ejecuta:
```bash
alembic upgrade head
```

**Opción B: Desde tu máquina local**

```bash
# Conectar a la base de datos de Render y ejecutar migraciones localmente
export DATABASE_URL="postgresql://user:password@host:5432/dbname"
alembic upgrade head
```

### Paso 8: Obtener la URL

Render te dará una URL automáticamente:
- Formato: `https://sistema-empresarial-backend.onrender.com`
- La URL estará disponible en el dashboard del servicio

### Paso 9: Configurar CORS

Actualiza `BACKEND_CORS_ORIGINS` con tu dominio de Render:

```env
BACKEND_CORS_ORIGINS=["http://localhost:3001","http://localhost:3000","https://frontend-next-silk.vercel.app","https://sistema-empresarial-backend.onrender.com"]
```

## 🔗 Conectar Frontend en Vercel

1. Ve a Vercel: https://vercel.com/toni872s-projects/frontend-next-silk/settings/environment-variables
2. Agrega:

```
NEXT_PUBLIC_API_URL=https://sistema-empresarial-backend.onrender.com
```

3. Redesplega el frontend

## ⚠️ Nota Importante sobre el Plan Gratuito

Render tiene algunas limitaciones en el plan gratuito:

- **Sleep después de inactividad:** El servicio se "duerme" después de 15 minutos de inactividad
- **Primera petición lenta:** La primera petición después de dormir puede tardar 30-60 segundos
- **Para producción:** Considera el plan **Starter** ($7/mes) para evitar el sleep

## 🔄 Despliegue Automático

Render despliega automáticamente cada vez que haces push a la rama configurada.

## 📊 Monitoreo

- **Logs:** Disponibles en tiempo real en la pestaña "Logs"
- **Métricas:** CPU, RAM en la pestaña "Metrics"
- **Base de datos:** Puedes conectarte con cualquier cliente PostgreSQL

## 💰 Costos

- **Plan gratuito:** Disponible con limitaciones (sleep después de inactividad)
- **Plan Starter:** $7/mes (sin sleep, mejor para producción)
- **Base de datos PostgreSQL:** Gratis (hasta 90 días) o $7/mes

## 🐛 Troubleshooting

### Error: "Build failed"
- Verifica los logs de build
- Asegúrate de que el Dockerfile esté en el directorio `backend`
- Verifica que todas las dependencias estén en `requirements.txt`

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Usa la **"Internal Database URL"** para mejor rendimiento
- Asegúrate de que la base de datos esté en la misma región

### El servicio se "duerme"
- Esto es normal en el plan gratuito
- La primera petición después de dormir puede tardar
- Considera el plan Starter para producción

### CORS errors
- Verifica que `BACKEND_CORS_ORIGINS` incluya tu dominio de Vercel
- Asegúrate de que el formato sea correcto (lista JSON)

---

**¿Necesitas ayuda?** Revisa la [documentación de Render](https://render.com/docs)

