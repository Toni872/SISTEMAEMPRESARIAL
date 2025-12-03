# ✅ Verificación de Variables de Entorno

## 🔵 Variables en VERCEL (Frontend)

### Variable Crítica

- **`NEXT_PUBLIC_API_URL`** = `https://tu-backend.up.railway.app` (URL de tu backend en Railway)

### Otras variables (opcionales pero recomendadas)

- `NODE_ENV` = `production`

---

## 🟢 Variables en RAILWAY (Backend)

### Variable Crítica para CORS

- **`BACKEND_CORS_ORIGINS`** debe incluir:

  ```
  https://frontend-next-silk.vercel.app,https://frontend-next-dzi9luz9y-toni872s-projects.vercel.app
  ```

### Otras variables importantes

- `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
- `REDIS_URL` = `${{Redis.REDIS_URL}}`
- `SECRET_KEY` = (tu clave secreta)
- `ENV` = `production`

---

## 🔍 Cómo Verificar

### 1. Verificar en Vercel

1. Ve a: <https://vercel.com> → Tu proyecto → Settings → Environment Variables
2. Busca `NEXT_PUBLIC_API_URL`
3. Debe tener la URL completa de tu backend en Railway (ej: `https://sistemaempresarial-production.up.railway.app`)

### 2. Verificar en Railway

1. Ve a: <https://railway.app> → Tu proyecto → Backend → Variables
2. Busca `BACKEND_CORS_ORIGINS`
3. Debe incluir las URLs de Vercel separadas por comas

### 3. Verificar que se redespelgó

1. En Vercel, ve a Deployments
2. El último deployment debe ser reciente (después de agregar las variables)
3. Si no se redespelgó automáticamente, haz clic en "Redeploy"

---

## ⚠️ Si sigue sin funcionar

1. **Verifica que el backend en Railway esté corriendo:**
   - Abre la URL del backend directamente en el navegador
   - Deberías ver la documentación de FastAPI o un mensaje de error del backend

2. **Verifica CORS en Railway:**
   - Asegúrate de que `BACKEND_CORS_ORIGINS` tenga las URLs exactas de Vercel
   - Después de cambiar CORS, reinicia el servicio en Railway

3. **Verifica la URL en Vercel:**
   - La URL debe ser HTTPS (no HTTP)
   - No debe terminar en `/api` o `/api/v1`
   - Debe ser la URL raíz del servicio de Railway

---

## 🚀 Después de Verificar

1. Espera 1-2 minutos para que se complete el redeploy
2. Abre: <https://frontend-next-silk.vercel.app>
3. Intenta hacer login
4. Si funciona, ¡todo está correcto! ✅
