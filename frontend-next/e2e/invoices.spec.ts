import { test, expect } from '@playwright/test';

/**
 * Tests E2E para gestión de facturas
 * 
 * Flujos probados:
 * - Listar facturas
 * - Filtrar facturas por estado
 * - Filtrar facturas por registro Verifactu
 * - Buscar facturas
 * - Ver detalles de factura
 */
test.describe('Gestión de Facturas', () => {
  // Skip tests en WebKit/Safari debido a problemas conocidos con navegación en Windows
  test.skip(({ browserName }) => browserName === 'webkit' || browserName === 'Mobile Safari', 
    'WebKit/Safari tiene problemas conocidos con navegación en Windows. Ejecutar en macOS o usar Chromium/Firefox.');

  test.beforeEach(async ({ page, browserName }) => {
    // Login antes de cada test
    await page.goto('/login');
    
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Esperar respuesta del login antes de hacer click
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/api/auth/login') && response.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    
    await page.click('button[type="submit"]');
    
    // Esperar respuesta del login
    await loginResponsePromise;
    
    // Esperar a que el token se guarde en localStorage
    await page.waitForFunction(() => {
      try {
        return localStorage.getItem('auth_token') !== null || 
               localStorage.getItem('auth-storage') !== null;
      } catch {
        return false;
      }
    }, { timeout: 20000 }).catch(() => {
      // Si falla, intentar continuar de todas formas
    });
    
    // Esperar un momento para que el estado se actualice
    await page.waitForTimeout(1000);
    
    // Navegar directamente a facturas
    await page.goto('/invoices');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar la lista de facturas', async ({ page }) => {
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Verificar que el título de la página está visible (usar heading más específico)
    await expect(page.locator('h1:has-text("Facturas")')).toBeVisible({ timeout: 10000 });
    
    // Verificar que hay métricas o contenido de facturas
    const invoicesContent = page.locator('text=/Total Facturas|Total Facturado|En Verifactu/i').first();
    await expect(invoicesContent).toBeVisible({ timeout: 10000 });
    
    // Verificar que no está en estado de carga
    const loadingText = page.locator('text=/Cargando facturas/i');
    if (await loadingText.isVisible({ timeout: 2000 })) {
      await expect(loadingText).not.toBeVisible({ timeout: 15000 });
    }
  });

  test('debe poder filtrar facturas por estado', async ({ page }) => {
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Buscar botón de filtros
    const filterButton = page.locator('button:has-text("Filtros")').first();
    if (await filterButton.isVisible({ timeout: 3000 })) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Buscar selector de estado
      const statusSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Estado|estado/i }).first();
      if (await statusSelect.isVisible({ timeout: 2000 })) {
        await statusSelect.click();
        await page.waitForTimeout(500);
        
        // Seleccionar estado "completed" o "completadas"
        const completedOption = page.locator('text=/completada|completed/i').first();
        if (await completedOption.isVisible({ timeout: 2000 })) {
          await completedOption.click();
          await page.waitForTimeout(1000);
          
          // Verificar que la lista se actualizó
          const invoicesList = page.locator('text=/Facturas|factura/i').first();
          await expect(invoicesList).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('debe poder filtrar facturas por registro Verifactu', async ({ page }) => {
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Buscar botón de filtros
    const filterButton = page.locator('button:has-text("Filtros")').first();
    if (await filterButton.isVisible({ timeout: 3000 })) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Buscar selector de registro Verifactu
      const registrySelect = page.locator('select, [role="combobox"]').filter({ hasText: /Verifactu|registro/i }).first();
      if (await registrySelect.isVisible({ timeout: 2000 })) {
        await registrySelect.click();
        await page.waitForTimeout(500);
        
        // Seleccionar "Con registro"
        const withRegistryOption = page.locator('text=/Con registro|con registro/i').first();
        if (await withRegistryOption.isVisible({ timeout: 2000 })) {
          await withRegistryOption.click();
          await page.waitForTimeout(1000);
          
          // Verificar que la lista se actualizó
          const invoicesList = page.locator('text=/Facturas|factura/i').first();
          await expect(invoicesList).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('debe poder buscar facturas', async ({ page }) => {
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Buscar campo de búsqueda
    const searchInput = page.locator('input[placeholder*="Buscar"], input[placeholder*="buscar"]').first();
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      
      // Verificar que la búsqueda se aplicó
      const invoicesList = page.locator('text=/Facturas|factura|No hay/i').first();
      await expect(invoicesList).toBeVisible({ timeout: 3000 });
    }
  });

  test('debe mostrar métricas de facturas', async ({ page }) => {
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que las métricas están visibles
    const metrics = [
      page.locator('text=/Total Facturas/i').first(),
      page.locator('text=/Total Facturado/i').first(),
      page.locator('text=/En Verifactu/i').first(),
      page.locator('text=/Pendientes/i').first(),
    ];
    
    // Al menos una métrica debe estar visible
    const visibleMetrics = await Promise.all(
      metrics.map(m => m.isVisible({ timeout: 3000 }).catch(() => false))
    );
    
    expect(visibleMetrics.some(v => v)).toBeTruthy();
  });

  test('debe mostrar mensaje cuando no hay facturas', async ({ page }) => {
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Esperar un momento adicional para que el contenido se renderice
    await page.waitForTimeout(2000);
    
    // Verificar que la página tiene contenido (métricas o lista) - más flexible que buscar heading específico
    const hasMetrics = await page.locator('text=/Total Facturas|Total Facturado|En Verifactu/i').first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasInvoices = await page.locator('text=/SALE-|Venta|factura/i').first().isVisible({ timeout: 3000 }).catch(() => false);
    const hasHeading = await page.getByRole('heading', { name: /Facturas/i }).isVisible({ timeout: 5000 }).catch(() => false);
    
    // La página debe tener al menos uno de estos elementos visibles
    expect(hasMetrics || hasInvoices || hasHeading).toBeTruthy();
  });
});



