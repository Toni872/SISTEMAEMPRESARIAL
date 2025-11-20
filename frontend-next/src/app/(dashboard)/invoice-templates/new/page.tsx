'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewInvoiceTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    header_color: '#6366f1',
    show_tax_breakdown: true,
    show_payment_terms: true,
    show_notes: true,
    is_default: false,
    html_template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .header {
      background-color: {{header_color}};
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .company-info, .client-info {
      flex: 1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .total {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>FACTURA</h1>
    <p>Número: {{sale_number}}</p>
    <p>Fecha: {{sale_date}}</p>
  </div>
  
  <div class="invoice-info">
    <div class="company-info">
      <h3>Empresa</h3>
      <p>{{company_name}}</p>
      <p>{{company_address}}</p>
    </div>
    <div class="client-info">
      <h3>Cliente</h3>
      <p>{{customer_name}}</p>
      <p>{{customer_email}}</p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Precio</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{items}}
    </tbody>
  </table>
  
  <div class="total">
    <p>Total: {{total}}</p>
  </div>
  
  {{#if show_notes}}
  <div class="notes">
    <h3>Notas</h3>
    <p>{{notes}}</p>
  </div>
  {{/if}}
</body>
</html>`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre es requerido',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.createInvoiceTemplate({
        name: formData.name,
        description: formData.description || undefined,
        header_color: formData.header_color,
        show_tax_breakdown: formData.show_tax_breakdown,
        show_payment_terms: formData.show_payment_terms,
        show_notes: formData.show_notes,
        is_default: formData.is_default,
        html_template: formData.html_template,
      });
      
      toast({
        title: 'Éxito',
        description: 'Plantilla creada exitosamente',
        variant: 'success',
      });
      
      router.push('/invoice-templates');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo crear la plantilla',
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
          <Link href="/invoice-templates">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Nueva Plantilla de Factura</h1>
          <p className="text-muted-foreground mt-1">Crea una plantilla personalizada para tus facturas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos básicos de la plantilla</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: Plantilla Moderna"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la plantilla..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="header_color">Color del Encabezado</Label>
              <div className="flex gap-2">
                <Input
                  id="header_color"
                  type="color"
                  value={formData.header_color}
                  onChange={(e) => setFormData({ ...formData, header_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={formData.header_color}
                  onChange={(e) => setFormData({ ...formData, header_color: e.target.value })}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opciones de Visualización</CardTitle>
            <CardDescription>Configura qué elementos mostrar en la factura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_tax_breakdown"
                checked={formData.show_tax_breakdown}
                onChange={(e) => setFormData({ ...formData, show_tax_breakdown: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="show_tax_breakdown">Mostrar desglose de IVA</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_payment_terms"
                checked={formData.show_payment_terms}
                onChange={(e) => setFormData({ ...formData, show_payment_terms: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="show_payment_terms">Mostrar términos de pago</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_notes"
                checked={formData.show_notes}
                onChange={(e) => setFormData({ ...formData, show_notes: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="show_notes">Mostrar notas</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_default">Establecer como plantilla por defecto</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plantilla HTML</CardTitle>
            <CardDescription>Edita el HTML de la plantilla. Usa variables como {{sale_number}}, {{customer_name}}, {{items}}, {{total}}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.html_template}
              onChange={(e) => setFormData({ ...formData, html_template: e.target.value })}
              rows={20}
              className="font-mono text-sm"
              placeholder="HTML de la plantilla..."
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/invoice-templates">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Plantilla'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

