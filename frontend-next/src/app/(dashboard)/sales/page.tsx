'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Eye,
  Download,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { SaleForm } from '@/components/sales/sale-form';
import { useToast } from '@/components/ui/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { exportSalesToCSV } from '@/lib/utils/export';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

export default function SalesPage() {
  const { toast } = useToast();
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_sales: 0,
  });

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const [salesData, statsData, productsData] = await Promise.all([
        apiClient.getSales(0, 1000),
        apiClient.getSalesStats(),
        apiClient.getProducts(0, 1000),
      ]);

      setSales(salesData);
      setProducts(productsData);
      setStats(statsData);
    } catch (err: any) {
      logger.error('Error fetching sales', err);
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const completedSales = sales.filter(s => s.status === 'completed');
  const pendingSales = sales.filter(s => s.status === 'pending');
  const cancelledSales = sales.filter(s => s.status === 'cancelled');
  
  const totalRevenue = stats.total_revenue || 0;
  const pendingAmount = pendingSales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
  
  // Extraer clientes únicos de las ventas
  const uniqueCustomers = Array.from(
    new Map(
      sales
        .filter(s => s.customer_name)
        .map(s => [s.customer_name, {
          name: s.customer_name,
          email: s.customer_email,
          phone: s.customer_phone,
          totalPurchases: sales
            .filter(ss => ss.customer_name === s.customer_name)
            .reduce((sum, ss) => sum + parseFloat(ss.total || 0), 0),
          lastPurchase: s.created_at,
        }])
    ).values()
  );

  const metrics = [
    {
      title: 'Ventas Totales',
      value: `€${totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: `${completedSales.length} completadas`,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Ventas Completadas',
      value: completedSales.length.toString(),
      change: `${sales.length > 0 ? ((completedSales.length / sales.length) * 100).toFixed(0) : 0}%`,
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Pendientes',
      value: `€${pendingAmount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: `${pendingSales.length} ventas`,
      trend: 'down' as const,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: 'Clientes Únicos',
      value: uniqueCustomers.length.toString(),
      change: '+0 nuevos',
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  const handleCreateSale = async (formData: any) => {
    try {
      setFormLoading(true);
      await apiClient.createSale({
        customer_name: formData.customer_name || undefined,
        customer_email: formData.customer_email || undefined,
        customer_phone: formData.customer_phone || undefined,
        notes: formData.notes || undefined,
        status: formData.status || 'pending',
        items: formData.items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      });
      setFormOpen(false);
      setEditingSale(null);
      await fetchSales();
      toast({
        title: "Venta creada",
        description: "La venta se ha creado exitosamente.",
        variant: "success",
      });
    } catch (err: any) {
      logger.error('Error creating sale', err);
      toast({
        title: "Error",
        description: err.message || 'Error al crear venta',
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateSale = async (formData: any) => {
    if (!editingSale) return;
    
    try {
      setFormLoading(true);
      await apiClient.updateSale(editingSale.id, {
        customer_name: formData.customer_name || undefined,
        customer_email: formData.customer_email || undefined,
        customer_phone: formData.customer_phone || undefined,
        notes: formData.notes || undefined,
        status: formData.status || 'pending',
      });
      setFormOpen(false);
      setEditingSale(null);
      await fetchSales();
      toast({
        title: "Venta actualizada",
        description: "La venta se ha actualizado exitosamente.",
        variant: "success",
      });
    } catch (err: any) {
      logger.error('Error updating sale', err);
      toast({
        title: "Error",
        description: err.message || 'Error al actualizar venta',
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSaleToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteSale = async () => {
    if (!saleToDelete) return;

    try {
      setDeletingId(saleToDelete);
      await apiClient.deleteSale(saleToDelete);
      await fetchSales();
      toast({
        title: "Venta eliminada",
        description: "La venta se ha eliminado exitosamente.",
        variant: "success",
      });
    } catch (err: any) {
      logger.error('Error deleting sale', err);
      toast({
        title: "Error",
        description: err.message || 'Error al eliminar venta',
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setSaleToDelete(null);
    }
  };

  const handleEditClick = async (sale: any) => {
    try {
      const fullSale = await apiClient.getSale(sale.id);
      setEditingSale(fullSale);
      setFormOpen(true);
    } catch (err: any) {
      logger.error('Error loading sale', err);
      toast({
        title: "Error",
        description: err.message || 'Error al cargar venta',
        variant: "destructive",
      });
    }
  };

  const handleCreateClick = () => {
    setEditingSale(null);
    setFormOpen(true);
  };

  const handleCreateInvoice = async (sale: any) => {
    try {
      setFormLoading(true);
      await apiClient.createInvoice(sale.id, true);
      await fetchSales();
      toast({
        title: "Factura creada",
        description: "La factura se ha creado y registrado en Verifactu exitosamente.",
        variant: "success",
      });
    } catch (err: any) {
      logger.error('Error creating invoice', err);
      toast({
        title: "Error",
        description: err.message || 'Error al crear factura',
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completada', variant: 'default' as const };
      case 'pending':
        return { label: 'Pendiente', variant: 'secondary' as const };
      case 'cancelled':
        return { label: 'Cancelada', variant: 'destructive' as const };
      default:
        return { label: status, variant: 'secondary' as const };
    }
  };

  if (loading && sales.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Cargando ventas...</p>
        </div>
      </div>
    );
  }

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión de Ventas
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Administra pedidos, facturas y relaciones con clientes
          </p>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants}>
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Sales Chart */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Evolución de Ventas</CardTitle>
                  <CardDescription>Últimas ventas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sales.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={sales.slice(-6).map(s => ({
                    month: new Date(s.created_at).toLocaleDateString('es-ES', { month: 'short' }),
                    ventas: parseFloat(s.total || 0),
                  }))}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorVentas)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay datos de ventas</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ventas por Estado</CardTitle>
                  <CardDescription>Distribución actual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">Completadas</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 dark:text-white">
                      {completedSales.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      €{completedSales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">Pendientes</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 dark:text-white">
                      {pendingSales.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      €{pendingAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                {cancelledSales.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-neutral-900 dark:text-white">Canceladas</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {cancelledSales.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        €{cancelledSales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="invoices" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="invoices">Ventas</TabsTrigger>
                <TabsTrigger value="customers">Clientes</TabsTrigger>
              </TabsList>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleCreateClick}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Venta
              </Button>
            </div>

            <TabsContent value="invoices" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ventas Registradas</CardTitle>
                      <CardDescription>Listado completo de ventas</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                          exportSalesToCSV(sales);
                          toast({
                            title: "Exportación exitosa",
                            description: `Se exportaron ${sales.length} ventas a CSV`,
                            variant: "success",
                          });
                        } catch (error: any) {
                          logger.error('Error al exportar', error);
                          toast({
                            title: "Error al exportar",
                            description: error.message || "No se pudo exportar las ventas",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={sales.length === 0}
                      type="button"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                      <p className="text-muted-foreground">Cargando ventas...</p>
                    </div>
                  ) : sales.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No hay ventas registradas</p>
                      <Button onClick={handleCreateClick} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primera Venta
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sales.map((sale, index) => {
                        const statusBadge = getStatusBadge(sale.status);
                        const isDeleting = deletingId === sale.id;

                        return (
                          <motion.div
                            key={sale.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02, duration: 0.15 }}
                            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                sale.status === 'completed'
                                  ? 'bg-emerald-100 dark:bg-emerald-900'
                                  : sale.status === 'pending'
                                  ? 'bg-orange-100 dark:bg-orange-900'
                                  : 'bg-red-100 dark:bg-red-900'
                              }`}>
                                <FileText className={`w-6 h-6 ${
                                  sale.status === 'completed'
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : sale.status === 'pending'
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900 dark:text-white">
                                  {sale.sale_number || `Venta #${sale.id}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {sale.customer_name || 'Cliente no especificado'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(sale.created_at).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-bold text-lg text-neutral-900 dark:text-white">
                                  €{parseFloat(sale.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </p>
                                <Badge variant={statusBadge.variant} className="mt-1">
                                  {statusBadge.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                {sale.status === 'completed' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCreateInvoice(sale);
                                    }}
                                    disabled={formLoading}
                                    type="button"
                                    title="Crear factura"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(sale);
                                  }}
                                  type="button"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600 hover:text-red-700 cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteClick(sale.id);
                                  }}
                                  disabled={isDeleting}
                                  type="button"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Clientes</CardTitle>
                      <CardDescription>Base de datos de clientes activos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {uniqueCustomers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No hay clientes registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uniqueCustomers.map((customer, index) => (
                        <motion.div
                          key={customer.name}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02, duration: 0.15 }}
                          className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-white">
                                {customer.name}
                              </p>
                              {customer.email && (
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                              )}
                              {customer.phone && (
                                <p className="text-xs text-muted-foreground">
                                  {customer.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-neutral-900 dark:text-white">
                              €{customer.totalPurchases.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-muted-foreground">Total compras</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Sale Form Modal */}
      <SaleForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingSale(null);
          }
        }}
        sale={editingSale}
        products={products}
        onSubmit={editingSale ? handleUpdateSale : handleCreateSale}
        loading={formLoading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleDeleteSale}
        title="¿Eliminar venta?"
        description="Esta acción no se puede deshacer. La venta será eliminada permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}
