'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface RecurringInvoiceItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  description?: string;
}

export default function NewRecurringInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    start_date: '',
    end_date: '',
    day_of_month: 1,
    notes: '',
    is_active: true,
  });

  const [items, setItems] = useState<RecurringInvoiceItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts(0, 1000);
        setProducts(data);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los productos',
          variant: 'destructive',
        });
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const addItem = () => {
    setItems([...items, { product_id: 0, quantity: 1, unit_price: 0, description: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof RecurringInvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Si cambia el producto, actualizar precio
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unit_price = product.price;
      }
    }
    
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'Debes agregar al menos un producto',
        variant: 'destructive',
      });
      return;
    }

    // Validar items
    for (const item of items) {
      if (!item.product_id || item.quantity <= 0) {
        toast({
          title: 'Error',
          description: 'Todos los items deben tener un producto y cantidad válida',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);
    try {
      await apiClient.createRecurringInvoice({
        ...formData,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          description: item.description || undefined,
        })),
      });
      
      toast({
        title: 'Éxito',
        description: 'Factura recurrente creada exitosamente',
        variant: 'success',
      });
      
      router.push('/recurring-invoices');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo crear la factura recurrente',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/recurring-invoices">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Nueva Factura Recurrente</h1>
          <p className="text-muted-foreground mt-1">Crea una factura que se generará automáticamente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos básicos de la factura recurrente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre de la Factura Recurrente *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: Factura mensual cliente X"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Nombre del Cliente</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="customer_email">Email del Cliente</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  placeholder="cliente@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customer_phone">Teléfono del Cliente</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="+34 600 000 000"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Frecuencia</CardTitle>
            <CardDescription>Define cuándo se generará la factura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="frequency">Frecuencia *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diaria</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.frequency === 'monthly' && (
              <div>
                <Label htmlFor="day_of_month">Día del Mes (1-31) *</Label>
                <Input
                  id="day_of_month"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.day_of_month}
                  onChange={(e) => setFormData({ ...formData, day_of_month: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Fecha de Inicio *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">Fecha de Fin (Opcional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos y Servicios</CardTitle>
            <CardDescription>Agrega los productos que se incluirán en cada factura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingProducts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <>
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                    <div className="col-span-12 md:col-span-4">
                      <Label>Producto *</Label>
                      <Select
                        value={item.product_id.toString()}
                        onValueChange={(value) => updateItem(index, 'product_id', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} - €{product.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Label>Cantidad *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Label>Precio Unit. *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-10 md:col-span-3">
                      <Label>Descripción</Label>
                      <Input
                        value={item.description || ''}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Opcional"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas adicionales sobre esta factura recurrente..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/recurring-invoices">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Factura Recurrente'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

