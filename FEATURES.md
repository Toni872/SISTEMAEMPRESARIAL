# Features Implementadas

## ✅ 1. Refresh Token

**Estado:** Implementado

- Login con `OAuth2PasswordRequestForm` retorna `access_token` y `refresh_token`
- Endpoint `/api/auth/refresh` para renovar tokens
- Refresh tokens almacenados en BD y validados
- Tokens con tipos (`access` vs `refresh`) para mayor seguridad

**Uso:**
```python
# Login
POST /api/auth/login
Body: form-data
  username: email@example.com
  password: password123

Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer"
}

# Refresh
POST /api/auth/refresh
Body: {"refresh_token": "..."}
```

## ✅ 2. Role-based Access Control

**Estado:** Implementado

- Campo `role` en modelo User (valores: `user`, `admin`, `manager`)
- Dependencies para verificar roles:
  - `require_admin`: Solo admin
  - `require_roles(allowed_roles)`: Roles específicos
  - `require_verified`: Email verificado

**Uso:**
```python
from app.api.auth.deps import require_admin, require_roles

@router.get("/admin-only")
def admin_endpoint(admin: User = Depends(require_admin)):
    return {"message": "Admin only"}

@router.get("/manager-or-admin")
def manager_endpoint(user: User = Depends(require_roles(["admin", "manager"]))):
    return {"message": "Manager or admin"}
```

## ✅ 3. Rate Limiting

**Estado:** Implementado

- Usando `slowapi` para rate limiting
- Límites configurados:
  - Register: 10 requests/minuto
  - Login: 5 requests/minuto
  - Resend verification: 3 requests/minuto
- Configurable via `RATE_LIMIT_ENABLED` y `RATE_LIMIT_PER_MINUTE`

**Configuración:**
```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
```

## ✅ 4. Email Verification

**Estado:** Implementado

- Servicio de email con `fastapi-mail`
- Tokens de verificación seguros
- Endpoints:
  - `/api/auth/verify-email`: Verificar email con token
  - `/api/auth/resend-verification`: Reenviar email
- En desarrollo, los tokens se loguean en consola si no hay SMTP configurado

**Uso:**
```python
# Verificar email
POST /api/auth/verify-email
Body: form-data
  token: verification_token_from_email

# Reenviar verificación
POST /api/auth/resend-verification
Headers: Authorization: Bearer <token>
```

**Configuración Email:**
```env
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

## ✅ 5. Docker Compose Multi-env

**Estado:** Implementado

- `docker-compose.backend.yml`: Base (backend + postgres)
- `docker-compose.dev.yml`: Desarrollo
- `docker-compose.prod.yml`: Producción
- `docker-compose.staging.yml`: Staging

**Uso:**
```bash
# Desarrollo
docker-compose -f docker-compose.backend.yml -f docker-compose.dev.yml up

# Staging
docker-compose -f docker-compose.backend.yml -f docker-compose.staging.yml up

# Producción
docker-compose -f docker-compose.backend.yml -f docker-compose.prod.yml up
```

Los archivos override agregan variables de entorno específicas por ambiente.

## ✅ 6. CI/CD Pipeline

**Estado:** Implementado

- GitHub Actions workflow completo
- Build y push a DockerHub
- Tests automatizados
- Build de frontend

**Configuración:**
1. Agregar secrets en GitHub:
   - `DOCKERHUB_USERNAME`: Tu usuario de DockerHub
   - `DOCKERHUB_TOKEN`: Token de acceso

2. El workflow automáticamente:
   - Construye imágenes Docker
   - Las sube a DockerHub con tags por branch
   - Ejecuta tests del backend
   - Build del frontend

## 📝 Migración de Base de Datos

Ejecutar migración para agregar nuevos campos:

```bash
cd backend
alembic upgrade head
```

O aplicar manualmente el SQL de `init_fastapi_db.sql` actualizado.

## 🔧 Configuración Inicial

1. Copiar `.env.example` a `.env` y configurar variables
2. Instalar dependencias: `pip install -r requirements.txt`
3. Ejecutar migraciones: `alembic upgrade head`
4. Seed inicial: `python scripts/seed.py`

## 📚 Endpoints Nuevos

- `POST /api/auth/login` - Login con OAuth2 (retorna refresh_token)
- `POST /api/auth/refresh` - Refrescar access token
- `POST /api/auth/verify-email` - Verificar email
- `POST /api/auth/resend-verification` - Reenviar email de verificación
- `POST /api/auth/logout` - Cerrar sesión (invalida refresh_token)


