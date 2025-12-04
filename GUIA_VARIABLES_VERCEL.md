# 📋 Guía Paso a Paso: Configurar Variables de Entorno en Vercel

## Paso 1: Acceder a la Configuración del Proyecto

1. Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Haz clic en tu proyecto (el que acabas de crear)
3. En el menú superior, haz clic en **"Settings"**
4. En el menú lateral izquierdo, haz clic en **"Environment Variables"**

## Paso 2: Agregar Variables de Entorno

Para cada variable, sigue estos pasos:

1. Haz clic en el botón **"Add New"** (o "+ Add" / "Añadir nueva")
2. En el campo **"Key"** (Clave), escribe el nombre de la variable
3. En el campo **"Value"** (Valor), escribe el valor
4. Selecciona los entornos donde aplicará:
   - ✅ **Production** (Producción)
   - ✅ **Preview** (Vista previa)
   - ✅ **Development** (Desarrollo)
5. Haz clic en **"Save"** (Guardar)

## Paso 3: Variables Requeridas (OBLIGATORIAS)

### 1. DATABASE_URL

**Key:** `DATABASE_URL`

**Value:** Tu conexión a PostgreSQL. Ejemplos:

**Opción A - Neon.tech (Recomendado):**

```
postgresql://usuario:password@ep-xxxxx-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Opción B - Otra base de datos:**

```
postgresql://usuario:password@host:5432/nombre_base_datos
```

**Cómo obtener DATABASE_URL:**

- Si usas **Neon.tech**:
  1. Ve a [https://neon.tech](https://neon.tech)
  2. Crea una cuenta y proyecto
  3. En el dashboard, copia la "Connection String"
  4. Pégala aquí

**Entornos:** ✅ Production, ✅ Preview, ✅ Development

---

### 2. SECRET_KEY

**Key:** `SECRET_KEY`

**Value:** Genera una clave secreta segura de al menos 32 caracteres.

**Cómo generar SECRET_KEY:**

**Opción A - En tu terminal:**

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Opción B - En línea (aleatorio seguro):**

```bash
openssl rand -base64 32
```

**Opción C - Manual (mínimo 32 caracteres):**
Ejemplo: `MiClaveSuperSecreta2024!NuncaCompartir123456789`

**⚠️ IMPORTANTE:**

- Mínimo 32 caracteres
- Guárdala en un lugar seguro
- No la compartas nunca

**Entornos:** ✅ Production, ✅ Preview, ✅ Development

---

### 3. ENV

**Key:** `ENV`

**Value:** `production`

**Entornos:** ✅ Production, ✅ Preview, ✅ Development

---

### 4. BACKEND_CORS_ORIGINS

**Key:** `BACKEND_CORS_ORIGINS`

**Value:** `*`

Esto permite que cualquier dominio pueda hacer peticiones al backend. Si quieres ser más restrictivo, puedes usar:

```
https://tu-proyecto.vercel.app,https://tu-proyecto-git-main-tu-usuario.vercel.app
```

Pero para empezar, usa `*` que es más simple.

**Entornos:** ✅ Production, ✅ Preview, ✅ Development

---

## Paso 4: Variables Opcionales (NO OBLIGATORIAS)

Estas variables son opcionales. Solo añádelas si las necesitas.

### NODE_ENV (Opcional pero recomendado)

**Key:** `NODE_ENV`

**Value:** `production`

**Entornos:** ✅ Production, ✅ Preview, ✅ Development

---

### REDIS_URL (Opcional - solo si usas Redis)

**Key:** `REDIS_URL`

**Value:** `redis://usuario:password@host:6379`

**Entornos:** ✅ Production, ✅ Preview, ✅ Development

---

### SENTRY_DSN (Opcional - solo si usas Sentry para errores)

**Key:** `SENTRY_DSN`

**Value:** `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

**Entornos:** ✅ Production

---

## Paso 5: Verificar las Variables

Después de agregar todas las variables, deberías ver una lista como esta:

```
DATABASE_URL          [●] [●] [●]  (Production, Preview, Development)
SECRET_KEY            [●] [●] [●]
ENV                   [●] [●] [●]
BACKEND_CORS_ORIGINS  [●] [●] [●]
NODE_ENV              [●] [●] [●]  (si la agregaste)
```

## Paso 6: Redeploy

1. Ve a la pestaña **"Deployments"** en el menú superior
2. Encuentra el último deployment
3. Haz clic en los **tres puntos (⋯)** a la derecha
4. Selecciona **"Redeploy"**
5. Confirma el redeploy

Esto hará que Vercel use las nuevas variables de entorno.

## ⚠️ IMPORTANTE: Variables que NO debes configurar

### ❌ NO configures NEXT_PUBLIC_API_URL

**NO** agregues esta variable. El frontend usará rutas relativas (`/api/*`) automáticamente porque frontend y backend están en el mismo proyecto.

Si la configuras, puede causar problemas.

## 🔍 Verificar que funciona

Después del redeploy, verifica:

1. **Frontend funciona:** `https://tu-proyecto.vercel.app`
2. **Backend API Docs:** `https://tu-proyecto.vercel.app/api/docs`
3. **Login funciona:** `https://tu-proyecto.vercel.app/login`

## 📸 Resumen Visual de los Pasos

```
1. Dashboard → Tu Proyecto
2. Settings (arriba)
3. Environment Variables (menú izquierdo)
4. Add New (botón)
5. Llenar Key y Value
6. Seleccionar entornos (Production, Preview, Development)
7. Save
8. Repetir para cada variable
9. Redeploy el proyecto
```

## 🆘 Troubleshooting

### Error: "DATABASE_URL not found"

- Verifica que agregaste la variable `DATABASE_URL`
- Verifica que seleccionaste los entornos correctos
- Haz un redeploy después de agregar variables

### Error: "SECRET_KEY too short"

- Asegúrate de que tenga al menos 32 caracteres
- Usa el comando Python para generar una segura

### Error: "CORS policy error"

- Verifica que `BACKEND_CORS_ORIGINS=*` esté configurado
- Haz un redeploy

### Las variables no se aplican

- Las variables solo se aplican en nuevos deployments
- Haz un **Redeploy** después de agregar/modificar variables
