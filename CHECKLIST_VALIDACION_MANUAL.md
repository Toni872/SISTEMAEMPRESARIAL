# ✅ Checklist de Validación Manual - MVP

**Fecha inicio:** 2025-01-27  
**Usuario:** [Tu nombre]  
**Ambiente:** Local (Backend: localhost:8000, Frontend: localhost:3001)

---

## 🔐 PRE-REQUISITOS

- [ ] Backend corriendo en `http://localhost:8000`
- [ ] Frontend corriendo en `http://localhost:3001`
- [ ] Base de datos con datos de prueba
- [ ] Usuario de prueba creado y verificado
- [ ] Navegador abierto y listo

---

## 📋 MÓDULO 1: FACTURACIÓN

### 1.1 Acceder a la página de Facturas

- [ ] Navegar a `http://localhost:3001/invoices`
- [ ] La página carga sin errores
- [ ] Se muestra el título "Facturas"
- [ ] Se muestran las métricas (Total Facturas, Total Facturado, En Verifactu, Pendientes)
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.2 Listar Facturas

- [ ] Se muestra la lista de facturas (si hay alguna)
- [ ] Cada factura muestra: número, cliente, total, fecha, estado
- [ ] Si no hay facturas, se muestra mensaje apropiado
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.3 Filtrar Facturas por Estado

- [ ] Hacer clic en "Filtros" (si está disponible)
- [ ] Seleccionar filtro por estado (ej: "Completadas")
- [ ] La lista se actualiza correctamente
- [ ] Solo se muestran facturas con el estado seleccionado
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.4 Filtrar Facturas por Registro Verifactu

- [ ] Seleccionar filtro "Con registro Verifactu" o "Sin registro"
- [ ] La lista se actualiza correctamente
- [ ] Solo se muestran facturas según el filtro seleccionado
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.5 Buscar Facturas

- [ ] Escribir en el campo de búsqueda (ej: número de venta, cliente)
- [ ] La búsqueda funciona correctamente
- [ ] Se muestran resultados relevantes
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.6 Crear Factura desde Venta

- [ ] Navegar a `http://localhost:3001/sales`
- [ ] Buscar una venta con estado "completed"
- [ ] Hacer clic en el botón de facturar (ícono de documento) en la venta
- [ ] Se crea la factura correctamente
- [ ] Se muestra mensaje de éxito
- [ ] La factura aparece en la lista de facturas
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.7 Crear Factura con Verifactu

- [ ] Crear una nueva factura desde una venta
- [ ] Verificar que se registra en Verifactu (si está disponible la opción)
- [ ] Se muestra el ID de registro Verifactu
- [ ] Se muestra el hash de la factura
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.8 Ver Detalles de Factura

- [ ] Hacer clic en una factura de la lista
- [ ] Se muestran todos los detalles de la factura
- [ ] Se muestran los items de la venta
- [ ] Se muestra el total correcto
- [ ] Se muestra el estado de registro Verifactu
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 1.9 Descargar XML de Verifactu

- [ ] Si la factura tiene registro Verifactu, hacer clic en "Descargar XML"
- [ ] Se descarga el archivo XML correctamente
- [ ] El archivo tiene el formato correcto
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

---

## 📊 MÓDULO 2: MODELO 303 (IVA TRIMESTRAL)

### 2.1 Acceder a Modelo 303

- [ ] Navegar a `http://localhost:3001/tax/model-303`
- [ ] La página carga sin errores
- [ ] Se muestra el título "Modelo 303 - IVA Trimestral"
- [ ] Se muestra el formulario de configuración
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 2.2 Seleccionar Trimestre y Año

- [ ] Seleccionar un trimestre del dropdown (ej: "1er Trimestre")
- [ ] Ingresar un año (ej: 2025)
- [ ] Los campos se actualizan correctamente
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 2.3 Calcular Modelo 303

- [ ] Hacer clic en "Calcular"
- [ ] El cálculo se completa sin errores
- [ ] Se muestran los resultados del cálculo
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 2.4 Verificar Resultados del Cálculo

