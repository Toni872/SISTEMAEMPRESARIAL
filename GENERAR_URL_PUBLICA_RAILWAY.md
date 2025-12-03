# 🌐 Generar URL Pública del Backend en Railway

## Problema
Railway no genera automáticamente URLs públicas para todos los servicios. Necesitas crear un dominio público manualmente.

---

## ✅ Solución: Generar Dominio Público

### Paso 1: Ir al Servicio Backend
1. Ve a: https://railway.app
2. Abre tu **proyecto**
3. Haz clic en el servicio **"Backend"** (o el nombre de tu servicio backend)

### Paso 2: Ir a Settings → Networking
1. En la parte superior, haz clic en la pestaña **"Settings"**
2. Desplázate hacia abajo hasta encontrar la sección **"Networking"** o **"Public Domain"**

### Paso 3: Generar Dominio Público
1. Busca el botón que dice:
   - **"Generate Domain"**
   - **"Create Public Domain"**
   - **"Enable Public Domain"**
   - O simplemente un botón **"+"** o **"Add Domain"**
2. Haz clic en ese botón
3. Railway generará automáticamente una URL pública
4. La URL aparecerá algo como:
   ```
   https://sistemaempresarial-production.up.railway.app
   ```
   o
   ```
   https://sistemaempresarial-backend.up.railway.app
   ```

### Paso 4: Copiar la URL
1. Copia la URL completa que Railway generó
2. Debe empezar con `https://`
3. NO debe terminar en `/api` o `/api/v1`

---

## 🔍 Si NO Ves el Botón "Generate Domain"

### Opción A: Verificar Tipo de Servicio
1. En Settings del servicio Backend
2. Verifica que el servicio esté configurado como **"Web Service"** o **"Public"**
3. Si está como **"Private"**, cámbialo a **"Public"**

### Opción B: Verificar Deployment
1. Asegúrate de que el servicio Backend esté **desplegado y corriendo**
2. Ve a la pestaña **"Deployments"**
3. Verifica que haya un deployment exitoso
4. Si no hay deployment, Railway no generará la URL

### Opción C: Ver en la Pestaña "Networking"
1. Ve a Settings → Networking
2. Busca cualquier sección que mencione "Domain" o "URL"
3. A veces Railway muestra la URL ahí aunque no esté habilitada

---

## 📝 Después de Obtener la URL

### 1. Configurar en Vercel
1. Ve a Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega/edita:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://tu-backend.up.railway.app` (la URL que copiaste)
   - **Environments:** Production, Preview, Development
3. Guarda

### 2. Actualizar CORS en Railway
En Railway (Backend), actualiza:
- **Variable:** `BACKEND_CORS_ORIGINS`
- **Value:** `https://frontend-next-silk.vercel.app,https://frontend-next-dzi9luz9y-toni872s-projects.vercel.app`
- (En lugar de `*` para mayor seguridad)

### 3. Redespelgar
- **Vercel:** Debería redespelgar automáticamente
- **Railway:** Reinicia el servicio después de cambiar CORS

---

## 🆘 Si Aún No Puedes Generar la URL

### Verificar:
1. ¿El servicio Backend está corriendo? (ve a Deployments)
2. ¿Hay algún error en los logs del servicio?
3. ¿El servicio está configurado como "Public" o "Web Service"?

### Alternativa Temporal:
Si no puedes generar la URL pública ahora, puedes:
1. Usar **ngrok** para crear un túnel temporal
2. O configurar Railway para exponer el puerto públicamente

---

## ✅ Verificación Final

Una vez que tengas la URL:
1. Abre la URL en el navegador (ej: `https://tu-backend.up.railway.app`)
2. Deberías ver:
   - La documentación de FastAPI (`/docs`)
   - O un mensaje del backend
   - O un error 404 (pero significa que la URL funciona)

Si ves alguno de estos, la URL está funcionando correctamente.

