# 🚨 SOLUCIÓN: Variable NEXT_PUBLIC_API_URL No Se Está Leyendo

## 🔍 Problema Identificado

El frontend está usando `http://localhost:8000` porque `NEXT_PUBLIC_API_URL` **NO está configurada en Railway** o **no se está leyendo durante el build**.

**En Next.js, las variables `NEXT_PUBLIC_*` deben estar disponibles en tiempo de BUILD, no solo en runtime.**

---

## ✅ SOLUCIÓN INMEDIATA

### Paso 1: Configurar Variable en Railway Frontend

1. Ve a Railway → Frontend → Settings → Variables
2. Haz clic en "New Variable" o busca `NEXT_PUBLIC_API_URL`
3. Configura:
   - **Variable Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://sistemaempresarial-production.up.railway.app`
   - **IMPORTANTE:** Sin barra final `/`
   - **IMPORTANTE:** Debe ser HTTPS (no HTTP)
4. Guarda los cambios

### Paso 2: Hacer REBUILD Completo del Frontend

**CRÍTICO:** Después de configurar la variable, debes hacer un **REBUILD completo**, no solo un redeploy:

1. Ve a Railway → Frontend → Deployments
2. Haz clic en "Deploy" o "Redeploy"
3. **Asegúrate de que se ejecute un BUILD completo** (no solo restart)
4. Espera a que termine el build

**O mejor aún:**

1. Ve a Railway → Frontend → Settings
2. Busca la opción "Clear Build Cache" o "Rebuild"
3. Haz clic en "Redeploy" o "Rebuild"
4. Esto forzará un build completo con las nuevas variables

---

## 🔍 Verificación

### Verificar en Logs del Build

1. Ve a Railway → Frontend → Logs
2. Busca durante el build el mensaje:
   ```
   🔍 NEXT_PUBLIC_API_URL en build: https://sistemaempresarial-production.up.railway.app
   ```
3. Si dice `NO CONFIGURADA`, la variable no se está leyendo

### Verificar en el Navegador

1. Abre el frontend: `https://grand-grace-production.up.railway.app`
2. Abre DevTools (F12) → Console
3. Debe aparecer:
   ```
   🔍 API_URL configurada: https://sistemaempresarial-production.up.railway.app
   ```
4. Si dice `localhost:8000`, la variable no se configuró correctamente

---

## 🆘 Si Aún No Funciona

### Opción 1: Verificar que la Variable Esté Configurada Correctamente

1. Ve a Railway → Frontend → Settings → Variables
2. Verifica que `NEXT_PUBLIC_API_URL` tenga exactamente:
   ```
   https://sistemaempresarial-production.up.railway.app
   ```
3. **NO debe tener:**
   - Comillas alrededor del valor
   - Barra final `/`
   - Espacios al inicio o final
   - `http://` (debe ser `https://`)

### Opción 2: Forzar Rebuild desde Cero

1. Ve a Railway → Frontend → Settings
2. Busca "Clear Build Cache" o similar
3. Haz clic en "Clear Cache"
4. Luego haz "Redeploy"

### Opción 3: Verificar Logs del Build

1. Ve a Railway → Frontend → Logs
2. Busca durante el build:
   - `🔍 NEXT_PUBLIC_API_URL en build: ...`
   - Si dice `NO CONFIGURADA`, la variable no está disponible durante el build
   - Si dice la URL correcta pero el navegador muestra `localhost:8000`, hay un problema de cache

---

## 📝 Nota Técnica

**Por qué es necesario un rebuild:**

- Next.js compila las variables `NEXT_PUBLIC_*` en tiempo de BUILD
- Estas variables se "bakean" en el código JavaScript generado
- Si cambias la variable después del build, necesitas hacer un rebuild completo
- Un simple "restart" no es suficiente

---

## ✅ Checklist Final

- [ ] `NEXT_PUBLIC_API_URL` está configurada en Railway Frontend
- [ ] El valor es `https://sistemaempresarial-production.up.railway.app` (sin `/` final)
- [ ] Se hizo un REBUILD completo (no solo restart)
- [ ] Los logs del build muestran la URL correcta
- [ ] El navegador muestra la URL correcta en la consola
- [ ] No hay errores de CORS

---

## 🚀 Después de Configurar

Una vez que funcione:

1. Verifica que el login funcione
2. Verifica que no haya errores de CORS
3. Si todo funciona, puedes cambiar `BACKEND_CORS_ORIGINS` de `*` a la URL específica del frontend

