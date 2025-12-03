# 🔧 Solucionar Error "Application failed to respond" en Railway

## 🔍 Paso 1: Revisar los Logs del Deployment

### Cómo ver los logs:
1. Ve a Railway → Tu proyecto → Servicio **Backend**
2. Haz clic en la pestaña **"Deployments"** o **"Logs"**
3. Abre el último deployment
4. Revisa los logs para ver qué error está ocurriendo

### Errores comunes a buscar:
- ❌ `ModuleNotFoundError` - Falta una dependencia
- ❌ `ConnectionError` o `DatabaseError` - Problema con la base de datos
- ❌ `ImportError` - Error al importar módulos
- ❌ `Port already in use` - Conflicto de puerto
- ❌ `Environment variable missing` - Falta una variable de entorno

---

## 🔍 Paso 2: Verificar Variables de Entorno

### Variables Críticas que DEBEN estar configuradas:

1. **DATABASE_URL**
   - Debe ser: `${{Postgres.DATABASE_URL}}` o la URL completa de PostgreSQL
   - Verifica que el servicio PostgreSQL esté corriendo

2. **SECRET_KEY**
   - Debe tener al menos 32 caracteres
   - Genera una nueva si es necesario: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

3. **ENV**
   - Debe ser: `production`

4. **REDIS_URL** (si usas Redis)
   - Debe ser: `${{Redis.REDIS_URL}}` o la URL completa

5. **BACKEND_CORS_ORIGINS**
   - Debe incluir las URLs de Vercel

---

## 🔍 Paso 3: Verificar el Puerto

### En Railway:
1. Ve a Settings → Networking
2. Verifica que el **"Target Port"** sea **8000**
3. Si Railway asignó otro puerto, actualiza el comando de inicio

### Verificar el comando de inicio:
En `railway.json` o en Settings → Deploy, el comando debe ser:
```bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

---

## 🔍 Paso 4: Verificar que el Servicio Esté Corriendo

1. Ve a la pestaña **"Deployments"**
2. Verifica que el último deployment esté **"Active"** y **"Healthy"**
3. Si está en estado "Failed" o "Building", espera a que termine

---

## 🛠️ Soluciones Comunes

### Problema 1: Error de Base de Datos
**Síntoma:** `ConnectionError` o `DatabaseError` en los logs

**Solución:**
1. Verifica que el servicio PostgreSQL esté corriendo
2. Verifica que `DATABASE_URL` esté configurada correctamente
3. Usa `${{Postgres.DATABASE_URL}}` para conectar automáticamente

---

### Problema 2: Error de Importación
**Síntoma:** `ModuleNotFoundError` o `ImportError` en los logs

**Solución:**
1. Verifica que `requirements.txt` tenga todas las dependencias
2. Revisa los logs del build para ver si alguna dependencia falló al instalar
3. Asegúrate de que el código esté completo en el repositorio

---

### Problema 3: Puerto Incorrecto
**Síntoma:** El servicio inicia pero no responde

**Solución:**
1. Verifica que el puerto en Settings → Networking sea **8000**
2. Verifica que el comando de inicio use `${PORT:-8000}`
3. Railway puede asignar un puerto diferente, pero el código debe usar la variable `PORT`

---

### Problema 4: Variables de Entorno Faltantes
**Síntoma:** El servicio falla al iniciar por falta de configuración

**Solución:**
1. Revisa todos los logs para identificar qué variable falta
2. Agrega todas las variables necesarias en Settings → Variables
3. Redespelga después de agregar variables

---

## 🔄 Paso 5: Redespelgar

Después de hacer cambios:
1. Ve a Deployments
2. Haz clic en **"Redeploy"** o **"Deploy"**
3. Espera a que termine el deployment
4. Revisa los logs nuevamente

---

## 📋 Checklist de Verificación

- [ ] Los logs muestran que el servidor inició correctamente
- [ ] No hay errores de importación o módulos faltantes
- [ ] La base de datos está conectada correctamente
- [ ] Todas las variables de entorno están configuradas
- [ ] El puerto está configurado como 8000
- [ ] El deployment está completo y activo
- [ ] El servicio muestra estado "Healthy"

---

## 🆘 Si Aún No Funciona

Comparte:
1. **Los últimos 50-100 líneas de los logs** del deployment
2. **Las variables de entorno** que tienes configuradas (sin valores sensibles)
3. **El estado del deployment** (Active, Failed, Building, etc.)
4. **Cualquier error específico** que veas en los logs

Con esta información podré ayudarte a identificar el problema exacto.

