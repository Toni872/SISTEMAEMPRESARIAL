'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SupplierForm } from '@/components/purchases/supplier-form';
import { PurchaseForm } from '@/components/purchases/purchase-form';
import {
  Truck,
  Plus,
  TrendingUp,
  Package,
  Users,
  FileText,
  Eye,
  Download,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Building2,
  Edit,
  FileDown,
  FileSpreadsheet,
  Filter,
  X,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface Purchase {
  id: number;
  purchase_number: string;
  supplier: {
    id: number;
    name: string;
  };
  total: number;
  status: string;
  purchase_date: string;
  items: any[];
}

interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_active?: boolean;
  totalAmount?: number;
  totalOrders?: number;
}

export default function PurchasesPage() {
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para formularios
  const [purchaseFormOpen, setPurchaseFormOpen] = useState(false);
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewPurchaseDialogOpen, setViewPurchaseDialogOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);
  const [exporting, setExporting] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    supplierId: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Usar Promise.allSettled para que si una falla, las otras continúen
      const results = await Promise.allSettled([
        apiClient.getPurchases().catch(err => {
          console.error('Error cargando compras:', err);
          return [];
        }),
        apiClient.getSuppliers().catch(err => {
          console.error('Error cargando proveedores:', err);
          return [];
        }),
        apiClient.getProducts(0, 1000).catch(err => {
          console.error('Error cargando productos:', err);
          return [];
        }),
      ]);
      
      // Procesar resultados
      const purchasesData = results[0].status === 'fulfilled' ? results[0].value : [];
      const suppliersData = results[1].status === 'fulfilled' ? results[1].value : [];
      const productsData = results[2].status === 'fulfilled' ? results[2].value : [];
      
      setPurchases(purchasesData || []);
      setSuppliers(suppliersData || []);
      setProducts(productsData || []);
      
      // Mostrar warning si alguna falló
      const failedCount = results.filter(r => r.status === 'rejected').length;
      if (failedCount > 0) {
        console.warn(`${failedCount} de ${results.length} llamadas a la API fallaron`);
      }
    } catch (err: any) {
      console.error('Error crítico cargando datos:', err);
      toast({
        title: 'Error',
        description: err.message || 'No se pudieron cargar los datos',
        variant: 'destructive',
      });
      // Asegurar que los estados estén inicializados incluso si hay error
      setPurchases([]);
      setSuppliers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePurchase = () => {
    setSelectedPurchase(null);
    setPurchaseFormOpen(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setPurchaseFormOpen(true);
  };

  const handleViewPurchase = async (purchase: Purchase) => {
    try {
      // Cargar detalles completos de la compra
      const fullPurchase = await apiClient.getPurchase(purchase.id);
      setViewingPurchase(fullPurchase);
      setViewPurchaseDialogOpen(true);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudieron cargar los detalles de la compra',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitPurchase = async (data: any) => {
    try {
      setFormLoading(true);
      if (selectedPurchase) {
        await apiClient.updatePurchase(selectedPurchase.id, data);
        toast({
          title: 'Éxito',
          description: 'Compra actualizada correctamente',
        });
      } else {
        await apiClient.createPurchase(data);
        toast({
          title: 'Éxito',
          description: 'Compra creada correctamente',
        });
      }
      setPurchaseFormOpen(false);
      setSelectedPurchase(null);
      await fetchData();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error al guardar la compra',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateSupplier = () => {
    setSelectedSupplier(null);
    setSupplierFormOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierFormOpen(true);
  };

  const handleSubmitSupplier = async (data: any) => {
    try {
      setFormLoading(true);
      
      // Limpiar datos: convertir strings vacíos a null y asegurar que solo se envíen campos válidos
      const cleanedData: any = {
        name: data.name,
        is_active: data.is_active !== undefined ? data.is_active : true,
      };
      
      // Agregar campos opcionales solo si tienen valor
      if (data.tax_id && data.tax_id.trim()) cleanedData.tax_id = data.tax_id.trim();
      if (data.email && data.email.trim()) cleanedData.email = data.email.trim();
      if (data.phone && data.phone.trim()) cleanedData.phone = data.phone.trim();
      if (data.address && data.address.trim()) cleanedData.address = data.address.trim();
      if (data.city && data.city.trim()) cleanedData.city = data.city.trim();
      if (data.postal_code && data.postal_code.trim()) cleanedData.postal_code = data.postal_code.trim();
      if (data.country && data.country.trim()) cleanedData.country = data.country.trim();
      if (data.contact_person && data.contact_person.trim()) cleanedData.contact_person = data.contact_person.trim();
      if (data.website && data.website.trim()) cleanedData.website = data.website.trim();
      if (data.notes && data.notes.trim()) cleanedData.notes = data.notes.trim();
      
      if (selectedSupplier) {
        await apiClient.updateSupplier(selectedSupplier.id, cleanedData);
        toast({
          title: 'Éxito',
          description: 'Proveedor actualizado correctamente',
        });
      } else {
        await apiClient.createSupplier(cleanedData);
        toast({
          title: 'Éxito',
          description: 'Proveedor creado correctamente',
        });
      }
      setSupplierFormOpen(false);
      setSelectedSupplier(null);
      await fetchData();
    } catch (err: any) {
      console.error('Error al guardar proveedor:', err);
      toast({
        title: 'Error',
        description: err.message || err.detail || 'Error al guardar el proveedor',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Función para filtrar compras
  const filteredPurchases = useMemo(() => {
    if (!purchases || purchases.length === 0) return [];
    
    try {
      return purchases.filter((purchase) => {
        // Filtro de búsqueda (número de compra o proveedor)
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            purchase.purchase_number?.toLowerCase().includes(searchLower) ||
            purchase.supplier?.name?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // Filtro por proveedor
        if (filters.supplierId && purchase.supplier?.id?.toString() !== filters.supplierId) {
          return false;
        }

        // Filtro por estado
        if (filters.status && purchase.status !== filters.status) {
          return false;
        }

        // Filtro por fecha
        if (filters.startDate && purchase.purchase_date) {
          try {
            const purchaseDate = new Date(purchase.purchase_date);
            const startDate = new Date(filters.startDate);
            if (purchaseDate < startDate) return false;
          } catch (e) {
            // Si hay error parseando la fecha, incluir el item
          }
        }

        if (filters.endDate && purchase.purchase_date) {
          try {
            const purchaseDate = new Date(purchase.purchase_date);
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // Incluir todo el día
            if (purchaseDate > endDate) return false;
          } catch (e) {
            // Si hay error parseando la fecha, incluir el item
          }
        }

        return true;
      });
    } catch (error) {
      console.error('Error filtrando compras:', error);
      return purchases; // Si hay error, devolver todas las compras
    }
  }, [purchases, filters]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      supplierId: '',
      status: '',
      startDate: '',
      endDate: '',
    });
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const totalPurchases = purchases.reduce((sum, p) => sum + parseFloat(p.total.toString()), 0);
  const pendingOrders = purchases.filter(p => p.status === 'pending').length;
  const approvedOrders = purchases.filter(p => p.status === 'approved').length;

  const metrics = [
    {
      title: 'Compras Totales',
      value: `€${totalPurchases.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: purchases.length > 0 ? `${purchases.length} compras` : 'Sin compras',
      trend: 'up' as const,
      icon: Truck,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Órdenes Activas',
      value: purchases.length.toString(),
      change: `${pendingOrders} pendientes`,
      trend: 'up' as const,
      icon: Package,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Proveedores',
      value: suppliers.length.toString(),
      change: suppliers.length > 0 ? `${suppliers.length} activos` : 'Sin proveedores',
      trend: 'up' as const,
      icon: Building2,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Aprobadas',
      value: approvedOrders.toString(),
      change: purchases.length > 0 ? `${((approvedOrders / purchases.length) * 100).toFixed(0)}%` : '0%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

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
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión de Compras
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Administra órdenes de compra y proveedores
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="orders">Órdenes de Compra</TabsTrigger>
                <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
                <TabsTrigger value="invoices">Facturas de Compra</TabsTrigger>
              </TabsList>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleCreatePurchase}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Orden
              </Button>
            </div>

            <TabsContent value="orders" className="space-y-4">
              {/* Filtros */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por número de compra o proveedor..."
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
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t"
                    >
                      <div>
                        <label className="text-sm font-medium mb-2 block">Proveedor</label>
                        <Select
                          value={filters.supplierId}
                          onValueChange={(value) => setFilters({ ...filters, supplierId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos los proveedores" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos los proveedores</SelectItem>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
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
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="approved">Aprobada</SelectItem>
                            <SelectItem value="received">Recibida</SelectItem>
                            <SelectItem value="cancelled">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Fecha desde</label>
                        <Input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Fecha hasta</label>
                        <Input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Órdenes de Compra</CardTitle>
                      <CardDescription>
                        {filteredPurchases.length} de {purchases.length} compras
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={exporting || purchases.length === 0}>
                          {exporting ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Exportando...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Exportar
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={async () => {
                            try {
                              setExporting(true);
                              const blob = await apiClient.exportPurchasesPDF();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `compras_${new Date().toISOString().split('T')[0]}.pdf`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                              toast({
                                title: 'Éxito',
                                description: 'PDF exportado correctamente',
                              });
                            } catch (err: any) {
                              toast({
                                title: 'Error',
                                description: err.message || 'Error al exportar PDF',
                                variant: 'destructive',
                              });
                            } finally {
                              setExporting(false);
                            }
                          }}
                        >
                          <FileDown className="w-4 h-4 mr-2" />
                          Exportar a PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () => {
                            try {
                              setExporting(true);
                              const blob = await apiClient.exportPurchasesExcel();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `compras_${new Date().toISOString().split('T')[0]}.xlsx`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                              toast({
                                title: 'Éxito',
                                description: 'Excel exportado correctamente',
                              });
                            } catch (err: any) {
                              toast({
                                title: 'Error',
                                description: err.message || 'Error al exportar Excel',
                                variant: 'destructive',
                              });
                            } finally {
                              setExporting(false);
                            }
                          }}
                        >
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Exportar a Excel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredPurchases.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No hay compras registradas</p>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                        onClick={handleCreatePurchase}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primera Compra
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredPurchases.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            order.status === 'received'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : order.status === 'approved'
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : 'bg-orange-100 dark:bg-orange-900'
                          }`}>
                            <Package className={`w-6 h-6 ${
                              order.status === 'received'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : order.status === 'approved'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {order.purchase_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.supplier?.name || 'Sin proveedor'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.items?.length || 0} artículos • {new Date(order.purchase_date).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-neutral-900 dark:text-white">
                              €{parseFloat(order.total.toString()).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                            <Badge
                              variant={
                                order.status === 'received'
                                  ? 'default'
                                  : order.status === 'approved'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="mt-1"
                            >
                              {order.status === 'received' ? 'Recibida' : order.status === 'approved' ? 'Aprobada' : order.status === 'pending' ? 'Pendiente' : order.status === 'draft' ? 'Borrador' : order.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={async () => {
                                try {
                                  const blob = await apiClient.exportPurchasePDF(order.id);
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `compra_${order.purchase_number}.pdf`;
                                  document.body.appendChild(a);
                                  a.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(a);
                                  toast({
                                    title: 'Éxito',
                                    description: 'PDF exportado correctamente',
                                  });
                                } catch (err: any) {
                                  toast({
                                    title: 'Error',
                                    description: err.message || 'Error al exportar PDF',
                                    variant: 'destructive',
                                  });
                                }
                              }}
                              title="Exportar PDF"
                            >
                              <FileDown className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditPurchase(order)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewPurchase(order)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Proveedores</CardTitle>
                      <CardDescription>Base de datos de proveedores</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCreateSupplier}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Proveedor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : suppliers.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No hay proveedores registrados</p>
                      <Button 
                        variant="outline"
                        onClick={handleCreateSupplier}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Primer Proveedor
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suppliers.map((supplier, index) => {
                        // Calcular estadísticas del proveedor
                        const supplierPurchases = purchases.filter(p => p.supplier?.id === supplier.id);
                        const totalAmount = supplierPurchases.reduce((sum, p) => sum + parseFloat(p.total.toString()), 0);
                        
                        return (
                          <motion.div
                            key={supplier.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02, duration: 0.15 }}
                            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900 dark:text-white">
                                  {supplier.name}
                                </p>
                                <p className="text-sm text-muted-foreground">{supplier.email || 'Sin email'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {supplier.phone || 'Sin teléfono'} • {supplierPurchases.length} órdenes
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-bold text-lg text-neutral-900 dark:text-white">
                                  €{totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </p>
                                <Badge variant={(supplier.is_active ?? true) ? 'default' : 'secondary'} className="mt-1">
                                  {(supplier.is_active ?? true) ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditSupplier(supplier)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Facturas de Compra</CardTitle>
                      <CardDescription>Facturas recibidas de proveedores</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Las facturas de compra se muestran en la sección de Órdenes de Compra
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Esta sección estará disponible en una futura actualización
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Facturas de Compra</CardTitle>
                      <CardDescription>Facturas recibidas de proveedores</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No hay facturas de compra registradas
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Factura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Formularios */}
      <PurchaseForm
        open={purchaseFormOpen}
        onOpenChange={setPurchaseFormOpen}
        onSubmit={handleSubmitPurchase}
        purchase={selectedPurchase || undefined}
        suppliers={suppliers}
        products={products}
        loading={formLoading}
        onOpenSupplierForm={handleCreateSupplier}
      />

      <SupplierForm
        open={supplierFormOpen}
        onOpenChange={setSupplierFormOpen}
        onSubmit={handleSubmitSupplier}
        supplier={selectedSupplier || undefined}
        loading={formLoading}
      />

      {/* Diálogo de Visualización de Compra */}
      <Dialog open={viewPurchaseDialogOpen} onOpenChange={setViewPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Compra</DialogTitle>
            <DialogDescription>
              Información completa de la orden de compra
            </DialogDescription>
          </DialogHeader>
          {viewingPurchase && (
            <div className="space-y-4 py-4">
              {/* Información Básica */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Información Básica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Número de Compra</p>
                    <p className="font-medium">{viewingPurchase.purchase_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">
                      {new Date(viewingPurchase.purchase_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{viewingPurchase.supplier?.name || 'Sin proveedor'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge
                      variant={
                        viewingPurchase.status === 'received'
                          ? 'default'
                          : viewingPurchase.status === 'approved'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {viewingPurchase.status === 'received' 
                        ? 'Recibida' 
                        : viewingPurchase.status === 'approved' 
                        ? 'Aprobada' 
                        : viewingPurchase.status === 'pending' 
                        ? 'Pendiente' 
                        : viewingPurchase.status === 'draft' 
                        ? 'Borrador' 
                        : viewingPurchase.status}
                    </Badge>
                  </div>
                  {viewingPurchase.reference_number && (
                    <div>
                      <p className="text-sm text-muted-foreground">Número de Referencia</p>
                      <p className="font-medium">{viewingPurchase.reference_number}</p>
                    </div>
                  )}
                </div>
                {viewingPurchase.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notas</p>
                    <p className="text-sm">{viewingPurchase.notes}</p>
                  </div>
                )}
              </div>

              {/* Artículos */}
              {viewingPurchase.items && viewingPurchase.items.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Artículos</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50 dark:bg-neutral-900">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Descripción</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Cantidad</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Precio Unit.</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">IVA %</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingPurchase.items.map((item: any, index: number) => (
                          <tr key={index} className="border-t border-neutral-200 dark:border-neutral-800">
                            <td className="px-4 py-2 text-sm">{item.description}</td>
                            <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">
                              €{parseFloat(item.unit_price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-2 text-sm text-right">{item.tax_rate}%</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">
                              €{parseFloat(item.subtotal).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Totales */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">
                    €{parseFloat(viewingPurchase.subtotal?.toString() || '0').toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">IVA:</span>
                  <span className="font-medium">
                    €{parseFloat(viewingPurchase.tax?.toString() || '0').toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-lg">
                  <span>Total:</span>
                  <span>
                    €{parseFloat(viewingPurchase.total.toString()).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
