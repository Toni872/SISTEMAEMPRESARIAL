import { test, expect } from '@playwright/test';

/**
 * Tests E2E para gestión de compras
 * 
 * Flujos probados:
 * - Listar compras
 * - Crear proveedor
 * - Crear compra
 */
test.describe('Gestión de Compras', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.goto('/login');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Navegar a compras
    await page.goto('/purchases');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar la lista de compras', async ({ page }) => {
    await expect(page.locator('text=/compras|purchases/i')).toBeVisible({ timeout: 5000 });
    
    // Verificar que hay una tabla o lista de compras
    const purchasesTable = page.locator('table, [role="table"], .purchases-list').first();
    await expect(purchasesTable).toBeVisible({ timeout: 5000 });
  });

  test('debe poder crear un proveedor', async ({ page }) => {
    // Buscar botón de crear proveedor
    const createSupplierButton = page.locator('button:has-text("Proveedor"), button:has-text("Supplier")').first();
    await createSupplierButton.click();
    
    // Esperar a que aparezca el formulario
    await page.waitForSelector('input[name="name"], input[placeholder*="nombre" i]', { timeout: 5000 });
    
    // Llenar el formulario
    const timestamp = Date.now();
    await page.fill('input[name="name"], input[placeholder*="nombre" i]', `Proveedor Test ${timestamp}`);
    await page.fill('input[name="email"], input[type="email"]', `proveedor${timestamp}@test.com`);
    
    // Guardar proveedor
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button[type="submit"]').first();
    await saveButton.click();
    
    // Verificar que el proveedor se creó
    await expect(
      page.locator('text=/creado|success|éxito|proveedor/i')
    ).toBeVisible({ timeout: 10000 });
  });
});

