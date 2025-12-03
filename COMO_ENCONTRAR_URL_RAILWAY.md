# 🔍 Cómo Encontrar la URL Pública del Backend en Railway

## 📍 Ubicación de la URL Pública

La URL pública de tu backend en Railway puede estar en **varios lugares**. Sigue estos pasos:

---

## Método 1: Pestaña "Settings" → "Networking"

1. Ve a: https://railway.app
2. Abre tu **proyecto**
3. Haz clic en el servicio **"Backend"** (o el nombre de tu servicio backend)
4. Ve a la pestaña **"Settings"** (en el menú superior)
5. Busca la sección **"Networking"** o **"Public Domain"**
6. Ahí verás la URL pública, algo como:
   ```
   https://sistemaempresarial-production.up.railway.app
   ```

---

## Método 2: Pestaña Principal del Servicio

1. Ve a tu proyecto en Railway
2. Haz clic en el servicio **"Backend"**
3. En la parte superior de la página, busca un enlace o texto que diga:
   - **"Public Domain"**
   - **"Open"** o **"Visit"**
   - Una URL que empiece con `https://`

---

## Método 3: Si NO tiene dominio público (Generar uno)

Si no ves ninguna URL pública:

1. Ve al servicio Backend
2. Ve a **Settings** → **Networking**
3. Busca el botón **"Generate Domain"** o **"Create Public Domain"**
4. Haz clic en él
5. Railway generará automáticamente una URL pública
6. Copia esa URL

---

## Método 4: Ver en los Logs

1. Ve al servicio Backend
2. Ve a la pestaña **"Deployments"** o **"Logs"**
3. Busca mensajes que mencionen la URL o el puerto
4. A veces Railway muestra la URL en los logs de inicio

---

## Método 5: Verificar Variables de Entorno

1. Ve al servicio Backend
2. Ve a **Settings** → **Variables**
3. Busca alguna variable que contenga una URL
4. A veces Railway crea variables automáticas con la URL

---

## ⚠️ Importante

- La URL debe empezar con `https://`
- NO debe terminar en `/api` o `/api/v1`
- Debe ser la URL raíz del servicio
- Ejemplo correcto: `https://sistemaempresarial-production.up.railway.app`
- Ejemplo incorrecto: `https://sistemaempresarial-production.up.railway.app/api`

---

## 🔧 Si No Encuentras la URL

**Opción A: Generar dominio público**
- Settings → Networking → Generate Domain

**Opción B: Verificar que el servicio esté desplegado**
- Si el servicio no está corriendo, no tendrá URL pública
- Asegúrate de que el deployment esté completo

**Opción C: Verificar el tipo de servicio**
- Algunos servicios en Railway son privados por defecto
- Necesitas habilitar el dominio público manualmente

---

## 📝 Una vez que encuentres la URL

1. **Cópiala completa** (ejemplo: `https://sistemaempresarial-production.up.railway.app`)
2. **En Vercel:**
   - Settings → Environment Variables
   - Agrega: `NEXT_PUBLIC_API_URL` = `[tu-url-aqui]`
   - Marca para Production, Preview, Development
   - Guarda y redespelga

---

## 🆘 Si Aún No La Encuentras

Comparte:
1. ¿Qué ves en la pestaña Settings → Networking del servicio Backend?
2. ¿Hay algún botón que diga "Generate Domain" o "Create Public Domain"?
3. ¿El servicio Backend está desplegado y corriendo?

