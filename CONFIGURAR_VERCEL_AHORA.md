# ⚡ Configurar Vercel AHORA - Guía Rápida

## 🚨 Problema Actual

Estás viendo este error en Vercel:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Login error: No se puede conectar con el servidor
```

**Causa:** La variable de entorno `NEXT_PUBLIC_API_URL` no está configurada en Vercel, por lo que el frontend intenta conectarse a `localhost:8000` que no existe en producción.

## ✅ Solución Rápida (2 minutos)

### Opción 1: Solo Visualización (Sin Backend)

Si solo quieres ver el frontend funcionando:

1. Ve a: https://vercel.com/toni872s-projects/frontend-next-silk-inky/settings/environment-variables
2. Agrega esta variable:

```
NEXT_PUBLIC_API_URL=https://httpbin.org/get
```

**Nota:** Esto no funcionará para login real, pero evitará los errores de conexión y podrás ver la UI.

### Opción 2: Con Backend Local (ngrok)

1. **Inicia tu backend local:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **En otra terminal, inicia ngrok:**
   ```bash
   ngrok http 8000
   ```

3. **Copia la URL HTTPS** que te da ngrok (ej: `https://abc123.ngrok.io`)

4. **Configura en Vercel:**
   - Ve a: https://vercel.com/toni872s-projects/frontend-next-silk-inky/settings/environment-variables
   - Agrega o actualiza:
     ```
     NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
     ```
   - Marca: ✅ Production, ✅ Preview, ✅ Development

5. **Redesplega:**
   - Ve a: https://vercel.com/toni872s-projects/frontend-next-silk-inky/deployments
   - Click en los 3 puntos (⋯) del último despliegue
   - Click en "Redeploy"

6. **Prueba:** Abre https://frontend-next-silk-inky.vercel.app/login

### Opción 3: Desplegar Backend (Recomendado para Producción)

Sigue la guía `DEPLOY_BACKEND_RAILWAY.md` para desplegar el backend en Railway, luego configura:

```
NEXT_PUBLIC_API_URL=https://tu-backend-railway.up.railway.app
```

## 📋 Pasos Detallados para Configurar Variable

1. **Accede a Vercel:**
   - Ve a: https://vercel.com/toni872s-projects/frontend-next-silk-inky/settings/environment-variables

2. **Agrega Variable:**
   - Click en **"Add New"**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** Tu URL del backend (ngrok o Railway)
   - **Environments:** Marca las 3 opciones (Production, Preview, Development)

3. **Guarda y Redesplega:**
   - Click en **"Save"**
   - Ve a **"Deployments"**
   - Click en los 3 puntos (⋯) → **"Redeploy"**

## 🔍 Verificar que Funciona

1. Abre: https://frontend-next-silk-inky.vercel.app/login
2. Abre la consola del navegador (F12)
3. Deberías ver: `🔗 API Client inicializado con URL: https://tu-backend-url.com`
4. Intenta hacer login (si configuraste ngrok o backend desplegado)

## ⚠️ Importante

- **NO** uses `http://localhost:8000` en producción (no funcionará)
- **NO** incluyas `/api` al final de la URL
- La URL debe ser HTTPS si estás usando ngrok o backend desplegado
- Después de agregar la variable, SIEMPRE haz redeploy

## 🆘 Si Sigue Sin Funcionar

1. Verifica que la variable esté guardada correctamente
2. Verifica que hayas hecho redeploy después de agregar la variable
3. Verifica que el backend esté corriendo y accesible (si usas ngrok)
4. Revisa los logs de build en Vercel para ver si hay errores

---

**¿Necesitas ayuda?** Revisa `VERCEL_DESARROLLO.md` para más detalles.

