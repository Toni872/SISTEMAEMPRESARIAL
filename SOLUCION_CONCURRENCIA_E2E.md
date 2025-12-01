# 🔧 Solución: Problema de Concurrencia en Tests E2E

## Problema Identificado

Los tests E2E fallan cuando se ejecutan en paralelo debido a **rate limiting** en el endpoint de login:
- Límite: **5 requests/minuto por IP**
- Cuando se ejecutan múltiples tests simultáneamente desde `localhost`, algunos exceden el límite
- Con `workers=1` funciona porque solo hay un login a la vez

## Soluciones Propuestas

### ✅ Opción 1: Deshabilitar Rate Limiting en Tests E2E (RECOMENDADA)

**Ventajas:**
- No afecta la seguridad en producción
- Permite ejecutar tests en paralelo sin problemas
- Similar a lo que ya hacemos en tests unitarios

**Implementación:**
1. Crear variable de entorno `E2E_MODE=true` cuando se ejecuten tests E2E
2. Modificar `backend/app/core/config.py` para deshabilitar rate limiting si `E2E_MODE=true`
3. O crear un endpoint de health/status que deshabilite rate limiting temporalmente

### ✅ Opción 2: Aumentar Rate Limit para Tests

**Ventajas:**
- Mantiene algo de protección
- Fácil de implementar

**Desventajas:**
- Aún puede fallar con muchos workers
- No es la solución ideal

**Implementación:**
```python
# En backend/app/api/auth/endpoints.py
@conditional_rate_limit("100/minute")  # Aumentar de 5 a 100
```

### ✅ Opción 3: Limitar Workers en Playwright

**Ventajas:**
- Solución rápida
- No requiere cambios en el backend

**Desventajas:**
- Tests más lentos
- No resuelve el problema de raíz

**Implementación:**
```bash
# Ejecutar con workers limitados
npx playwright test --workers=2
```

### ✅ Opción 4: Configurar Rate Limiting por Entorno

**Ventajas:**
- Solución más elegante
- Mantiene seguridad en producción

**Implementación:**
- Deshabilitar rate limiting cuando `ENV=test` o `E2E_MODE=true`
- Ya tenemos `RATE_LIMIT_ENABLED` en config, solo necesitamos ajustarlo

## Recomendación Final

**Usar Opción 1 + Opción 3 combinadas:**

1. **Deshabilitar rate limiting en modo E2E** (backend)
2. **Configurar Playwright para usar workers limitados** (frontend)

Esto nos da:
- ✅ Tests rápidos (paralelismo controlado)
- ✅ Sin problemas de rate limiting
- ✅ Seguridad mantenida en producción

## Implementación Propuesta

### Backend: Deshabilitar Rate Limiting en E2E

```python
# backend/app/core/config.py
RATE_LIMIT_ENABLED: bool = True
E2E_MODE: bool = False  # Nueva variable

# En rate_limit.py, verificar E2E_MODE
if settings.E2E_MODE:
    RATE_LIMIT_ENABLED = False
```

### Frontend: Configurar Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4,  // Limitar workers
  // ...
});
```

## Estado Actual

- ✅ Tests funcionan con `workers=1`
- ⏳ Pendiente: Implementar solución permanente






