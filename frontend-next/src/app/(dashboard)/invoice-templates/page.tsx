'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient, InvoiceTemplate } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Palette,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function InvoiceTemplatesPage() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getInvoiceTemplates();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar plantillas');
      toast({
        title: 'Error',
        description: err.message || 'No se pudieron cargar las plantillas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteInvoiceTemplate(id);
      toast({
        title: 'Eliminado',
        description: 'Plantilla eliminada exitosamente',
        variant: 'success',
      });
      fetchTemplates();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo eliminar la plantilla',
        variant: 'destructive',
      });
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handleSetDefault = async (id: number) => {
    try {
      await apiClient.updateInvoiceTemplate(id, { is_default: true });
      toast({
        title: 'Actualizado',
        description: 'Plantilla establecida como predeterminada',
        variant: 'success',
      });
      fetchTemplates();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo actualizar la plantilla',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Cargando plantillas...</p>
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
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Plantillas de Factura</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las plantillas para tus facturas
            </p>
          </div>
          <Button asChild>
            <Link href="/invoice-templates/new">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Plantilla
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistema</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {templates.filter((t) => t.is_system).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personalizadas</CardTitle>
              <Palette className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {templates.filter((t) => !t.is_system).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        {templates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay plantillas</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Crea tu primera plantilla personalizada
              </p>
              <Button asChild>
                <Link href="/invoice-templates/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Plantilla
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{template.name}</CardTitle>
                          {template.is_default && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Por Defecto
                            </Badge>
                          )}
                          {template.is_system && (
                            <Badge variant="secondary">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Sistema
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {template.description || 'Sin descripción'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {!template.is_default && !template.is_system && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(template.id)}
                            title="Establecer como predeterminada"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {!template.is_system && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/invoice-templates/${template.id}/edit`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, id: template.id })}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Color Header</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: template.header_color }}
                          />
                          <p className="font-medium">{template.header_color}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opciones</p>
                        <div className="flex flex-wrap gap-1">
                          {template.show_tax_breakdown && (
                            <Badge variant="outline" className="text-xs">IVA</Badge>
                          )}
                          {template.show_payment_terms && (
                            <Badge variant="outline" className="text-xs">Pago</Badge>
                          )}
                          {template.show_notes && (
                            <Badge variant="outline" className="text-xs">Notas</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Creada</p>
                        <p className="font-medium">{formatDate(template.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actualizada</p>
                        <p className="font-medium">{formatDate(template.updated_at)}</p>
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
        title="Eliminar plantilla"
        description="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
      />
    </>
  );
}

