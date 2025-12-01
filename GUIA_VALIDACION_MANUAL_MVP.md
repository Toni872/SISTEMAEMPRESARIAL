# 📋 Guía de Validación Manual - MVP

**Fecha:** 2025-01-27  
**Objetivo:** Validar manualmente las funcionalidades principales del MVP

---

## 🔐 Pre-requisitos

1. **Backend corriendo** en `http://localhost:8000`
2. **Frontend corriendo** en `http://localhost:3001`
3. **Base de datos** con datos de prueba
4. **Usuario de prueba** creado y verificado

---

## ✅ MÓDULO 1: FACTURACIÓN

### 1.1 Crear Factura desde Venta

**Pasos:**
1. Navegar a `/sales` (Ventas)
2. Verificar que hay al menos una venta completada
3. Buscar una venta con estado "completed"
4. Hacer clic en el botón "Facturar" o "Ver Detalles"
5. Si no hay botón directo, navegar a `/invoices` y crear factura desde ahí

**Validaciones:**
- ✅ La factura se crea correctamente
- ✅ Se muestra el número de factura
- ✅ Los datos de la venta se reflejan en la factura
- ✅ El total coincide con la venta original

### 1.2 Listar Facturas

**Pasos:**
1. Navegar a `/invoices`
2. Verificar que se muestra la lista de facturas

**Validaciones:**
- ✅ Se muestran todas las facturas creadas
- ✅ Se muestran métricas (Total Facturas, Total Facturado, En Verifactu, Pendientes)
- ✅ Cada factura muestra: número, cliente, total, fecha, estado

### 1.3 Filtrar Facturas

**Pasos:**
1. En `/invoices`, hacer clic en "Filtros"
2. Probar filtros:
   - Por estado (completadas, pendientes)
   - Por registro Verifactu (con registro, sin registro)
   - Búsqueda por texto (número de venta, cliente, email)

**Validaciones:**
- ✅ Los filtros funcionan correctamente
- ✅ La lista se actualiza según los filtros
- ✅ La búsqueda encuentra facturas por diferentes criterios

### 1.4 Crear Factura con Verifactu

**Pasos:**
1. Crear una nueva factura desde una venta
2. Marcar la opción "Registrar en Verifactu" (si está disponible)
3. Confirmar la creación

**Validaciones:**
- ✅ La factura se crea con registro Verifactu
- ✅ Se genera el hash de la factura
- ✅ Se muestra el ID de registro en Verifactu
- ✅ Se puede descargar el XML de Verifactu

### 1.5 Ver Detalles de Factura

**Pasos:**
1. En `/invoices`, hacer clic en una factura
2. Verificar que se muestran todos los detalles

**Validaciones:**
- ✅ Se muestran todos los datos de la factura
- ✅ Se muestran los items de la venta
- ✅ Se muestra el total correcto
- ✅ Se muestra el estado de registro Verifactu

---

## 📊 MÓDULO 2: MODELO 303 (IVA TRIMESTRAL)

### 2.1 Acceder a Modelo 303

**Pasos:**
1. Navegar a `/tax/model-303`
2. Verificar que la página carga correctamente

**Validaciones:**
- ✅ Se muestra el título "Modelo 303 - IVA Trimestral"
- ✅ Se muestra el formulario de configuración
- ✅ Los campos están disponibles (Trimestre, Año, Notas)

### 2.2 Calcular Modelo 303

**Pasos:**
1. Seleccionar un trimestre (ej: 1er Trimestre)
2. Seleccionar el año (ej: 2025)
3. Hacer clic en "Calcular"
4. Esperar a que se complete el cálculo

**Validaciones:**
- ✅ El cálculo se completa sin errores
- ✅ Se muestran los resultados del cálculo:
  - Ventas (IVA Repercutido) por tipo (21%, 10%, 4%, Exentas)
  - Compras (IVA Soportado) por tipo
  - Resultado final (A INGRESAR o A DEVOLVER)
- ✅ Se muestra el periodo calculado
- ✅ Se muestra el número de ventas/compras incluidas

### 2.3 Generar Declaración PDF

**Pasos:**
1. Después de calcular, hacer clic en "Generar"
2. Esperar a que se genere el PDF
3. Verificar que se descarga el archivo

**Validaciones:**
- ✅ El PDF se genera correctamente
- ✅ El PDF contiene todos los datos del cálculo
- ✅ El formato es correcto y legible
- ✅ Se puede descargar el archivo

### 2.4 Probar Diferentes Trimestres

**Pasos:**
1. Probar calcular para diferentes trimestres:
   - 1er Trimestre (Ene-Mar)
   - 2do Trimestre (Abr-Jun)
   - 3er Trimestre (Jul-Sep)
   - 4to Trimestre (Oct-Dic)
2. Verificar que los resultados son diferentes según el periodo

**Validaciones:**
- ✅ Cada trimestre muestra resultados correctos
- ✅ Solo se incluyen ventas/compras del periodo seleccionado
- ✅ Los cálculos son correctos para cada periodo

---

## 🔍 VALIDACIONES ADICIONALES

### Integración Frontend-Backend

**Validaciones:**
- ✅ Las peticiones al backend funcionan correctamente
- ✅ Los errores se manejan adecuadamente (mostrar mensajes al usuario)
- ✅ Los estados de carga se muestran correctamente
- ✅ Los datos se actualizan en tiempo real

### UX/UI

**Validaciones:**
- ✅ La interfaz es intuitiva y fácil de usar
- ✅ Los mensajes de error son claros
- ✅ Los mensajes de éxito se muestran correctamente
- ✅ La navegación es fluida
- ✅ Los formularios tienen validaciones adecuadas

### Rendimiento

**Validaciones:**
- ✅ Las páginas cargan en menos de 3 segundos
- ✅ Los cálculos se completan en menos de 5 segundos
- ✅ No hay errores en la consola del navegador
- ✅ No hay errores en los logs del backend

---

## 📝 CHECKLIST DE VALIDACIÓN

### Facturación
- [ ] Crear factura desde venta funciona
- [ ] Listar facturas funciona
- [ ] Filtrar facturas funciona
- [ ] Crear factura con Verifactu funciona
- [ ] Ver detalles de factura funciona
- [ ] Descargar XML de Verifactu funciona

### Modelo 303
- [ ] Acceder a Modelo 303 funciona
- [ ] Calcular Modelo 303 funciona
- [ ] Generar PDF funciona
- [ ] Probar diferentes trimestres funciona
- [ ] Los cálculos son correctos

### General
- [ ] Integración frontend-backend funciona
- [ ] UX/UI es adecuada
- [ ] Rendimiento es aceptable
- [ ] No hay errores críticos

---

## 🐛 PROBLEMAS ENCONTRADOS

### Facturación
- [ ] Problema 1: [descripción]
- [ ] Problema 2: [descripción]

### Modelo 303
- [ ] Problema 1: [descripción]
- [ ] Problema 2: [descripción]

---

## ✅ CONCLUSIÓN

**Estado General:** [ ] ✅ Validado | [ ] ⚠️ Con problemas menores | [ ] ❌ Con problemas críticos

**Notas:**
- [Escribir notas adicionales aquí]

---

**Última actualización:** 2025-01-27



