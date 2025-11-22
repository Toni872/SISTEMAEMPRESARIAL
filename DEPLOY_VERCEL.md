# 🚀 Guía de Despliegue a Vercel

**Proyecto actual:** `frontend-next-silk-inky`  
**URL de producción:** https://frontend-next-silk-inky.vercel.app

## Prerrequisitos

1. Tener cuenta en [Vercel](https://vercel.com)
2. Tener el proyecto conectado a GitHub
3. Tener el backend desplegado y accesible (o usar la URL de desarrollo)

## Opción 1: Despliegue desde la CLI de Vercel

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Iniciar sesión

```bash
vercel login
```

### 3. Navegar al directorio del frontend

```bash
cd frontend-next
```

### 4. Desplegar

```bash
# Primera vez (configuración inicial)
# Vincular al proyecto existente
vercel link --project frontend-next-silk-inky

# Despliegues posteriores
vercel --prod
```

## Opción 2: Despliegue desde GitHub (Recomendado)

### 1. Conectar repositorio en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Selecciona tu repositorio `SISTEMAEMPRESARIAL`
4. Vercel detectará automáticamente que es un proyecto Next.js

### 2. Configurar el proyecto

**Project Name:** `sistema-empresarial-frontend` (o el nombre que prefieras)

**Root Directory:** `frontend-next`

**Build Command:** `npm run build`

**Output Directory:** `.next`

**Install Command:** `npm install`

**Nota:** Si ya existe un proyecto con ese nombre, puedes cambiarlo desde la configuración del proyecto en Vercel (Settings → General → Project Name) o usar un nombre diferente durante la configuración inicial.

### 3. Variables de Entorno

Agregar las siguientes variables de entorno en Vercel:

```
NEXT_PUBLIC_API_URL=https://tu-backend-url.com
```

**Importante:**

- Si el backend está en producción, usar la URL de producción
- Si el backend está local, usar un servicio como ngrok o desplegar el backend también

### 4. Desplegar

Click en "Deploy" y Vercel desplegará automáticamente.

## Configuración de Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agregar:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | `https://tu-backend-url.com` | Production, Preview, Development |

## Verificar el Despliegue

Una vez desplegado, Vercel te dará una URL como:

```
https://tu-proyecto.vercel.app
```

### Verificar que funciona

1. Abre la URL en el navegador
2. Deberías ver la landing page
3. Intenta hacer login (asegúrate de que el backend esté accesible)

## Actualizaciones Automáticas

Si conectaste el repositorio de GitHub, Vercel desplegará automáticamente:

- **Production:** Cada push a `master` o `main`
- **Preview:** Cada pull request

## Troubleshooting

### Error: "API_URL not found"

**Solución:** Verifica que la variable de entorno `NEXT_PUBLIC_API_URL` esté configurada en Vercel.

### Error: "Build failed"

**Solución:**

1. Revisa los logs de build en Vercel
2. Verifica que `npm run build` funcione localmente
3. Asegúrate de que todas las dependencias estén en `package.json`

### Error: "Cannot connect to backend"

**Solución:**

1. Verifica que el backend esté desplegado y accesible
2. Verifica la URL en `NEXT_PUBLIC_API_URL`
3. Verifica CORS en el backend para permitir tu dominio de Vercel

### CORS en Backend

Asegúrate de que en `backend/app/main.py` tengas:

```python
BACKEND_CORS_ORIGINS = [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://tu-proyecto.vercel.app",  # Agregar tu dominio de Vercel
]
```

## Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs

# Ver información del proyecto
vercel inspect

# Listar todos los despliegues
vercel ls

# Eliminar un despliegue
vercel remove
```

## Próximos Pasos

1. ✅ Desplegar el frontend a Vercel
2. ⏳ Desplegar el backend (Railway, Render, Fly.io, etc.)
3. ⏳ Configurar dominio personalizado
4. ⏳ Configurar SSL/HTTPS
5. ⏳ Configurar monitoreo y alertas

---

**¿Necesitas ayuda?** Revisa la [documentación de Vercel](https://vercel.com/docs)
