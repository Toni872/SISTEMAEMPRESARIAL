# 🔧 Corregir Puerto en Railway - Backend Escuchando en 8080

## Problema Identificado
El backend está corriendo en el puerto **8080**, pero Railway está configurado para escuchar en el puerto **8000**. Por eso aparece "Application failed to respond".

---

## ✅ Solución: Actualizar Target Port en Railway

### Paso 1: Ir a Settings → Networking
1. Ve a Railway → Tu proyecto → Servicio **Backend**
2. Haz clic en la pestaña **"Settings"**
3. Desplázate hasta la sección **"Networking"** o **"Public Domain"**

### Paso 2: Actualizar el Target Port
1. Busca el campo **"Target Port"** o **"Port"**
2. Cambia el valor de **8000** a **8080**
3. Guarda los cambios

### Paso 3: Verificar
1. Espera unos segundos para que Railway actualice la configuración
2. Intenta acceder a la URL pública nuevamente
3. Debería funcionar correctamente

---

## 🔄 Alternativa: Forzar Puerto 8000

Si prefieres usar el puerto 8000 en lugar de 8080:

### Opción A: Configurar Variable PORT en Railway
1. Ve a Settings → Variables
2. Agrega una nueva variable:
   - **Name:** `PORT`
   - **Value:** `8000`
3. Redespelga el servicio

### Opción B: Actualizar railway.json
El archivo `railway.json` ya está configurado correctamente para usar `${PORT:-8000}`, así que si agregas la variable `PORT=8000`, debería funcionar.

---

## 📝 Verificación Final

Después de cambiar el Target Port a 8080:

1. Espera 30-60 segundos
2. Abre la URL pública del backend en el navegador
3. Deberías ver:
   - La documentación de FastAPI en `/docs`
   - O un mensaje del backend
   - O un error 404 (pero significa que la URL funciona)

Ejemplo:
```
https://tu-backend.up.railway.app/docs
```

---

## ✅ Una Vez que Funcione

1. **Copia la URL pública** completa
2. **En Vercel:**
   - Settings → Environment Variables
   - Agrega: `NEXT_PUBLIC_API_URL` = `https://tu-backend.up.railway.app`
   - Guarda y redespelga

3. **Verifica CORS en Railway:**
   - Asegúrate de que `BACKEND_CORS_ORIGINS` incluya las URLs de Vercel

---

## 🎯 Resumen

**Problema:** Backend en puerto 8080, Railway configurado para 8000  
**Solución:** Cambiar Target Port en Railway de 8000 a 8080  
**Resultado:** El backend debería responder correctamente

