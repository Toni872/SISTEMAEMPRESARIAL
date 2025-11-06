# 🏷️ Guía Rápida: Configurar Labels en GitHub

## ✅ YA ESTÁ TODO LISTO

Los templates de issues ya están configurados en tu repositorio:

1. **Ve a crear un nuevo issue:**
   https://github.com/Toni872/SISTEMAEMPRESARIAL/issues/new/choose

2. **Verás 4 opciones:**
   - 🐛 Bug Report
   - ✨ Feature Request  
   - 🌟 Good First Issue
   - 📚 Documentation

## 🎯 CONFIGURAR LABELS (2 opciones)

### Opción 1: Manualmente (5 minutos)

1. **Ve a Labels:**
   https://github.com/Toni872/SISTEMAEMPRESARIAL/labels

2. **Click en "New label"** para cada uno:

#### Labels Esenciales (copiar y pegar):

| Nombre | Color | Descripción |
|--------|-------|-------------|
| `good first issue` | `7057ff` | Para nuevos contribuidores |
| `help wanted` | `008672` | Se necesita ayuda |
| `bug` | `d73a4a` | Algo no funciona |
| `enhancement` | `a2eeef` | Nueva funcionalidad |
| `documentation` | `0075ca` | Mejoras en docs |
| `priority: high` | `d93f0b` | Alta prioridad |
| `priority: medium` | `fbca04` | Prioridad media |
| `priority: low` | `0e8a16` | Baja prioridad |
| `frontend` | `bfdadc` | Frontend/React |
| `backend` | `d4c5f9` | Backend/NestJS |
| `needs-triage` | `d4c5f9` | Necesita revisión |
| `in-progress` | `0052cc` | En progreso |

### Opción 2: Con GitHub CLI (automático)

Si tienes `gh` instalado y autenticado:

```powershell
cd C:\Users\Antonio\Desktop\sistemaempresarial
.\scripts\setup-labels-simple.ps1
```

## 🎉 DESPUÉS DE CONFIGURAR

1. **Prueba los templates:**
   - Crea un issue de prueba
   - Selecciona "Bug Report"
   - Verás un formulario estructurado

2. **Usa los labels:**
   - Al crear issues, asigna labels apropiados
   - Ejemplo: `bug` + `priority: high` + `frontend`

3. **Para contribuidores externos:**
   - Marca issues simples con `good first issue`
   - GitHub los mostrará automáticamente

## 💡 TIPS

### Buscar Issues

```
# Issues para nuevos contribuidores
is:issue is:open label:"good first issue"

# Bugs de alta prioridad
is:issue is:open label:bug label:"priority: high"

# Issues del frontend
is:issue is:open label:frontend
```

### Combinar Labels

Un issue puede tener múltiples labels:
- `bug` + `priority: high` + `frontend` + `needs-triage`
- `enhancement` + `priority: medium` + `backend` + `help wanted`
- `documentation` + `good first issue` + `priority: low`

## 📊 BENEFICIOS

✅ **Organización clara** de issues  
✅ **Facilita contribuciones** externas  
✅ **Priorización visual** de tareas  
✅ **Filtrado eficiente** de problemas  
✅ **Workflow profesional**  

## 🔗 LINKS ÚTILES

- **Labels:** https://github.com/Toni872/SISTEMAEMPRESARIAL/labels
- **Nuevo Issue:** https://github.com/Toni872/SISTEMAEMPRESARIAL/issues/new/choose
- **Issues Abiertos:** https://github.com/Toni872/SISTEMAEMPRESARIAL/issues
- **Pull Requests:** https://github.com/Toni872/SISTEMAEMPRESARIAL/pulls
- **Guía Contribución:** https://github.com/Toni872/SISTEMAEMPRESARIAL/blob/master/.github/CONTRIBUTING.md

---

**¿Todo listo? ¡Empieza a usar los templates y labels!** 🚀

