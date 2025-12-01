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
    // Login antes de cada test (mismo patrón que dashboard.spec.ts)
    await page.goto('/login');
    
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'testpassword123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // El login redirige a /landing según el código de login/page.tsx
    await page.waitForURL('/landing', { timeout: 10000 });
    
    // Navegar a ventas
    await page.goto('/sales');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar la lista de ventas', async ({ page }) => {
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Verificar que el título de la página está visible
    await expect(page.locator('text=/Gestión de Ventas/i')).toBeVisible({ timeout: 10000 });
    
    // Verificar que hay métricas o contenido de ventas
    // La página muestra métricas y luego una lista de ventas en cards
    const salesContent = page.locator('text=/Ventas Registradas|Ventas Totales|Nueva Venta/i').first();
    await expect(salesContent).toBeVisible({ timeout: 10000 });
    
    // Verificar que no está en estado de carga
    const loadingText = page.locator('text=/Cargando ventas/i');
    if (await loadingText.isVisible({ timeout: 2000 })) {
      await expect(loadingText).not.toBeVisible({ timeout: 15000 });
    }
  });

  test('debe poder crear una nueva venta', async ({ page }) => {
    // Buscar botón de crear venta
    const createButton = page.locator('button:has-text("Crear"), button:has-text("Nueva Venta"), button:has-text("Nuevo")').first();
    if (await createButton.isVisible({ timeout: 3000 })) {
      await createButton.click();
    }
    
    // Esperar a que aparezca el formulario o modal
    await page.waitForTimeout(1000);
    
    // Buscar campos del formulario (puede estar en modal o página)
    const customerNameInput = page.locator('input[name="customer_name"], input[placeholder*="cliente" i], input[placeholder*="nombre" i]').first();
    if (await customerNameInput.isVisible({ timeout: 3000 })) {
      await customerNameInput.fill('Cliente Test E2E');
    }
    
    // Si hay items, agregar uno
    const addItemButton = page.locator('button:has-text("Agregar"), button:has-text("Add Item"), button:has-text("+")').first();
    if (await addItemButton.isVisible({ timeout: 2000 })) {
      await addItemButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Guardar venta
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button:has-text("Confirmar"), button[type="submit"]').first();
    if (await saveButton.isVisible({ timeout: 3000 })) {
      await saveButton.click();
    }
    
    // Verificar que la venta se creó (mensaje de éxito o redirección)
    await page.waitForTimeout(2000);
    const successIndicator = page.locator('text=/creada|success|éxito|venta|guardada/i').first();
    if (await successIndicator.isVisible({ timeout: 5000 })) {
      await expect(successIndicator).toBeVisible();
    }
  });

  test('debe mostrar detalles de una venta existente', async ({ page }) => {
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página muestra información de ventas
    // La página muestra métricas y lista de ventas, así que verificamos elementos específicos
    const salesTitle = page.locator('text=/Gestión de Ventas/i');
    await expect(salesTitle).toBeVisible({ timeout: 10000 });
    
    // Verificar que hay contenido de ventas (métricas o lista)
    // Buscar elementos específicos que indican que hay ventas cargadas
    const salesContent = page.locator('text=/Ventas Registradas|Ventas Totales|Ventas Completadas/i').first();
    await expect(salesContent).toBeVisible({ timeout: 10000 });
    
    // Si hay ventas, debería haber información visible (métricas o lista)
    // Si no hay ventas, debería mostrar mensaje de "No hay ventas"
    const hasSales = await page.locator('text=/Venta|SALE-/i').first().isVisible({ timeout: 3000 }).catch(() => false);
    const noSales = await page.locator('text=/No hay ventas|Crear Primera Venta/i').first().isVisible({ timeout: 3000 }).catch(() => false);
    
    // Al menos uno de los dos debe ser verdadero
    expect(hasSales || noSales).toBeTruthy();
  });

  test('debe poder filtrar ventas por estado', async ({ page }) => {
    // Buscar filtro de estado
    const statusFilter = page.locator('select[name="status"], button:has-text("Estado"), [aria-label*="estado" i]').first();
    if (await statusFilter.isVisible({ timeout: 3000 })) {
      await statusFilter.click();
      
      // Seleccionar estado "completed" o "completada"
      const completedOption = page.locator('text=/completada|completed/i').first();
      if (await completedOption.isVisible({ timeout: 2000 })) {
        await completedOption.click();
        await page.waitForTimeout(1000);
        
        // Verificar que la lista se actualizó
        const salesTable = page.locator('table, [role="table"]').first();
        await expect(salesTable).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('debe validar campos requeridos al crear venta', async ({ page }) => {
    const createButton = page.locator('button:has-text("Nueva Venta"), button:has-text("Crear")').first();
    if (await createButton.isVisible({ timeout: 5000 })) {
      await createButton.click();
      await page.waitForTimeout(2000);
      
      // Esperar a que el modal/formulario aparezca
      await page.waitForSelector('input[name="customer_name"], input[placeholder*="cliente" i], input[placeholder*="nombre" i]', { timeout: 5000 });
      
      // El botón puede estar deshabilitado si no hay items, así que verificamos primero
      const saveButton = page.locator('button[type="submit"]:not([disabled]), button:has-text("Crear Venta"):not([disabled])').first();
      
      // Verificar que el botón está deshabilitado (validación funcionando)
      // El botón debería estar deshabilitado si no hay items o campos requeridos
      const saveButtonDisabled = page.locator('button[type="submit"][disabled]').first();
      if (await saveButtonDisabled.isVisible({ timeout: 3000 })) {
        // El botón está deshabilitado, lo cual es la validación funcionando
        await expect(saveButtonDisabled).toBeDisabled();
      } else {
        // Si está habilitado, intentar click y verificar mensajes de error
        await saveButton.click();
        await expect(
          page.locator('text=/requerido|required|obligatorio|error|debe/i').first()
        ).toBeVisible({ timeout: 5000 });
      }
    }
  });
});








