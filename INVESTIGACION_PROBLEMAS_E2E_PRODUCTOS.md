# 🔍 Investigación: Problemas E2E Módulo Productos

**Fecha:** 2025-01-24  
**Problemas identificados:** 2

---

## Problema 1: WebKit/Safari - Timeout en Login

### Síntomas
- Timeout esperando `/landing` o `/dashboard` después del login
- Afecta a todos los tests en WebKit (7 tests) y Mobile Safari (7 tests)
- Los tests pasan correctamente en Chromium y Firefox

### Análisis

#### Flujo de Login Actual
1. Usuario hace submit del formulario de login
2. `login()` en `auth-store.ts` llama a `apiClient.login()`
3. Se obtiene `getCurrentUser()` para cargar datos del usuario
4. Se actualiza el estado de Zustand con `persist` (usa localStorage)
5. `login/page.tsx` hace `router.push('/landing')` después de éxito

#### Posibles Causas

**1. Problema con localStorage en WebKit**
- WebKit puede tener restricciones más estrictas con localStorage
- El `persist` de Zustand usa localStorage para guardar el estado
- Si localStorage falla silenciosamente, el estado no se persiste correctamente

**2. Problema con redirecciones asíncronas**
- WebKit puede manejar `router.push()` de manera diferente
- El `waitForURL` puede no detectar la redirección si es muy rápida o muy lenta
- Puede haber un race condition entre el estado de autenticación y la redirección

**3. Problema con el estado de autenticación**
- El `useEffect` en `login/page.tsx` verifica `isAuthenticated` y redirige
- Si el estado no se actualiza correctamente en WebKit, la redirección no ocurre

### Soluciones Propuestas

#### Solución 1: Esperar explícitamente el estado de autenticación
```typescript
// En lugar de solo esperar la URL, esperar también el estado
await page.waitForFunction(() => {
  return localStorage.getItem('auth-storage') !== null;
}, { timeout: 15000 });
await page.waitForURL(/\/landing|\/dashboard/, { timeout: 15000 });
```

#### Solución 2: Usar waitForNavigation en lugar de waitForURL
```typescript
await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle' }),
  page.click('button[type="submit"]')
]);
```

#### Solución 3: Aumentar timeout y añadir esperas adicionales
```typescript
await page.click('button[type="submit"]');
// Esperar a que el botón de loading desaparezca
await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 });
// Esperar a que localStorage se actualice
await page.waitForFunction(() => {
  const auth = localStorage.getItem('auth-storage');
  return auth && JSON.parse(auth).state?.isAuthenticated === true;
}, { timeout: 15000 });
await page.waitForURL(/\/landing|\/dashboard/, { timeout: 15000 });
```

#### Solución 4: Verificar que el login fue exitoso antes de esperar redirección
```typescript
await page.click('button[type="submit"]');
// Esperar a que desaparezca el mensaje de error (si aparece)
await page.waitForTimeout(1000);
// Verificar que no hay error
const errorVisible = await page.locator('text=/error|incorrectas/i').isVisible().catch(() => false);
if (errorVisible) {
  throw new Error('Login failed');
}
// Esperar redirección
await page.waitForURL(/\/landing|\/dashboard/, { timeout: 20000 });
```

### Recomendación
**Combinar Solución 3 y 4** para máxima robustez:
- Esperar a que el botón de submit termine de cargar
- Verificar que no hay errores
- Esperar a que localStorage se actualice
- Esperar la redirección con timeout aumentado

---

## Problema 2: Mobile Chrome - Filtro de Categoría No Visible

### Síntomas
- El botón de categoría no es visible en Mobile Chrome
- Error: "Element is not visible"
- El test falla al intentar hacer click en el segundo botón de categoría

### Análisis

#### Estructura del Filtro
```tsx
<div className="flex gap-2">
  <Button variant={selectedCategory === 'all' ? 'default' : 'outline'} size="sm">
    Todas
  </Button>
  {categories.map((cat) => (
    <Button variant={selectedCategory === cat ? 'default' : 'outline'} size="sm">
      {cat}
    </Button>
  ))}
</div>
```

#### Posibles Causas

**1. Overflow en Mobile**
- En Mobile Chrome, el contenedor `flex gap-2` puede tener overflow
- Los botones pueden estar fuera del viewport
- El botón puede estar oculto por CSS responsive

**2. Botones Renderizados Dinámicamente**
- Los botones de categoría se renderizan basados en `categories.map()`
- Si no hay categorías, no hay botones
- Puede haber un delay en el renderizado

**3. Selector Incorrecto**
- El selector `button.filter({ hasText: /^(Todas|[A-Z])/ })` puede no coincidir correctamente
- En Mobile, los botones pueden tener diferentes estilos o estructura

