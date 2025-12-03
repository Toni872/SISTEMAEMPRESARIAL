# 🔧 SOLUCIÓN CORS para Vercel

## 🔍 Problema

El frontend en Vercel (`https://frontend-next-silk.vercel.app`) está siendo bloqueado por CORS del backend en Railway.

**Error:**
```
Access to fetch at 'https://sistemaempresarial-production.up.railway.app/api/auth/login' 
from origin 'https://frontend-next-silk.vercel.app' 
has been blocked by CORS policy
```

---

## ✅ SOLUCIÓN

### Paso 1: Configurar CORS en Railway Backend

1. Ve a Railway → Backend → Settings → Variables
2. Busca `BACKEND_CORS_ORIGINS`
3. **Edita** la variable para incluir la URL de Vercel

**Valor correcto:**
```
https://frontend-next-silk.vercel.app,https://sistemaempresarial-production.up.railway.app
```

**O si tienes múltiples URLs de Vercel (production + preview):**
```
https://frontend-next-silk.vercel.app,https://frontend-next-*.vercel.app,https://sistemaempresarial-production.up.railway.app
```

**IMPORTANTE:**
- ⚠️ Sin comillas alrededor del valor
- ⚠️ Separadas por comas (sin espacios después de las comas)
- ⚠️ Debe ser HTTPS (no HTTP)
- ⚠️ Sin barra final `/`

### Paso 2: Redeploy del Backend

**CRÍTICO:** Después de cambiar la variable, debes hacer redeploy:

1. Ve a Railway → Backend → Deployments
2. Haz clic en "Redeploy"
3. Espera a que termine

---

## 🔍 Verificar URLs de Vercel

### URLs que necesitas añadir:

1. **URL de Production:** `https://frontend-next-silk.vercel.app`
2. **URLs de Preview (opcional):** `https://frontend-next-*.vercel.app` (wildcard para todas las previews)

### Cómo encontrar tu URL de Vercel:

1. Ve a Vercel → Tu Proyecto → Deployments
2. Haz clic en el último deployment
3. Copia la URL que aparece (algo como `https://frontend-next-silk.vercel.app`)

---

## 📝 Configuración Completa

### En Railway Backend:

**Variable:** `BACKEND_CORS_ORIGINS`  
**Valor:** 
```
https://frontend-next-silk.vercel.app,https://sistemaempresarial-production.up.railway.app
```

**O con wildcard para previews:**
```
https://frontend-next-silk.vercel.app,https://frontend-next-*.vercel.app,https://sistemaempresarial-production.up.railway.app
```

---

## ✅ Verificación

### Paso 1: Verificar en Logs del Backend

1. Ve a Railway → Backend → Logs
2. Busca el mensaje de inicio de Uvicorn
3. Debe decir que está corriendo correctamente

### Paso 2: Probar en el Navegador

1. Abre tu app en Vercel: `https://frontend-next-silk.vercel.app`
2. Abre DevTools (F12) → Network
3. Intenta hacer login
4. Haz clic en la petición a `/api/auth/login`
5. Ve a "Response Headers"
6. Debe incluir:
   ```
   Access-Control-Allow-Origin: https://frontend-next-silk.vercel.app
   ```

---

## 🆘 Si Aún No Funciona

### Opción 1: Usar `*` Temporalmente (Solo para probar)

1. Ve a Railway → Backend → Settings → Variables
2. Cambia `BACKEND_CORS_ORIGINS` a:
   ```
   *
   ```
3. Guarda y haz redeploy
4. Prueba el frontend
5. **Si funciona**, el problema es el formato de las URLs
6. **Vuelve a cambiarlo** a las URLs específicas después

### Opción 2: Verificar Formato

Asegúrate de que en Railway la variable se vea así (sin comillas):

```
https://frontend-next-silk.vercel.app,https://sistemaempresarial-production.up.railway.app
```

**NO así:**
```
"https://frontend-next-silk.vercel.app,https://sistemaempresarial-production.up.railway.app"
```

---

## 📋 Checklist

- [ ] `BACKEND_CORS_ORIGINS` incluye `https://frontend-next-silk.vercel.app`
- [ ] Sin comillas alrededor del valor
- [ ] URLs separadas por comas (sin espacios)
- [ ] Se hizo redeploy del backend después de cambiar la variable
- [ ] El frontend puede hacer requests sin errores de CORS

---

## 🎯 Resumen

1. Ve a Railway → Backend → Variables
2. Edita `BACKEND_CORS_ORIGINS`
3. Añade: `https://frontend-next-silk.vercel.app`
4. Guarda y haz redeploy
5. Prueba el frontend

¡Eso debería solucionarlo!


