'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText,
  Plus,
  TrendingUp,
  DollarSign,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  X,
  FileDown,
  QrCode,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

interface Invoice {
  id: number;
  sale_id: number;
  sale_number: string;
  // Alineamos con el tipo del cliente de API (`customer_name?: string | null;`)
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
  items: Array<{
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  invoice_registry_id?: number | null;
  invoice_hash?: string | null;
  qr_code?: string | null;
  sent_to_aeat: boolean;
}

export default function InvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    hasRegistry: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const hasRegistry = filters.hasRegistry === 'true' ? true : filters.hasRegistry === 'false' ? false : undefined;
      const data = await apiClient.getInvoices(0, 1000, filters.status || undefined, hasRegistry);
      setInvoices(data.invoices);
    } catch (err: any) {
      logger.error('Error fetching invoices', err);
      setError(err.message || 'Error al cargar facturas');
      toast({
        title: 'Error',
        description: err.message || 'Error al cargar facturas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters.status, filters.hasRegistry]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          invoice.sale_number?.toLowerCase().includes(searchLower) ||
          invoice.customer_name?.toLowerCase().includes(searchLower) ||
          invoice.customer_email?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [invoices, filters.search]);

  const metrics = useMemo(() => {
    const totalInvoices = filteredInvoices.length;
    const totalAmount = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.total.toString()), 0);
    const withRegistry = filteredInvoices.filter((inv) => inv.invoice_registry_id !== null).length;
    const sentToAEAT = filteredInvoices.filter((inv) => inv.sent_to_aeat).length;

    return [
      {
        title: 'Total Facturas',
        value: totalInvoices.toString(),
        change: `${withRegistry} registradas`,
        trend: 'up' as const,
        icon: FileText,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950',
      },
      {
        title: 'Total Facturado',
        value: `€${totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
        change: `${totalInvoices} facturas`,
        trend: 'up' as const,
        icon: DollarSign,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      },
      {
        title: 'En Verifactu',
        value: withRegistry.toString(),
        change: `${sentToAEAT} enviadas a AEAT`,
        trend: 'up' as const,
        icon: CheckCircle2,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-950',
      },
      {
        title: 'Pendientes',
        value: (totalInvoices - withRegistry).toString(),
        change: 'Sin registro',
        trend: 'up' as const,
        icon: Clock,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950',
      },
    ];
  }, [filteredInvoices]);

  const handleViewInvoice = async (invoice: Invoice) => {
    // Navegar a detalles de la factura
    window.location.href = `/sales/${invoice.sale_id}`;
  };

  const handleDownloadXML = async (invoice: Invoice) => {
    if (!invoice.invoice_registry_id) {
      toast({
        title: 'Error',
        description: 'Esta factura no está registrada en Verifactu',
        variant: 'destructive',
      });
      return;
    }

    try {
      const blob = await apiClient.getVerifactuXML(invoice.sale_id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura_${invoice.sale_number}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Éxito',
        description: 'XML descargado correctamente',
      });
    } catch (err: any) {
      logger.error('Error downloading XML', err);
      toast({
        title: 'Error',
        description: err.message || 'Error al descargar XML',
        variant: 'destructive',
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      hasRegistry: '',
    });
  };

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== '').length;
  }, [filters]);

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Facturas
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gestiona tus facturas y registros Verifactu
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : Clock;

            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1 text-neutral-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={metric.trend === 'up' ? 'default' : 'secondary'}
                        className="gap-1 text-xs"
                      >
                        <TrendIcon className="h-3 w-3" />
                        {metric.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, cliente o email..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-neutral-100 dark:bg-neutral-800' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
                >
                  <div>
                    <label className="text-sm font-medium mb-2 block">Estado</label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los estados</SelectItem>
                        <SelectItem value="completed">Completadas</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="cancelled">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Registro Verifactu</label>
                    <Select
                      value={filters.hasRegistry}
                      onValueChange={(value) => setFilters({ ...filters, hasRegistry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las facturas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas las facturas</SelectItem>
                        <SelectItem value="true">Con registro</SelectItem>
                        <SelectItem value="false">Sin registro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoices List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Facturas</CardTitle>
              <CardDescription>
                {filteredInvoices.length} de {invoices.length} facturas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No hay facturas registradas</p>
                  <Button variant="outline" onClick={() => window.location.href = '/sales'}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ir a Ventas
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInvoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.15 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {invoice.sale_number}
                            </p>
                            {invoice.invoice_registry_id && (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Verifactu
                              </Badge>
                            )}
                            {invoice.sent_to_aeat && (
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                AEAT
                              </Badge>
                            )}
                            <Badge variant={invoice.status === 'completed' ? 'default' : 'secondary'}>
                              {invoice.status === 'completed' ? 'Completada' : invoice.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {invoice.customer_name || 'Sin cliente'} • {invoice.items.length} items
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(invoice.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-neutral-900 dark:text-white">
                            €{parseFloat(invoice.total.toString()).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            IVA: €{parseFloat(invoice.tax.toString()).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewInvoice(invoice)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {invoice.invoice_registry_id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadXML(invoice)}
                            title="Descargar XML"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}

