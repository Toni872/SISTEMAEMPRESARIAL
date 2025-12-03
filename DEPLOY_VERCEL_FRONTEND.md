# 🚀 Deploy Frontend a Vercel

## ✅ Pasos para Deployar

### Paso 1: Conectar Repositorio en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub: `Toni872/SISTEMAEMPRESARIAL`
4. Configura el proyecto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend-next`
   - **Build Command:** `npm run build` (o déjalo vacío, Vercel lo detecta automáticamente)
   - **Output Directory:** `.next` (o déjalo vacío)
   - **Install Command:** `npm install`

### Paso 2: Configurar Variables de Entorno

**CRÍTICO:** Antes de hacer deploy, configura estas variables:

1. En la página de configuración del proyecto, ve a "Environment Variables"
2. Añade estas variables:

```
NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app
```

**IMPORTANTE:**
- Sin comillas alrededor del valor
- Sin barra final `/`
- Debe ser HTTPS

### Paso 3: Deploy

1. Haz clic en "Deploy"
2. Vercel hará el build automáticamente
3. Espera a que termine (2-3 minutos)

### Paso 4: Verificar

1. Una vez terminado el deploy, Vercel te dará una URL (algo como `tu-proyecto.vercel.app`)
2. Abre esa URL en el navegador
3. Abre DevTools (F12) → Console
4. Debe aparecer:
   ```
   🔍 API_URL configurada: https://sistemaempresarial-production.up.railway.app
   ```
5. Intenta hacer login

---

## 🔧 Configuración Adicional

### Variables de Entorno Recomendadas

Si necesitas más variables en el futuro, añádelas en Vercel → Settings → Environment Variables:

- `NEXT_PUBLIC_API_URL` (ya configurada)
- Cualquier otra variable `NEXT_PUBLIC_*` que necesites

### Dominio Personalizado (Opcional)

1. Ve a Vercel → Settings → Domains
2. Añade tu dominio personalizado si lo tienes

---

## ✅ Ventajas de Vercel

- ✅ Deploy automático desde GitHub
- ✅ Builds rápidos y optimizados para Next.js
- ✅ SSL automático
- ✅ CDN global
- ✅ Preview deployments para cada PR
- ✅ Variables de entorno fáciles de configurar

---

## 🆘 Si Hay Problemas

### Error de Build

1. Ve a Vercel → Deployments → [último deployment] → Build Logs
2. Revisa los errores
3. Los logs mostrarán exactamente qué falló

### Variable no se está leyendo

1. Verifica que `NEXT_PUBLIC_API_URL` esté configurada en Vercel
2. Verifica que no tenga comillas
3. Haz un nuevo deploy después de cambiar variables

---

## 📝 Notas

- Vercel detecta automáticamente Next.js y configura todo
- No necesitas `vercel.json` para configuración básica
- Cada push a `main` hará deploy automático
- Puedes tener preview deployments para otras ramas

---

## 🎯 Resumen

1. Conecta repositorio en Vercel
2. Configura `NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app`
3. Deploy
4. Verifica que funcione

¡Listo! Vercel es mucho más simple para Next.js que Railway.