- [ ] Se muestran las Ventas (IVA Repercutido) por tipo:
  - [ ] Base 21% y IVA
  - [ ] Base 10% y IVA
  - [ ] Base 4% y IVA
  - [ ] Exentas
- [ ] Se muestran las Compras (IVA Soportado) por tipo
- [ ] Se muestra el Resultado final (A INGRESAR o A DEVOLVER)
- [ ] Se muestra el periodo calculado
- [ ] Se muestra el número de ventas/compras incluidas
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 2.5 Generar Declaración PDF

- [ ] Después de calcular, hacer clic en "Generar"
- [ ] El PDF se genera correctamente
- [ ] Se descarga el archivo PDF
- [ ] El PDF contiene todos los datos del cálculo
- [ ] El formato es correcto y legible
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### 2.6 Probar Diferentes Trimestres

- [ ] Probar calcular para 1er Trimestre (Ene-Mar)
- [ ] Probar calcular para 2do Trimestre (Abr-Jun)
- [ ] Probar calcular para 3er Trimestre (Jul-Sep)
- [ ] Probar calcular para 4to Trimestre (Oct-Dic)
- [ ] Cada trimestre muestra resultados correctos
- [ ] Solo se incluyen ventas/compras del periodo seleccionado
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

---

## 🔍 VALIDACIONES ADICIONALES

### Integración Frontend-Backend

- [ ] Las peticiones al backend funcionan correctamente
- [ ] Los errores se manejan adecuadamente (se muestran mensajes al usuario)
- [ ] Los estados de carga se muestran correctamente
- [ ] Los datos se actualizan en tiempo real
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### UX/UI

- [ ] La interfaz es intuitiva y fácil de usar
- [ ] Los mensajes de error son claros
- [ ] Los mensajes de éxito se muestran correctamente
- [ ] La navegación es fluida
- [ ] Los formularios tienen validaciones adecuadas
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

### Rendimiento

- [ ] Las páginas cargan en menos de 3 segundos
- [ ] Los cálculos se completan en menos de 5 segundos
- [ ] No hay errores en la consola del navegador (F12 → Console)
- [ ] No hay errores en los logs del backend
- [ ] **Resultado:** ✅ Funciona | ⚠️ Con problemas | ❌ No funciona
- [ ] **Notas:** [Escribir observaciones]

---

## 🐛 PROBLEMAS ENCONTRADOS

### Facturación

- [ ] **Problema 1:** [Descripción del problema]
  - **Severidad:** 🔴 Crítico | 🟡 Importante | 🟢 Menor
  - **Pasos para reproducir:** [Pasos]
  - **Solución:** [Si se encontró solución]

- [ ] **Problema 2:** [Descripción del problema]
  - **Severidad:** 🔴 Crítico | 🟡 Importante | 🟢 Menor
  - **Pasos para reproducir:** [Pasos]
  - **Solución:** [Si se encontró solución]

### Modelo 303

- [ ] **Problema 1:** [Descripción del problema]
  - **Severidad:** 🔴 Crítico | 🟡 Importante | 🟢 Menor
  - **Pasos para reproducir:** [Pasos]
  - **Solución:** [Si se encontró solución]

- [ ] **Problema 2:** [Descripción del problema]
  - **Severidad:** 🔴 Crítico | 🟡 Importante | 🟢 Menor
  - **Pasos para reproducir:** [Pasos]
  - **Solución:** [Si se encontró solución]

---

## ✅ RESUMEN FINAL

### Facturación

- **Total validaciones:** 9
- **Pasando:** ___ / 9
- **Estado:** ✅ Funcional | ⚠️ Con problemas menores | ❌ Con problemas críticos

### Modelo 303

- **Total validaciones:** 6
- **Pasando:** ___ / 6
- **Estado:** ✅ Funcional | ⚠️ Con problemas menores | ❌ Con problemas críticos

### Estado General

- **Estado:** ✅ Validado | ⚠️ Con problemas menores | ❌ Con problemas críticos
- **¿Listo para producción?** [ ] Sí | [ ] No (especificar por qué)

### Notas Finales

[Escribir notas adicionales, observaciones, recomendaciones, etc.]

---

**Fecha finalización:** [Fecha]  
**Tiempo total:** [Tiempo empleado]
