# 🔍 Cómo Verificar que los GitHub Actions Están Operativos

Este documento explica cómo comprobar que los workflows de GitHub Actions están funcionando correctamente.

## 📋 Workflows Disponibles

El proyecto tiene **3 workflows** configurados:

1. **`ci.yml`** - Pipeline CI/CD principal
2. **`daily-maintenance.yml`** - Mantenimiento diario
3. **`security-scan.yml`** - Escaneo de seguridad

## 🔍 Cómo Verificar que Están Operativos

### Método 1: Desde GitHub (Recomendado)

1. **Ir a tu repositorio en GitHub**
   ```
   https://github.com/TU_USUARIO/TU_REPOSITORIO
   ```

2. **Ir a la pestaña "Actions"**
   - Click en "Actions" en la barra superior del repositorio

3. **Ver el historial de ejecuciones**
   - Verás una lista de todas las ejecuciones de workflows
   - Cada ejecución muestra:
     - ✅ Verde = Éxito
     - ❌ Rojo = Fallo
     - 🟡 Amarillo = En progreso
     - ⚪ Gris = Cancelado

4. **Ver detalles de una ejecución**
   - Click en cualquier ejecución para ver detalles
   - Puedes ver logs de cada paso
   - Ver qué jobs pasaron o fallaron

### Método 2: Verificar Estado con Badge

En el README.md debería haber badges que muestran el estado:

```markdown
[![CI/CD](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/ci.yml/badge.svg)](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/ci.yml)
```

Si el badge muestra:
- ✅ **Passing** = Los workflows están funcionando
- ❌ **Failing** = Hay un problema
- ⚪ **No status** = No se han ejecutado aún

### Método 3: Forzar una Ejecución

Para verificar que los workflows funcionan, puedes:

1. **Hacer un push a una rama**
   ```bash
   git checkout -b test-workflow
   git commit --allow-empty -m "Test workflow"
   git push origin test-workflow
   ```

2. **Crear un Pull Request**
   - Esto activará el workflow `ci.yml`

3. **Esperar y verificar**
   - Ve a Actions → Verás la ejecución en progreso

## 📊 Detalles de Cada Workflow

### 1. CI/CD Pipeline (`ci.yml`)

**Cuándo se ejecuta:**
- Push a `master`, `main`, o `develop`
- Pull Request a `master`, `main`, o `develop`

**Qué hace:**
- ✅ Build y test del frontend (Next.js)
- ✅ Build y test del backend (FastAPI)
- ✅ Linter checks
- ✅ Security scans
- ✅ Docker build (si hay secrets configurados)

**Cómo verificar:**
```bash
# Ver en GitHub Actions
https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/ci.yml
```

### 2. Daily Maintenance (`daily-maintenance.yml`)

**Cuándo se ejecuta:**
- Diariamente a las 2:00 AM UTC
- También se puede ejecutar manualmente

**Qué hace:**
- ✅ Actualiza dependencias
- ✅ Ejecuta tests
- ✅ Verifica seguridad

**Cómo verificar:**
```bash
# Ver en GitHub Actions
https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/daily-maintenance.yml

# O ejecutar manualmente desde GitHub:
# Actions → daily-maintenance.yml → Run workflow
```

### 3. Security Scan (`security-scan.yml`)

**Cuándo se ejecuta:**
- Push a cualquier rama
- Pull Request
- Semanalmente (domingos)

**Qué hace:**
- ✅ Escanea código con Trivy
- ✅ Busca vulnerabilidades
- ✅ Sube resultados a GitHub Security

**Cómo verificar:**
```bash
# Ver en GitHub Actions
https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/security-scan.yml

# Ver vulnerabilidades encontradas:
# Security → Code scanning alerts
```

## 🚨 Solución de Problemas

### Problema: Los workflows no se ejecutan

**Posibles causas:**
1. **Workflows deshabilitados**
   - Ve a Settings → Actions → General
   - Verifica que "Allow all actions" esté habilitado

