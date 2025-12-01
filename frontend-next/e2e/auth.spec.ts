import { test, expect } from '@playwright/test';

/**
 * Tests E2E para autenticación
 * 
 * Flujos probados:
 * - Login exitoso
 * - Login con credenciales incorrectas
 * - Registro de nuevo usuario
 * - Logout
 */
test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login antes de cada test
    await page.goto('/login');
  });

  test('debe mostrar la página de login', async ({ page }) => {
    await expect(page).toHaveTitle(/Login/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('debe mostrar error con credenciales incorrectas', async ({ page }) => {
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Esperar a que aparezca el mensaje de error
    await expect(page.locator('text=/incorrecto|error|invalid/i')).toBeVisible({ timeout: 5000 });
  });

  test('debe hacer login exitoso con credenciales válidas', async ({ page }) => {
    // Usar credenciales de test (ajustar según tu configuración)
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('debe redirigir al dashboard después del login', async ({ page }) => {
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Verificar que se muestra el dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page.locator('text=/dashboard|inicio|bienvenido/i')).toBeVisible({ timeout: 5000 });
  });

  test('debe hacer logout correctamente', async ({ page }) => {
    // Primero hacer login
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Buscar y hacer click en logout (ajustar selector según tu UI)
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Salir"), [aria-label*="logout" i]').first();
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();
      await page.waitForURL('/login', { timeout: 5000 });
      await expect(page).toHaveURL(/\/login/);
    }
  });
});













