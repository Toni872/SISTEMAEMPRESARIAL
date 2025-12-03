# 🔧 Configurar NEXT_PUBLIC_API_URL en Railway Frontend

## ✅ Railway Detectó la Variable Correctamente

Railway está sugiriendo `NEXT_PUBLIC_API_URL` porque detectó que tu proyecto Next.js la necesita. Esto es correcto.

---

## 📝 Configuración Correcta

### Paso 1: Agregar la Variable

1. En Railway → Servicio **Frontend** → **Settings** → **Variables**
2. Haz clic en **"Add Variable"** o **"New Variable"**
3. Configura:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://sistemaempresarial-production.up.railway.app`
4. Haz clic en **"Add"** o **"Save"**

---

## ⚠️ Si Aparece Múltiples Veces

Si Railway muestra `NEXT_PUBLIC_API_URL` varias veces:

1. **Verifica que solo haya UNA variable** con ese nombre
2. Si hay duplicados, elimina los extras
3. Mantén solo UNA con el valor correcto:
   ```
   NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app
   ```

---

## ✅ Verificación

Después de agregar la variable:

1. Railway debería redespelgar automáticamente
2. Ve a **Deployments** para ver el progreso
3. Una vez completado, el frontend debería conectarse al backend correctamente

---

## 🎯 Valor Correcto

**Variable:** `NEXT_PUBLIC_API_URL`  
**Valor:** `https://sistemaempresarial-production.up.railway.app`

**Importante:**
- ✅ Debe empezar con `https://`
- ✅ NO debe terminar en `/api` o `/api/v1`
- ✅ Debe ser la URL completa del backend

---

## 🔍 Si No Funciona

1. Verifica que el backend esté corriendo:
   - Abre: `https://sistemaempresarial-production.up.railway.app`
   - Deberías ver: `{"message":"Welcome to ERP Sistema Backend"...}`

2. Verifica que la variable esté configurada:
   - Settings → Variables → Busca `NEXT_PUBLIC_API_URL`
   - Debe tener el valor correcto

3. Verifica CORS en Backend:
   - Backend → Settings → Variables → `BACKEND_CORS_ORIGINS`
   - Debe incluir la URL del frontend de Railway

