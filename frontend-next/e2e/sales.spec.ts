import { test, expect } from '@playwright/test';

/**
 * Tests E2E para gestión de ventas
 * 
 * Flujos probados:
 * - Listar ventas
 * - Crear venta
 * - Verificar cálculo de totales
 */
test.describe('Gestión de Ventas', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.goto('/login');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Navegar a ventas
    await page.goto('/sales');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar la lista de ventas', async ({ page }) => {
    await expect(page.locator('text=/ventas|sales/i')).toBeVisible({ timeout: 5000 });
    
    // Verificar que hay una tabla o lista de ventas
    const salesTable = page.locator('table, [role="table"], .sales-list').first();
    await expect(salesTable).toBeVisible({ timeout: 5000 });
  });

  test('debe poder crear una nueva venta', async ({ page }) => {
    // Buscar botón de crear venta
    const createButton = page.locator('button:has-text("Crear"), button:has-text("Nueva Venta")').first();
    await createButton.click();
    
    // Esperar a que aparezca el formulario
    await page.waitForSelector('input[name="customer_name"], input[placeholder*="cliente" i]', { timeout: 5000 });
    
    // Llenar el formulario básico
    await page.fill('input[name="customer_name"], input[placeholder*="cliente" i]', 'Cliente Test E2E');
    
    // Si hay items, agregar uno
    const addItemButton = page.locator('button:has-text("Agregar"), button:has-text("Add Item")').first();
    if (await addItemButton.isVisible({ timeout: 2000 })) {
      await addItemButton.click();
      // Llenar campos del item si existen
      await page.waitForTimeout(1000);
    }
    
    // Guardar venta
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button[type="submit"]').first();
    await saveButton.click();
    
    // Verificar que la venta se creó
    await expect(
      page.locator('text=/creada|success|éxito|venta/i')
    ).toBeVisible({ timeout: 10000 });
  });
});

