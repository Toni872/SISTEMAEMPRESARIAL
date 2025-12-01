# Tests E2E con Playwright

Este directorio contiene los tests end-to-end (E2E) del proyecto usando Playwright.

## Instalación

```bash
npm install
npx playwright install
```

## Configuración

1. Copia `e2e/.env.example` a `e2e/.env` y configura las credenciales de test:
```bash
cp e2e/.env.example e2e/.env
```

2. Edita `e2e/.env` con tus credenciales:
```
TEST_EMAIL=test@example.com
TEST_PASSWORD=testpassword123
PLAYWRIGHT_BASE_URL=http://localhost:3001
```

## Ejecutar Tests

### Todos los tests
```bash
npm run test:e2e
```

### Con interfaz gráfica
```bash
npm run test:e2e:ui
```

### Modo debug
```bash
npm run test:e2e:debug
```

### Con navegador visible (headed)
```bash
npm run test:e2e:headed
```

### Ver reporte HTML
```bash
npm run test:e2e:report
```

## Estructura de Tests

- `auth.spec.ts` - Tests de autenticación (login, logout)
- `products.spec.ts` - Tests de gestión de productos
- `sales.spec.ts` - Tests de gestión de ventas
- `purchases.spec.ts` - Tests de gestión de compras

## Escribir Nuevos Tests

Ejemplo básico:

```typescript
import { test, expect } from '@playwright/test';

test('mi test', async ({ page }) => {
  await page.goto('/mi-pagina');
  await expect(page.locator('h1')).toHaveText('Mi Título');
});
```

## CI/CD

Los tests se ejecutan automáticamente en GitHub Actions. Ver `.github/workflows/ci.yml`.

## Notas

- Los tests requieren que el servidor de desarrollo esté corriendo
- Playwright automáticamente inicia el servidor si no está corriendo (ver `playwright.config.ts`)
- Los screenshots y videos se guardan en `test-results/` cuando fallan los tests