2. **Rama incorrecta**
   - Los workflows solo se ejecutan en `master`, `main`, o `develop`
   - Verifica que estés haciendo push a la rama correcta

3. **Archivos en `.github/workflows/`**
   - Verifica que los archivos `.yml` estén en el repositorio
   - Deben estar en la rama principal

**Solución:**
```bash
# Verificar que los archivos existen
ls -la .github/workflows/

# Hacer commit y push si faltan
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

### Problema: Workflow falla

**Pasos para diagnosticar:**

1. **Ver logs detallados**
   - Ve a Actions → Click en la ejecución fallida
   - Click en el job que falló
   - Revisa los logs de cada step

2. **Errores comunes:**

   **Frontend:**
   ```bash
   # Error: npm ci falla
   # Solución: Verificar package-lock.json está actualizado
   cd frontend-next
   npm install
   git add package-lock.json
   ```

   **Backend:**
   ```bash
   # Error: Tests fallan
   # Solución: Ejecutar tests localmente primero
   cd backend
   pytest tests/ -v
   ```

   **Docker:**
   ```bash
   # Error: Docker build falla
   # Solución: Verificar Dockerfile y secrets
   # Los secrets DOCKERHUB_USERNAME y DOCKERHUB_TOKEN deben estar configurados
   ```

3. **Verificar secrets**
   - Ve a Settings → Secrets and variables → Actions
   - Verifica que los secrets necesarios estén configurados:
     - `DOCKERHUB_USERNAME` (opcional)
     - `DOCKERHUB_TOKEN` (opcional)

### Problema: Workflow nunca se ejecuta automáticamente

**Verificar triggers:**

1. **Verificar rama**
   ```bash
   git branch
   # Debe estar en master, main, o develop
   ```

2. **Verificar archivo workflow**
   ```yaml
   # En .github/workflows/ci.yml debe tener:
   on:
     push:
       branches: [ master, main, develop ]
   ```

3. **Hacer un push de prueba**
   ```bash
   git commit --allow-empty -m "Trigger workflow"
   git push origin main
   ```

## ✅ Checklist de Verificación

Usa este checklist para verificar que todo funciona:

- [ ] Los workflows están en `.github/workflows/`
- [ ] Los workflows están en la rama principal (`main`/`master`)
- [ ] GitHub Actions está habilitado en Settings → Actions
- [ ] Al menos una ejecución aparece en Actions
- [ ] La última ejecución pasó (✅ verde)
- [ ] Los tests se ejecutan correctamente
- [ ] Los linters se ejecutan correctamente
- [ ] Los security scans se ejecutan
- [ ] Los badges en README muestran "passing"

## 🔧 Comandos Útiles

### Verificar workflows localmente (usando act)

```bash
# Instalar act (opcional)
# https://github.com/nektos/act

# Ejecutar workflow localmente
act -l
act push
```

### Verificar sintaxis de workflows

```bash
# Validar YAML
yamllint .github/workflows/*.yml

# O usar validación online
# https://www.yamllint.com/
```

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Debugging Workflows](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows)

## 🎯 Próximos Pasos

1. **Verificar que los workflows están activos**
   - Ve a GitHub → Actions
   - Verifica que hay ejecuciones recientes

2. **Hacer un test push**
   ```bash
   git commit --allow-empty -m "Test GitHub Actions"
   git push origin main
   ```

3. **Revisar resultados**
   - Espera 2-5 minutos
   - Ve a Actions → Verifica que pasó

4. **Configurar secrets (opcional)**
   - Si quieres Docker builds, configura `DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN`
   - Settings → Secrets and variables → Actions

---

**Nota:** Si los workflows no aparecen en GitHub, asegúrate de que:
1. Están en la rama principal (`main`/`master`)
2. GitHub Actions está habilitado en el repositorio
3. Los archivos tienen extensión `.yml` o `.yaml`



