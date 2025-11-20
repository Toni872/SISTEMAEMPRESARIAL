/**
 * Utilidades para exportar datos a CSV
 */

/**
 * Convierte un array de objetos a formato CSV
 */
function convertToCSV(data: any[], headers: string[]): string {
  // Crear la fila de encabezados
  const headerRow = headers.join(',');
  
  // Crear las filas de datos
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = item[header] || '';
      // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
      const stringValue = String(value).replace(/"/g, '""');
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Descarga un archivo CSV
 */
function downloadCSV(csvContent: string, filename: string): void {
  // Agregar BOM para UTF-8 (ayuda con Excel)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exporta productos a CSV
 */
export function exportProductsToCSV(products: any[]): void {
  try {
    if (!products || products.length === 0) {
      console.warn('No hay productos para exportar');
      return;
    }

    console.log('Exportando productos:', products.length);

    const headers = ['ID', 'Nombre', 'Descripción', 'SKU', 'Categoría', 'Precio', 'Costo', 'Stock', 'Stock Mínimo', 'Activo'];
    
    const csvData = products.map(product => ({
      'ID': product.id || '',
      'Nombre': product.name || '',
      'Descripción': product.description || '',
      'SKU': product.sku || '',
      'Categoría': product.category || '',
      'Precio': parseFloat(product.price || 0).toFixed(2),
      'Costo': product.cost ? parseFloat(product.cost).toFixed(2) : '',
      'Stock': product.stock || 0,
      'Stock Mínimo': product.min_stock || 0,
      'Activo': product.is_active ? 'Sí' : 'No',
    }));

    const csv = convertToCSV(csvData, headers);
    const filename = `productos_${new Date().toISOString().split('T')[0]}.csv`;
    
    console.log('Descargando CSV:', filename);
    downloadCSV(csv, filename);
    console.log('CSV descargado exitosamente');
  } catch (error) {
    console.error('Error al exportar productos:', error);
    throw error;
  }
}

/**
 * Exporta ventas a CSV
 */
export function exportSalesToCSV(sales: any[]): void {
  try {
    if (!sales || sales.length === 0) {
      console.warn('No hay ventas para exportar');
      return;
    }

    console.log('Exportando ventas:', sales.length);

    const headers = ['ID', 'Número de Venta', 'Cliente', 'Email', 'Teléfono', 'Estado', 'Subtotal', 'Impuesto', 'Total', 'Fecha Creación', 'Notas'];
    
    const csvData = sales.map(sale => ({
      'ID': sale.id || '',
      'Número de Venta': sale.sale_number || `Venta #${sale.id}`,
      'Cliente': sale.customer_name || '',
      'Email': sale.customer_email || '',
      'Teléfono': sale.customer_phone || '',
      'Estado': sale.status === 'completed' ? 'Completada' : sale.status === 'pending' ? 'Pendiente' : 'Cancelada',
      'Subtotal': parseFloat(sale.subtotal || 0).toFixed(2),
      'Impuesto': parseFloat(sale.tax || 0).toFixed(2),
      'Total': parseFloat(sale.total || 0).toFixed(2),
      'Fecha Creación': sale.created_at ? new Date(sale.created_at).toLocaleString('es-ES') : '',
      'Notas': sale.notes || '',
    }));

    const csv = convertToCSV(csvData, headers);
    const filename = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
    
    console.log('Descargando CSV:', filename);
    downloadCSV(csv, filename);
    console.log('CSV descargado exitosamente');
  } catch (error) {
    console.error('Error al exportar ventas:', error);
    throw error;
  }
}