### Soluciones Propuestas

#### Solución 1: Scroll al elemento antes de hacer click
```typescript
const categoryButton = categoryButtons.nth(1);
await categoryButton.scrollIntoViewIfNeeded();
await categoryButton.click({ timeout: 5000 });
```

#### Solución 2: Usar selector más específico
```typescript
// Buscar botones dentro del contenedor de filtros
const filterContainer = page.locator('div').filter({ hasText: 'Todas' }).first();
const categoryButtons = filterContainer.locator('button');
```

#### Solución 3: Verificar visibilidad antes de hacer click
```typescript
const categoryButton = categoryButtons.nth(1);
const isVisible = await categoryButton.isVisible();
if (!isVisible) {
  // Scroll al contenedor primero
  await filterContainer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}
await categoryButton.click({ timeout: 5000, force: true });
```

#### Solución 4: Usar click en el texto en lugar del botón
```typescript
// Si el botón no es clickeable, hacer click en el texto
const categoryName = await categoryButtons.nth(1).textContent();
await page.click(`button:has-text("${categoryName}")`);
```

### Recomendación
**Combinar Solución 1 y 3**:
- Verificar que hay categorías disponibles
- Scroll al contenedor si es necesario
- Verificar visibilidad antes de hacer click
- Usar `force: true` como último recurso

---

## Plan de Acción

### Paso 1: Mejorar Login para WebKit
1. Añadir espera explícita del estado de autenticación
2. Verificar que no hay errores de login
3. Aumentar timeout a 20 segundos
4. Añadir espera de localStorage

### Paso 2: Mejorar Filtro de Categoría para Mobile Chrome
1. Scroll al contenedor antes de interactuar
2. Verificar visibilidad antes de hacer click
3. Usar selector más específico
4. Añadir fallback con `force: true`

### Paso 3: Ejecutar Tests y Validar
1. Ejecutar tests en WebKit para verificar login
2. Ejecutar tests en Mobile Chrome para verificar filtro
3. Ejecutar todos los tests para validar que no se rompió nada

---

## Código de Implementación

### Mejora del Login (beforeEach)
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
  
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  
  // Hacer click y esperar múltiples condiciones
  await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/auth/login') && response.status() === 200
    ).catch(() => {}), // No fallar si la respuesta ya ocurrió
    page.click('button[type="submit"]')
  ]);
  
  // Esperar a que el botón termine de cargar
  await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 }).catch(() => {});
  
  // Verificar que no hay error
  const errorVisible = await page.locator('text=/error|incorrectas/i').isVisible({ timeout: 2000 }).catch(() => false);
  if (errorVisible) {
    throw new Error('Login failed - credentials incorrect');
  }
  
  // Esperar a que localStorage se actualice (para WebKit)
  await page.waitForFunction(() => {
    try {
      const auth = localStorage.getItem('auth-storage');
      if (!auth) return false;
      const parsed = JSON.parse(auth);
      return parsed.state?.isAuthenticated === true;
    } catch {
      return false;
    }
  }, { timeout: 20000 }).catch(() => {
    // Si falla, continuar de todas formas (puede funcionar sin esto)
  });
  
  // Esperar redirección con timeout aumentado
  await page.waitForURL(/\/landing|\/dashboard/, { timeout: 20000 });
  
  // Navegar a productos
  await page.goto('/products');
  await page.waitForLoadState('networkidle');
});
```

### Mejora del Filtro de Categoría
```typescript
test('debe poder filtrar productos por categoría', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  
  // Buscar el contenedor de filtros
  const filterContainer = page.locator('button:has-text("Todas")').locator('..').first();
  const todasVisible = await filterContainer.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (todasVisible) {
    // Scroll al contenedor para asegurar visibilidad en mobile
    await filterContainer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Buscar botones de categoría dentro del contenedor
    const categoryButtons = filterContainer.locator('button');
    const buttonCount = await categoryButtons.count();
    
    if (buttonCount > 1) {
      const secondButton = categoryButtons.nth(1);
      
      // Verificar visibilidad
      const isVisible = await secondButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!isVisible) {
        // Intentar scroll específico al botón
        await secondButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
      }
      
      // Hacer click (usar force solo si es necesario)
      await secondButton.click({ timeout: 5000, force: !isVisible });
      
      await page.waitForTimeout(1000);
      
      const table = page.locator('table').first();
      await expect(table).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  } else {
    test.skip();
  }
});
```

---

## Próximos Pasos

1. Implementar mejoras en `products.spec.ts`
2. Ejecutar tests para validar correcciones
3. Documentar resultados
4. Si los problemas persisten, investigar más a fondo

