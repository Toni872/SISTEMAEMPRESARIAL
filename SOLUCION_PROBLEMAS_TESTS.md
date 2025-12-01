# 🔧 Solución de Problemas con Tests

## 🐛 Problemas Encontrados

### 1. Error de pytest: `ModuleNotFoundError: No module named 'pydantic_core._pydantic_core'`

**Causa:** Instalación corrupta o conflicto de versiones de pydantic_core

**Solución:**
```bash
cd backend
pip uninstall pydantic pydantic-core pydantic-settings -y
pip install pydantic pydantic-settings
```

### 2. Error: `Missing script: "test:e2e"`

**Causa:** El script existe pero puede que:
- No estés en el directorio correcto (`frontend-next`)
- Playwright no esté instalado

**Solución:**
```bash
# Desde la raíz del proyecto
cd frontend-next
npm install
npx playwright install
npm run test:e2e
```

### 3. Error de ruta: `cd frontend-next` desde `backend`

**Causa:** Intentaste cambiar de directorio desde dentro de `backend`

**Solución:** Volver a la raíz primero:
```bash
cd ..  # Volver a la raíz
cd frontend-next  # Ahora sí funciona
```

---

## ✅ SOLUCIÓN COMPLETA PASO A PASO

### Paso 1: Arreglar Backend Tests

```bash
# Desde la raíz del proyecto
cd backend

# Reinstalar pydantic
pip uninstall pydantic pydantic-core pydantic-settings -y
pip install pydantic pydantic-settings

# Verificar instalación
python -c "import pydantic; print('OK')"

# Ejecutar tests
pytest tests/test_dashboard.py -v
```

### Paso 2: Arreglar Frontend Tests

```bash
# Desde la raíz del proyecto
cd frontend-next

# Instalar dependencias si falta algo
npm install

# Instalar navegadores de Playwright
npx playwright install

# Ejecutar tests E2E
npm run test:e2e
```

---

## 🚀 COMANDOS CORRECTOS PARA EJECUTAR TESTS

### Backend Tests

```powershell
# Desde la raíz del proyecto
cd backend
pytest tests/test_dashboard.py -v

# O todos los tests
pytest tests/ -v
```

### Frontend E2E Tests

```powershell
# Desde la raíz del proyecto
cd frontend-next
npm run test:e2e

# Con UI interactiva
npm run test:e2e:ui

# En modo debug
npm run test:e2e:debug
```

---

## 📋 VERIFICACIÓN PREVIA

Antes de ejecutar tests, verifica:

### Backend
- [ ] Estás en el directorio `backend`
- [ ] El entorno virtual está activado (`.venv`)
- [ ] `pydantic` está instalado correctamente
- [ ] PostgreSQL está corriendo (si los tests lo requieren)

### Frontend
- [ ] Estás en el directorio `frontend-next`
- [ ] `node_modules` existe (ejecutar `npm install` si falta)
- [ ] Playwright está instalado (`npx playwright install`)
- [ ] El backend está corriendo en `http://localhost:8000`

---

## 🔍 DIAGNÓSTICO RÁPIDO

### Verificar Backend
```bash
cd backend
python -c "import pydantic; print('Pydantic OK')"
python -c "import pytest; print('Pytest OK')"
```

### Verificar Frontend
```bash
cd frontend-next
npm list @playwright/test
npx playwright --version
```

---

## 💡 ALTERNATIVA: Ejecutar desde Docker

Si los problemas persisten, puedes ejecutar tests desde Docker:

```bash
# Backend tests en Docker
docker exec sistemaempresarial-backend pytest tests/ -v

# Frontend tests (requiere que el contenedor tenga Node.js)
# Mejor ejecutar localmente
```

---

**Última actualización:** $(date)












