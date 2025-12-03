# 🚀 Desplegar Frontend en Railway

## ✅ Ventajas de Tener Todo en Railway

- ✅ **Todo en un solo lugar** - Backend y Frontend en el mismo dashboard
- ✅ **Más fácil de gestionar** - Variables de entorno y configuraciones centralizadas
- ✅ **Mejor para monorepos** - Railway maneja bien proyectos con múltiples servicios
- ✅ **Un solo proveedor** - Menos cuentas y configuraciones que mantener
- ✅ **CORS más simple** - URLs del mismo dominio base

---

## 📋 Paso 1: Crear Servicio Frontend en Railway

### Opción A: Desde el Dashboard de Railway

1. Ve a tu proyecto en Railway: https://railway.app
2. Haz clic en **"+ New"** o **"New Service"**
3. Selecciona **"GitHub Repo"** (si tu código está en GitHub)
4. Conecta tu repositorio si no está conectado
5. Selecciona el repositorio: `SISTEMAEMPRESARIAL`
6. Railway detectará automáticamente que es un proyecto Next.js

### Opción B: Desde el Repositorio

1. Ve a tu proyecto en Railway
2. Haz clic en **"+ New"** → **"GitHub Repo"**
3. Busca tu repositorio y conéctalo
4. Railway creará un nuevo servicio automáticamente

---

## 🔧 Paso 2: Configurar el Servicio Frontend

### 2.1 Configurar Root Directory

1. Ve al nuevo servicio Frontend
2. Ve a **Settings** → **Service**
3. Busca **"Root Directory"** o **"Source"**
4. Configura: `frontend-next`
5. Guarda

### 2.2 Verificar Build Command

Railway debería detectar automáticamente:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

Si no lo detecta, en **Settings** → **Deploy**:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

---

## 🔐 Paso 3: Configurar Variables de Entorno

Ve a **Settings** → **Variables** y agrega:

### Variable Crítica:
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://sistemaempresarial-production.up.railway.app`
- (La URL de tu backend en Railway)

### Variable Opcional:
- **Name:** `NODE_ENV`
- **Value:** `production`

---

## 🌐 Paso 4: Generar Dominio Público

1. Ve a **Settings** → **Networking**
2. Haz clic en **"Generate Domain"** o **"Create Public Domain"**
3. Railway generará una URL automáticamente
4. Copia la URL (algo como: `https://frontend-production.up.railway.app`)

---

## 🔄 Paso 5: Actualizar CORS en Backend

1. Ve al servicio **Backend** en Railway
2. Ve a **Settings** → **Variables**
3. Busca `BACKEND_CORS_ORIGINS`
4. Actualiza el valor para incluir la nueva URL del frontend:
   ```
   https://frontend-production.up.railway.app,https://sistemaempresarial-production.up.railway.app
   ```
5. Guarda y reinicia el servicio Backend

---

## 🚀 Paso 6: Desplegar

1. Railway debería empezar a construir y desplegar automáticamente
2. Ve a la pestaña **"Deployments"** para ver el progreso
3. Espera a que termine el build (puede tardar 3-5 minutos)
4. Una vez completado, el frontend estará disponible en la URL pública

---

## ✅ Paso 7: Verificar que Funciona

1. Abre la URL pública del frontend en Railway
2. Intenta hacer login
3. Debería conectarse al backend sin problemas

---

## 📝 Configuración Final

### Backend (Railway):
- URL: `https://sistemaempresarial-production.up.railway.app`
- CORS: Incluye la URL del frontend de Railway

### Frontend (Railway):
- URL: `https://frontend-production.up.railway.app` (ejemplo)
- Variable: `NEXT_PUBLIC_API_URL` = `https://sistemaempresarial-production.up.railway.app`

---

## 🗑️ Paso 8: Eliminar Deployment de Vercel (Opcional)

Si ya no necesitas Vercel:

1. Ve a Vercel → Tu proyecto
2. Ve a **Settings** → **General**
3. Desplázate hasta el final
4. Haz clic en **"Delete Project"**
5. Confirma la eliminación

**Nota:** Puedes mantener Vercel como respaldo si quieres, pero ya no será necesario.

---

## 🎯 Estructura Final en Railway

```
Tu Proyecto Railway
├── Backend Service
│   ├── URL: https://sistemaempresarial-production.up.railway.app
│   ├── Variables: DATABASE_URL, SECRET_KEY, etc.
│   └── CORS: Incluye URL del frontend
│
├── Frontend Service
│   ├── URL: https://frontend-production.up.railway.app
│   ├── Root Directory: frontend-next
│   └── Variables: NEXT_PUBLIC_API_URL
│
├── PostgreSQL Service
│   └── Variables: Automáticas
│
└── Redis Service
    └── Variables: Automáticas
```

---

## 🆘 Problemas Comunes

### Error: "Build failed"
- Verifica que el Root Directory esté configurado como `frontend-next`
- Verifica que `package.json` tenga el script `build`

### Error: "Port not found"
- Railway asignará un puerto automáticamente
- Next.js detectará el puerto desde la variable `PORT`

### Error CORS
- Verifica que `BACKEND_CORS_ORIGINS` incluya la URL del frontend de Railway
- Reinicia el servicio Backend después de cambiar CORS

---

## ✅ Checklist

- [ ] Servicio Frontend creado en Railway
- [ ] Root Directory configurado como `frontend-next`
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada
- [ ] Dominio público generado
- [ ] CORS actualizado en Backend
- [ ] Deployment completado
- [ ] Frontend funciona correctamente

