# 🧪 Cómo Ejecutar Tests - Guía Rápida

## ✅ PROBLEMAS SOLUCIONADOS

1. ✅ **pydantic-core reinstalado** - El problema de importación debería estar resuelto
2. ⚠️ **Conflicto con reflex** - No afecta los tests (reflex es otra librería)

---

## 🚀 EJECUTAR TESTS BACKEND

### Desde PowerShell (Windows)

```powershell
# 1. Ir al directorio backend
cd C:\Users\Antonio\Desktop\sistemaempresarial\backend

# 2. Activar entorno virtual (si no está activo)
.\.venv\Scripts\Activate.ps1

# 3. Ejecutar tests del Dashboard
pytest tests/test_dashboard.py -v

# 4. O ejecutar todos los tests
pytest tests/ -v

# 5. Con más detalles
pytest tests/ -v -s
```

### Tests Específicos

```powershell
# Solo Dashboard
pytest tests/test_dashboard.py -v

# Solo Productos
pytest tests/test_products.py -v

# Solo Ventas
pytest tests/test_sales.py -v

# Solo Compras
pytest tests/test_purchases.py -v

# Solo Autenticación
pytest tests/test_auth.py -v
```

---

## 🎭 EJECUTAR TESTS E2E FRONTEND

### Desde PowerShell (Windows)

```powershell
# 1. Ir al directorio frontend-next
cd C:\Users\Antonio\Desktop\sistemaempresarial\frontend-next

# 2. Verificar que Playwright está instalado
npx playwright --version

# 3. Si no está instalado, instalar navegadores
npx playwright install

# 4. Ejecutar tests E2E
npm run test:e2e

# 5. Con UI interactiva (recomendado para debugging)
npm run test:e2e:ui

# 6. En modo debug
npm run test:e2e:debug

# 7. Con navegador visible
npm run test:e2e:headed
```

### Tests Específicos

```powershell
# Solo Dashboard
npm run test:e2e -- dashboard

# Solo Autenticación
npm run test:e2e -- auth

# Solo Productos
npm run test:e2e -- products
```

---

## 📋 CHECKLIST ANTES DE EJECUTAR TESTS

### Backend
- [ ] Estás en el directorio `backend`
- [ ] Entorno virtual activado (`.venv`)
- [ ] Backend puede iniciarse sin errores
- [ ] Base de datos accesible (para tests de integración)

### Frontend E2E
- [ ] Estás en el directorio `frontend-next`
- [ ] `npm install` ejecutado
- [ ] Playwright instalado (`npx playwright install`)
- [ ] Backend corriendo en `http://localhost:8000`
- [ ] Frontend corriendo en `http://localhost:3001`

---

## 🔧 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: `ModuleNotFoundError: No module named 'pydantic_core._pydantic_core'`

**Solución:**
```powershell
cd backend
pip uninstall pydantic-core -y
pip install --upgrade pydantic pydantic-settings
```

### Error: `Missing script: "test:e2e"`

**Solución:**
```powershell
cd frontend-next
npm install
npm run test:e2e
```

### Error: Playwright no encuentra navegadores

**Solución:**
```powershell
cd frontend-next
npx playwright install
```

### Error: Backend no responde en tests E2E

**Solución:**
1. Iniciar backend manualmente:
```powershell
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

2. En otra terminal, ejecutar tests:
```powershell
cd frontend-next
npm run test:e2e
```

---

## 📊 INTERPRETAR RESULTADOS

### Backend Tests (pytest)

```
✅ PASSED - Test pasó correctamente
❌ FAILED - Test falló (ver detalles)
⏭️ SKIPPED - Test omitido
⚠️ WARNINGS - Advertencias (no crítico)
```

### Frontend E2E Tests (Playwright)

```
✅ passed - Test pasó
❌ failed - Test falló
⏭️ skipped - Test omitido
```

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE EJECUTAR TESTS

1. **Si todos los tests pasan:**
   - ✅ Continuar con pruebas manuales
   - ✅ Documentar resultados
   - ✅ Proceder con validación de otros módulos

2. **Si hay tests fallidos:**
   - 🔍 Revisar mensajes de error
   - 📝 Documentar bugs encontrados
   - 🔧 Corregir bugs críticos primero
   - 🔄 Re-ejecutar tests después de correcciones

---

## 💡 TIPS

1. **Ejecuta tests frecuentemente** - No esperes a tener todo listo
2. **Usa `-v` para más detalles** - `pytest tests/ -v`
3. **Usa `-s` para ver prints** - `pytest tests/ -s`
4. **Ejecuta un test específico** - `pytest tests/test_dashboard.py::test_dashboard_stats_endpoint -v`
5. **Para E2E, usa UI mode** - `npm run test:e2e:ui` es más fácil de debuggear

---

**Última actualización:** $(date)












