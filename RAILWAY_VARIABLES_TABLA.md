# 🔐 Variables de Entorno para Railway - Formato Tabla

## 🟢 BACKEND Service - Variables de Entorno

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `SECRET_KEY` | `TU_SECRET_KEY_GENERADA_AQUI` |
| `ENV` | `production` |
| `DEBUG` | `False` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` |
| `PASSWORD_HASH_ALGORITHM` | `bcrypt` |
| `PROJECT_NAME` | `ERP Sistema Backend` |
| `VERSION` | `1.0.0` |
| `API_V1_STR` | `/api/v1` |
| `RATE_LIMIT_ENABLED` | `True` |
| `RATE_LIMIT_PER_MINUTE` | `60` |
| `BACKEND_CORS_ORIGINS` | `https://tu-frontend.railway.app` |

### 📝 Notas importantes para BACKEND

1. **DATABASE_URL**: Usa `${{Postgres.DATABASE_URL}}` para conectar automáticamente al PostgreSQL de Railway
2. **REDIS_URL**: Usa `${{Redis.REDIS_URL}}` para conectar automáticamente al Redis de Railway
3. **SECRET_KEY**: Genera una nueva con: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
4. **BACKEND_CORS_ORIGINS**: Actualiza después del primer deploy con la URL real del frontend

---

## 🔵 FRONTEND Service - Variables de Entorno

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_API_URL` | `https://tu-backend.railway.app` |
| `NODE_ENV` | `production` |

### 📝 Notas importantes para FRONTEND

1. **NEXT_PUBLIC_API_URL**: Actualiza después del primer deploy con la URL real del backend

---

## 📋 Variables Mínimas (Solo lo esencial)

### BACKEND - Mínimo necesario

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `SECRET_KEY` | `GENERA_UNA_NUEVA_SECRET_KEY` |
| `ENV` | `production` |
| `BACKEND_CORS_ORIGINS` | `https://tu-frontend.railway.app` |

### FRONTEND - Mínimo necesario

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_API_URL` | `https://tu-backend.railway.app` |
| `NODE_ENV` | `production` |

---

## 🔄 Variables Opcionales (Puedes añadirlas después)

### BACKEND - Opcionales

| Variable Name | Value | Descripción |
|---------------|-------|-------------|
| `MAIL_USERNAME` | `tu-email@gmail.com` | Email para envío de correos |
| `MAIL_PASSWORD` | `tu-app-password` | Contraseña de aplicación Gmail |
| `MAIL_FROM` | `noreply@erp.com` | Email remitente |
| `MAIL_PORT` | `587` | Puerto SMTP |
| `MAIL_SERVER` | `smtp.gmail.com` | Servidor SMTP |
| `SENTRY_DSN` | `tu-sentry-dsn` | Para error tracking (opcional) |
| `VERIFACTU_CERTIFICATES_DIR` | `certificates` | Solo si usas Verifactu |
| `AEAT_BASE_URL` | `https://sede.agenciatributaria.gob.es/verifactu/api` | Solo si usas Verifactu |

### FRONTEND - Opcionales

| Variable Name | Value | Descripción |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | `tu-sentry-dsn` | Para error tracking (opcional) |

---

## 🎯 Cómo copiar y pegar en Railway

### Paso 1: Ir a Variables

1. En Railway Dashboard, selecciona el servicio (Backend o Frontend)
2. Haz clic en la pestaña **"Variables"** o **"Settings"** → **"Variables"**

### Paso 2: Añadir variables

1. Haz clic en **"New Variable"** o **"Add Variable"**
2. En **"Variable Name"**: Pega el nombre de la variable (columna izquierda)
3. En **"Value"**: Pega el valor (columna derecha)
4. Haz clic en **"Add"** o **"Save"**

### Paso 3: Repetir

Repite el proceso para cada variable de la tabla.

---

## 📝 Ejemplo Visual de cómo se ve en Railway

```
┌─────────────────────────────────────────────────┐
│ Variables                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Variable Name          │  Value                │
│  ──────────────────────┼────────────────────── │
│  DATABASE_URL           │ ${{Postgres.DATABASE_ │
│                        │  URL}}                │
│  ──────────────────────┼────────────────────── │
│  REDIS_URL              │ ${{Redis.REDIS_URL}}  │
│  ──────────────────────┼────────────────────── │
│  SECRET_KEY             │ tu-secret-key-aqui    │
│  ──────────────────────┼────────────────────── │
│  ENV                    │ production            │
│  ──────────────────────┼────────────────────── │
│  BACKEND_CORS_ORIGINS   │ https://tu-frontend...│
│                                                 │
│  [+ New Variable]                               │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Variables

### BACKEND

- [ ] `BACKEND_CORS_ORIGINS` = (URL del frontend después del deploy)

### FRONTEND

- [ ] `NEXT_PUBLIC_API_URL` = (URL del backend después del deploy)
- [ ] `NODE_ENV` = `production`

---

## 🔑 Generar SECRET_KEY

Antes de añadir `SECRET_KEY`, genera una nueva ejecutando:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copia el resultado y úsalo como valor de `SECRET_KEY`.

---

## ⚠️ Importante

1. **Referencias entre servicios**: Usa `${{Service.VARIABLE}}` para referenciar variables de otros servicios (Postgres, Redis)

2. **URLs después del deploy**: Las variables `BACKEND_CORS_ORIGINS` y `NEXT_PUBLIC_API_URL` deben actualizarse después del primer deploy con las URLs reales que Railway genera

3. **Sin espacios**: No dejes espacios alrededor del `=` en Railway (usa la interfaz de Railway, no edites manualmente)

4. **Case sensitive**: Los nombres de variables son case-sensitive, respeta mayúsculas/minúsculas exactamente como se muestra
