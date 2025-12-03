# 🔧 Configurar Backend para Puerto 8000

## ✅ Estado Actual

El código del backend ya está configurado para usar el puerto **8000** por defecto:
- `Dockerfile`: `EXPOSE 8000` y `--port ${PORT:-8000}`
- `start.sh`: `PORT=${PORT:-8000}`
- El código usa `8000` si Railway no proporciona `PORT`

---

## 🔧 Configurar Railway para Puerto 8000

### Paso 1: Verificar "Target Port" en Railway

1. Ve a Railway → Backend → Settings
2. Busca la sección **"Networking"** o **"Ports"**
3. Verifica el **"Target Port"** (puerto interno)
4. Debe estar configurado a **8000**
5. Si está en **8080**, cámbialo a **8000**
6. Guarda los cambios

---

### Paso 2: Verificar Variable PORT (Opcional)

Railway puede estar configurando `PORT=8080` automáticamente. Para usar 8000:

1. Ve a Railway → Backend → Settings → Variables
2. Busca la variable `PORT`
3. Si existe y tiene valor `8080`, cámbiala a `8000`
4. Si no existe, puedes añadirla con valor `8000` (aunque no es necesario porque el código ya usa 8000 por defecto)
5. Guarda los cambios

---

### Paso 3: Redeploy

Después de cambiar el "Target Port":

1. Railway debería redeployar automáticamente
2. Si no, haz un redeploy manual
3. Espera a que termine el deploy

---

## ✅ Verificación

Después del redeploy:

1. Ve a Railway → Backend → Logs
2. Busca el mensaje de inicio de Uvicorn
3. Debe decir algo como:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```
4. Si dice `8080`, entonces Railway está forzando ese puerto

---

## 🎯 Ventajas de Usar Puerto 8000

- ✅ Consistente con el código local
- ✅ Consistente con la documentación
- ✅ Menos confusión
- ✅ Más fácil de recordar

---

## 📝 Nota Importante

En Railway, el puerto interno (8000 o 8080) no afecta la URL pública. La URL pública siempre será algo como:
- `https://sistemaempresarial-production.up.railway.app`

Lo importante es que:
- El "Target Port" en Railway coincida con el puerto que usa el código
- El código use 8000 por defecto (ya lo hace)

---

## 🆘 Si Railway No Permite Cambiar el Puerto

Si Railway está forzando el puerto 8080 y no puedes cambiarlo:

1. Podemos añadir una variable `PORT=8000` explícitamente
2. O podemos cambiar el código para usar 8080 por defecto (no recomendado)

Pero primero intenta cambiar el "Target Port" en Railway.


