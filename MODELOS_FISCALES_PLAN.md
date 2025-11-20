# Plan de Implementación - Modelos Fiscales Españoles

## Objetivo
Implementar la generación de modelos fiscales españoles obligatorios para empresas:
- **Modelo 303**: Declaración trimestral de IVA
- **Modelo 111**: Retenciones IRPF (si aplica)
- **Modelo 130**: IRPF autónomos (opcional, fase 2)

## Fase 1: Modelo 303 (IVA Trimestral) - PRIORITARIO

### Backend

#### 1. Modelo de Base de Datos
- Tabla `tax_declarations`:
  - `id`, `user_id`, `model_type` (303, 111, etc.)
  - `period` (trimestre: Q1, Q2, Q3, Q4 + año)
  - `start_date`, `end_date`
  - `status` (draft, submitted, accepted, rejected)
  - `data` (JSON con todos los campos del modelo)
  - `submitted_at`, `response_data` (JSON con respuesta AEAT)
  - `created_at`, `updated_at`

#### 2. Lógica de Cálculo
- Función para calcular IVA de ventas en un periodo
- Función para calcular IVA de compras (cuando tengamos módulo de compras)
- Cálculo de bases imponibles
- Cálculo de cuotas soportadas vs repercutidas
- Resultado a ingresar/devolver

#### 3. Endpoints API
- `GET /api/tax/declarations` - Listar declaraciones
- `GET /api/tax/declarations/{id}` - Obtener una declaración
- `POST /api/tax/declarations/303/calculate` - Calcular modelo 303 para un periodo
- `POST /api/tax/declarations/303/generate` - Generar declaración
- `GET /api/tax/declarations/303/{id}/pdf` - Descargar PDF
- `GET /api/tax/declarations/303/{id}/xml` - Descargar XML (para envío AEAT)

#### 4. Generación de PDF
- Usar biblioteca como `reportlab` o `weasyprint`
- Plantilla PDF del modelo 303
- Campos prellenados con datos calculados

### Frontend

#### 1. Página de Declaraciones Fiscales
- Listado de declaraciones por modelo
- Filtros por periodo, estado
- Vista de resumen de cada declaración

#### 2. Formulario de Cálculo Modelo 303
- Selector de trimestre y año
- Vista previa de cálculos
- Desglose de ventas/compras
- Botón para generar declaración

#### 3. Vista de Declaración Generada
- Visualización de todos los campos
- Botones para descargar PDF/XML
- Estado de envío a AEAT (simulado inicialmente)

## Estructura del Modelo 303

### Campos Principales:
1. **Datos del contribuyente** (NIF, nombre, etc.)
2. **Periodo de declaración** (trimestre + año)
3. **Base imponible y cuotas**:
   - Ventas: Base imponible, IVA repercutido
   - Compras: Base imponible, IVA soportado
4. **Resultado**: A ingresar o a devolver
5. **Rectificativas**: Si es rectificativa de otra declaración

### Cálculos Necesarios:
- Sumar todas las ventas del periodo con `status = 'completed'`
- Calcular IVA repercutido (21%, 10%, 4% según tipo)
- Sumar todas las compras del periodo (cuando tengamos módulo)
- Calcular IVA soportado
- Diferencia = IVA repercutido - IVA soportado

## Fase 2: Modelo 111 (Retenciones IRPF)

Similar estructura pero para retenciones de trabajadores/profesionales.

## Tecnologías Sugeridas

- **PDF**: `reportlab` (Python) o `@react-pdf/renderer` (Frontend)
- **XML**: `xml.etree.ElementTree` (Python) para generar XML AEAT
- **Validación**: Validar estructura según especificación AEAT

## Próximos Pasos Inmediatos

1. Crear modelo de base de datos
2. Implementar función de cálculo de IVA por periodo
3. Crear endpoint de cálculo
4. Generar PDF básico
5. Crear frontend para visualizar y generar

