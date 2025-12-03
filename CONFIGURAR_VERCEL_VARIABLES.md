# 🔧 Configurar Variables de Entorno en Vercel

## Problema Actual
El frontend en Vercel está intentando conectarse a `http://localhost:8000`, que no es accesible desde producción.

## Solución: Configurar `NEXT_PUBLIC_API_URL`

### Paso 1: Obtener la URL del Backend en Railway

1. Ve a tu proyecto en Railway: https://railway.app
2. Abre el servicio del **Backend**
3. Ve a la pestaña **"Settings"** o **"Variables"**
4. Busca la URL pública del servicio (debería ser algo como: `https://tu-backend.up.railway.app`)
5. **Copia esa URL completa** (sin `/api` al final)

### Paso 2: Configurar Variable en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com
2. Abre el proyecto **frontend-next**
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **"Add New"**
5. Configura:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://tu-backend.up.railway.app` (la URL que copiaste)
   - **Environment:** Selecciona **Production**, **Preview**, y **Development**
6. Haz clic en **"Save"**

### Paso 3: Redesplegar

Después de agregar la variable, Vercel debería redespelgar automáticamente. Si no:
1. Ve a **Deployments**
2. Haz clic en los **3 puntos** del último deployment
3. Selecciona **"Redeploy"**

---

## ⚠️ Importante: También Configurar CORS en Railway

Asegúrate de que en Railway (Backend) tengas configurado:

**Variable:** `BACKEND_CORS_ORIGINS`  
**Value:** `https://frontend-next-silk.vercel.app,https://frontend-next-dzi9luz9y-toni872s-projects.vercel.app`

Esto permite que el frontend en Vercel se conecte al backend.

---

## ✅ Verificación

Después de configurar:
1. Espera a que termine el redeploy
2. Abre: https://frontend-next-silk.vercel.app
3. Intenta hacer login
4. Debería funcionar sin errores CORS

