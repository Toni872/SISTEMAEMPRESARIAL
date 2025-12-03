# 🔧 Actualizar CORS en Backend con URL del Frontend

## ✅ URL del Frontend

```
https://grand-grace-production.up.railway.app
```

---

## 🔧 Paso 1: Actualizar CORS en Railway Backend

1. Ve a Railway → Servicio **Backend**
2. Ve a **Settings** → **Variables**
3. Busca la variable `BACKEND_CORS_ORIGINS`
4. Actualiza el valor a:

   ```
   https://grand-grace-production.up.railway.app,https://sistemaempresarial-production.up.railway.app
   ```

5. Haz clic en **"Save"** o **"Update"**

---

## 🔄 Paso 2: Reiniciar Backend (si es necesario)

Después de actualizar CORS:

1. Ve a la pestaña **"Deployments"** del Backend
2. Haz clic en **"Redeploy"** o espera a que Railway reinicie automáticamente
3. Esto asegura que los cambios de CORS se apliquen

---

## ✅ Paso 3: Verificar que Funciona

1. Abre: `https://grand-grace-production.up.railway.app`
2. Intenta hacer login
3. Debería conectarse al backend sin errores CORS

---

## 📝 Configuración Final

### Backend (Railway)

- URL: `https://sistemaempresarial-production.up.railway.app`
- CORS: `https://grand-grace-production.up.railway.app,https://sistemaempresarial-production.up.railway.app`

### Frontend (Railway)

- URL: `https://grand-grace-production.up.railway.app`
- Variable: `NEXT_PUBLIC_API_URL` = `https://sistemaempresarial-production.up.railway.app`

---

## 🎯 Estructura Final Completa

```
Railway Project
├── Backend
│   ├── URL: https://sistemaempresarial-production.up.railway.app ✅
│   └── CORS: Incluye grand-grace-production.up.railway.app (actualizar)
│
├── Frontend
│   ├── URL: https://grand-grace-production.up.railway.app ✅
│   └── Variable: NEXT_PUBLIC_API_URL configurada ✅
│
├── PostgreSQL ✅
└── Redis ✅
```

---

## ✅ Checklist Final

- [ ] CORS actualizado en Backend con la URL del frontend
- [ ] Backend reiniciado (si es necesario)
- [ ] Frontend accesible en `https://grand-grace-production.up.railway.app`
- [ ] Login funciona sin errores CORS
- [ ] Todo funcionando correctamente
