# 🌐 Configurar Dominio Público del Frontend en Railway

## ✅ Configuración Correcta

Cuando Railway te pida el **Target Port**, usa:

```
8080
```

Este es el puerto en el que Next.js está corriendo según los logs.

---

## 📝 Pasos Completos

1. **En Railway → Frontend → Settings → Networking**
2. **Haz clic en "Generate Domain"**
3. **En "Target Port" escribe:** `8080`
4. **Haz clic en "Generate" o "Create"**
5. Railway generará la URL automáticamente

---

## ✅ Después de Generar el Dominio

Una vez que Railway genere la URL (algo como `https://frontend-production.up.railway.app`):

1. **Copia la URL completa**
2. **Actualiza CORS en Backend:**
   - Backend → Settings → Variables
   - `BACKEND_CORS_ORIGINS` = `https://frontend-production.up.railway.app,https://sistemaempresarial-production.up.railway.app`
   - (Reemplaza con la URL real que Railway te dé)

3. **Prueba el frontend:**
   - Abre la URL en el navegador
   - Debería funcionar correctamente

---

## 🎯 Resumen

- **Target Port:** `8080` ✅
- **Frontend corriendo:** Puerto 8080 ✅
- **Siguiente paso:** Generar dominio y actualizar CORS

