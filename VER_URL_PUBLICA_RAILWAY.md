# 👀 Cómo Ver la URL Pública del Backend en Railway

## ✅ Después de Generar el Dominio

Una vez que hayas generado el dominio público, Railway mostrará la URL en varios lugares:

---

## 📍 Ubicación 1: Pestaña "Settings" → "Networking"

1. Ve al servicio **Backend** en Railway
2. Haz clic en la pestaña **"Settings"** (arriba)
3. Desplázate hasta la sección **"Networking"** o **"Public Domain"**
4. Ahí verás la URL pública, algo como:
   ```
   https://sistemaempresarial-production.up.railway.app
   ```
5. Puede haber un botón **"Copy"** o **"🔗"** para copiarla

---

## 📍 Ubicación 2: Pestaña Principal del Servicio

1. En la página principal del servicio **Backend**
2. En la parte superior, busca un enlace o texto que diga:
   - **"Open"** o **"Visit"**
   - Un botón con un ícono de enlace **🔗**
   - La URL directamente visible
3. Haz clic en el enlace o copia la URL

---

## 📍 Ubicación 3: En el Header del Servicio

1. En la parte superior de la página del servicio Backend
2. Busca un banner o tarjeta que muestre:
   - **"Public Domain"**
   - La URL con un botón para copiar
   - Un ícono de enlace externo

---

## 📍 Ubicación 4: En la Lista de Servicios

1. Ve a la página principal de tu proyecto en Railway
2. En la lista de servicios, el servicio Backend puede mostrar:
   - Un ícono de enlace **🔗** junto al nombre
   - La URL directamente debajo del nombre del servicio

---

## 🔍 Si No La Ves

### Opción A: Verificar que el Dominio se Generó
1. Ve a Settings → Networking
2. Deberías ver una sección que dice **"Public Domain"** o **"Custom Domain"**
3. Si no aparece, el dominio no se generó correctamente
4. Intenta generar el dominio nuevamente

### Opción B: Verificar el Estado del Deployment
1. Ve a la pestaña **"Deployments"**
2. Verifica que el último deployment esté **completo y exitoso**
3. Si hay errores, el dominio puede no estar disponible

### Opción C: Verificar Variables de Entorno
1. Ve a Settings → Variables
2. A veces Railway crea una variable automática con la URL
3. Busca variables que contengan "URL" o "DOMAIN"

---

## ✅ Una Vez que Tengas la URL

### 1. Verificar que Funciona
Abre la URL en el navegador. Deberías ver:
- La documentación de FastAPI en `/docs`
- O un mensaje del backend
- O un error 404 (pero significa que la URL funciona)

Ejemplo:
```
https://tu-backend.up.railway.app/docs
```

### 2. Configurar en Vercel
1. Ve a Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega/edita:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://tu-backend.up.railway.app` (la URL que copiaste)
   - **Environments:** Production, Preview, Development
3. Guarda

### 3. Redespelgar Vercel
- Vercel debería redespelgar automáticamente
- O ve a Deployments → Redeploy

---

## 🎯 Formato de la URL

La URL debería verse así:
```
https://[nombre-proyecto]-[servicio].up.railway.app
```

Ejemplos:
- `https://sistemaempresarial-production.up.railway.app`
- `https://sistemaempresarial-backend.up.railway.app`
- `https://[tu-proyecto]-[tu-servicio].up.railway.app`

---

## 🆘 Si Aún No La Encuentras

Comparte:
1. ¿Qué ves en Settings → Networking del servicio Backend?
2. ¿Hay alguna sección que diga "Public Domain" o "Custom Domain"?
3. ¿El deployment está completo y exitoso?

