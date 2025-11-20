'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Calculator, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Model303Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);

  const [formData, setFormData] = useState({
    quarter: currentQuarter,
    year: currentYear,
    include_purchases: false,
    notes: '',
  });

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const result = await apiClient.calculateModel303(
        formData.quarter,
        formData.year,
        formData.include_purchases
      );
      setCalculationResult(result);
      toast({
        title: 'Cálculo completado',
        description: 'El cálculo del Modelo 303 se ha realizado correctamente',
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo calcular el Modelo 303',
        variant: 'destructive',
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleGenerate = async () => {
    if (!calculationResult) {
      toast({
        title: 'Error',
        description: 'Debes calcular primero antes de generar',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const declaration = await apiClient.generateModel303(
        formData.quarter,
        formData.year,
        formData.include_purchases,
        formData.notes || undefined
      );
      
      toast({
        title: 'Declaración generada',
        description: 'La declaración del Modelo 303 se ha generado exitosamente',
        variant: 'success',
      });
      
      router.push(`/tax`);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo generar la declaración',
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
          <Link href="/tax">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Modelo 303 - IVA Trimestral</h1>
          <p className="text-muted-foreground mt-1">Calcula y genera tu declaración trimestral de IVA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Selecciona el periodo a declarar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quarter">Trimestre *</Label>
                <Select
                  value={formData.quarter.toString()}
                  onValueChange={(value) => setFormData({ ...formData, quarter: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1er Trimestre (Ene-Mar)</SelectItem>
                    <SelectItem value="2">2do Trimestre (Abr-Jun)</SelectItem>
                    <SelectItem value="3">3er Trimestre (Jul-Sep)</SelectItem>
                    <SelectItem value="4">4to Trimestre (Oct-Dic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Año *</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  max="2100"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || currentYear })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales sobre esta declaración..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCalculate} disabled={calculating} className="flex-1">
                  {calculating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calcular
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !calculationResult}
                  variant="default"
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2">
          {calculationResult ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Cálculo Completado
                  </CardTitle>
                  <CardDescription>
                    Periodo: {calculationResult.period} ({formatDate(calculationResult.period_start)} - {formatDate(calculationResult.period_end)})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ventas */}
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Ventas (IVA Repercutido)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">Base 21%</p>
                        <p className="font-bold">{formatCurrency(calculationResult.sales_base_21)}</p>
                        <p className="text-xs text-muted-foreground">IVA: {formatCurrency(calculationResult.sales_tax_21)}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">Base 10%</p>
                        <p className="font-bold">{formatCurrency(calculationResult.sales_base_10)}</p>
                        <p className="text-xs text-muted-foreground">IVA: {formatCurrency(calculationResult.sales_tax_10)}</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">Base 4%</p>
                        <p className="font-bold">{formatCurrency(calculationResult.sales_base_4)}</p>
                        <p className="text-xs text-muted-foreground">IVA: {formatCurrency(calculationResult.sales_tax_4)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">Exentas</p>
                        <p className="font-bold">{formatCurrency(calculationResult.sales_base_exempt)}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total IVA Repercutido:</span>
                        <span className="text-xl font-bold">{formatCurrency(calculationResult.total_sales_tax)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculationResult.sales_count} ventas incluidas
                      </p>
                    </div>
                  </div>

                  {/* Compras */}
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Compras (IVA Soportado)</h3>
                    {calculationResult.purchases_count > 0 || calculationResult.total_purchases_tax > 0 ? (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                            <p className="text-xs text-muted-foreground">Base 21%</p>
                            <p className="font-bold">{formatCurrency(calculationResult.purchases_base_21 || 0)}</p>
                            <p className="text-xs text-muted-foreground">IVA: {formatCurrency(calculationResult.purchases_tax_21 || 0)}</p>
                          </div>
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                            <p className="text-xs text-muted-foreground">Base 10%</p>
                            <p className="font-bold">{formatCurrency(calculationResult.purchases_base_10 || 0)}</p>
                            <p className="text-xs text-muted-foreground">IVA: {formatCurrency(calculationResult.purchases_tax_10 || 0)}</p>
                          </div>
                          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                            <p className="text-xs text-muted-foreground">Base 4%</p>
                            <p className="font-bold">{formatCurrency(calculationResult.purchases_base_4 || 0)}</p>
                            <p className="text-xs text-muted-foreground">IVA: {formatCurrency(calculationResult.purchases_tax_4 || 0)}</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                            <p className="text-xs text-muted-foreground">Exentas</p>
                            <p className="font-bold">{formatCurrency(calculationResult.purchases_base_exempt || 0)}</p>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total IVA Soportado:</span>
                            <span className="text-xl font-bold">{formatCurrency(calculationResult.total_purchases_tax || 0)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {calculationResult.purchases_count || 0} compras incluidas
                          </p>
                        </div>
                        {calculationResult.purchases_details && calculationResult.purchases_details.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Detalle de compras:</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {calculationResult.purchases_details.map((purchase: any, idx: number) => (
                                <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{purchase.purchase_number}</span>
                                    <span>{formatCurrency(purchase.total)}</span>
                                  </div>
                                  <div className="text-muted-foreground">
                                    {purchase.supplier_name} • {formatDate(purchase.date)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {formData.include_purchases
                            ? 'No hay compras aprobadas o recibidas en este periodo'
                            : 'Activa "Incluir compras" para calcular el IVA soportado'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Resultado */}
                  <div className={`p-6 rounded-lg ${
                    calculationResult.result_to_pay > 0
                      ? 'bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800'
                      : calculationResult.result_to_refund > 0
                      ? 'bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-950'
                  }`}>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Resultado de la Declaración</p>
                      {calculationResult.result_to_pay > 0 ? (
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                          A INGRESAR: {formatCurrency(calculationResult.result_to_pay)}
                        </p>
                      ) : calculationResult.result_to_refund > 0 ? (
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          A DEVOLVER: {formatCurrency(calculationResult.result_to_refund)}
                        </p>
                      ) : (
                        <p className="text-3xl font-bold">€0.00</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calculator className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calcula tu declaración</h3>
                <p className="text-muted-foreground text-center">
                  Selecciona el trimestre y año, luego haz clic en "Calcular" para ver los resultados
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

