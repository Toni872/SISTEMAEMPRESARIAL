# 🏷️ Configuración de Labels para GitHub

Este documento describe cómo configurar los labels en tu repositorio de GitHub para una mejor organización de issues y PRs.

## 📋 Labels Recomendados

### 🎯 Por Tipo

| Label | Color | Descripción |
|-------|-------|-------------|
| `bug` | `#d73a4a` | Algo no funciona correctamente |
| `enhancement` | `#a2eeef` | Nueva funcionalidad o mejora |
| `documentation` | `#0075ca` | Mejoras o correcciones en documentación |
| `refactor` | `#fbca04` | Mejora del código sin cambiar funcionalidad |
| `test` | `#1d76db` | Relacionado con tests |
| `security` | `#ee0701` | Vulnerabilidad o problema de seguridad |
| `performance` | `#5319e7` | Mejora de rendimiento |

### 🌟 Para Contribuidores

| Label | Color | Descripción |
|-------|-------|-------------|
| `good first issue` | `#7057ff` | Perfecto para nuevos contribuidores |
| `help wanted` | `#008672` | Se necesita ayuda externa |
| `beginner friendly` | `#0e8a16` | Apropiado para principiantes |

### 📊 Por Prioridad

| Label | Color | Descripción |
|-------|-------|-------------|
| `priority: critical` | `#b60205` | Debe resolverse inmediatamente |
| `priority: high` | `#d93f0b` | Alta prioridad |
| `priority: medium` | `#fbca04` | Prioridad media |
| `priority: low` | `#0e8a16` | Baja prioridad |

### 🏗️ Por Estado

| Label | Color | Descripción |
|-------|-------|-------------|
| `needs-triage` | `#d4c5f9` | Necesita revisión inicial |
| `needs-discussion` | `#c5def5` | Requiere discusión del equipo |
| `in-progress` | `#0052cc` | Se está trabajando en ello |
| `blocked` | `#e99695` | Bloqueado por otra tarea |
| `ready-for-review` | `#0e8a16` | Listo para revisión |
| `changes-requested` | `#fbca04` | Cambios solicitados en PR |

### 🎨 Por Componente

| Label | Color | Descripción |
|-------|-------|-------------|
| `frontend` | `#bfdadc` | Relacionado con React/UI |
| `backend` | `#d4c5f9` | Relacionado con NestJS/API |
| `database` | `#5319e7` | Relacionado con Prisma/PostgreSQL |
| `graphql` | `#e10098` | Relacionado con GraphQL |
| `auth` | `#c2e0c6` | Autenticación y autorización |
| `dashboard` | `#fef2c0` | Panel de control |
| `sales` | `#bfdadc` | Módulo de ventas |
| `purchases` | `#c5def5` | Módulo de compras |
| `products` | `#d4c5f9` | Módulo de productos |
| `ai-engine` | `#5319e7` | Motor de IA |

### 🔧 Por Acción

| Label | Color | Descripción |
|-------|-------|-------------|
| `wontfix` | `#ffffff` | No se trabajará en esto |
| `duplicate` | `#cfd3d7` | Duplicado de otro issue |
| `invalid` | `#e4e669` | No es válido o no reproduce |
| `question` | `#d876e3` | Pregunta o solicitud de información |

## 🚀 Cómo Configurar los Labels

### Opción 1: Manualmente en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Issues** → **Labels**
3. Click en **New label** para cada uno
4. Copia el nombre, color y descripción de arriba

### Opción 2: Usando GitHub CLI

