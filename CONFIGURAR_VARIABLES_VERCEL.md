# 🔧 Configurar Variables de Entorno en Vercel

## Problema Actual

El frontend desplegado en Vercel está intentando conectarse a `http://localhost:8000`, que solo funciona en desarrollo local. Necesitas configurar la URL del backend en producción.

## Solución: Configurar Variable de Entorno

### Paso 1: Obtener la URL del Backend

Tienes 3 opciones:

#### Opción A: Backend ya desplegado
Si tu backend ya está desplegado (Railway, Render, Fly.io, etc.), usa esa URL:
```
https://tu-backend-url.com
```

#### Opción B: Usar ngrok para desarrollo
Si el backend está corriendo localmente y quieres probarlo:

1. Instala ngrok: https://ngrok.com/download
2. Ejecuta: `ngrok http 8000`
3. Copia la URL HTTPS que te da (ej: `https://abc123.ngrok.io`)

#### Opción C: Desplegar el backend
Si aún no tienes el backend desplegado, necesitas desplegarlo primero.

### Paso 2: Configurar en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/toni872s-projects/frontend-next-silk-inky
2. Click en **Settings** (Configuración)
3. Click en **Environment Variables** (Variables de Entorno)
4. Agrega la siguiente variable:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://tu-backend-url.com` | ✅ Production, ✅ Preview, ✅ Development |

**Importante:** 
- Reemplaza `https://tu-backend-url.com` con la URL real de tu backend
- Marca las 3 opciones (Production, Preview, Development)
- **NO** incluyas `/api` al final, solo la URL base

### Paso 3: Redesplegar

Después de agregar la variable:

1. Ve a la pestaña **Deployments**
2. Click en los 3 puntos (⋯) del último despliegue
3. Click en **Redeploy**
4. O simplemente haz un nuevo push a GitHub

## Verificar que Funciona

1. Abre tu aplicación en Vercel: `https://frontend-next-silk-inky.vercel.app`
2. Abre la consola del navegador (F12)
3. Intenta hacer login
4. Deberías ver que ahora intenta conectarse a tu URL de backend, no a localhost

## Ejemplo de Configuración

Si tu backend está en Railway con URL `https://sistema-empresarial-backend.railway.app`:

```
NEXT_PUBLIC_API_URL = https://sistema-empresarial-backend.railway.app
```

Si estás usando ngrok temporalmente:

```
NEXT_PUBLIC_API_URL = https://abc123.ngrok.io
```

## Troubleshooting

### Error: "CORS policy"
Si ves errores de CORS, necesitas agregar tu dominio de Vercel a la lista de orígenes permitidos en el backend.

En `backend/app/main.py`, asegúrate de tener:

```python
BACKEND_CORS_ORIGINS = [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://frontend-next-silk-inky.vercel.app",  # Tu dominio de Vercel
]
```

### Error: "Connection refused"
- Verifica que la URL del backend sea correcta (sin `/api` al final)
- Verifica que el backend esté corriendo y accesible
- Verifica que hayas hecho redeploy después de agregar la variable

### La variable no se aplica
- Asegúrate de que el nombre sea exactamente `NEXT_PUBLIC_API_URL` (case-sensitive)
- Asegúrate de haber marcado los entornos correctos (Production, Preview, Development)
- Haz un redeploy después de agregar la variable

---

**¿Necesitas ayuda para desplegar el backend?** Puedo ayudarte con Railway, Render, o cualquier otra plataforma.

