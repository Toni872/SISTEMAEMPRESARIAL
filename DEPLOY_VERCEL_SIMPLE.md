# 🚀 Deploy Frontend a Vercel - Guía Simple

## ✅ Pasos Rápidos

### 1. Conectar Repositorio en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **"Add New Project"**
3. Selecciona tu repositorio: `Toni872/SISTEMAEMPRESARIAL`
4. Configura:
   - **Framework Preset:** Next.js (se detecta automáticamente)
   - **Root Directory:** `frontend-next` ⚠️ **IMPORTANTE**
   - **Build Command:** (déjalo vacío, Vercel lo detecta)
   - **Output Directory:** (déjalo vacío)

### 2. Configurar Variable de Entorno

**ANTES de hacer deploy**, añade la variable:

1. En la misma página de configuración, busca **"Environment Variables"**
2. Haz clic en **"Add"**
3. Configura:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://sistemaempresarial-production.up.railway.app`
   - **Environment:** Production, Preview, Development (marca las 3)
   - ⚠️ **SIN comillas** alrededor del valor
   - ⚠️ **SIN barra final** `/`

### 3. Deploy

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos
3. ¡Listo! Vercel te dará una URL

### 4. Verificar

1. Abre la URL que te dio Vercel
2. Abre DevTools (F12) → Console
3. Debe aparecer:
   ```
   🔍 API_URL configurada: https://sistemaempresarial-production.up.railway.app
   ```
4. Intenta hacer login

---

## ✅ Ventajas de Vercel

- ✅ **Automático:** Cada push a `main` hace deploy automático
- ✅ **Rápido:** Builds optimizados para Next.js
- ✅ **SSL automático:** HTTPS sin configuración
- ✅ **CDN global:** Tu app carga rápido en todo el mundo
- ✅ **Preview deployments:** Cada PR tiene su propia URL
- ✅ **Variables fáciles:** Configuración simple de variables de entorno

---

## 🔧 Configuración Adicional (Opcional)

### Dominio Personalizado

1. Ve a Vercel → Settings → Domains
2. Añade tu dominio si lo tienes

### Variables Adicionales

Si necesitas más variables en el futuro:
1. Ve a Vercel → Settings → Environment Variables
2. Añade cualquier variable `NEXT_PUBLIC_*`

---

## 🆘 Si Hay Problemas

### Error de Build

1. Ve a Vercel → Deployments → [último deployment]
2. Haz clic en "Build Logs"
3. Revisa los errores (Vercel muestra errores claros)

### Variable no funciona

1. Verifica que `NEXT_PUBLIC_API_URL` esté configurada
2. Verifica que **no tenga comillas**
3. Haz un nuevo deploy después de cambiar variables

---

## 📝 Notas Importantes

- **Root Directory:** Debe ser `frontend-next` (no la raíz del repo)
- **Variables:** Se aplican automáticamente en el próximo build
- **Deploy automático:** Cada push a `main` hace deploy
- **No necesitas `vercel.json`:** Vercel detecta Next.js automáticamente

---

## 🎯 Resumen

1. Conecta repo en Vercel
2. Root Directory: `frontend-next`
3. Variable: `NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app`
4. Deploy
5. ¡Listo!

**Vercel es mucho más simple para Next.js que Railway.** 🚀


