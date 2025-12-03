'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient, Withholding } from '@/lib/api';

interface Model111WithholdingDetail {
  nif?: string;
  name?: string;
  supplier_id?: number;
  supplier_name?: string;
  base_amount: number;
  withholding_rate: number;
  withholding_amount?: number;
}
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Calculator, FileText, CheckCircle, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Model111Page() {
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
    notes: '',
  });

  const [withholdings, setWithholdings] = useState<Model111WithholdingDetail[]>([
    {
      nif: '',
      name: '',
      base_amount: 0,
      withholding_rate: 15,
      withholding_amount: 0,
    },
  ]);

  const addWithholding = () => {
    setWithholdings([
      ...withholdings,
      {
        nif: '',
        name: '',
        base_amount: 0,
        withholding_rate: 15,
        withholding_amount: 0,
      },
    ]);
  };

  const removeWithholding = (index: number) => {
    setWithholdings(withholdings.filter((_, i) => i !== index));
  };

  const updateWithholding = (index: number, field: keyof Model111WithholdingDetail, value: any) => {
    const newWithholdings = [...withholdings];
    newWithholdings[index] = { ...newWithholdings[index], [field]: value };
    
    // Calcular retención automáticamente si cambia base_amount o withholding_rate
    if (field === 'base_amount' || field === 'withholding_rate') {
      const base = parseFloat(newWithholdings[index].base_amount.toString()) || 0;
      const rate = parseFloat(newWithholdings[index].withholding_rate.toString()) || 0;
      newWithholdings[index].withholding_amount = (base * rate) / 100;
    }
    
    setWithholdings(newWithholdings);
  };

  const handleCalculate = async () => {
    // Validar que todas las retenciones tengan datos
    for (const w of withholdings) {
      if (!w.nif || !w.name || w.base_amount <= 0) {
        toast({
          title: 'Error',
          description: 'Todas las retenciones deben tener NIF, nombre y base válida',
          variant: 'destructive',
        });
        return;
      }
    }

    setCalculating(true);
    try {
      // Convertir Model111WithholdingDetail[] a Withholding[]
      const withholdingsForApi: Withholding[] = withholdings.map(w => ({
        nif: w.nif || '',
        name: w.name || '',
        base: w.base_amount,
        percentage: w.withholding_rate,
        amount: w.withholding_amount || (w.base_amount * w.withholding_rate) / 100,
      }));
      
      const result = await apiClient.calculateModel111(
        formData.quarter,
        formData.year,
        withholdingsForApi
      );
      setCalculationResult(result);
      toast({
        title: 'Cálculo completado',
        description: 'El cálculo del Modelo 111 se ha realizado correctamente',
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo calcular el Modelo 111',
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
      // Convertir Model111WithholdingDetail[] a Withholding[]
      const withholdingsForApi: Withholding[] = withholdings.map(w => ({
        nif: w.nif || '',
        name: w.name || '',
        base: w.base_amount,
        percentage: w.withholding_rate,
        amount: w.withholding_amount || (w.base_amount * w.withholding_rate) / 100,
      }));
      
      const declaration = await apiClient.generateModel111(
        formData.quarter,
        formData.year,
        withholdingsForApi,
        formData.notes || undefined
      );
      
      toast({
        title: 'Declaración generada',
        description: 'La declaración del Modelo 111 se ha generado exitosamente',
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
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Modelo 111 - Retenciones IRPF</h1>
          <p className="text-muted-foreground mt-1">Declara las retenciones de IRPF practicadas a profesionales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Selecciona el periodo y agrega las retenciones</CardDescription>
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

        {/* Retenciones y Resultados */}
        <div className="lg:col-span-2 space-y-4">
          {/* Formulario de Retenciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Retenciones Practicadas</CardTitle>
                  <CardDescription>Agrega las retenciones de IRPF practicadas a profesionales</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addWithholding}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {withholdings.map((withholding, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>NIF *</Label>
                      <Input
                        value={withholding.nif}
                        onChange={(e) => updateWithholding(index, 'nif', e.target.value)}
                        placeholder="12345678A"
                      />
                    </div>
                    <div>
                      <Label>Nombre *</Label>
                      <Input
                        value={withholding.name}
                        onChange={(e) => updateWithholding(index, 'name', e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Base Retención (€) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={withholding.base_amount}
                        onChange={(e) => updateWithholding(index, 'base_amount', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>% Retención</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={withholding.withholding_rate}
                        onChange={(e) => updateWithholding(index, 'withholding_rate', parseFloat(e.target.value) || 15)}
                      />
                    </div>
                    <div>
                      <Label>Importe Retenido</Label>
                      <div className="px-3 py-2 border rounded-md bg-neutral-50 dark:bg-neutral-900">
                        <p className="font-semibold">{formatCurrency(withholding.withholding_amount || 0)}</p>
                      </div>
                    </div>
                  </div>
                  {withholdings.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWithholding(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resultados */}
          {calculationResult && (
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Base</p>
                    <p className="text-2xl font-bold">{formatCurrency(calculationResult.total_base)}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Retenciones</p>
                    <p className="text-2xl font-bold">{formatCurrency(calculationResult.total_withholdings)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Detalle de Retenciones</h3>
                  <div className="space-y-2">
                    {calculationResult.withholding_details?.map((w: Model111WithholdingDetail, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{w.name}</p>
                          <p className="text-sm text-muted-foreground">NIF: {w.nif}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(w.base_amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {w.withholding_rate}% = {formatCurrency(w.withholding_amount || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

