# 🚂 Railway - Guía Paso a Paso

## Paso 1: Crear Proyecto en Railway

1. Ve a https://railway.app
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Busca y selecciona: `Toni872/SISTEMAEMPRESARIAL`
6. Haz clic en **"Deploy Now"**

Railway comenzará a detectar automáticamente los servicios.

---

## Paso 2: Verificar Servicios Detectados

Railway debería detectar automáticamente:

- ✅ **Backend** (FastAPI) - desde `backend/`
- ✅ **Frontend** (Next.js) - desde `frontend-next/`

Si NO los detecta automáticamente:

### Crear Backend Service manualmente:
1. Haz clic en **"New"** → **"GitHub Repo"**
2. Selecciona `Toni872/SISTEMAEMPRESARIAL`
3. En **"Root Directory"**, escribe: `backend`
4. Railway detectará que es Python/FastAPI

### Crear Frontend Service manualmente:
1. Haz clic en **"New"** → **"GitHub Repo"**
2. Selecciona `Toni872/SISTEMAEMPRESARIAL`
3. En **"Root Directory"**, escribe: `frontend-next`
4. Railway detectará que es Next.js

---

## Paso 3: Añadir Bases de Datos

### PostgreSQL:
1. Haz clic en **"New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway creará automáticamente el servicio
4. Se generarán automáticamente estas variables:
   - `DATABASE_URL`
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Redis:
1. Haz clic en **"New"**
2. Selecciona **"Database"** → **"Redis"**
3. Railway creará automáticamente el servicio
4. Se generará automáticamente: `REDIS_URL`

---

## Paso 4: Configurar Variables de Entorno - BACKEND

Ve al servicio **Backend** → Haz clic en **"Variables"** (o Settings → Variables)

### Variables OBLIGATORIAS:

```bash
# 1. Base de datos (conectar PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# 2. Redis (conectar Redis)
REDIS_URL=${{Redis.REDIS_URL}}

# 3. SECRET_KEY (genera una nueva - ver abajo)
SECRET_KEY=GENERA_UNA_NUEVA_SECRET_KEY_AQUI

# 4. Entorno
ENV=production
DEBUG=False

# 5. CORS (actualizar después del primer deploy con la URL del frontend)
BACKEND_CORS_ORIGINS=https://tu-frontend.railway.app
```

### Variables OPCIONALES (puedes añadirlas después):

```bash
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
PASSWORD_HASH_ALGORITHM=bcrypt
PROJECT_NAME=ERP Sistema Backend
VERSION=1.0.0
API_V1_STR=/api/v1
RATE_LIMIT_ENABLED=True
RATE_LIMIT_PER_MINUTE=60
```

**IMPORTANTE**: Para `DATABASE_URL` y `REDIS_URL`, usa la sintaxis `${{Service.VARIABLE}}` para referenciar los servicios de Railway.

---

## Paso 5: Configurar Variables de Entorno - FRONTEND

Ve al servicio **Frontend** → Haz clic en **"Variables"**

### Variables OBLIGATORIAS:

```bash
# API Backend (actualizar después del primer deploy con la URL del backend)
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app

# Entorno
NODE_ENV=production
```

**IMPORTANTE**: `NEXT_PUBLIC_API_URL` debe actualizarse después del primer deploy con la URL real del backend.

---

## Paso 6: Generar SECRET_KEY

Para generar una SECRET_KEY segura, ejecuta en tu terminal:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

O usa este generador online: https://randomkeygen.com/

Copia el resultado y úsalo como valor de `SECRET_KEY` en el Backend.

---

## Paso 7: Primer Deploy

1. Railway comenzará a desplegar automáticamente
2. Espera a que termine el build (puede tardar 5-10 minutos)
3. Railway generará URLs automáticas para cada servicio:
   - Backend: `https://tu-backend-xxxx.up.railway.app`
   - Frontend: `https://tu-frontend-xxxx.up.railway.app`

---

## Paso 8: Actualizar URLs después del Primer Deploy

Una vez que tengas las URLs:

### En BACKEND:
1. Ve a Backend → Variables
2. Actualiza `BACKEND_CORS_ORIGINS`:
   ```
   BACKEND_CORS_ORIGINS=https://tu-frontend-xxxx.up.railway.app
   ```

### En FRONTEND:
1. Ve a Frontend → Variables
2. Actualiza `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend-xxxx.up.railway.app
   ```

Railway redeployará automáticamente con las nuevas variables.

---

## Paso 9: Verificar Deployment

1. **Backend**: Visita `https://tu-backend-xxxx.up.railway.app/docs`
   - Deberías ver Swagger UI funcionando

2. **Frontend**: Visita `https://tu-frontend-xxxx.up.railway.app`
   - Deberías ver la aplicación funcionando

3. **Logs**: Revisa los logs en Railway Dashboard si hay errores

---

## 🎯 Resumen de Variables Mínimas

### Backend (mínimo necesario):
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
SECRET_KEY=tu-secret-key-generada
ENV=production
BACKEND_CORS_ORIGINS=https://tu-frontend.railway.app
```

### Frontend (mínimo necesario):
```
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
NODE_ENV=production
```

---

## ✅ Checklist Final

- [ ] Proyecto creado en Railway
- [ ] Repositorio conectado
- [ ] Backend service creado/detectado
- [ ] Frontend service creado/detectado
- [ ] PostgreSQL añadido
- [ ] Redis añadido
- [ ] Variables de entorno configuradas en Backend
- [ ] Variables de entorno configuradas en Frontend
- [ ] Primer deploy completado
- [ ] URLs obtenidas
- [ ] URLs actualizadas en variables de entorno
- [ ] Backend accesible en `/docs`
- [ ] Frontend accesible y funcionando

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté conectado al Backend
- Verifica que `DATABASE_URL` use `${{Postgres.DATABASE_URL}}`

### Error: "CORS error"
- Verifica que `BACKEND_CORS_ORIGINS` tenga la URL exacta del frontend
- Asegúrate de incluir `https://` en la URL

### Build falla
- Revisa los logs en Railway Dashboard
- Verifica que el directorio raíz esté correcto (`backend` o `frontend-next`)

### Variables no se aplican
- Asegúrate de guardar las variables después de añadirlas
- Railway redeployará automáticamente

---

## 📚 Documentación Adicional

- Guía completa: `DEPLOY_RAILWAY.md`
- Lista de variables: `RAILWAY_VARIABLES.md`
- Railway Docs: https://docs.railway.app




