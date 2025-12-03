# 🔍 Cómo Encontrar la URL Pública del Backend en Railway

## Pasos para encontrar la URL:

1. **Ve a Railway:** https://railway.app
2. **Abre tu proyecto** (el que tiene el backend)
3. **Haz clic en el servicio "Backend"** (o el servicio que ejecuta tu FastAPI)
4. **Ve a la pestaña "Settings"** o **"Networking"**
5. **Busca "Public Domain"** o **"Generate Domain"**
6. **Copia la URL** que aparece (debería ser algo como):
   - `https://sistemaempresarial-production.up.railway.app`
   - `https://sistemaempresarial-backend.up.railway.app`
   - `https://[tu-proyecto]-[servicio].up.railway.app`

## Si no tiene dominio público:

1. En Railway, ve al servicio Backend
2. Ve a **Settings** → **Networking**
3. Haz clic en **"Generate Domain"** o **"Public Domain"**
4. Railway generará una URL pública automáticamente
5. Copia esa URL

## ⚠️ Importante:

- La URL debe empezar con `https://`
- NO debe terminar en `/api` o `/api/v1`
- Debe ser la URL raíz del servicio (ej: `https://tu-backend.up.railway.app`)

---

## Una vez que tengas la URL:

1. **En Vercel:**
   - Ve a Settings → Environment Variables
   - Agrega/edita: `NEXT_PUBLIC_API_URL` = `https://tu-backend.up.railway.app`
   - Marca para Production, Preview, Development
   - Guarda

2. **En Railway (Backend):**
   - Actualiza `BACKEND_CORS_ORIGINS` a:
     ```
     https://frontend-next-silk.vercel.app,https://frontend-next-dzi9luz9y-toni872s-projects.vercel.app
     ```
   - (En lugar de `*` para mayor seguridad)

3. **Redespelgar ambos servicios**

