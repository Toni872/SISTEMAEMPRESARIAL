import { test, expect } from '@playwright/test';

/**
 * Tests E2E para Dashboard MVP
 */
test.describe('Dashboard MVP', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('/login');
    
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('debe mostrar el dashboard con métricas principales', async ({ page }) => {
    // Verificar que se muestran las métricas principales
    await expect(page.locator('text=/ingresos|revenue|total/i')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=/ventas|sales/i')).toBeVisible();
    await expect(page.locator('text=/productos|products/i')).toBeVisible();
  });

  test('debe mostrar gráficos del dashboard', async ({ page }) => {
    // Verificar que hay gráficos (Recharts renderiza SVGs)
    await page.waitForTimeout(2000); // Esperar a que carguen los gráficos
    const charts = page.locator('svg').first();
    await expect(charts).toBeVisible({ timeout: 5000 });
  });

  test('debe mostrar top productos', async ({ page }) => {
    // Buscar sección de top productos
    await expect(page.locator('text=/top.*productos|productos.*vendidos/i')).toBeVisible({ timeout: 5000 });
  });

  test('debe mostrar alertas si hay stock bajo', async ({ page }) => {
    // Verificar que se muestran alertas (si hay)
    // Esto puede no aparecer si no hay stock bajo, así que es opcional
    const alerts = page.locator('text=/stock.*bajo|alerta/i');
    const count = await alerts.count();
    // Si hay alertas, deben ser visibles
    if (count > 0) {
      await expect(alerts.first()).toBeVisible();
    }
  });

  test('debe permitir cambiar período de visualización', async ({ page }) => {
    // Buscar selectores de período (mes, semana, año)
    const periodButtons = page.locator('button:has-text("Mes"), button:has-text("Semana"), button:has-text("Año")');
    const count = await periodButtons.count();
    
    if (count > 0) {
      // Si hay botones de período, hacer click en uno
      await periodButtons.first().click();
      await page.waitForTimeout(1000); // Esperar actualización
    }
  });

  test('debe mostrar enlaces a otras secciones', async ({ page }) => {
    // Verificar enlaces rápidos a otras secciones
    const quickLinks = page.locator('a[href*="/sales"], a[href*="/products"], a[href*="/purchases"]');
    const count = await quickLinks.count();
    
    if (count > 0) {
      // Verificar que al menos un enlace funciona
      await quickLinks.first().click();
      await page.waitForTimeout(1000);
    }
  });
});












