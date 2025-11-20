'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const templateId = parseInt(params.id as string);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saleId, setSaleId] = useState<number | null>(null);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await apiClient.getSales(0, 100);
        setSales(data);
        if (data.length > 0) {
          setSaleId(data[0].id);
        }
      } catch (err: any) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las ventas',
          variant: 'destructive',
        });
      }
    };
    fetchSales();
  }, [toast]);

  useEffect(() => {
    if (saleId && templateId) {
      const generatePreview = async () => {
        try {
          setLoading(true);
          const html = await apiClient.getInvoicePreview(templateId, saleId);
          setPreviewHtml(html);
        } catch (err: any) {
          toast({
            title: 'Error',
            description: err.message || 'No se pudo generar el preview',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };
      generatePreview();
    }
  }, [saleId, templateId, toast]);

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
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Preview de Plantilla</h1>
          <p className="text-muted-foreground mt-1">Vista previa de la plantilla con datos reales</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Seleccionar Venta</CardTitle>
              <CardDescription>Elige una venta para ver el preview</CardDescription>
            </div>
            {previewHtml && (
              <Button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(previewHtml);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Imprimir/PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <select
            value={saleId || ''}
            onChange={(e) => setSaleId(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950 mb-4"
          >
            <option value="">Seleccionar venta...</option>
            {sales.map((sale) => (
              <option key={sale.id} value={sale.id}>
                {sale.sale_number} - {sale.customer_name || 'Sin cliente'} - €{parseFloat(sale.total).toFixed(2)}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </CardContent>
        </Card>
      ) : previewHtml ? (
        <Card>
          <CardContent className="p-0">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Selecciona una venta para ver el preview</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

