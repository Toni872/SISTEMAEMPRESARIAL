'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/auth-store';
import { useDashboard } from '@/lib/hooks/use-dashboard';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Activity,
  FileText,
  ArrowUpRight,
  BarChart3,
  Loader2,
  AlertTriangle,
  Plus,
  Percent,
  Receipt,
  Award,
  Bell,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import Link from 'next/link';

// Colores para gráficos
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#ec4899', '#14b8a6'];

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

export default function DashboardPage() {
  const { user } = useAuthStore();
  const dashboardData = useDashboard();

  // Preparar datos para gráfico de timeline
  const timelineData = dashboardData.salesTimeline.map(item => ({
    period: item.period,
    ventas: item.sales_count,
    ingresos: item.revenue,
  }));

  // Preparar datos para gráfico de categorías
  const categoryChartData = dashboardData.categoryDistribution.map((cat, index) => ({
    name: cat.category,
    value: cat.percentage,
    revenue: cat.revenue,
    color: COLORS[index % COLORS.length],
  }));

  // Preparar datos para gráfico de estado de ventas
  const salesStatusData = [
    { name: 'Completadas', value: dashboardData.salesByStatus.completed, color: '#10b981' },
    { name: 'Pendientes', value: dashboardData.salesByStatus.pending, color: '#f59e0b' },
    { name: 'Canceladas', value: dashboardData.salesByStatus.cancelled, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Construir métricas principales con comparaciones temporales
  const formatChange = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  const metrics = [
    {
      title: 'Ingresos Totales',
      value: `€${dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: formatChange(dashboardData.revenueChangePercent),
      trend: dashboardData.revenueChangePercent >= 0 ? 'up' as const : 'down' as const,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      subtitle: `vs período anterior: €${dashboardData.revenuePreviousPeriod.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Ventas',
      value: dashboardData.totalSales.toString(),
      change: formatChange(dashboardData.salesChangePercent),
      trend: dashboardData.salesChangePercent >= 0 ? 'up' as const : 'down' as const,
      icon: ShoppingCart,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      subtitle: `vs período anterior: ${dashboardData.salesPreviousPeriod}`,
    },
    {
      title: 'Ticket Promedio',
      value: `€${dashboardData.averageTicket.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: dashboardData.averageTicket > 0 ? 'Activo' : 'Sin datos',
      trend: 'up' as const,
      icon: Receipt,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      subtitle: 'Valor promedio por venta',
    },
    {
      title: 'Margen de Beneficio',
      value: `${dashboardData.profitMargin.toFixed(1)}%`,
      change: `€${dashboardData.totalProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      trend: dashboardData.profitMargin >= 0 ? 'up' as const : 'down' as const,
      icon: Percent,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      subtitle: 'Ganancia total',
    },
    {
      title: 'Productos',
      value: dashboardData.totalProducts.toString(),
      change: dashboardData.totalProducts > 0 ? 'Activos' : 'Sin productos',
      trend: 'up' as const,
      icon: Package,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      subtitle: 'Total en inventario',
    },
    {
      title: 'Stock Bajo',
      value: dashboardData.lowStockCount.toString(),
      change: dashboardData.lowStockCount > 0 ? 'Atención' : 'OK',
      trend: dashboardData.lowStockCount > 0 ? ('down' as const) : ('up' as const),
      icon: AlertTriangle,
      color: dashboardData.lowStockCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400',
      bgColor: dashboardData.lowStockCount > 0 ? 'bg-orange-50 dark:bg-orange-950' : 'bg-green-50 dark:bg-green-950',
      subtitle: 'Productos que requieren atención',
    },
  ];

  // Mostrar loading mientras se cargan los datos
  if (dashboardData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay
  if (dashboardData.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Error al cargar datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dashboardData.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Bienvenido, {user?.name || 'Usuario'}
              </p>
            </div>
          </div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Resumen de tu negocio en tiempo real
        </p>
      </motion.div>

      {/* Alertas */}
      {dashboardData.alerts.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Alertas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashboardData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-900 border border-orange-200 dark:border-orange-900"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  {alert.action_url && (
                    <Link href={alert.action_url}>
                      <Button variant="outline" size="sm">
                        Ver
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dashboard Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Metrics Grid - 6 métricas */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{metric.value}</div>
                    <div className="flex items-center gap-1 mb-1">
                      <Badge
                        variant={metric.trend === 'up' ? 'default' : 'destructive'}
                        className="gap-1 text-xs"
                      >
                        <TrendIcon className="h-3 w-3" />
                        {metric.change}
                      </Badge>
                    </div>
                    {metric.subtitle && (
                      <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                    )}
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Sales Timeline Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ventas e Ingresos Mensuales</CardTitle>
                    <CardDescription>Evolución en los últimos 12 meses</CardDescription>
                  </div>
                  <Link href="/sales">
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Ver más
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="period" className="text-xs" />
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
                        strokeWidth={2}
                        fill="url(#colorVentas)"
                        name="Ventas"
                      />
                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorIngresos)"
                        name="Ingresos (€)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No hay datos de ventas disponibles
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution & Sales Status */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
            {/* Category Distribution */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
                <CardDescription>Ventas por tipo de producto</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryChartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {categoryChartData.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium">
                            {cat.value.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                    No hay datos de categorías
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales Status */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Estado de Ventas</CardTitle>
                <CardDescription>Distribución por estado</CardDescription>
              </CardHeader>
              <CardContent>
                {salesStatusData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={salesStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {salesStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {salesStatusData.map((status) => (
                        <div key={status.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {status.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium">
                            {status.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[150px] flex items-center justify-center text-muted-foreground text-sm">
                    No hay ventas registradas
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Products and Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                    <CardDescription>Top 5 productos por cantidad vendida</CardDescription>
                  </div>
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {dashboardData.topProducts.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {dashboardData.topProducts.map((product, index) => (
                        <div
                          key={product.product_id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{product.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.total_sold} unidades vendidas
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">
                              €{product.total_revenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/products">
                      <Button variant="outline" className="w-full mt-4" size="sm">
                        Ver todos los productos
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="mb-4">No hay productos vendidos aún</p>
                    <Link href="/products">
                      <Button variant="outline" size="sm">
                        Crear primer producto
                        <Plus className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Customers */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Clientes Más Valiosos</CardTitle>
                    <CardDescription>Top 5 clientes por facturación</CardDescription>
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {dashboardData.topCustomers.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {dashboardData.topCustomers.map((customer, index) => (
                        <div
                          key={customer.customer_email || index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {customer.customer_name || customer.customer_email || 'Cliente sin nombre'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {customer.total_sales} {customer.total_sales === 1 ? 'venta' : 'ventas'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">
                              €{customer.total_revenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/sales">
                      <Button variant="outline" className="w-full mt-4" size="sm">
                        Ver todas las ventas
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="mb-4">No hay clientes registrados aún</p>
                    <Link href="/sales">
                      <Button variant="outline" size="sm">
                        Crear primera venta
                        <Plus className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row - Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Facturas Recientes */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Facturas Recientes</CardTitle>
                    <CardDescription>Últimas facturas emitidas</CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.recentSales.length > 0 ? (
                  <>
                    {dashboardData.recentSales.map((sale) => (
                      <Link
                        key={sale.id}
                        href="/sales"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${
                            sale.status === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : sale.status === 'pending'
                              ? 'bg-orange-100 dark:bg-orange-900'
                              : 'bg-red-100 dark:bg-red-900'
                          }`}>
                            <FileText className={`h-4 w-4 ${
                              sale.status === 'completed'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : sale.status === 'pending'
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-red-600 dark:text-red-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                              {sale.customer_name || 'Cliente no especificado'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {sale.sale_number || `Venta #${sale.id}`}
                              </p>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {new Date(sale.created_at).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-sm text-neutral-900 dark:text-white">
                            €{parseFloat(sale.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </p>
                          <Badge
                            variant={
                              sale.status === 'completed'
                                ? 'default'
                                : sale.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                            className="text-xs mt-1"
                          >
                            {sale.status === 'completed' ? 'Completada' : sale.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                    <Link href="/sales">
                      <Button variant="outline" className="w-full mt-2" size="sm">
                        Ver todas las ventas
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="mb-4">No hay ventas recientes</p>
                    <Link href="/sales">
                      <Button variant="outline" size="sm">
                        Crear primera venta
                        <Plus className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Últimas acciones del sistema</CardDescription>
                  </div>
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.recentProducts.length > 0 ? (
                  <>
                    {dashboardData.recentProducts.map((product) => {
                      const stock = parseInt(product.stock) || 0;
                      const price = parseFloat(product.price) || 0;
                      return (
                        <Link
                          key={product.id}
                          href="/products"
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0">
                            <Package className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                Stock: <span className={stock < 10 ? 'font-semibold text-orange-600 dark:text-orange-400' : ''}>{stock}</span> unidades
                              </p>
                              {product.category && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {product.category}
                                  </Badge>
                                </>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                              €{price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                    <Link href="/products">
                      <Button variant="outline" className="w-full mt-2" size="sm">
                        Ver todos los productos
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="mb-4">No hay productos recientes</p>
                    <Link href="/products">
                      <Button variant="outline" size="sm">
                        Crear primer producto
                        <Plus className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
