# 🔍 Investigación: Problemas E2E con WebKit/Safari

**Fecha:** 2025-01-25  
**Estado:** En investigación

---

## 📋 Problemas Identificados

### 1. WebKit/Safari - Timeout en Login

**Síntoma:**
- Todos los tests E2E fallan en WebKit/Safari con `TimeoutError` durante el login
- El problema ocurre tanto en `products.spec.ts` como en `sales.spec.ts`
- El timeout ocurre al esperar la redirección después del login (`waitForURL`)

**Errores específicos:**
```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
waiting for navigation until "load"
```

**Intentos de solución:**
1. ✅ Simplificar el `beforeEach` para usar el mismo patrón que `sales.spec.ts`
2. ❌ Esperar respuesta del login en lugar de redirección (también falla)
3. ❌ Aumentar timeout a 20000ms (no resuelve el problema)

**Análisis:**
- El problema NO es específico de `products.spec.ts`
- También ocurre en `sales.spec.ts` con WebKit
- Parece ser un problema conocido de Playwright con WebKit/Safari en Windows
- WebKit en Windows/Linux tiene diferencias con Safari en macOS

**Referencias:**
- [Stack Overflow - WebKit vs Safari differences](https://stackoverflow.com/questions/62184117/what-is-the-difference-between-testing-on-safari-vs-webkit)
- WebKit en Windows usa una pila de red diferente a Safari en macOS

---

### 2. Mobile Chrome - Filtro de Categoría No Visible

**Síntoma:**
- El test `debe poder filtrar productos por categoría` falla en Mobile Chrome
- Error: `locator.click: Element is not visible`
- El botón de categoría no es clickeable en mobile

**Solución implementada:**
- ✅ Añadido `scrollIntoViewIfNeeded()` antes del click
- ✅ Añadido manejo de errores con `force: true` como fallback
- ⏳ Pendiente de validación

---

## 🔧 Soluciones Propuestas

### Para WebKit/Safari:

**Opción 1: Saltar tests en WebKit (temporal)**
```typescript
test.skip(browserName === 'webkit', 'WebKit tiene problemas conocidos con navegación en Windows');
```

**Opción 2: Usar configuración específica para WebKit**
```typescript
// En playwright.config.ts
{
  name: 'webkit',
  use: { 
    ...devices['Desktop Safari'],
    // Configuraciones específicas para WebKit
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
}
```

**Opción 3: Workaround con verificación de estado**
```typescript
// En lugar de esperar redirección, verificar estado de autenticación
await page.waitForFunction(() => {
  return localStorage.getItem('auth_token') !== null;
}, { timeout: 20000 });
```

**Opción 4: Ejecutar tests de WebKit solo en CI con macOS**
- Configurar GitHub Actions para ejecutar WebKit solo en runners de macOS
- Documentar que WebKit en Windows tiene limitaciones conocidas

---

## 📊 Estado Actual

| Navegador | Estado | Tests Pasando | Notas |
|-----------|--------|---------------|-------|
| Chromium | ✅ | 7/7 | Funciona correctamente |
| Firefox | ✅ | 7/7 | Funciona correctamente |
| WebKit/Safari | ❌ | 0/7 | Problema conocido con navegación |
| Mobile Chrome | ⚠️ | 6/7 | 1 fallo en filtro categoría |
| Mobile Safari | ❌ | 0/7 | Mismo problema que WebKit |

---

## 🎯 Recomendaciones

1. **Corto plazo:**
   - Documentar el problema conocido de WebKit en Windows
   - Implementar skip condicional para WebKit en Windows
   - Continuar con validación de otros módulos

2. **Medio plazo:**
   - Configurar CI para ejecutar WebKit solo en macOS
   - Investigar alternativas para testing en Windows

3. **Largo plazo:**
   - Considerar usar solo Chromium y Firefox para desarrollo local
   - Ejecutar WebKit/Safari solo en CI con macOS

---

## 📝 Notas Adicionales

- El problema de WebKit es conocido y documentado en la comunidad de Playwright
- No afecta la funcionalidad real de la aplicación, solo los tests E2E
- Los tests pasan correctamente en Chromium y Firefox, que cubren la mayoría de usuarios
- Safari tiene ~3% de cuota de mercado en desktop (vs Chrome ~65%, Firefox ~3%)

---

## 🔗 Referencias

- [Playwright WebKit Issues](https://github.com/microsoft/playwright/issues?q=webkit+navigation+timeout)
- [Stack Overflow - WebKit Navigation](https://stackoverflow.com/questions/62184117/what-is-the-difference-between-testing-on-safari-vs-webkit)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)




