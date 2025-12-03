# ✅ Verificación Después de Cambiar a Puerto 8000

## ✅ Cambios Realizados

- ✅ Backend configurado para puerto 8000
- ✅ Frontend configurado para puerto 8000

---

## 🔍 Verificaciones Necesarias

### 1. Verificar Logs del Backend

1. Ve a Railway → Backend → Logs
2. Busca el mensaje de inicio de Uvicorn
3. Debe decir:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```
4. Si dice `8080`, el cambio no se aplicó correctamente

---

### 2. Verificar Variables de Entorno del Backend

1. Ve a Railway → Backend → Settings → Variables
2. Verifica que `BACKEND_CORS_ORIGINS` incluya la URL del frontend:
   ```
   https://grand-grace-production.up.railway.app
   ```
   O si tienes múltiples:
   ```
   https://grand-grace-production.up.railway.app,https://sistemaempresarial-production.up.railway.app
   ```
3. **IMPORTANTE:** Sin comillas alrededor del valor

---

### 3. Verificar Variables de Entorno del Frontend

1. Ve a Railway → Frontend → Settings → Variables
2. Verifica que `NEXT_PUBLIC_API_URL` tenga la URL pública del backend:
   ```
   https://sistemaempresarial-production.up.railway.app
   ```
3. **IMPORTANTE:** Sin barra final (`/`)

---

### 4. Verificar que Ambos Servicios Estén Desplegados

1. Ve a Railway → Backend → Deployments
2. Verifica que el último deployment esté completo (✅)
3. Ve a Railway → Frontend → Deployments
4. Verifica que el último deployment esté completo (✅)

---

## 🧪 Prueba de Conexión

### Paso 1: Probar Backend Directamente

1. Abre tu navegador
2. Ve a: `https://sistemaempresarial-production.up.railway.app/docs`
3. Debe cargar la documentación de Swagger
4. Si no carga, hay un problema con el backend

---

### Paso 2: Probar Frontend

1. Abre tu navegador
2. Ve a: `https://grand-grace-production.up.railway.app`
3. Intenta hacer login
4. Abre las DevTools (F12) → Network
5. Intenta hacer login de nuevo
6. Revisa la petición a `/api/auth/login`

---

### Paso 3: Verificar Headers CORS

En las DevTools → Network:

1. Haz clic en la petición a `/api/auth/login`
2. Ve a la pestaña "Headers"
3. Busca "Response Headers"
4. Debe incluir:
   ```
   Access-Control-Allow-Origin: https://grand-grace-production.up.railway.app
   ```
5. Si no aparece este header, el CORS no está configurado correctamente

---

## 🆘 Si Aún Hay Problemas

### Problema 1: Error de CORS Persiste

**Solución:**
1. Ve a Railway → Backend → Settings → Variables
2. Cambia `BACKEND_CORS_ORIGINS` temporalmente a:
   ```
   *
   ```
3. Guarda y haz redeploy
4. Prueba el frontend
5. Si funciona, el problema es el formato de las URLs

---

### Problema 2: Frontend No Puede Conectar

**Verificar:**
1. `NEXT_PUBLIC_API_URL` en Frontend debe ser la URL pública del backend
2. No debe incluir `localhost` ni `8000` en la URL
3. Debe ser HTTPS (no HTTP)

---

### Problema 3: Backend No Inicia

**Verificar:**
1. Logs del Backend en Railway
2. Busca errores relacionados con:
   - Variables de entorno faltantes
   - Errores de conexión a la base de datos
   - Errores de importación de módulos

---

## ✅ Checklist Final

- [ ] Backend está corriendo en puerto 8000 (verificar logs)
- [ ] Frontend está corriendo en puerto 8000 (si aplica)
- [ ] `BACKEND_CORS_ORIGINS` incluye la URL del frontend
- [ ] `NEXT_PUBLIC_API_URL` tiene la URL pública del backend
- [ ] Ambos servicios están desplegados correctamente
- [ ] Backend responde en `/docs`
- [ ] Frontend puede hacer login sin errores de CORS

---

## 📝 Notas

- El puerto 8000 es solo interno en Railway
- La URL pública siempre será HTTPS sin especificar puerto
- Los cambios pueden tardar unos minutos en aplicarse


