# 🔍 Configuración de Sentry

Sentry está integrado en el proyecto para tracking de errores y monitoreo en producción.

## Frontend (Next.js)

### 1. Instalar dependencias

```bash
cd frontend-next
npm install
```

### 2. Configurar variables de entorno

Agrega a tu `.env.local` o configura en Vercel:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://tu-dsn@sentry.io/tu-proyecto-id
```

### 3. Archivos de configuración

Los archivos de configuración ya están creados:
- `sentry.client.config.ts` - Cliente (browser)
- `sentry.server.config.ts` - Servidor (API routes, SSR)
- `sentry.edge.config.ts` - Edge Runtime (middleware)

### 4. Build con Sentry

Sentry se integra automáticamente durante el build de Next.js. No se requiere configuración adicional.

## Backend (FastAPI)

### 1. Instalar dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configurar variable de entorno

Agrega a tu `.env`:

```bash
SENTRY_DSN=https://tu-dsn@sentry.io/tu-proyecto-id
```

### 3. Inicialización

Sentry se inicializa automáticamente en `main.py` si `SENTRY_DSN` está configurado.

## Obtener DSN de Sentry

1. Crea una cuenta en https://sentry.io
2. Crea un proyecto:
   - Para frontend: Selecciona "Next.js"
   - Para backend: Selecciona "Python" → "FastAPI"
3. Copia el DSN que aparece en la página de configuración
4. Configúralo en las variables de entorno

## Configuración en Vercel (Frontend)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `NEXT_PUBLIC_SENTRY_DSN` = `https://tu-dsn@sentry.io/tu-proyecto-id`
4. Redeploy la aplicación

## Configuración en Railway/Render (Backend)

1. Ve a tu proyecto en Railway/Render
2. Variables de entorno
3. Agrega:
   - `SENTRY_DSN` = `https://tu-dsn@sentry.io/tu-proyecto-id`
4. Reinicia el servicio

## Verificación

### Frontend

Los errores de JavaScript se capturan automáticamente. Para probar:

```javascript
// En la consola del navegador
throw new Error('Test Sentry error');
```

### Backend

Los errores no controlados se capturan automáticamente. Para probar:

```python
# En cualquier endpoint
raise Exception("Test Sentry error")
```

## Características

- ✅ Captura automática de errores no controlados
- ✅ Tracking de performance (traces)
- ✅ Session replay (solo frontend)
- ✅ Contexto adicional (request ID, usuario, etc.)
- ✅ Filtrado de errores esperados (validación, auth, etc.)
- ✅ Configuración por entorno (dev vs production)

## Desactivar Sentry

Para desactivar Sentry temporalmente, simplemente no configures las variables `SENTRY_DSN` o `NEXT_PUBLIC_SENTRY_DSN`. El código detectará automáticamente que Sentry no está disponible y continuará funcionando normalmente.

