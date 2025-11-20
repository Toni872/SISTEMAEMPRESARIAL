'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient, TaxDeclaration } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  FileText,
  Calculator,
  Download,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function TaxPage() {
  const [declarations, setDeclarations] = useState<TaxDeclaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDeclarations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getTaxDeclarations();
      setDeclarations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar declaraciones fiscales');
      toast({
        title: 'Error',
        description: err.message || 'No se pudieron cargar las declaraciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: any; label: string }> = {
      draft: { variant: 'secondary', icon: FileText, label: 'Borrador' },
      calculated: { variant: 'default', icon: Calculator, label: 'Calculada' },
      generated: { variant: 'default', icon: CheckCircle, label: 'Generada' },
      submitted: { variant: 'default', icon: CheckCircle, label: 'Enviada' },
      accepted: { variant: 'default', icon: CheckCircle, label: 'Aceptada' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rechazada' },
    };
    return badges[status] || badges.draft;
  };

  const getModelLabel = (modelType: string) => {
    const labels: Record<string, string> = {
      '303': 'Modelo 303 - IVA Trimestral',
      '111': 'Modelo 111 - Retenciones IRPF',
      '130': 'Modelo 130 - IRPF Autónomos',
      '347': 'Modelo 347 - Operaciones con Terceros',
    };
    return labels[modelType] || `Modelo ${modelType}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Cargando declaraciones fiscales...</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Declaraciones Fiscales</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus declaraciones fiscales españolas
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/tax/model-111">
              <Calculator className="w-4 h-4 mr-2" />
              Modelo 111
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tax/model-303">
              <Calculator className="w-4 h-4 mr-2" />
              Modelo 303
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{declarations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {declarations.filter((d) => d.status === 'generated' || d.status === 'submitted' || d.status === 'accepted').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {declarations.filter((d) => d.status === 'draft' || d.status === 'calculated').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Ingresar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                declarations.reduce((sum, d) => {
                  const result = d.declaration_data?.result_to_pay || 0;
                  return sum + result;
                }, 0)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {declarations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay declaraciones fiscales</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Genera tu primera declaración del Modelo 303 (IVA Trimestral)
            </p>
            <Button asChild>
              <Link href="/tax/model-303">
                <Calculator className="w-4 h-4 mr-2" />
                Crear Primera Declaración
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {declarations.map((declaration) => {
            const statusBadge = getStatusBadge(declaration.status);
            const StatusIcon = statusBadge.icon;
            const result = declaration.declaration_data;
            
            return (
              <motion.div
                key={declaration.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{getModelLabel(declaration.model_type)}</CardTitle>
                          <Badge variant={statusBadge.variant}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <CardDescription>
                          {declaration.period_quarter
                            ? `Trimestre ${declaration.period_quarter} de ${declaration.period_year}`
                            : `Año ${declaration.period_year}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {(declaration.model_type === '303' || declaration.model_type === '111') && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Descargar PDF"
                            onClick={async () => {
                              try {
                                const blob = await apiClient.downloadTaxDeclarationPDF(declaration.id);
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                const modelName = declaration.model_type === '303' ? 'modelo_303' : 'modelo_111';
                                a.download = `${modelName}_q${declaration.period_quarter}_${declaration.period_year}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                toast({
                                  title: 'PDF descargado',
                                  description: 'El PDF se ha descargado exitosamente',
                                  variant: 'success',
                                });
                              } catch (err: any) {
                                toast({
                                  title: 'Error',
                                  description: err.message || 'No se pudo descargar el PDF',
                                  variant: 'destructive',
                                });
                              }
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Periodo</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(declaration.period_start_date)} - {formatDate(declaration.period_end_date)}
                        </p>
                      </div>
                      {result && (
                        <>
                          <div>
                            <p className="text-muted-foreground">IVA Repercutido</p>
                            <p className="font-medium">{formatCurrency(result.total_sales_tax || 0)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">IVA Soportado</p>
                            <p className="font-medium">{formatCurrency(result.total_purchases_tax || 0)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Resultado</p>
                            <p className={`font-medium ${(result?.result_to_pay || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {result?.result_to_pay > 0
                                ? `A ingresar: ${formatCurrency(result.result_to_pay)}`
                                : result?.result_to_refund > 0
                                ? `A devolver: ${formatCurrency(result.result_to_refund)}`
                                : formatCurrency(0)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

