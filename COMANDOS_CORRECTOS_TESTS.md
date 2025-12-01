# ✅ Comandos Correctos para Ejecutar Tests

## 🔧 PROBLEMAS SOLUCIONADOS

1. ✅ **langsmith desinstalado** - Ya no interfiere con pytest
2. ✅ **pydantic-core reinstalado** - Debería funcionar ahora
3. ✅ **pytest.ini actualizado** - Deshabilita langsmith automáticamente

---

## 🚀 COMANDOS CORRECTOS

### ⚠️ IMPORTANTE: Estar en el directorio correcto

**NO ejecutes `cd backend` si ya estás en `backend`**  
**NO ejecutes `cd frontend-next` desde dentro de `backend`**

---

## 📊 TESTS BACKEND

### Desde PowerShell (estando en la raíz del proyecto)

```powershell
# Opción 1: Desde la raíz, ir a backend
cd C:\Users\Antonio\Desktop\sistemaempresarial\backend
pytest tests/test_dashboard.py -v

# Opción 2: Ejecutar directamente desde la raíz
cd C:\Users\Antonio\Desktop\sistemaempresarial
cd backend
pytest tests/test_dashboard.py -v
```

### Verificar que estás en el directorio correcto

```powershell
# Debe mostrar: C:\Users\Antonio\Desktop\sistemaempresarial\backend
pwd
# O en PowerShell:
Get-Location
```

### Ejecutar tests específicos

```powershell
# Dashboard completo
pytest tests/test_dashboard.py -v

# Un test específico
pytest tests/test_dashboard.py::test_dashboard_stats_endpoint -v

# Todos los tests
pytest tests/ -v

# Con más detalles
pytest tests/ -v -s
```

---

## 🎭 TESTS FRONTEND E2E

### Desde PowerShell (estando en la raíz del proyecto)

```powershell
# Ir a frontend-next desde la raíz
cd C:\Users\Antonio\Desktop\sistemaempresarial\frontend-next

# Verificar que estás en el directorio correcto
# Debe mostrar: C:\Users\Antonio\Desktop\sistemaempresarial\frontend-next
Get-Location

# Instalar dependencias si falta algo
npm install

# Instalar navegadores de Playwright
npx playwright install

# Ejecutar tests
npm run test:e2e

# Con UI interactiva (recomendado)
npm run test:e2e:ui
```

### Verificar scripts disponibles

```powershell
cd frontend-next
npm run
# Debe mostrar todos los scripts incluyendo test:e2e
```

---

## 🔍 DIAGNÓSTICO RÁPIDO

### Verificar Backend

```powershell
cd backend

# Verificar pydantic
python -c "import pydantic; print('Pydantic OK')"

# Verificar pytest
python -c "import pytest; print('Pytest OK')"

# Verificar que puedes importar la app
python -c "from app.main import app; print('App OK')"
```

### Verificar Frontend

```powershell
cd frontend-next

# Verificar package.json existe
Test-Path package.json

# Verificar scripts
npm run

# Verificar Playwright
npx playwright --version
```

---

## 🐛 SI SIGUE FALLANDO

### Backend: Error de pydantic_core

```powershell
cd backend

# Solución agresiva
pip uninstall pydantic pydantic-core pydantic-settings -y
pip install pydantic pydantic-settings

# Verificar
python -c "import pydantic_core; print('OK')"
```

### Frontend: Script no encontrado

```powershell
cd frontend-next

# Verificar que estás en el directorio correcto
Get-Location

# Debe mostrar: ...\frontend-next
# Si muestra ...\backend, entonces:
cd ..
cd frontend-next

# Luego ejecutar
npm run test:e2e
```

---

## 📋 CHECKLIST ANTES DE EJECUTAR

### Backend Tests
- [ ] Estás en `C:\Users\Antonio\Desktop\sistemaempresarial\backend`
- [ ] Entorno virtual activado (`.venv`)
- [ ] `pydantic` funciona: `python -c "import pydantic"`
- [ ] `pytest` funciona: `python -c "import pytest"`

### Frontend E2E Tests
- [ ] Estás en `C:\Users\Antonio\Desktop\sistemaempresarial\frontend-next`
- [ ] `package.json` existe
- [ ] `npm install` ejecutado
- [ ] `npx playwright install` ejecutado
- [ ] Backend corriendo en `http://localhost:8000`

---

## 💡 TIPS

1. **Siempre verifica el directorio actual** con `Get-Location` o `pwd`
2. **Si estás en `backend`, NO hagas `cd backend`** - ya estás ahí
3. **Para ir a `frontend-next` desde `backend`:** `cd ..\frontend-next`
4. **Para volver a la raíz:** `cd ..` desde cualquier subdirectorio

---

**Última actualización:** $(date)












