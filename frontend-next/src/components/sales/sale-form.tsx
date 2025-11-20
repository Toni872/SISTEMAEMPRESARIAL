'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface SaleItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
}

interface SaleFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
  status: string;
  items: SaleItem[];
}

interface SaleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SaleFormData) => Promise<void>;
  sale?: any;
  products?: any[];
  loading?: boolean;
}

export function SaleForm({ open, onOpenChange, onSubmit, sale, products = [], loading = false }: SaleFormProps) {
  const [formData, setFormData] = useState<SaleFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
    status: 'pending',
    items: [],
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        customer_name: sale.customer_name || '',
        customer_email: sale.customer_email || '',
        customer_phone: sale.customer_phone || '',
        notes: sale.notes || '',
        status: sale.status || 'pending',
        items: sale.items?.map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product?.name || '',
          quantity: item.quantity || 1,
          unit_price: parseFloat(item.unit_price) || 0,
        })) || [],
      });
    } else {
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        notes: '',
        status: 'pending',
        items: [],
      });
    }
  }, [sale, open]);

  const addItem = () => {
    if (products.length === 0) {
      alert('No hay productos disponibles. Por favor, crea productos primero.');
      return;
    }
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          product_id: products[0].id,
          product_name: products[0].name,
          quantity: 1,
          unit_price: parseFloat(products[0].price) || 0,
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

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Si cambia el producto, actualizar precio y nombre
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].product_name = product.name;
        newItems[index].unit_price = parseFloat(product.price) || 0;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      alert('Debes agregar al menos un producto a la venta');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sale ? 'Editar Venta' : 'Nueva Venta'}</DialogTitle>
          <DialogDescription>
            {sale ? 'Modifica la información de la venta' : 'Completa los datos para crear una nueva venta'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Información del Cliente */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Información del Cliente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="Nombre del cliente"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="email@ejemplo.com"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="Teléfono"
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
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
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

            {/* Productos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Productos</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  disabled={loading || products.length === 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>

              {formData.items.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <p className="text-sm text-muted-foreground">No hay productos agregados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-5 space-y-2">
                          <label className="text-sm font-medium">Producto</label>
                          <select
                            value={item.product_id}
                            onChange={(e) => updateItem(index, 'product_id', parseInt(e.target.value))}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                          >
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} - €{parseFloat(product.price).toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <label className="text-sm font-medium">Cantidad</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            disabled={loading}
                          />
                        </div>
                        <div className="col-span-3 space-y-2">
                          <label className="text-sm font-medium">Precio Unit.</label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unit_price}
                            onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            disabled={loading}
                          />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <label className="text-sm font-medium">Subtotal</label>
                          <div className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-neutral-50 dark:bg-neutral-900">
                            <p className="text-sm font-semibold">
                              €{(item.quantity * item.unit_price).toFixed(2)}
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
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                      €{calculateTotal().toFixed(2)}
                    </p>
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
            <Button type="submit" disabled={loading || formData.items.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {sale ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                sale ? 'Guardar Cambios' : 'Crear Venta'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


