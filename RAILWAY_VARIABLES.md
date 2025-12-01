# 🔐 Variables de Entorno para Railway

## 📝 Instrucciones Rápidas

1. **Conecta tu repositorio en Railway**:
   - Ve a https://railway.app
   - Click en **"New Project"**
   - Selecciona **"Deploy from GitHub repo"**
   - Elige: `Toni872/SISTEMAEMPRESARIAL`

2. **Railway detectará automáticamente**:
   - ✅ Backend (FastAPI) en `backend/`
   - ✅ Frontend (Next.js) en `frontend-next/`

3. **Añade las bases de datos**:
   - Click **"New"** → **"Database"** → **"PostgreSQL"**
   - Click **"New"** → **"Database"** → **"Redis"**

4. **Configura las variables de entorno** (ver abajo)

---

## 🔧 Variables de Entorno por Servicio

### 🟢 BACKEND Service

Ve al servicio Backend → Settings → Variables

#### Base de Datos (Conectar PostgreSQL)
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

#### Redis (Conectar Redis)
```
REDIS_URL=${{Redis.REDIS_URL}}
```

#### Seguridad (OBLIGATORIO)
```bash
# Genera una SECRET_KEY segura:
# python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=TU_SECRET_KEY_AQUI_MINIMO_32_CARACTERES

ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
PASSWORD_HASH_ALGORITHM=bcrypt
```

#### Entorno
```bash
ENV=production
ENVIRONMENT=production
DEBUG=False
```

#### CORS (IMPORTANTE - Actualiza con tu URL de frontend)
```bash
# Reemplaza con la URL real de tu frontend en Railway
BACKEND_CORS_ORIGINS=https://tu-frontend.railway.app,https://tu-dominio.com
```

#### Aplicación
```bash
PROJECT_NAME=ERP Sistema Backend
VERSION=1.0.0
API_V1_STR=/api/v1
```

#### Rate Limiting
```bash
RATE_LIMIT_ENABLED=True
RATE_LIMIT_PER_MINUTE=60
```

#### Email (Opcional - si usas envío de emails)
```bash
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
MAIL_FROM=noreply@erp.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=ERP Sistema
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
USE_CREDENTIALS=True
VALIDATE_CERTS=True
```

#### Sentry (Opcional - para error tracking)
```bash
SENTRY_DSN=tu-sentry-dsn-si-lo-usas
```

#### Verifactu (Opcional - solo si usas facturación electrónica)
```bash
VERIFACTU_CERTIFICATES_DIR=certificates
AEAT_BASE_URL=https://sede.agenciatributaria.gob.es/verifactu/api
AEAT_CERTIFICATE_PATH=
AEAT_CERTIFICATE_PASSWORD=
AEAT_AUTO_SEND=False
```

---

### 🔵 FRONTEND Service

Ve al servicio Frontend → Settings → Variables

#### API Backend (IMPORTANTE - Actualiza con tu URL de backend)
```bash
# Reemplaza con la URL real de tu backend en Railway
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
```

#### Entorno
```bash
NODE_ENV=production
```

#### Sentry (Opcional)
```bash
NEXT_PUBLIC_SENTRY_DSN=tu-sentry-dsn-frontend
```

---

## 🎯 Orden de Configuración Recomendado

1. ✅ **Conectar repositorio** → Railway detecta servicios
2. ✅ **Añadir PostgreSQL** → Se crea automáticamente `DATABASE_URL`
3. ✅ **Añadir Redis** → Se crea automáticamente `REDIS_URL`
4. ✅ **Backend**: Configurar `DATABASE_URL` y `REDIS_URL` usando `${{Postgres.DATABASE_URL}}`
5. ✅ **Backend**: Añadir `SECRET_KEY` (generar una nueva)
6. ✅ **Backend**: Configurar `BACKEND_CORS_ORIGINS` con URL del frontend
7. ✅ **Frontend**: Configurar `NEXT_PUBLIC_API_URL` con URL del backend
8. ✅ **Deploy**: Railway desplegará automáticamente

---

## 🔑 Generar SECRET_KEY

Ejecuta este comando para generar una SECRET_KEY segura:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copia el resultado y úsalo como valor de `SECRET_KEY`.

---

## ⚠️ Notas Importantes

1. **URLs dinámicas**: Las URLs de Railway cambian en cada deploy. Usa los dominios generados automáticamente o configura un dominio personalizado.

2. **Referencias entre servicios**: Usa `${{Service.VARIABLE}}` para referenciar variables de otros servicios.

3. **CORS**: Asegúrate de que `BACKEND_CORS_ORIGINS` incluya la URL exacta del frontend (con `https://`).

4. **DATABASE_URL**: Railway la crea automáticamente cuando conectas PostgreSQL. Solo necesitas referenciarla con `${{Postgres.DATABASE_URL}}`.

5. **Primer deploy**: Después del primer deploy, Railway te dará las URLs de cada servicio. Actualiza las variables de entorno con esas URLs.

---

## ✅ Checklist

- [ ] Repositorio conectado en Railway
- [ ] Backend service detectado/creado
- [ ] Frontend service detectado/creado
- [ ] PostgreSQL añadido
- [ ] Redis añadido
- [ ] `DATABASE_URL` configurada en Backend (usando `${{Postgres.DATABASE_URL}}`)
- [ ] `REDIS_URL` configurada en Backend (usando `${{Redis.REDIS_URL}}`)
- [ ] `SECRET_KEY` generada y configurada en Backend
- [ ] `BACKEND_CORS_ORIGINS` configurada con URL del frontend
- [ ] `NEXT_PUBLIC_API_URL` configurada con URL del backend
- [ ] Primer deploy exitoso
- [ ] URLs obtenidas y variables actualizadas

---

## 🆘 Si algo falla

1. **Revisa los logs** en Railway Dashboard → Service → Logs
2. **Verifica variables de entorno** → Settings → Variables
3. **Comprueba conexiones** entre servicios (PostgreSQL, Redis)
4. **Verifica URLs** de CORS y API




