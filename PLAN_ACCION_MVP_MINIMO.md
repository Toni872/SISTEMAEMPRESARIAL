# 🎯 Plan de Acción: MVP Mínimo

**Objetivo:** Completar MVP mínimo funcional en 2-3 semanas  
**Fecha inicio:** 2025-01-25  
**Prioridad:** Módulos críticos para operación básica del ERP

---

## 📊 Estado Actual vs MVP Mínimo

### ✅ Ya Completado (50%)
- ✅ Dashboard completo
- ✅ Ventas completo
- ✅ Productos (backend completo, frontend operativo)
- ✅ Compras (backend completo)

### 🎯 Necesario para MVP Mínimo (50%)
- ⏳ Compras frontend validado
- ⏳ Facturación básica
- ⏳ Modelo 303 (IVA trimestral)
- ⏳ Validación completa con tests

---

## 🚀 Fase 1: Completar Módulos Core Existentes (Semana 1)

### Prioridad 1: Validar Frontend de Compras ⚠️ CRÍTICO

**Objetivo:** Completar validación del módulo de Compras

**Tareas:**
1. ✅ Backend ya validado (7/7 tests pasando)
2. ⏳ Crear tests E2E para Compras
   - [ ] Listar compras
   - [ ] Crear compra
   - [ ] Editar compra
   - [ ] Eliminar compra
   - [ ] Filtrar compras
   - [ ] Gestión de proveedores
3. ⏳ Ejecutar y validar tests E2E
4. ⏳ Corregir bugs encontrados
5. ⏳ Documentar resultados

**Tiempo estimado:** 2-3 días  
**Dependencias:** Ninguna  
**Archivos a modificar:**
- `frontend-next/e2e/purchases.spec.ts` (crear/mejorar)
- `VALIDACION_MVP.md` (actualizar estado)

---

### Prioridad 2: Validar Frontend de Productos ⚠️ IMPORTANTE

**Objetivo:** Completar validación E2E de Productos

**Tareas:**
1. ⏳ Resolver problemas conocidos de E2E
   - [ ] Validar filtro de categoría en Mobile Chrome
   - [ ] Documentar limitaciones de WebKit/Safari
2. ⏳ Ejecutar tests E2E con backend activo
3. ⏳ Corregir bugs encontrados
4. ⏳ Actualizar documentación

**Tiempo estimado:** 1-2 días  
**Dependencias:** Backend activo  
**Archivos a modificar:**
- `frontend-next/e2e/products.spec.ts`
- `RESUMEN_FINAL_PRODUCTOS.md`

---

## 🚀 Fase 2: Facturación Básica (Semana 2)

### Prioridad 3: Implementar Facturación Básica desde Ventas 🔴 CRÍTICO

**Objetivo:** Permitir crear facturas desde ventas existentes

**Tareas Backend:**
1. ⏳ Crear endpoint `POST /api/sales/{sale_id}/invoice`
   - [ ] Generar número de factura único
   - [ ] Crear registro de factura
   - [ ] Asociar factura con venta
   - [ ] Validar que la venta no tenga factura ya
2. ⏳ Crear modelo `Invoice` en base de datos
   - [ ] Campos: número, fecha, venta_id, total, estado
   - [ ] Migración Alembic
3. ⏳ Crear endpoint `GET /api/invoices`
   - [ ] Listar facturas con filtros
   - [ ] Paginación
4. ⏳ Crear endpoint `GET /api/invoices/{id}`
   - [ ] Obtener factura por ID
   - [ ] Incluir datos de venta asociada
5. ⏳ Crear tests backend
   - [ ] Test crear factura desde venta
   - [ ] Test listar facturas
   - [ ] Test obtener factura
   - [ ] Test validaciones (venta ya facturada, venta no existe)

**Tareas Frontend:**
1. ⏳ Crear página `/invoices`
   - [ ] Listado de facturas
   - [ ] Filtros (fecha, estado, número)
   - [ ] Búsqueda
2. ⏳ Añadir botón "Facturar" en página de ventas
   - [ ] Modal de confirmación
   - [ ] Crear factura desde venta
   - [ ] Mostrar mensaje de éxito
3. ⏳ Crear página de detalle de factura
   - [ ] Mostrar datos de factura
   - [ ] Mostrar datos de venta asociada
   - [ ] Botón descargar PDF (opcional para MVP mínimo)
4. ⏳ Crear tests E2E
   - [ ] Crear factura desde venta
   - [ ] Listar facturas
   - [ ] Ver detalle de factura

**Tiempo estimado:** 4-5 días  
**Dependencias:** Módulo Ventas (ya completo)  
**Archivos a crear/modificar:**
- `backend/app/models/invoice.py` (nuevo)
- `backend/app/api/invoices/endpoints.py` (nuevo)
- `backend/app/api/invoices/schemas.py` (nuevo)
- `backend/app/crud/invoice.py` (nuevo)
- `backend/alembic/versions/xxx_add_invoices.py` (nuevo)
- `backend/tests/test_invoices.py` (nuevo)
- `frontend-next/src/app/(dashboard)/invoices/page.tsx` (nuevo)
- `frontend-next/src/app/(dashboard)/invoices/[id]/page.tsx` (nuevo)
- `frontend-next/e2e/invoices.spec.ts` (nuevo)

---

## 🚀 Fase 3: Fiscalidad Básica - Modelo 303 (Semana 2-3)

### Prioridad 4: Implementar Modelo 303 (IVA Trimestral) 🔴 CRÍTICO

**Objetivo:** Calcular y generar Modelo 303 de IVA trimestral

