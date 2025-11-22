# 🚀 Configurar Vercel para Desarrollo

Esta guía te explica cómo configurar Vercel para que el frontend se visualice correctamente mientras sigues desarrollando localmente.

## 📋 Situación Actual

- ✅ Frontend desplegado en Vercel: `https://frontend-next-silk-inky.vercel.app`
- ⚠️ Backend corriendo localmente: `http://localhost:8000`
- ❌ Problema: Vercel no puede conectarse a `localhost:8000`

## 🎯 Soluciones para Desarrollo

### Opción 1: Usar ngrok (Recomendado para pruebas rápidas)

Cuando quieras probar el frontend en Vercel con tu backend local:

1. **Instala ngrok:**
   ```bash
   # Descarga desde https://ngrok.com/download
   # O con npm:
   npm install -g ngrok
   ```

2. **Inicia tu backend local:**
   ```bash
   cd backend
   # Asegúrate de que el backend esté corriendo en http://localhost:8000
   ```

3. **Inicia ngrok en otra terminal:**
   ```bash
   ngrok http 8000
   ```

4. **Copia la URL HTTPS** que te da ngrok (ej: `https://abc123.ngrok.io`)

5. **Actualiza la variable en Vercel:**
   - Ve a: https://vercel.com/toni872s-projects/frontend-next-silk-inky/settings/environment-variables
   - Actualiza `NEXT_PUBLIC_API_URL` con la URL de ngrok
   - Redesplega el frontend

6. **Prueba el frontend en Vercel** - ahora debería conectarse a tu backend local a través de ngrok

**Nota:** La URL de ngrok cambia cada vez que lo reinicias (en el plan gratuito). Para una URL fija, necesitas el plan de pago.

### Opción 2: Desarrollo Local Completo (Recomendado)

Para desarrollo diario, es mejor trabajar completamente en local:

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend-next
npm run dev
```

Accede a: `http://localhost:3001`

**Ventajas:**
- ✅ Hot reload instantáneo
- ✅ Sin límites de tiempo
- ✅ No necesitas ngrok
- ✅ Más rápido para desarrollo

### Opción 3: Mensaje Informativo en Vercel

El frontend mostrará un mensaje claro cuando el backend no esté disponible, permitiendo que veas la UI aunque algunas funcionalidades no funcionen.

## 🔧 Configuración Actual en Vercel

### Variable de Entorno Recomendada para Desarrollo

Mientras desarrollas, puedes configurar en Vercel:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Nota:** Esto NO funcionará desde Vercel (porque localhost apunta al servidor de Vercel, no a tu máquina), pero evitará errores de compilación. El frontend mostrará mensajes informativos cuando intente conectarse.

### Para Producción (cuando despliegues el backend)

Cuando despliegues el backend en Railway/Render, actualiza a:

```
NEXT_PUBLIC_API_URL=https://tu-backend-url.com
```

## 📝 Flujo de Trabajo Recomendado

### Desarrollo Diario
1. Trabaja en local (`localhost:3001` y `localhost:8000`)
2. Usa Vercel solo para mostrar el frontend a otras personas o para pruebas de UI

### Cuando Quieras Probar en Vercel
1. Inicia ngrok: `ngrok http 8000`
2. Actualiza `NEXT_PUBLIC_API_URL` en Vercel con la URL de ngrok
3. Redesplega
4. Prueba en `https://frontend-next-silk.vercel.app`

### Para Producción
1. Despliega el backend en Railway/Render
2. Actualiza `NEXT_PUBLIC_API_URL` en Vercel con la URL del backend desplegado
3. Listo ✅

## 🎨 Visualizar Solo el Frontend

Si solo quieres ver cómo se ve el frontend en Vercel (sin funcionalidad del backend):

1. El frontend ya está configurado para mostrar mensajes claros cuando el backend no está disponible
2. Puedes navegar por las páginas y ver la UI
3. Las acciones que requieren backend mostrarán mensajes informativos

## ⚡ Comandos Rápidos

```bash
# Ver el frontend en Vercel
# Abre: https://frontend-next-silk-inky.vercel.app

# Desarrollo local completo
cd backend && uvicorn app.main:app --reload  # Terminal 1
cd frontend-next && npm run dev              # Terminal 2

# Probar con ngrok
ngrok http 8000  # Terminal 3 (mientras backend corre)
```

---

**Resumen:** Para desarrollo diario, usa localhost. Para mostrar a otros o probar en producción, usa ngrok temporalmente o despliega el backend.

