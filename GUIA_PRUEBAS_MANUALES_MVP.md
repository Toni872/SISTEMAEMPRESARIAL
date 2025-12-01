# 🧪 Guía de Pruebas Manuales - MVP

**Fecha:** $(date)  
**Objetivo:** Validar manualmente los 8 módulos MVP

---

## 🚀 PREPARACIÓN

### 1. Iniciar Backend

```bash
cd backend

# Opción A: Con Docker
docker-compose -f docker-compose.backend.yml up -d

# Opción B: Directamente con uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Verificar:** http://localhost:8000/docs (Swagger UI debe cargar)

### 2. Iniciar Frontend

```bash
cd frontend-next
npm run dev
```

**Verificar:** http://localhost:3001 (Frontend debe cargar)

### 3. Credenciales de Prueba

```
Email: test@example.com
Password: testpassword123
```

---

## 📊 MÓDULO 1: DASHBOARD

### Checklist de Pruebas

#### ✅ Prueba 1: Carga del Dashboard
1. Iniciar sesión con credenciales de prueba
2. Verificar redirección automática a `/dashboard`
3. **Esperado:** Dashboard carga sin errores

#### ✅ Prueba 2: Métricas Principales
1. Verificar que se muestran las siguientes métricas:
   - Total de Ingresos
   - Total de Ventas
   - Total de Productos
   - Stock Bajo
   - Ticket Promedio
   - Margen de Beneficio
2. **Esperado:** Todas las métricas se muestran con valores numéricos

#### ✅ Prueba 3: Gráficos
1. Verificar que se muestran gráficos:
   - Gráfico de línea (timeline de ventas)
   - Gráfico de barras (ventas por período)
   - Gráfico de pastel (distribución por categoría)
2. **Esperado:** Gráficos se renderizan correctamente

#### ✅ Prueba 4: Top Productos y Clientes
1. Verificar sección "Top Productos"
2. Verificar sección "Top Clientes"
3. **Esperado:** Listas se muestran correctamente

#### ✅ Prueba 5: Alertas
1. Verificar que se muestran alertas (si hay stock bajo)
2. **Esperado:** Alertas visibles y con enlaces funcionales

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]
- [ ] Bug 2: [descripción]

---

## 💰 MÓDULO 2: VENTAS

### Checklist de Pruebas

#### ✅ Prueba 1: Listado de Ventas
1. Navegar a `/sales`
2. Verificar que se muestra tabla/listado de ventas
3. Verificar filtros (fecha, estado, búsqueda)
4. **Esperado:** Listado carga correctamente

#### ✅ Prueba 2: Crear Venta
1. Click en botón "Nueva Venta" o "Crear"
2. Completar formulario:
   - Cliente (nombre, email)
   - Agregar items (producto, cantidad, precio)
   - Seleccionar estado
3. Guardar venta
4. **Esperado:** Venta se crea y aparece en el listado

#### ✅ Prueba 3: Editar Venta
1. Seleccionar una venta del listado
2. Click en "Editar"
3. Modificar campos
4. Guardar cambios
5. **Esperado:** Cambios se guardan correctamente

#### ✅ Prueba 4: Eliminar Venta
1. Seleccionar una venta
2. Click en "Eliminar"
3. Confirmar eliminación
4. **Esperado:** Venta se elimina del listado

#### ✅ Prueba 5: Exportación PDF
1. Seleccionar venta(s)
2. Click en "Exportar PDF"
3. **Esperado:** PDF se descarga correctamente

#### ✅ Prueba 6: Exportación Excel
1. Click en "Exportar Excel"
2. **Esperado:** Archivo Excel se descarga correctamente

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]
- [ ] Bug 2: [descripción]

---

## 🔄 MÓDULO 3: FACTURAS RECURRENTES

### Checklist de Pruebas

#### ✅ Prueba 1: Listado de Facturas Recurrentes
1. Navegar a `/recurring-invoices`
2. Verificar listado
3. **Esperado:** Listado carga correctamente

#### ✅ Prueba 2: Crear Factura Recurrente
1. Click en "Nueva Factura Recurrente"
2. Completar formulario:
   - Cliente
   - Items
   - Frecuencia (mensual, semanal, etc.)
   - Fecha de inicio
   - Fecha de fin (opcional)
3. Guardar
4. **Esperado:** Factura recurrente se crea

#### ✅ Prueba 3: Ver Detalles
1. Seleccionar factura recurrente
2. Ver detalles
3. **Esperado:** Información se muestra correctamente

#### ✅ Prueba 4: Editar Factura Recurrente
1. Editar factura existente
2. Modificar frecuencia o items
3. Guardar
4. **Esperado:** Cambios se guardan

#### ✅ Prueba 5: Eliminar Factura Recurrente
1. Eliminar factura recurrente
2. Confirmar
3. **Esperado:** Se elimina correctamente

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]

---

## 📄 MÓDULO 4: PLANTILLAS DE FACTURA

### Checklist de Pruebas

#### ✅ Prueba 1: Listado de Plantillas
1. Navegar a `/invoice-templates`
2. Verificar listado
3. **Esperado:** Plantillas se muestran

#### ✅ Prueba 2: Crear Plantilla
1. Click en "Nueva Plantilla"
2. Completar formulario:
   - Nombre
   - Diseño (HTML/editor)
   - Variables disponibles
3. Guardar
4. **Esperado:** Plantilla se crea

#### ✅ Prueba 3: Vista Previa
1. Seleccionar plantilla
2. Click en "Vista Previa"
3. **Esperado:** Preview se muestra correctamente

#### ✅ Prueba 4: Editar Plantilla
1. Editar plantilla existente
2. Modificar diseño
3. Guardar
4. **Esperado:** Cambios se guardan

#### ✅ Prueba 5: Aplicar Plantilla
1. Crear venta
2. Seleccionar plantilla
3. Generar factura
4. **Esperado:** Factura usa la plantilla seleccionada

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]

---

## 🛒 MÓDULO 5: COMPRAS

### Checklist de Pruebas

#### ✅ Prueba 1: Listado de Compras
1. Navegar a `/purchases`
2. Verificar listado
3. Verificar filtros (fecha, proveedor, estado)
4. **Esperado:** Listado carga correctamente

#### ✅ Prueba 2: Crear Compra
1. Click en "Nueva Compra"
2. Completar formulario:
   - Seleccionar o crear proveedor
   - Agregar items
   - Seleccionar estado
   - Fecha
3. Guardar
4. **Esperado:** Compra se crea correctamente

#### ✅ Prueba 3: Gestión de Proveedores
1. Navegar a sección de proveedores
2. Crear nuevo proveedor
3. Editar proveedor existente
4. Eliminar proveedor
5. **Esperado:** CRUD de proveedores funciona

#### ✅ Prueba 4: Exportación PDF
1. Seleccionar compra
2. Exportar PDF
3. **Esperado:** PDF se descarga

#### ✅ Prueba 5: Exportación Excel
1. Exportar lista a Excel
2. **Esperado:** Excel se descarga

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]

---

## 📑 MÓDULO 6: FISCALIDAD

### Checklist de Pruebas

#### ✅ Prueba 1: Página Principal de Fiscalidad
1. Navegar a `/tax`
2. Verificar listado de declaraciones
3. **Esperado:** Página carga correctamente

#### ✅ Prueba 2: Modelo 303 (IVA)
1. Navegar a `/tax/model-303`
2. Seleccionar período (trimestre)
3. Click en "Calcular"
4. Verificar resultados:
   - IVA repercutido (ventas)
   - IVA soportado (compras)
   - Diferencia
   - Desglose por tipos de IVA
5. Click en "Generar PDF"
6. **Esperado:** Cálculo correcto y PDF se genera

#### ✅ Prueba 3: Modelo 111 (IRPF)
1. Navegar a `/tax/model-111`
2. Seleccionar período
3. Click en "Calcular"
4. Verificar resultados:
   - Retenciones por proveedor
   - Total de retenciones
5. Generar PDF
6. **Esperado:** Cálculo correcto y PDF se genera

#### ✅ Prueba 4: Historial de Declaraciones
1. Ver historial
2. Descargar PDFs anteriores
3. **Esperado:** Historial se muestra y PDFs se descargan

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]

---

## 🛡️ MÓDULO 7: VERIFACTU

### Checklist de Pruebas

#### ✅ Prueba 1: Listado de Registros
1. Navegar a `/verifactu`
2. Verificar listado de facturas registradas
3. **Esperado:** Listado carga correctamente

#### ✅ Prueba 2: Registrar Factura
1. Seleccionar venta
2. Click en "Registrar en Verifactu"
3. Verificar que se genera:
   - Hash SHA-256
   - Cadena de hashes
   - XML Facturae
   - Código QR
4. **Esperado:** Registro se completa correctamente

#### ✅ Prueba 3: Validar Integridad
1. Click en "Validar Integridad"
2. Verificar resultado
3. **Esperado:** Validación funciona correctamente

#### ✅ Prueba 4: Descargar XML
1. Seleccionar registro
2. Descargar XML
3. **Esperado:** XML se descarga correctamente

#### ✅ Prueba 5: Gestión de Certificados
1. Navegar a sección de certificados
2. Subir certificado
3. Verificar certificados disponibles
4. Eliminar certificado
5. **Esperado:** Gestión funciona correctamente

#### ✅ Prueba 6: Envío a AEAT (Mock)
1. Seleccionar registro
2. Click en "Enviar a AEAT"
3. Verificar estado de envío
4. **Esperado:** Envío simulado funciona

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]

---

## 📦 MÓDULO 8: PRODUCTOS

### Checklist de Pruebas

#### ✅ Prueba 1: Listado de Productos
1. Navegar a `/products`
2. Verificar listado
3. Verificar filtros (categoría, stock bajo, búsqueda)
4. **Esperado:** Listado carga correctamente

#### ✅ Prueba 2: Crear Producto
1. Click en "Nuevo Producto"
2. Completar formulario:
   - Nombre
   - SKU
   - Precio
   - Costo
   - Stock
   - Stock mínimo
   - Categoría
   - Descripción
3. Guardar
4. **Esperado:** Producto se crea correctamente

#### ✅ Prueba 3: Editar Producto
1. Seleccionar producto
2. Editar campos
3. Guardar
4. **Esperado:** Cambios se guardan

#### ✅ Prueba 4: Eliminar Producto
1. Eliminar producto
2. Confirmar
3. **Esperado:** Producto se elimina

#### ✅ Prueba 5: Alertas de Stock Bajo
1. Crear producto con stock bajo
2. Verificar que aparece alerta en dashboard
3. **Esperado:** Alertas funcionan correctamente

**Bugs Encontrados:**
- [ ] Bug 1: [descripción]

---

## 📋 RESUMEN DE PRUEBAS

### Progreso
- **Módulos probados:** 0/8
- **Bugs encontrados:** 0
- **Bugs críticos:** 0
- **Bugs importantes:** 0
- **Bugs menores:** 0

### Prioridades de Corrección
1. 🔴 **Crítico:** [lista de bugs críticos]
2. 🟡 **Importante:** [lista de bugs importantes]
3. 🟢 **Menor:** [lista de bugs menores]

---

## 🚀 SIGUIENTE PASO

Después de completar las pruebas manuales:
1. Documentar todos los bugs encontrados
2. Priorizar correcciones
3. Corregir bugs críticos primero
4. Re-probar después de correcciones

---

**Última actualización:** $(date)