**Tareas Backend:**
1. ⏳ Crear endpoint `POST /api/tax/modelo303/calculate`
   - [ ] Calcular IVA repercutido (ventas facturadas)
   - [ ] Calcular IVA soportado (compras)
   - [ ] Agrupar por tipo de IVA (21%, 10%, 4%, exento)
   - [ ] Calcular resultado (repercutido - soportado)
   - [ ] Validar período (trimestre)
2. ⏳ Crear endpoint `POST /api/tax/modelo303/generate-pdf`
   - [ ] Generar PDF del Modelo 303
   - [ ] Formato oficial AEAT
   - [ ] Incluir datos calculados
3. ⏳ Crear endpoint `GET /api/tax/modelo303/history`
   - [ ] Listar declaraciones anteriores
   - [ ] Filtros por período
4. ⏳ Crear tests backend
   - [ ] Test cálculo IVA repercutido
   - [ ] Test cálculo IVA soportado
   - [ ] Test cálculo resultado
   - [ ] Test validación de período
   - [ ] Test generación PDF

**Tareas Frontend:**
1. ⏳ Crear página `/tax/modelo303`
   - [ ] Selector de trimestre
   - [ ] Botón calcular
   - [ ] Mostrar resultados (IVA repercutido, soportado, resultado)
   - [ ] Desglose por tipo de IVA
   - [ ] Botón generar PDF
   - [ ] Historial de declaraciones
2. ⏳ Crear componente de cálculo
   - [ ] Formulario de selección de período
   - [ ] Tabla de resultados
   - [ ] Gráficos (opcional)
3. ⏳ Crear tests E2E
   - [ ] Calcular Modelo 303
   - [ ] Generar PDF
   - [ ] Ver historial

**Tiempo estimado:** 5-6 días  
**Dependencias:** Facturación básica, Ventas, Compras  
**Archivos a crear/modificar:**
- `backend/app/api/tax/endpoints.py` (mejorar)
- `backend/app/crud/tax.py` (mejorar)
- `backend/app/utils/pdf_generator.py` (añadir generación Modelo 303)
- `backend/tests/test_tax.py` (mejorar)
- `frontend-next/src/app/(dashboard)/tax/modelo303/page.tsx` (nuevo)
- `frontend-next/src/components/tax/modelo303-calculator.tsx` (nuevo)
- `frontend-next/e2e/tax.spec.ts` (nuevo)

---

## 📋 Checklist de Validación MVP Mínimo

### Módulos Core
- [ ] Dashboard: ✅ Ya completo
- [ ] Ventas: ✅ Ya completo
- [ ] Productos: ⏳ Validar E2E completo
- [ ] Compras: ⏳ Validar frontend y E2E

### Facturación
- [ ] Crear facturas desde ventas
- [ ] Listar facturas
- [ ] Ver detalle de factura
- [ ] Tests backend completos
- [ ] Tests E2E completos

### Fiscalidad
- [ ] Modelo 303 - Cálculo
- [ ] Modelo 303 - Generación PDF
- [ ] Modelo 303 - Historial
- [ ] Tests backend completos
- [ ] Tests E2E completos

---

## 🎯 Criterios de Éxito MVP Mínimo

### Funcionalidades Críticas
1. ✅ Usuario puede gestionar productos
2. ✅ Usuario puede crear ventas
3. ✅ Usuario puede crear compras
4. ⏳ Usuario puede facturar ventas
5. ⏳ Usuario puede calcular Modelo 303

### Calidad
- ✅ Tests backend pasando en módulos core
- ⏳ Tests E2E pasando en módulos críticos
- ⏳ Sin bugs críticos
- ⏳ Documentación básica completa

### Performance
- ✅ Respuesta API < 2s
- ✅ Carga de páginas < 3s
- ✅ Sin errores en consola

---

## 📅 Timeline Estimado

### Semana 1 (Días 1-5)
- **Día 1-2:** Validar frontend de Compras
- **Día 3:** Validar E2E de Productos
- **Día 4-5:** Implementar facturación básica (backend)

### Semana 2 (Días 6-10)
- **Día 6-7:** Implementar facturación básica (frontend)
- **Día 8-10:** Implementar Modelo 303 (backend + frontend)

### Semana 3 (Días 11-15)
- **Día 11-12:** Tests y validación completa
- **Día 13:** Corrección de bugs
- **Día 14:** Documentación final
- **Día 15:** Preparación para deploy

---

## 🚨 Riesgos y Mitigaciones

### Riesgo 1: Complejidad de Modelo 303
- **Mitigación:** Usar formato simplificado para MVP, validar con ejemplos reales

### Riesgo 2: Generación de PDFs
- **Mitigación:** Usar librería probada (reportlab o weasyprint), templates simples

### Riesgo 3: Tests E2E fallando
- **Mitigación:** Priorizar Chromium y Firefox, documentar limitaciones conocidas

### Riesgo 4: Tiempo insuficiente
- **Mitigación:** Priorizar funcionalidades críticas, dejar mejoras para después

---

## 📝 Notas Importantes

1. **Facturación básica:** No incluir facturas recurrentes ni plantillas en MVP mínimo
2. **Modelo 303:** Enfocarse en cálculo y PDF básico, no en envío a AEAT
3. **Tests:** Priorizar tests backend, E2E solo en funcionalidades críticas
4. **Documentación:** Mantener documentación básica, detallar después

---

## ✅ Próximos Pasos Inmediatos

1. **Hoy:** Validar frontend de Compras
2. **Mañana:** Crear tests E2E para Compras
3. **Día 3:** Empezar implementación de facturación básica

---

**Última actualización:** 2025-01-25  
**Estado:** 🚀 Listo para comenzar



