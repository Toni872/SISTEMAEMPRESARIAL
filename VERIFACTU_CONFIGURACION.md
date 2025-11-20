# Configuración Verifactu para Producción

## 1. Migraciones SQL Ejecutadas

✅ **invoice_registry** - Tabla para registros Verifactu
✅ **electronic_certificates** - Tabla para certificados electrónicos

## 2. Configuración de Certificados Electrónicos

### Requisitos

Para usar certificados electrónicos en producción, necesitas:

1. **Certificado válido de la FNMT (Fábrica Nacional de Moneda y Timbre)**
   - Tipo: Certificado digital de persona física o jurídica
   - Formato: PKCS#12 (.p12) o PFX
   - Debe estar vigente

2. **Configuración en variables de entorno**

Agrega a tu archivo `.env`:

```env
# Verifactu/AEAT Configuration
VERIFACTU_CERTIFICATES_DIR=certificates
AEAT_BASE_URL=https://sede.agenciatributaria.gob.es/verifactu/api
AEAT_CERTIFICATE_PATH=/ruta/al/certificado.p12
AEAT_CERTIFICATE_PASSWORD=tu_contraseña_del_certificado
AEAT_AUTO_SEND=false
```

### Subir Certificado desde la Interfaz

1. Ve a **Verifactu > Certificados Electrónicos**
2. Haz clic en **Agregar Certificado**
3. Selecciona tu archivo .p12 o .pfx
4. Ingresa la contraseña del certificado
5. El sistema validará automáticamente el certificado

### Validación Automática

El sistema valida automáticamente:
- ✅ Formato del certificado
- ✅ Fecha de validez
- ✅ Presencia de clave privada
- ✅ Estructura del certificado

## 3. Integración con Servicios AEAT

### Estado Actual

Los servicios de Verifactu de la AEAT aún no están disponibles públicamente. El sistema está **preparado** para cuando estén disponibles.

### Estructura Preparada

El sistema incluye:

1. **Cliente AEAT** (`backend/app/core/aeat_client.py`)
   - Métodos para envío de registros
   - Validación de registros
   - Gestión de certificados

2. **Endpoints de Integración**
   - `POST /api/verifactu/aeat/send-registry/{id}` - Enviar registro individual
   - `POST /api/verifactu/aeat/send-all-pending` - Enviar todos los pendientes
   - `GET /api/verifactu/aeat/status` - Estado de la integración

### Cuando los Servicios Estén Disponibles

1. **Actualizar URL base** en `.env`:
   ```env
   AEAT_BASE_URL=https://sede.agenciatributaria.gob.es/verifactu/api
   ```

2. **Configurar certificado** (ver sección anterior)

3. **Habilitar envío automático** (opcional):
   ```env
   AEAT_AUTO_SEND=true
   ```

4. **El sistema automáticamente**:
   - Firmará los XML con el certificado
   - Enviará a los endpoints de AEAT
   - Procesará las respuestas
   - Guardará referencias de AEAT

### Flujo de Envío a AEAT

```
1. Factura creada → Registro Verifactu generado
2. Hash SHA-256 calculado
3. XML Facturae 3.2 generado
4. XML firmado con certificado electrónico
5. Enviado a endpoint AEAT
6. Respuesta procesada y guardada
7. Registro marcado como "enviado"
```

## 4. Verificación y Testing

### Verificar Integridad

1. Ve a **Verifactu > Validación de Integridad**
2. Haz clic en **Validar Cadena**
3. El sistema verificará:
   - Que todos los hashes sean correctos
   - Que los enlaces cronológicos sean válidos
   - Que no haya alteraciones

### Testing Local

Para testing sin conexión real a AEAT:

1. El sistema simula el envío
2. Los registros se marcan como "enviado" localmente
3. Se puede probar todo el flujo sin certificados reales

## 5. Seguridad

### Almacenamiento de Certificados

- Los certificados se almacenan en `backend/certificates/{user_id}/`
- Permisos: 600 (solo lectura para el propietario)
- No se almacenan contraseñas en texto plano
- Los certificados se validan antes de guardar

### Recomendaciones

1. **Nunca** subas certificados a repositorios Git
2. Usa variables de entorno para contraseñas
3. Rota certificados antes de que expiren
4. Mantén backups seguros de certificados

## 6. Monitoreo

### Logs

El sistema registra:
- Intentos de envío a AEAT
- Errores de validación
- Problemas con certificados
- Estado de la integración

### Dashboard

En **Verifactu > Integración AEAT** puedes ver:
- Total de registros
- Registros enviados
- Registros pendientes
- Último envío exitoso

## 7. Soporte

Para más información sobre Verifactu:
- [Documentación AEAT](https://www.agenciatributaria.gob.es/)
- [Facturae 3.2](https://www.facturae.gob.es/)
- [FNMT Certificados](https://www.fnmt.es/)

