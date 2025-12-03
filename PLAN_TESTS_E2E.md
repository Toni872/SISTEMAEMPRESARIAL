# 🎯 Plan de Acción: Tests E2E y Validación MVP

**Fecha:** 2025-01-24  
**Estado:** En progreso

---

## ✅ Completado

### Tests Backend Dashboard
- ✅ 5/5 tests del Dashboard pasando
- ✅ Configuración de tests optimizada (SQLite, rate limiting)
- ✅ Script de seed E2E creado (`backend/scripts/seed_e2e.py`)

---

## 📋 Próximos Pasos

### 1. Preparar Entorno para Tests E2E

**Objetivo:** Configurar datos de prueba y entorno

```bash
# 1. Ejecutar script de seed E2E
cd backend
python scripts/seed_e2e.py

# Esto creará:
# - Usuario: test@example.com / testpassword123
# - 6 productos de ejemplo
# - 3 ventas de ejemplo
# - 2 proveedores y 2 compras
```

**Archivos necesarios:**
- ✅ `backend/scripts/seed_e2e.py` - Creado
- ⏳ Variables de entorno para tests E2E

---

### 2. Ejecutar Tests E2E del Dashboard

**Objetivo:** Validar que los tests E2E del Dashboard funcionan correctamente

```bash
# Desde frontend-next
cd frontend-next

# Asegurar que backend y frontend estén corriendo
# Backend: http://localhost:8000
# Frontend: http://localhost:3001

# Ejecutar tests E2E del Dashboard
npm run test:e2e dashboard.spec.ts

# O con interfaz gráfica
npm run test:e2e:ui
```

**Tests a validar:**
- ✅ Dashboard muestra métricas principales
- ✅ Dashboard muestra gráficos
- ✅ Dashboard muestra top productos
- ✅ Dashboard muestra alertas de stock bajo
- ✅ Cambio de período funciona
- ✅ Enlaces a otras secciones funcionan

---

### 3. Validar Otros Módulos Críticos

#### Módulo: Productos
**Tests Backend:**
```bash
cd backend
pytest tests/test_products.py -v
```

**Tests E2E:**
```bash
cd frontend-next
npm run test:e2e products.spec.ts
```

#### Módulo: Ventas
**Tests Backend:**
```bash
cd backend
pytest tests/test_sales.py -v
```

**Tests E2E:**
```bash
cd frontend-next
npm run test:e2e sales.spec.ts
```

#### Módulo: Compras
**Tests Backend:**
```bash
cd backend
pytest tests/test_purchases.py -v
```

**Tests E2E:**
```bash
cd frontend-next
npm run test:e2e purchases.spec.ts
```

---

## 🔧 Configuración Necesaria

### Variables de Entorno para Tests E2E

Crear archivo `.env` en `frontend-next/e2e/` (si no existe):

```env
TEST_EMAIL=test@example.com
TEST_PASSWORD=testpassword123
PLAYWRIGHT_BASE_URL=http://localhost:3001
```

### Verificar Servicios

Antes de ejecutar tests E2E, asegurar:

1. **Backend corriendo:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   # Debe estar en http://localhost:8000
   ```

2. **Frontend corriendo:**
   ```bash
   cd frontend-next
   npm run dev
   # Debe estar en http://localhost:3001
   ```

3. **Base de datos con datos de seed:**
   ```bash
   cd backend
   python scripts/seed_e2e.py
   ```

---

## 📊 Priorización de Módulos

### 🔴 Críticos (MVP Core)
1. ✅ **Dashboard** - Backend completado, E2E pendiente
2. ⏳ **Productos** - CRUD básico
3. ⏳ **Ventas** - CRUD básico
4. ⏳ **Compras** - CRUD básico

### 🟡 Importantes (MVP Extendido)
5. ⏳ **Autenticación** - Tests E2E básicos existen
6. ⏳ **Fiscalidad** - Modelos 303 y 111
7. ⏳ **Verifactu** - Registro de facturas

### 🟢 Opcionales (Post-MVP)
8. ⏳ **Facturas Recurrentes**
9. ⏳ **Plantillas de Factura**

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Tests E2E fallan por falta de datos
**Solución:** Ejecutar `python backend/scripts/seed_e2e.py` antes de los tests

### Problema: Tests E2E fallan por credenciales incorrectas
**Solución:** Verificar variables de entorno `TEST_EMAIL` y `TEST_PASSWORD`

### Problema: Playwright no encuentra elementos
**Solución:** Revisar selectores en los tests, pueden necesitar actualización según la UI actual

---

## 📝 Checklist de Ejecución

### Para cada módulo:

- [ ] **Backend:**
  - [ ] Ejecutar tests unitarios
  - [ ] Verificar que todos pasan
  - [ ] Documentar bugs encontrados

- [ ] **E2E:**
  - [ ] Ejecutar script de seed
  - [ ] Verificar servicios corriendo
  - [ ] Ejecutar tests E2E
  - [ ] Verificar que todos pasan
  - [ ] Documentar bugs encontrados

- [ ] **Validación Manual:**
  - [ ] Probar flujos críticos manualmente
  - [ ] Verificar UX/UI
  - [ ] Documentar mejoras necesarias

---

## 🎯 Objetivo Final

**MVP completamente validado con:**
- ✅ Tests backend para módulos críticos
- ✅ Tests E2E para flujos principales
- ✅ Datos de prueba consistentes
- ✅ Documentación de bugs y mejoras

---

## 📞 Siguiente Acción Inmediata

**Recomendación:** Ejecutar tests E2E del Dashboard

```bash
# 1. Preparar datos
cd backend
python scripts/seed_e2e.py

# 2. Ejecutar tests E2E
cd ../frontend-next
npm run test:e2e dashboard.spec.ts
```

**Resultado esperado:** 6 tests del Dashboard pasando ✅

---

**Última actualización:** 2025-01-24


















