'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface PurchaseItem {
  product_id: number | null;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

interface PurchaseFormData {
  supplier_id: number | null;
  purchase_date: string;
  reference_number: string;
  status: string;
  notes: string;
  items: PurchaseItem[];
}

interface PurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
  purchase?: any;
  suppliers?: any[];
  products?: any[];
  loading?: boolean;
  onOpenSupplierForm?: () => void;
}

export function PurchaseForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  purchase, 
  suppliers = [], 
  products = [],
  loading = false,
  onOpenSupplierForm
}: PurchaseFormProps) {
  const [formData, setFormData] = useState<PurchaseFormData>({
    supplier_id: null,
    purchase_date: new Date().toISOString().split('T')[0],
    reference_number: '',
    status: 'draft',
    notes: '',
    items: [],
  });

  useEffect(() => {
    if (purchase) {
      setFormData({
        supplier_id: purchase.supplier_id || purchase.supplier?.id || null,
        purchase_date: purchase.purchase_date ? new Date(purchase.purchase_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        reference_number: purchase.reference_number || '',
        status: purchase.status || 'draft',
        notes: purchase.notes || '',
        items: purchase.items?.map((item: any) => ({
          product_id: item.product_id || null,
          description: item.description || '',
          quantity: parseFloat(item.quantity) || 1,
          unit_price: parseFloat(item.unit_price) || 0,
          tax_rate: parseFloat(item.tax_rate) || 21.0,
        })) || [],
      });
    } else {
      setFormData({
        supplier_id: null,
        purchase_date: new Date().toISOString().split('T')[0],
        reference_number: '',
        status: 'draft',
        notes: '',
        items: [],
      });
    }
  }, [purchase, open]);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product_id: null,
          description: '',
          quantity: 1,
          unit_price: 0,
          tax_rate: 21.0,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Si cambia el producto, actualizar descripción y precio
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].description = product.name || '';
        newItems[index].unit_price = parseFloat(product.price) || 0;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = (item: PurchaseItem) => {
    return item.quantity * item.unit_price;
  };

  const calculateTax = (item: PurchaseItem) => {
    return calculateSubtotal(item) * (item.tax_rate / 100);
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
    const tax = formData.items.reduce((sum, item) => sum + calculateTax(item), 0);
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier_id) {
      alert('Debes seleccionar un proveedor');
      return;
    }

    if (formData.items.length === 0) {
      alert('Debes agregar al menos un artículo a la compra');
      return;
    }

    const totals = calculateTotal();
    const purchaseData = {
      ...formData,
      purchase_date: new Date(formData.purchase_date).toISOString(),
      items: formData.items.map(item => ({
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        subtotal: calculateSubtotal(item),
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
    };

    await onSubmit(purchaseData as any);
  };

  const totals = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{purchase ? 'Editar Compra' : 'Nueva Compra'}</DialogTitle>
          <DialogDescription>
            {purchase ? 'Modifica la información de la compra' : 'Completa los datos para crear una nueva compra'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Información Básica</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Proveedor *</label>
                  {suppliers.length === 0 ? (
                    <div className="space-y-2">
                      <div className="p-3 border border-orange-200 dark:border-orange-800 rounded-md bg-orange-50 dark:bg-orange-950">
                        <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                          No hay proveedores disponibles. Debes crear un proveedor primero.
                        </p>
                        {onOpenSupplierForm && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onOpenChange(false);
                              onOpenSupplierForm();
                            }}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Proveedor
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <select
                      value={formData.supplier_id || ''}
                      onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value ? parseInt(e.target.value) : null })}
                      disabled={loading}
                      required
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                    >
                      <option value="">Seleccionar proveedor</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha *</label>
                  <Input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                  >
                    <option value="draft">Borrador</option>
                    <option value="pending">Pendiente</option>
                    <option value="approved">Aprobada</option>
                    <option value="received">Recibida</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número de Referencia</label>
                  <Input
                    value={formData.reference_number}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    placeholder="Número de referencia del proveedor"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notas</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notas adicionales"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Artículos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Artículos</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Artículo
                </Button>
              </div>

              {formData.items.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <p className="text-sm text-muted-foreground">No hay artículos agregados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-4 space-y-2">
                          <label className="text-sm font-medium">Producto</label>
                          <select
                            value={item.product_id || ''}
                            onChange={(e) => updateItem(index, 'product_id', e.target.value ? parseInt(e.target.value) : null)}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                          >
                            <option value="">Seleccionar producto</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} - €{parseFloat(product.price).toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-3 space-y-2">
                          <label className="text-sm font-medium">Descripción</label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Descripción"
                            disabled={loading}
                            required
                          />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <label className="text-sm font-medium">Cant.</label>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            disabled={loading}
                            required
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <label className="text-sm font-medium">Precio Unit.</label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unit_price}
                            onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            disabled={loading}
                            required
                          />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <label className="text-sm font-medium">IVA %</label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={item.tax_rate}
                            onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                            disabled={loading}
                          />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <label className="text-sm font-medium">Subtotal</label>
                          <div className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-neutral-50 dark:bg-neutral-900">
                            <p className="text-sm font-semibold">
                              €{calculateSubtotal(item).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.items.length > 0 && (
                <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="text-right space-y-1">
                    <div className="flex justify-between gap-8">
                      <span className="text-sm text-muted-foreground">Subtotal:</span>
                      <span className="text-sm font-medium">€{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-sm text-muted-foreground">IVA:</span>
                      <span className="text-sm font-medium">€{totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-8 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <span className="text-sm font-semibold">Total:</span>
                      <span className="text-lg font-bold text-neutral-900 dark:text-white">
                        €{totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || formData.items.length === 0 || !formData.supplier_id || suppliers.length === 0}
              title={
                suppliers.length === 0 
                  ? 'Primero debes crear un proveedor' 
                  : formData.items.length === 0 
                  ? 'Debes agregar al menos un artículo' 
                  : !formData.supplier_id 
                  ? 'Debes seleccionar un proveedor' 
                  : ''
              }
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {purchase ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                purchase ? 'Guardar Cambios' : 'Crear Compra'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

