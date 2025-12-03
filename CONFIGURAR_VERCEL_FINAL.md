# ✅ Configurar Vercel con la URL del Backend

## Backend Funcionando ✅
Tu backend está corriendo correctamente en:
```
https://sistemaempresarial-production.up.railway.app
```

---

## 🔧 Paso 1: Configurar Variable en Vercel

### En Vercel:
1. Ve a: https://vercel.com
2. Abre tu proyecto **frontend-next**
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **"Add New"**
5. Configura:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://sistemaempresarial-production.up.railway.app`
   - **Environments:** Marca las tres opciones:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Haz clic en **"Save"**

---

## 🔧 Paso 2: Verificar CORS en Railway

### En Railway (Backend):
1. Ve a Railway → Tu proyecto → Servicio **Backend**
2. Ve a **Settings** → **Variables**
3. Busca la variable `BACKEND_CORS_ORIGINS`
4. Actualiza el valor a:
   ```
   https://frontend-next-silk.vercel.app,https://frontend-next-dzi9luz9y-toni872s-projects.vercel.app
   ```
5. Guarda los cambios

**Nota:** Si actualmente tiene `*`, está bien para desarrollo, pero es mejor usar las URLs específicas para producción.

---

## 🔄 Paso 3: Redespelgar Vercel

Después de agregar la variable de entorno:

1. Vercel debería redespelgar automáticamente
2. Si no, ve a **Deployments**
3. Haz clic en los **3 puntos** del último deployment
4. Selecciona **"Redeploy"**
5. Espera a que termine el deployment (1-2 minutos)

---

## ✅ Paso 4: Verificar que Funciona

1. Espera a que termine el redeploy en Vercel
2. Abre: https://frontend-next-silk.vercel.app
3. Intenta hacer login
4. Debería funcionar sin errores CORS

---

## 🎯 Resumen de URLs

### Backend (Railway):
```
https://sistemaempresarial-production.up.railway.app
```

### Frontend (Vercel):
```
https://frontend-next-silk.vercel.app
```

### Variable en Vercel:
```
NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app
```

---

## ✅ Checklist Final

- [ ] Variable `NEXT_PUBLIC_API_URL` configurada en Vercel
- [ ] Variable `BACKEND_CORS_ORIGINS` actualizada en Railway
- [ ] Vercel redespelgado
- [ ] Frontend funciona sin errores CORS
- [ ] Login funciona correctamente

---

## 🆘 Si Aún Hay Problemas

### Error CORS:
- Verifica que `BACKEND_CORS_ORIGINS` en Railway incluya las URLs de Vercel
- Reinicia el servicio Backend en Railway después de cambiar CORS

### Error de conexión:
- Verifica que `NEXT_PUBLIC_API_URL` esté configurada correctamente en Vercel
- Verifica que el redeploy de Vercel haya terminado
- Abre la consola del navegador (F12) para ver errores específicos