```bash
# Instalar GitHub CLI
winget install GitHub.cli

# Autenticarse
gh auth login

# Crear labels (ejecutar desde la raíz del proyecto)
gh label create "good first issue" --color "7057ff" --description "Perfecto para nuevos contribuidores"
gh label create "help wanted" --color "008672" --description "Se necesita ayuda externa"
gh label create "documentation" --color "0075ca" --description "Mejoras en documentación"
gh label create "bug" --color "d73a4a" --description "Algo no funciona"
gh label create "enhancement" --color "a2eeef" --description "Nueva funcionalidad"
gh label create "priority: high" --color "d93f0b" --description "Alta prioridad"
gh label create "priority: medium" --color "fbca04" --description "Prioridad media"
gh label create "priority: low" --color "0e8a16" --description "Baja prioridad"
gh label create "needs-triage" --color "d4c5f9" --description "Necesita revisión"
gh label create "needs-discussion" --color "c5def5" --description "Requiere discusión"
gh label create "frontend" --color "bfdadc" --description "Frontend/React"
gh label create "backend" --color "d4c5f9" --description "Backend/NestJS"
gh label create "security" --color "ee0701" --description "Seguridad"
gh label create "performance" --color "5319e7" --description "Rendimiento"
```

### Opción 3: Usando Script PowerShell

Crea un archivo `setup-labels.ps1`:

```powershell
# Lista de labels
$labels = @(
    @{name="good first issue"; color="7057ff"; description="Perfecto para nuevos contribuidores"},
    @{name="help wanted"; color="008672"; description="Se necesita ayuda externa"},
    @{name="documentation"; color="0075ca"; description="Mejoras en documentación"},
    @{name="bug"; color="d73a4a"; description="Algo no funciona"},
    @{name="enhancement"; color="a2eeef"; description="Nueva funcionalidad"},
    @{name="priority: high"; color="d93f0b"; description="Alta prioridad"},
    @{name="priority: medium"; color="fbca04"; description="Prioridad media"},
    @{name="priority: low"; color="0e8a16"; description="Baja prioridad"}
)

foreach ($label in $labels) {
    gh label create $label.name --color $label.color --description $label.description --force
    Write-Host "✅ Label '$($label.name)' creado" -ForegroundColor Green
}
```

Ejecutar:
```powershell
.\setup-labels.ps1
```

## 📝 Cómo Usar los Labels

### En Issues

1. **Al crear un issue nuevo:**
   - El template automáticamente asigna algunos labels
   - Ejemplo: Bug Report → `bug`, `needs-triage`

2. **Durante triage:**
   - Remover `needs-triage`
   - Añadir prioridad: `priority: high`, `priority: medium`, etc.
   - Añadir componente: `frontend`, `backend`, etc.

3. **Para nuevos contribuidores:**
   - Issues simples → `good first issue`
   - Issues que necesitan ayuda → `help wanted`

### En Pull Requests

1. **Automáticamente:**
   - Los workflows pueden añadir labels basados en archivos modificados

2. **Manualmente:**
   - `ready-for-review` cuando está listo
   - `changes-requested` si necesita cambios
   - Componente afectado: `frontend`, `backend`, etc.

## 🎯 Ejemplos de Uso

### Issue de Bug
```
Labels: bug, priority: high, frontend, needs-triage
Título: [BUG] Error al cargar dashboard
```

### Feature Request
```
Labels: enhancement, needs-discussion, backend, priority: medium
Título: [FEATURE] Añadir filtro por fecha
```

### Good First Issue
```
Labels: good first issue, documentation, priority: low
Título: [DOCS] Actualizar guía de instalación
```

## 🔍 Filtros Útiles

### Buscar en GitHub

```
# Issues para nuevos contribuidores
is:issue is:open label:"good first issue"

# Bugs de alta prioridad
is:issue is:open label:bug label:"priority: high"

# PRs del frontend listos para review
is:pr is:open label:frontend label:"ready-for-review"

# Issues que necesitan ayuda
is:issue is:open label:"help wanted"
```

## 📊 Mantener los Labels

- **Revisar mensualmente** si los labels están siendo usados correctamente
- **Eliminar labels** que no se usan (después de 3 meses sin uso)
- **Añadir nuevos labels** según las necesidades del proyecto
- **Mantener consistencia** en colores y nombres

---

**¿Necesitas ayuda?** Revisa la [documentación de GitHub sobre labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)

