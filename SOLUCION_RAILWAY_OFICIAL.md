# 🔧 Solución Basada en Documentación Oficial de Railway

Basado en: [Railway Errors Documentation](https://docs.railway.com/reference/errors)

---

## 🔍 Errores Comunes y Soluciones

### 1. Application Failed to Respond

**Causa:** El puerto configurado en Railway no coincide con el puerto que usa tu aplicación.

**Solución:**
1. Ve a Railway → Backend → Settings → Networking
2. Verifica el **"Target Port"** (debe ser **8000**)
3. Verifica que tu aplicación escuche en `0.0.0.0:8000`
4. Nuestro código ya está configurado correctamente:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
   ```

**Referencia:** [Application Failed to Respond](https://docs.railway.com/reference/errors/application-failed-to-respond)

---

### 2. 405 Method Not Allowed

**Causa:** Railway redirige HTTP a HTTPS, lo que puede cambiar métodos POST a GET.

**Solución:**
- ✅ Asegúrate de usar **HTTPS** en todas las URLs
- ✅ `NEXT_PUBLIC_API_URL` debe ser `https://...` (no `http://`)
- ✅ El frontend ya está configurado para usar HTTPS

**Referencia:** [405 Method Not Allowed](https://docs.railway.com/reference/errors/405-method-not-allowed)

---

### 3. CORS Policy Error

**Causa:** El backend no está enviando los headers CORS correctos.

**Solución según Railway:**

#### Paso 1: Verificar Configuración CORS en Backend

1. Ve a Railway → Backend → Settings → Variables
2. Verifica `BACKEND_CORS_ORIGINS`:
   ```
   https://grand-grace-production.up.railway.app
   ```
   O múltiples orígenes separados por comas:
   ```
   https://grand-grace-production.up.railway.app,https://sistemaempresarial-production.up.railway.app
   ```

#### Paso 2: Probar con `*` Temporalmente

Para diagnosticar si el problema es el formato:

1. Cambia `BACKEND_CORS_ORIGINS` a:
   ```
   *
   ```
2. Guarda y haz redeploy
3. Prueba el frontend
4. Si funciona, el problema es el formato de las URLs

#### Paso 3: Verificar Headers en DevTools

1. Abre el frontend
2. Abre DevTools (F12) → Network
3. Intenta hacer login
4. Haz clic en la petición a `/api/auth/login`
5. Ve a "Response Headers"
6. Debe incluir:
   ```
   Access-Control-Allow-Origin: https://grand-grace-production.up.railway.app
   ```

---

### 4. ENOTFOUND redis.railway.internal

**Causa:** El hostname de Redis no se resuelve correctamente.

**Solución:**
- ✅ Usa la variable `REDIS_URL` proporcionada por Railway
- ✅ No hardcodees `redis.railway.internal`
- ✅ Nuestro código ya usa `REDIS_URL` de las variables de entorno

**Referencia:** [ENOTFOUND redis.railway.internal](https://docs.railway.com/reference/errors/enotfound-redis-railway-internal)

---

## ✅ Checklist de Verificación

### Backend

- [ ] **Target Port** en Railway está configurado a **8000**
- [ ] La aplicación escucha en `0.0.0.0:8000` (verificar logs)
- [ ] `BACKEND_CORS_ORIGINS` incluye la URL del frontend
- [ ] `DATABASE_URL` está configurada (de PostgreSQL service)
- [ ] `REDIS_URL` está configurada (de Redis service)
- [ ] `SECRET_KEY` está configurada (mínimo 32 caracteres)
- [ ] Backend responde en `/docs` (Swagger UI)

### Frontend

- [ ] **Target Port** en Railway está configurado a **8000** (si aplica)
- [ ] `NEXT_PUBLIC_API_URL` tiene la URL pública del backend (HTTPS)
- [ ] `NEXT_PUBLIC_API_URL` no incluye `localhost` ni puerto
- [ ] Frontend se despliega correctamente

### Conexión

- [ ] Frontend puede hacer requests al backend
- [ ] No hay errores de CORS en DevTools
- [ ] Headers `Access-Control-Allow-Origin` están presentes
- [ ] Todas las URLs usan HTTPS (no HTTP)

---

## 🔧 Pasos de Diagnóstico

### Paso 1: Verificar Logs del Backend

1. Ve a Railway → Backend → Logs
2. Busca:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```
3. Si dice otro puerto, verifica la configuración

### Paso 2: Probar Backend Directamente

1. Abre: `https://sistemaempresarial-production.up.railway.app/docs`
2. Debe cargar Swagger UI
3. Si no carga, hay un problema con el backend

### Paso 3: Probar Frontend

1. Abre: `https://grand-grace-production.up.railway.app`
2. Abre DevTools (F12) → Network
3. Intenta hacer login
4. Revisa la petición a `/api/auth/login`
5. Verifica los headers de respuesta

### Paso 4: Verificar Variables de Entorno

**Backend:**
```
BACKEND_CORS_ORIGINS=https://grand-grace-production.up.railway.app
DATABASE_URL=postgresql://... (de PostgreSQL service)
REDIS_URL=redis://... (de Redis service)
SECRET_KEY=... (mínimo 32 caracteres)
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://sistemaempresarial-production.up.railway.app
```

---

## 🆘 Si el Problema Persiste

### Opción 1: Usar Network Diagnostics

Railway ofrece herramientas de diagnóstico de red:
- Revisa la documentación de [Network Diagnostics](https://docs.railway.com/reference/network-diagnostics)

### Opción 2: Contactar Soporte

Railway ofrece soporte según tu plan:
- Comunidad en Central Station
- Discord
- Soporte por email (planes superiores)

**Referencia:** [Railway Support](https://docs.railway.com/reference/support)

---

## 📝 Notas Importantes

1. **Puerto Interno vs URL Pública:**
   - El puerto 8000 es solo interno
   - La URL pública siempre será HTTPS sin especificar puerto
   - Ejemplo: `https://sistemaempresarial-production.up.railway.app`

2. **HTTPS es Obligatorio:**
   - Railway redirige HTTP a HTTPS automáticamente
   - Esto puede causar problemas con métodos POST
   - Siempre usa HTTPS en las URLs

3. **Variables de Entorno:**
   - Railway inyecta `PORT` automáticamente
   - Usa `${PORT:-8000}` para tener un fallback
   - Las variables se actualizan después del redeploy

4. **CORS:**
   - Los orígenes deben ser exactos (incluyendo protocolo HTTPS)
   - No uses `localhost` en producción
   - Prueba con `*` temporalmente para diagnosticar

---

## 🔗 Referencias

- [Railway Errors Documentation](https://docs.railway.com/reference/errors)
- [Application Failed to Respond](https://docs.railway.com/reference/errors/application-failed-to-respond)
- [405 Method Not Allowed](https://docs.railway.com/reference/errors/405-method-not-allowed)
- [ENOTFOUND redis.railway.internal](https://docs.railway.com/reference/errors/enotfound-redis-railway-internal)


