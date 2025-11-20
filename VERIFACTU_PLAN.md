# Plan de Implementación Verifactu

## ¿Qué es Verifactu?

Verifactu es el sistema de la AEAT que establece requisitos técnicos para sistemas informáticos de facturación en España. Su objetivo es garantizar:

1. **Integridad**: Los registros de facturación deben ser inalterables una vez generados
2. **Trazabilidad**: Los registros deben enlazarse cronológicamente
3. **Accesibilidad**: Los datos deben ser fácilmente accesibles y legibles

## Requisitos Técnicos Principales

### 1. Hash SHA-256
- Cada registro de facturación debe tener un hash SHA-256
- El hash debe incluir todos los datos de la factura
- Los registros deben enlazarse mediante hashes (cada registro incluye el hash del anterior)

### 2. Estructura de Registros
- Cada factura debe tener un registro único
- Los registros deben estar ordenados cronológicamente
- Debe mantenerse un registro maestro (log) de todas las facturas

### 3. Formato XML
- Las facturas deben seguir el formato Facturae 3.2 (estándar español)
- O alternativamente, formato UBL 2.1
- El XML debe incluir metadatos de Verifactu

### 4. Certificados Electrónicos
- Necesario para autenticarse con AEAT
- No requiere firma electrónica, pero sí certificado para envío

## Estructura de Implementación Propuesta

### Backend

1. **Modelo de Base de Datos**
   - Tabla `invoice_registry` para almacenar registros de facturación
   - Campos: hash, previous_hash, timestamp, invoice_data, xml_path

2. **Generador de Hash**
   - Función para calcular SHA-256 de facturas
   - Incluir todos los campos relevantes de la factura

3. **Generador XML Facturae**
   - Crear XML según especificación Facturae 3.2
   - Incluir metadatos de Verifactu

4. **Registro de Facturas**
   - Al crear/emitir factura, generar hash y registrar
   - Enlazar con registro anterior

5. **API Endpoints**
   - `/api/invoices/{id}/verifactu-xml` - Generar XML Verifactu
   - `/api/invoices/registry` - Obtener registro de facturas
   - `/api/invoices/export-registry` - Exportar registro completo

### Frontend

1. **Vista de Registro**
   - Mostrar todas las facturas con sus hashes
   - Visualizar cadena de integridad

2. **Generación XML**
   - Botón para generar XML Verifactu de cada factura
   - Descarga del XML

3. **Exportación**
   - Exportar registro completo en formato compatible

## Implementación por Fases

### Fase 1: Estructura Básica (Ahora)
- Crear modelo de registro de facturas
- Implementar cálculo de hash SHA-256
- Generar XML básico Facturae 3.2

### Fase 2: Integración Completa
- Enlazar registros (previous_hash)
- Validación de integridad
- Exportación de registros

### Fase 3: Integración con AEAT (Futuro)
- Conexión con servicios AEAT
- Envío automático de registros
- Certificados electrónicos

## Referencias

- Facturae 3.2: https://www.facturae.gob.es/
- Verifactu AEAT: https://www.agenciatributaria.gob.es/
- UBL 2.1: Estándar internacional alternativo

