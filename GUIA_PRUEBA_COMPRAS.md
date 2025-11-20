# Guía de Prueba - Módulo de Compras

## 🎯 Funcionalidades a Probar

1. ✅ Exportación a PDF y Excel
2. ✅ Filtros avanzados
3. ✅ Integración con Modelo 303

---

## 📋 Preparación

### 1. Verificar que el backend esté corriendo

```bash
# Verificar que el backend esté activo
curl http://localhost:8000/docs
```

### 2. Instalar dependencias nuevas (si es necesario)

Si el backend está en Docker, asegúrate de que `openpyxl` esté instalado:

```bash
# Si usas Docker (Windows PowerShell)
docker exec erp-backend-fastapi pip install openpyxl

# Verificar instalación
docker exec erp-backend-fastapi python -c "import openpyxl; print('openpyxl OK')"

# Si el contenedor se reinicia, necesitarás reinstalar openpyxl
# O mejor: actualiza el Dockerfile para incluir openpyxl permanentemente
```

---

## 🧪 Prueba 1: Exportación a PDF Individual

### Pasos

1. **Abrir la aplicación**: <http://localhost:3000/purchases>
2. **Crear una compra de prueba** (si no tienes ninguna):
   - Click en "Nueva Orden"
   - Seleccionar un proveedor (o crear uno nuevo)
   - Agregar items
   - Guardar

3. **Exportar PDF individual**:
   - En la lista de compras, buscar el botón con icono de descarga (📥) junto a cada compra
   - Click en el botón de descarga
   - Verificar que se descarga un archivo PDF con el nombre `compra_COMP-YYYYMMDD-XXXX.pdf`

### ✅ Resultado esperado

- Se descarga un PDF con:
  - Información de la compra (número, fecha, proveedor)
  - Tabla de items con descripción, cantidad, precio, IVA
  - Totales (subtotal, IVA, total)

---

## 🧪 Prueba 2: Exportación Lista Completa (PDF/Excel)

### Pasos

1. **Ir a la sección de compras**
2. **Click en el botón "Exportar"** (arriba a la derecha)
3. **Seleccionar una opción**:
   - "Exportar a PDF" → Descarga `compras_YYYYMMDD.pdf`
   - "Exportar a Excel" → Descarga `compras_YYYYMMDD.xlsx`

### ✅ Resultado esperado

**PDF:**

- Lista de todas las compras con columnas: Número, Fecha, Proveedor, Estado, Subtotal, IVA, Total
- Fila de totales al final

**Excel:**

- Misma información en formato Excel
- Formato numérico correcto para columnas de dinero
- Encabezados con estilo destacado

---

## 🧪 Prueba 3: Filtros Avanzados

### Pasos

1. **Búsqueda por texto**:
   - En el campo de búsqueda, escribir parte del número de compra o nombre del proveedor
   - Verificar que la lista se filtra en tiempo real

2. **Filtro por proveedor**:
   - Click en "Filtros"
   - Seleccionar un proveedor del dropdown
   - Verificar que solo se muestran compras de ese proveedor

3. **Filtro por estado**:
   - En el panel de filtros, seleccionar un estado (ej: "Aprobada")
   - Verificar que solo se muestran compras con ese estado

4. **Filtro por fecha**:
   - Establecer "Fecha desde" y "Fecha hasta"
   - Verificar que solo se muestran compras en ese rango

5. **Filtros combinados**:
   - Activar múltiples filtros a la vez
   - Verificar que el contador de filtros muestra el número correcto
   - Verificar que los resultados se filtran correctamente

6. **Limpiar filtros**:
   - Click en "Limpiar"
   - Verificar que todos los filtros se resetean y se muestran todas las compras

### ✅ Resultado esperado

- Los filtros funcionan correctamente
- El contador muestra el número de filtros activos
- La descripción muestra "X de Y compras"
- Los filtros se pueden combinar
- El botón "Limpiar" resetea todos los filtros

---

## 🧪 Prueba 4: Integración con Modelo 303

### Pasos

1. **Crear compras de prueba**:
   - Crear al menos 2-3 compras con estado "approved" o "received"
   - Asegurarse de que tengan items con diferentes tipos de IVA (21%, 10%, 4%)
   - Anotar las fechas de las compras

2. **Ir a Modelo 303**:
   - Navegar a: <http://localhost:3000/tax/model-303>
   - O desde el menú: Fiscalidad → Modelo 303 (IVA)

3. **Calcular sin compras**:
   - Seleccionar un trimestre que incluya las fechas de tus compras
   - Dejar "Incluir compras" desactivado
   - Click en "Calcular"
   - Verificar que el IVA soportado es 0

4. **Calcular con compras**:
   - Activar "Incluir compras"
   - Click en "Calcular"
   - Verificar que ahora aparece:
     - Desglose de compras por tipo de IVA (21%, 10%, 4%)
     - Total IVA soportado calculado
     - Número de compras incluidas
     - Detalle de compras con proveedor y fecha
     - Resultado final (IVA repercutido - IVA soportado)

5. **Generar declaración**:
   - Con el cálculo realizado, click en "Generar"
   - Verificar que se crea la declaración
   - Ir a la lista de declaraciones y verificar que aparece

### ✅ Resultado esperado

- El cálculo incluye correctamente las compras cuando está activado
- El IVA soportado se calcula correctamente por tipo
- El resultado final (a pagar/devolver) se ajusta con el IVA soportado
- Se muestra el detalle de compras incluidas
- La declaración se genera correctamente

---

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'openpyxl'"

**Solución:**

```bash
# En el contenedor Docker
docker exec -it <container_name> pip install openpyxl

# O reiniciar el contenedor
docker-compose restart backend
```

### Error: "No se pueden cargar las compras"

**Solución:**

- Verificar que el backend esté corriendo
- Verificar que hay compras creadas
- Revisar la consola del navegador para errores

### Los filtros no funcionan

**Solución:**

- Verificar que `filteredPurchases` esté definido en el código
- Revisar la consola del navegador para errores JavaScript
- Asegurarse de que los estados de filtros se actualizan correctamente

### El PDF no se descarga

**Solución:**

- Verificar que el endpoint `/api/purchases/{id}/export/pdf` funciona en Swagger
- Revisar la consola del navegador
- Verificar que el token de autenticación es válido

---

## 📝 Checklist de Prueba

- [ ] Exportar PDF individual funciona
- [ ] Exportar lista a PDF funciona
- [ ] Exportar lista a Excel funciona
- [ ] Búsqueda por texto funciona
- [ ] Filtro por proveedor funciona
- [ ] Filtro por estado funciona
- [ ] Filtro por fecha funciona
- [ ] Filtros combinados funcionan
- [ ] Limpiar filtros funciona
- [ ] Modelo 303 calcula sin compras (IVA soportado = 0)
- [ ] Modelo 303 calcula con compras (IVA soportado > 0)
- [ ] El IVA soportado se desglosa por tipo (21%, 10%, 4%)
- [ ] Se muestra el detalle de compras incluidas
- [ ] El resultado final se ajusta correctamente

---

## 🎉 ¡Listo para Probar

Sigue los pasos anteriores y verifica que todo funciona correctamente. Si encuentras algún problema, revisa la sección de solución de problemas o avísame.
