# Guía de Configuración Verifactu para Producción

## 1. Migraciones de Base de Datos

Las migraciones SQL ya están creadas y ejecutadas:
- ✅ `invoice_registry` - Tabla para registros Verifactu
- ✅ `electronic_certificates` - Tabla para certificados electrónicos

## 2. Configuración de Certificados Electrónicos

### 2.1. Obtener Certificado

Para obtener un certificado electrónico válido para AEAT:

1. **FNMT (Fábrica Nacional de Moneda y Timbre)**
   - Visita: https://www.sede.fnmt.gob.es/certificados/persona-fisica
   - Solicita certificado de persona física o jurídica
   - Descarga el certificado en formato .pfx o .p12

2. **Otros proveedores autorizados**
   - AC Camerfirma
   - AC Firmaprofesional
   - Otros reconocidos por la AEAT

### 2.2. Instalar Certificado en el Sistema

```bash
# Opción 1: Subir mediante la interfaz web
# Ir a /verifactu → Sección "Certificados Electrónicos" → Agregar Certificado

# Opción 2: Configurar variable de entorno
export AEAT_DEFAULT_CERTIFICATE_PATH=/ruta/al/certificado.pfx
export AEAT_DEFAULT_CERTIFICATE_PASSWORD=tu_contraseña
```

### 2.3. Configuración en Docker

Si usas Docker, monta el directorio de certificados:

```yaml
# docker-compose.yml
services:
  backend:
    volumes:
      - ./certificates:/app/certificates:ro
    environment:
      - AEAT_DEFAULT_CERTIFICATE_PATH=/app/certificates/certificado.pfx
      - AEAT_DEFAULT_CERTIFICATE_PASSWORD=${CERTIFICATE_PASSWORD}
```

## 3. Configuración de Conexión con AEAT

### 3.1. Variables de Entorno

```bash
# Modo de operación
AEAT_USE_SANDBOX=false  # Cambiar a false en producción

# URLs (ya configuradas por defecto)
AEAT_SANDBOX_URL=https://www.agenciatributaria.gob.es/...
AEAT_PRODUCTION_URL=https://sede.agenciatributaria.gob.es/verifactu/api

# Timeouts
AEAT_REQUEST_TIMEOUT=30
AEAT_MAX_RETRIES=3
```

### 3.2. Habilitar Envío Real

Para habilitar el envío real a AEAT:

1. Configurar certificado (ver sección 2)
2. Cambiar `AEAT_USE_SANDBOX=false` en producción
3. Usar `actually_send=true` en las peticiones API

Ejemplo:
```bash
POST /api/verifactu/aeat/send-registry/{registry_id}?actually_send=true
```

## 4. Estructura de Archivos

```
backend/
├── app/
│   ├── utils/
│   │   ├── verifactu.py          # Utilidades Verifactu
│   │   ├── certificate_manager.py # Gestión de certificados
│   │   └── aeat_client.py        # Cliente AEAT
│   ├── core/
│   │   └── aeat_config.py        # Configuración AEAT
│   └── api/verifactu/
│       ├── endpoints.py           # Endpoints principales
│       ├── certificates.py        # Gestión certificados
│       └── aeat_integration.py   # Integración AEAT
└── certificates/                 # Directorio de certificados (crear)
    └── {user_id}/
        └── certificado.pfx
```

## 5. Pruebas en Sandbox

Antes de pasar a producción:

1. Mantener `AEAT_USE_SANDBOX=true`
2. Probar con certificado de prueba
3. Validar que los registros se envían correctamente
4. Verificar respuestas de AEAT

## 6. Monitoreo y Logs

El sistema registra automáticamente:
- Intentos de envío a AEAT
- Errores de conexión
- Validaciones de certificados
- Respuestas de AEAT

Revisar logs:
```bash
docker logs erp-backend-fastapi | grep -i aeat
```

## 7. Seguridad

### 7.1. Almacenamiento de Certificados

- Los certificados se almacenan con permisos 600 (solo lectura para propietario)
- En producción, considerar encriptación adicional
- Nunca commitear certificados al repositorio

### 7.2. Variables de Entorno

- Usar secretos gestionados (Docker Secrets, Kubernetes Secrets, etc.)
- No hardcodear contraseñas
- Rotar certificados periódicamente

## 8. Checklist de Producción

- [ ] Migraciones ejecutadas
- [ ] Certificado electrónico instalado y validado
- [ ] Variables de entorno configuradas
- [ ] `AEAT_USE_SANDBOX=false` en producción
- [ ] Directorio de certificados montado correctamente
- [ ] Permisos de certificados configurados (600)
- [ ] Pruebas en sandbox completadas
- [ ] Monitoreo y alertas configurados
- [ ] Documentación del equipo actualizada

## 9. Soporte y Documentación

- **AEAT Verifactu**: https://www.agenciatributaria.gob.es/
- **Documentación técnica**: Consultar especificaciones oficiales AEAT
- **Sandbox**: Disponible para pruebas antes de producción

## 10. Notas Importantes

⚠️ **IMPORTANTE**: 
- Los servicios reales de AEAT pueden no estar disponibles aún
- Verificar disponibilidad antes de activar envío real
- Mantener modo sandbox hasta confirmación oficial
- El código está preparado para cuando los servicios estén disponibles

