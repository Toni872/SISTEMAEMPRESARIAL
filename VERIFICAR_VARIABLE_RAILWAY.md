# 🚨 VERIFICACIÓN CRÍTICA: NEXT_PUBLIC_API_URL

## ⚠️ PROBLEMA ACTUAL

El frontend está usando `localhost:8000` en lugar de la URL de Railway. Esto significa que **`NEXT_PUBLIC_API_URL` NO está configurada o NO se está leyendo durante el BUILD**.

---

## ✅ PASOS PARA SOLUCIONARLO

### Paso 1: Verificar Variable en Railway Frontend

1. Ve a Railway → Frontend → Settings → Variables
2. Busca `NEXT_PUBLIC_API_URL` en la lista
3. **Si NO existe:**
   - Haz clic en "New Variable"
   - Variable Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://sistemaempresarial-production.up.railway.app`
   - **IMPORTANTE:** Sin barra final `/`
   - **IMPORTANTE:** Debe ser HTTPS (no HTTP)
   - **IMPORTANTE:** Sin comillas alrededor del valor
   - Guarda

4. **Si existe:**
   - Haz clic para editarla
   - Verifica que el valor sea exactamente: `https://sistemaempresarial-production.up.railway.app`
   - Sin espacios al inicio o final
   - Sin comillas
   - Sin barra final `/`
   - Guarda si hiciste cambios

---

### Paso 2: Hacer REBUILD COMPLETO (CRÍTICO)

**IMPORTANTE:** Después de configurar/editar la variable, debes hacer un **REBUILD COMPLETO**, no solo un restart.

#### Opción A: Redeploy desde Deployments

1. Ve a Railway → Frontend → Deployments
2. Haz clic en "Redeploy" en el último deployment
3. **Espera a que se ejecute el BUILD completo** (verás `npm run build`)
4. Luego se iniciará el servidor (`npm start`)

#### Opción B: Forzar Rebuild desde Settings

1. Ve a Railway → Frontend → Settings
2. Busca "Clear Build Cache" o "Rebuild"
3. Si existe, haz clic en "Clear Cache"
4. Luego haz "Redeploy"

---

### Paso 3: Verificar en los Logs del Build

1. Ve a Railway → Frontend → Logs
2. Busca durante el BUILD el mensaje:
   ```
   🔍 NEXT_PUBLIC_API_URL en build: https://sistemaempresarial-production.up.railway.app
   ```
3. **Si dice `NO CONFIGURADA` o `undefined`:**
   - La variable no está disponible durante el build
   - Verifica que esté configurada correctamente en Railway
   - Asegúrate de hacer REBUILD después de configurarla

4. **Si dice la URL correcta:**
   - El build está bien
   - El problema puede ser cache del navegador

---

### Paso 4: Verificar en el Navegador

1. Abre: `https://grand-grace-production.up.railway.app`
2. Abre DevTools (F12) → Console
3. Debe aparecer:
   ```
   🔍 API_URL configurada: https://sistemaempresarial-production.up.railway.app
   ```
4. **Si dice `localhost:8000`:**
   - La variable no se configuró o no se hizo rebuild
   - Vuelve a los pasos anteriores

---

## 🔍 DIAGNÓSTICO RÁPIDO

### ¿Qué URL ves en la consola del navegador?

- ✅ `https://sistemaempresarial-production.up.railway.app` → **Correcto**
- ❌ `http://localhost:8000` → **Variable no configurada o no se hizo rebuild**

### ¿Qué dice en los logs del build de Railway?

- ✅ `🔍 NEXT_PUBLIC_API_URL en build: https://...` → **Correcto**
- ❌ `🔍 NEXT_PUBLIC_API_URL en build: NO CONFIGURADA` → **Variable no configurada**

---

## 🆘 SI AÚN NO FUNCIONA

### Verificar Formato de la Variable

En Railway → Frontend → Variables, la variable debe verse así:

**Correcto:**
```
NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app
```

**Incorrecto (NO hacer esto):**
```
NEXT_PUBLIC_API_URL = "https://sistemaempresarial-production.up.railway.app"
NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app/
NEXT_PUBLIC_API_URL = http://sistemaempresarial-production.up.railway.app
NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app (con espacios)
```

### Forzar Rebuild desde Cero

1. Ve a Railway → Frontend → Settings
2. Busca "Delete Service" o "Remove"
3. **NO lo borres**, pero busca opciones de "Clear Cache" o "Rebuild"
4. Si no hay opciones, haz un nuevo deployment desde GitHub:
   - Haz un commit vacío: `git commit --allow-empty -m "Force rebuild"`
   - `git push`
   - Esto forzará un nuevo build completo

---

## 📝 NOTA TÉCNICA

**Por qué es necesario un REBUILD:**

- Next.js compila las variables `NEXT_PUBLIC_*` en tiempo de BUILD
- Estas variables se "bakean" en el código JavaScript generado
- Si cambias la variable después del build, necesitas hacer REBUILD completo
- Un simple "restart" NO es suficiente

---

## ✅ CHECKLIST FINAL

- [ ] `NEXT_PUBLIC_API_URL` está configurada en Railway Frontend
- [ ] El valor es `https://sistemaempresarial-production.up.railway.app` (sin `/` final)
- [ ] No tiene comillas alrededor del valor
- [ ] Se hizo un **REBUILD completo** (no solo restart)
- [ ] Los logs del build muestran la URL correcta
- [ ] El navegador muestra la URL correcta en la consola
- [ ] Se limpió el cache del navegador (Ctrl+Shift+R)

---

## 🎯 PRÓXIMOS PASOS

1. **Verifica** que la variable esté configurada correctamente
2. **Haz REBUILD completo** del frontend
3. **Revisa los logs** del build para confirmar
4. **Prueba en el navegador** y verifica la consola

Si después de estos pasos sigue sin funcionar, comparte:
- Lo que ves en los logs del build de Railway
- Lo que ves en la consola del navegador
- Una captura de pantalla de las variables en Railway


