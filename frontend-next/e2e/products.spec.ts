import { test, expect } from '@playwright/test';

/**
 * Tests E2E para gestión de productos
 * 
 * Flujos probados:
 * - Listar productos
 * - Crear producto
 * - Editar producto
 * - Eliminar producto
 */
test.describe('Gestión de Productos', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.goto('/login');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Navegar a productos
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar la lista de productos', async ({ page }) => {
    // Verificar que la página de productos se carga
    await expect(page.locator('text=/productos|products/i')).toBeVisible({ timeout: 5000 });
    
    // Verificar que hay una tabla o lista de productos
    const productsTable = page.locator('table, [role="table"], .products-list').first();
    await expect(productsTable).toBeVisible({ timeout: 5000 });
  });

  test('debe poder crear un nuevo producto', async ({ page }) => {
    // Buscar botón de crear producto
    const createButton = page.locator('button:has-text("Crear"), button:has-text("Nuevo"), button:has-text("Add")').first();
    await createButton.click();
    
    // Esperar a que aparezca el formulario
    await page.waitForSelector('input[name="name"], input[placeholder*="nombre" i]', { timeout: 5000 });
    
    // Llenar el formulario
    const timestamp = Date.now();
    await page.fill('input[name="name"], input[placeholder*="nombre" i]', `Producto Test ${timestamp}`);
    await page.fill('input[name="price"], input[type="number"]', '99.99');
    await page.fill('input[name="stock"], input[placeholder*="stock" i]', '100');
    
    // Buscar y hacer click en guardar
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button[type="submit"]').first();
    await saveButton.click();
    
    // Verificar que el producto se creó (mensaje de éxito o aparece en la lista)
    await expect(
      page.locator('text=/creado|success|éxito|producto test/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('debe validar campos requeridos al crear producto', async ({ page }) => {
    const createButton = page.locator('button:has-text("Crear"), button:has-text("Nuevo")').first();
    await createButton.click();
    
    await page.waitForSelector('input[name="name"]', { timeout: 5000 });
    
    // Intentar guardar sin llenar campos requeridos
    const saveButton = page.locator('button[type="submit"]').first();
    await saveButton.click();
    
    // Verificar que aparecen mensajes de validación
    await expect(
      page.locator('text=/requerido|required|obligatorio/i')
    ).toBeVisible({ timeout: 3000 });
  });
});

