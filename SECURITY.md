# 🔒 Política de Seguridad

Este documento describe las medidas de seguridad implementadas en el proyecto y las mejores prácticas para mantenerlo seguro.

## 🛡️ Medidas de Seguridad Implementadas

### Autenticación y Autorización

- **JWT Tokens**: Autenticación mediante tokens JWT con expiración configurable
- **Refresh Tokens**: Sistema de refresh tokens para renovar sesiones sin re-autenticación
- **Bcrypt**: Hash de contraseñas con bcrypt (algoritmo seguro y lento)
- **Validación de Contraseñas**: Requisitos mínimos de seguridad (8+ caracteres, mayúsculas, minúsculas, números, caracteres especiales)
- **Verificación de Email**: Sistema de verificación de email antes de activar cuenta

### Headers de Seguridad

- **X-Content-Type-Options**: `nosniff` - Previene MIME type sniffing
- **X-Frame-Options**: `DENY` - Previene clickjacking
- **X-XSS-Protection**: `1; mode=block` - Protección XSS básica
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Control de información de referrer
- **Permissions-Policy**: Restricción de geolocalización, micrófono y cámara
- **Content-Security-Policy**: Política estricta de recursos permitidos
- **Strict-Transport-Security**: HSTS en producción (solo HTTPS)

### Rate Limiting

- **Límite por IP**: 60 requests por minuto por defecto
- **Configurable**: Ajustable mediante variables de entorno
- **Deshabilitable**: Para tests E2E mediante `E2E_MODE=true`

### Validación y Sanitización

- **Validación de Email**: Validación estricta con `email-validator`
- **Validación de Contraseñas**: Requisitos de seguridad mínimos
- **Validación de CIF/NIF**: Validación de formato español
- **Validación de Teléfonos**: Formato español (9 dígitos)
- **Sanitización de Strings**: Eliminación de caracteres peligrosos
- **Validación de URLs**: Validación de formato de URLs

### Logging Seguro

- **Sanitización Automática**: Los logs automáticamente redactan información sensible
- **Enmascaramiento**: Emails y teléfonos se enmascaran en logs
- **Redacción de Secrets**: Passwords, tokens, API keys se redactan automáticamente
- **Sin Información Sensible**: Los logs nunca contienen contraseñas o tokens completos

### Variables de Entorno

- **Nunca en Repositorio**: Los archivos `.env` están en `.gitignore`
- **Ejemplos Seguros**: `env.example` contiene placeholders, no valores reales
- **Validación**: La aplicación valida que SECRET_KEY tenga longitud mínima
- **Advertencias**: Warnings si las configuraciones no son seguras

### Base de Datos

- **Prepared Statements**: SQLAlchemy usa prepared statements (protección SQL injection)
- **Validación de Entrada**: Pydantic valida todos los datos de entrada
- **Transacciones**: Operaciones críticas usan transacciones de BD

### CORS

- **Orígenes Específicos**: Solo orígenes permitidos pueden hacer requests
- **Credenciales**: `allow_credentials=True` solo para orígenes confiables
- **Métodos Limitados**: Solo métodos HTTP necesarios permitidos

## 🔐 Mejores Prácticas

### Generación de SECRET_KEY

```bash
# Genera una SECRET_KEY segura (mínimo 32 caracteres)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Configuración de Producción

1. **Cambiar todas las contraseñas por defecto**
2. **Generar SECRET_KEY única y segura**
3. **Usar HTTPS en producción** (Strict-Transport-Security activado)
4. **Configurar CORS solo con orígenes de producción**
5. **Habilitar rate limiting**
6. **Configurar Sentry para error tracking**
7. **Revisar logs regularmente**
8. **Mantener dependencias actualizadas**

### Variables de Entorno Críticas

```bash
# Base de datos
POSTGRES_PASSWORD=<contraseña_segura>
DATABASE_URL=postgresql://user:password@host:port/db

# JWT
SECRET_KEY=<generar_con_secrets_token_urlsafe_32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email (si se usa)
MAIL_PASSWORD=<app_password_de_gmail>

# AEAT/Verifactu (si se usa)
AEAT_CERTIFICATE_PASSWORD=<contraseña_certificado>
```

### Docker Compose

- **Usar variables de entorno**: No hardcodear contraseñas en `docker-compose.yml`
- **Archivo .env**: Crear `.env` con valores reales (no subir al repositorio)
- **Permisos**: Restringir acceso a archivos `.env`

## 🚨 Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** crear un issue público
2. Contactar directamente al equipo de desarrollo
3. Proporcionar detalles de la vulnerabilidad
4. Esperar confirmación antes de hacer público

## 📋 Checklist de Seguridad para Producción

- [ ] SECRET_KEY generada con `secrets.token_urlsafe(32)` (mínimo 32 caracteres)
- [ ] Todas las contraseñas por defecto cambiadas
- [ ] HTTPS configurado y funcionando
- [ ] CORS configurado solo con orígenes de producción
- [ ] Rate limiting habilitado
- [ ] Variables de entorno seguras (no en repositorio)
- [ ] Logs configurados y revisados regularmente
- [ ] Dependencias actualizadas (`pip audit`, `npm audit`)
- [ ] Certificados SSL válidos y actualizados
- [ ] Backups de base de datos configurados
- [ ] Monitoreo de errores configurado (Sentry)
- [ ] Firewall configurado correctamente
- [ ] Acceso a base de datos restringido
- [ ] pgAdmin no expuesto públicamente (solo desarrollo)

## 🔍 Auditoría de Seguridad

### Comandos Útiles

```bash
# Backend - Verificar dependencias vulnerables
cd backend
pip install safety
safety check

# Frontend - Verificar dependencias vulnerables
cd frontend-next
npm audit

# Verificar que no hay secrets en el código
grep -r "password.*=" --include="*.py" --exclude-dir=__pycache__ backend/
grep -r "SECRET_KEY.*=" --include="*.py" backend/
```

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Python Security Best Practices](https://python.readthedocs.io/en/stable/library/secrets.html)



