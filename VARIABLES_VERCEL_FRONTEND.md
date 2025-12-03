# 📋 Variables de Entorno para Vercel - Frontend

## ✅ Variables OBLIGATORIAS

### 1. NEXT_PUBLIC_API_URL

**Nombre:** `NEXT_PUBLIC_API_URL`  
**Valor:** `https://sistemaempresarial-production.up.railway.app`  
**Descripción:** URL del backend en Railway  
**Ambientes:** Production, Preview, Development  
**Importante:**
- ⚠️ Sin comillas alrededor del valor
- ⚠️ Sin barra final `/`
- ⚠️ Debe ser HTTPS (no HTTP)

---

## 🔧 Variables OPCIONALES

### 2. NEXT_PUBLIC_SENTRY_DSN

**Nombre:** `NEXT_PUBLIC_SENTRY_DSN`  
**Valor:** (tu DSN de Sentry, si lo tienes)  
**Descripción:** DSN de Sentry para monitoreo de errores  
**Ambientes:** Production (opcional)  
**Ejemplo:** `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`  
**Nota:** Solo necesaria si quieres monitoreo de errores con Sentry

---

## 📝 Tabla Resumen

| Variable | Obligatoria | Valor | Ambientes |
|----------|-------------|-------|-----------|
| `NEXT_PUBLIC_API_URL` | ✅ SÍ | `https://sistemaempresarial-production.up.railway.app` | Production, Preview, Development |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ NO | (tu DSN de Sentry) | Production (opcional) |

---

## 🚀 Cómo Configurarlas en Vercel

### Paso 1: Ir a Variables de Entorno

1. Ve a Vercel → Tu Proyecto → Settings
2. Haz clic en **"Environment Variables"** en el menú lateral

### Paso 2: Añadir Variables

Para cada variable:

1. Haz clic en **"Add"** o **"Add New"**
2. **Key (Nombre):** Escribe el nombre exacto (ej: `NEXT_PUBLIC_API_URL`)
3. **Value:** Escribe el valor (ej: `https://sistemaempresarial-production.up.railway.app`)
4. **Environment:** Selecciona los ambientes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Haz clic en **"Save"**

### Paso 3: Verificar

Después de añadir las variables, verifica que:
- ✅ El nombre esté correcto (sin espacios, mayúsculas/minúsculas exactas)
- ✅ El valor no tenga comillas
- ✅ Los ambientes estén marcados correctamente

---

## ✅ Checklist de Configuración

- [ ] `NEXT_PUBLIC_API_URL` configurada con valor: `https://sistemaempresarial-production.up.railway.app`
- [ ] Sin comillas alrededor del valor
- [ ] Sin barra final `/`
- [ ] Marcada para Production, Preview y Development
- [ ] (Opcional) `NEXT_PUBLIC_SENTRY_DSN` configurada si usas Sentry

---

## 🔍 Verificación Después del Deploy

### En los Logs del Build

1. Ve a Vercel → Deployments → [último deployment] → Build Logs
2. Busca:
   ```
   🔍 NEXT_PUBLIC_API_URL en build: https://sistemaempresarial-production.up.railway.app
   ```
3. Debe mostrar la URL correcta (sin comillas)

### En el Navegador

1. Abre tu app en Vercel
2. Abre DevTools (F12) → Console
3. Debe aparecer:
   ```
   🔍 API_URL configurada: https://sistemaempresarial-production.up.railway.app
   ```
4. Debe aparecer:
   ```
   🔍 NEXT_PUBLIC_API_URL: https://sistemaempresarial-production.up.railway.app
   ```

---

## 🆘 Si Hay Problemas

### Variable no se está leyendo

1. Verifica que el nombre sea exacto: `NEXT_PUBLIC_API_URL`
2. Verifica que no tenga comillas alrededor del valor
3. Verifica que esté marcada para el ambiente correcto (Production)
4. Haz un nuevo deploy después de cambiar variables

### Error de Build

1. Ve a Vercel → Deployments → [último deployment] → Build Logs
2. Revisa los errores
3. Los logs mostrarán si falta alguna variable

---

## 📝 Notas Importantes

- **Variables `NEXT_PUBLIC_*`:** Se compilan en tiempo de BUILD y están disponibles en el cliente
- **Cambios de variables:** Requieren un nuevo deploy para aplicarse
- **Sin comillas:** Vercel añade las comillas automáticamente si es necesario, no las pongas manualmente
- **Case sensitive:** Los nombres de variables son sensibles a mayúsculas/minúsculas

---

## 🎯 Resumen Rápido

**Solo necesitas configurar UNA variable obligatoria:**

```
NEXT_PUBLIC_API_URL = https://sistemaempresarial-production.up.railway.app
```

¡Eso es todo! El resto es opcional.


