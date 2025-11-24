# 📝 Guía de Variables de Entorno

Esta guía te muestra dónde y cómo configurar las variables de entorno para el proyecto.

## 📍 Ubicación de los Archivos

### Frontend (Next.js)

**Ubicación:** `frontend-next/.env.local`

Este archivo **NO existe por defecto**, debes crearlo tú mismo. Next.js lo lee automáticamente.

**Pasos:**

1. Ve a la carpeta `frontend-next/`
2. Crea un archivo llamado `.env.local`
3. Copia el contenido de `.env.local.example` (si existe) o usa este template:

```bash
# Variables de entorno para el Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SENTRY_DSN=
```

**Variables importantes:**

- `NEXT_PUBLIC_API_URL` - URL del backend (requerido)
- `NEXT_PUBLIC_SENTRY_DSN` - DSN de Sentry (opcional)

### Backend (FastAPI)

**Ubicación:** `backend/.env`

Este archivo **NO existe por defecto**, debes crearlo tú mismo. Hay un archivo de ejemplo: `backend/env.example`

**Pasos:**

1. Ve a la carpeta `backend/`
2. Copia `env.example` a `.env`:

   ```bash
   cp env.example .env
   ```

3. Edita `.env` con tus valores

**Variables importantes:**

- `DATABASE_URL` - URL de la base de datos PostgreSQL
- `SECRET_KEY` - Clave secreta para JWT (genera una nueva)
- `SENTRY_DSN` - DSN de Sentry (opcional)

## 🔧 Configuración Rápida

### Frontend

```bash
cd frontend-next
# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Backend

```bash
cd backend
# Copiar archivo de ejemplo
cp env.example .env
# Editar .env con tus valores
```

## 📋 Variables Comunes

### Frontend (.env.local)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL del backend API | `http://localhost:8000` |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN de Sentry (opcional) | `https://xxx@sentry.io/xxx` |

### Backend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://user:pass@localhost:5432/erp` |
| `SECRET_KEY` | Clave secreta para JWT | Genera una nueva con: `openssl rand -hex 32` |
| `ENV` | Entorno (development/production) | `development` |
| `SENTRY_DSN` | DSN de Sentry (opcional) | `https://xxx@sentry.io/xxx` |

## 🔒 Seguridad

**IMPORTANTE:**

- ✅ Los archivos `.env` y `.env.local` están en `.gitignore` (no se suben a GitHub)
- ✅ Nunca subas estos archivos al repositorio
- ✅ Usa diferentes valores para desarrollo y producción
- ✅ Genera nuevas `SECRET_KEY` para cada entorno

## 🚀 Para Producción

### Vercel (Frontend)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `NEXT_PUBLIC_API_URL` = URL de tu backend desplegado
   - `NEXT_PUBLIC_SENTRY_DSN` = Tu DSN de Sentry (opcional)

### Railway/Render (Backend)

1. Ve a tu proyecto en Railway/Render
2. Variables de entorno
3. Agrega todas las variables del archivo `.env`

## ✅ Verificación

### Frontend

Para verificar que las variables se están leyendo:

```bash
cd frontend-next
npm run dev
# Abre http://localhost:3001
# Abre DevTools → Console
# Deberías ver: "🔗 API Client inicializado con URL: http://localhost:8000"
```

### Backend

Para verificar que las variables se están leyendo:

```bash
cd backend
python -c "from app.core.config import settings; print(f'API URL: {settings.DATABASE_URL[:20]}...')"
```

## 📚 Archivos de Ejemplo

- `frontend-next/.env.local.example` - Template para frontend
- `backend/env.example` - Template para backend

## 🆘 Problemas Comunes

### "No se puede conectar con el servidor"

**Solución:** Verifica que `NEXT_PUBLIC_API_URL` en `.env.local` apunte al backend correcto.

### "ModuleNotFoundError" en backend

**Solución:** Verifica que todas las dependencias estén instaladas: `pip install -r requirements.txt`

### Variables no se leen

**Solución:**

- Frontend: Reinicia el servidor de desarrollo (`npm run dev`)
- Backend: Reinicia el servidor FastAPI
- Verifica que los archivos se llamen exactamente `.env.local` (frontend) o `.env` (backend)
