'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Plus,
  RefreshCw,
  Calendar,
  DollarSign,
  Loader2,
  AlertTriangle,
  Edit,
  Trash2,
  Play,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface RecurringInvoice {
  id: number;
  name: string;
  customer_name?: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  next_run_date: string;
  is_active: boolean;
  total_invoices_generated: number;
}

export default function RecurringInvoicesPage() {
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const { toast } = useToast();

  const fetchRecurringInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getRecurringInvoices();
      setRecurringInvoices(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar facturas recurrentes');
      toast({
        title: 'Error',
        description: err.message || 'No se pudieron cargar las facturas recurrentes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteRecurringInvoice(id);
      toast({
        title: 'Eliminado',
        description: 'Factura recurrente eliminada exitosamente',
        variant: 'success',
      });
      fetchRecurringInvoices();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo eliminar la factura recurrente',
        variant: 'destructive',
      });
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handleGenerate = async (id: number) => {
    try {
      await apiClient.generateInvoiceFromRecurring(id, true);
      toast({
        title: 'Factura generada',
        description: 'La factura se ha generado exitosamente',
        variant: 'success',
      });
      fetchRecurringInvoices();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo generar la factura',
        variant: 'destructive',
      });
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: 'Diaria',
      weekly: 'Semanal',
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      yearly: 'Anual',
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyColor = (frequency: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      weekly: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      monthly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      quarterly: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      yearly: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[frequency] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Cargando facturas recurrentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchRecurringInvoices} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Facturas Recurrentes</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus facturas que se generan automáticamente
            </p>
          </div>
          <Button asChild>
            <Link href="/recurring-invoices/new">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Factura Recurrente
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recurringInvoices.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {recurringInvoices.filter((ri) => ri.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
              <XCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {recurringInvoices.filter((ri) => !ri.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facturas Generadas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recurringInvoices.reduce((sum, ri) => sum + ri.total_invoices_generated, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        {recurringInvoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay facturas recurrentes</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Crea tu primera factura recurrente para automatizar la generación de facturas
              </p>
              <Button asChild>
                <Link href="/recurring-invoices/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Factura Recurrente
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recurringInvoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{invoice.name}</CardTitle>
                          <Badge className={getFrequencyColor(invoice.frequency)}>
                            {getFrequencyLabel(invoice.frequency)}
                          </Badge>
                          {invoice.is_active ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Activa
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactiva
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {invoice.customer_name || 'Sin cliente asignado'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerate(invoice.id)}
                          title="Generar factura ahora"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/recurring-invoices/${invoice.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, id: invoice.id })}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Próxima ejecución</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(invoice.next_run_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fecha inicio</p>
                        <p className="font-medium">{formatDate(invoice.start_date)}</p>
                      </div>
                      {invoice.end_date && (
                        <div>
                          <p className="text-muted-foreground">Fecha fin</p>
                          <p className="font-medium">{formatDate(invoice.end_date)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Facturas generadas</p>
                        <p className="font-medium">{invoice.total_invoices_generated}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
        onConfirm={() => deleteDialog.id && handleDelete(deleteDialog.id)}
        title="Eliminar factura recurrente"
        description="¿Estás seguro de que deseas eliminar esta factura recurrente? Esta acción no se puede deshacer."
      />
    </>
  );
}

