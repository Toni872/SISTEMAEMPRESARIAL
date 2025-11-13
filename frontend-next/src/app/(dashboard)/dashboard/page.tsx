'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/auth-store';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Activity,
  FileText,
  Clock,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Link from 'next/link';
import { 
  mockDashboardMetrics, 
  mockChartData, 
  mockInvoices, 
  mockActivities,
  mockProducts 
} from '@/lib/mock-data';

// Métricas usando datos mock reales
const metrics = [
  {
    title: 'Ingresos Totales',
    value: `€${mockDashboardMetrics.revenue.current.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    change: `+${mockDashboardMetrics.revenue.change}%`,
    trend: 'up' as const,
    icon: DollarSign,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  {
    title: 'Pedidos',
    value: mockDashboardMetrics.orders.current.toString(),
    change: `+${mockDashboardMetrics.orders.change}%`,
    trend: 'up' as const,
    icon: ShoppingCart,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    title: 'Clientes',
    value: mockDashboardMetrics.customers.current.toString(),
    change: `+${mockDashboardMetrics.customers.change}%`,
    trend: 'up' as const,
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    title: 'Ganancia Neta',
    value: `€${mockDashboardMetrics.profit.current.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    change: `+${mockDashboardMetrics.profit.change}%`,
    trend: 'up' as const,
    icon: Package,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
];

const monthlySales = [
  { month: 'Ene', ventas: 24500, ingresos: 32000 },
  { month: 'Feb', ventas: 28300, ingresos: 36500 },
  { month: 'Mar', ventas: 31200, ingresos: 41000 },
  { month: 'Abr', ventas: 29800, ingresos: 38500 },
  { month: 'May', ventas: 33500, ingresos: 43200 },
  { month: 'Jun', ventas: 35800, ingresos: 46800 },
  { month: 'Jul', ventas: 38200, ingresos: 49500 },
  { month: 'Ago', ventas: 36900, ingresos: 47800 },
  { month: 'Sep', ventas: 40100, ingresos: 52000 },
  { month: 'Oct', ventas: 42300, ingresos: 54500 },
  { month: 'Nov', ventas: 45600, ingresos: 58900 },
  { month: 'Dic', ventas: 48900, ingresos: 63200 },
];

const categoryData = [
  { name: 'Electrónica', value: 35, color: '#8b5cf6' },
  { name: 'Ropa', value: 25, color: '#3b82f6' },
  { name: 'Alimentos', value: 20, color: '#10b981' },
  { name: 'Hogar', value: 15, color: '#f59e0b' },
  { name: 'Otros', value: 5, color: '#6b7280' },
];

const topProducts = [
  { name: 'Producto Premium X', revenue: 45200, quantity: 234, growth: 12 },
  { name: 'Producto Estrella Y', revenue: 38900, quantity: 412, growth: 8 },
  { name: 'Producto Elite Z', revenue: 32100, quantity: 189, growth: 15 },
  { name: 'Producto Pro A', revenue: 28500, quantity: 298, growth: -3 },
  { name: 'Producto Plus B', revenue: 24800, quantity: 356, growth: 6 },
];

const recentActivity = [
  { id: 1, type: 'sale', title: 'Nueva venta #1234', amount: 1250, time: 'Hace 5 min', user: 'JD' },
  { id: 2, type: 'purchase', title: 'Orden de compra #5678', amount: 3400, time: 'Hace 12 min', user: 'MS' },
  { id: 3, type: 'sale', title: 'Nueva venta #1235', amount: 890, time: 'Hace 23 min', user: 'AL' },
  { id: 4, type: 'alert', title: 'Stock bajo: Producto XYZ', amount: 0, time: 'Hace 1 hora', user: 'SY' },
];

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

  return (
    <>
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
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
        <p className="text-neutral-600 dark:text-neutral-400">
          Resumen de tu negocio en tiempo real
        </p>
      </motion.div>

      {/* Dashboard Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
          {/* Metrics Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={metric.trend === 'up' ? 'default' : 'destructive'}
                          className="gap-1"
                        >
                          <TrendIcon className="h-3 w-3" />
                          {metric.change}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-1">vs mes anterior</span>
                      </div>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* Sales Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ventas e Ingresos Mensuales</CardTitle>
                      <CardDescription>Evolución en los últimos 12 meses</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Ver más
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlySales}>
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
                        strokeWidth={2}
                        fill="url(#colorVentas)"
                      />
                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorIngresos)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Distribution */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader>
                  <CardTitle>Distribución por Categoría</CardTitle>
                  <CardDescription>Ventas por tipo de producto</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {cat.name} ({cat.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Facturas Pendientes */}
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
                  {mockInvoices.slice(0, 5).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{invoice.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          €{invoice.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                        <Badge
                          variant={
                            invoice.status === 'paid'
                              ? 'default'
                              : invoice.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-xs"
                        >
                          {invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                  {mockActivities.slice(0, 5).map((activity) => {
                    const iconMap = {
                      invoice: FileText,
                      customer: Users,
                      product: Package,
                      order: ShoppingCart,
                    };
                    const Icon = iconMap[activity.type];
                    const timeAgo = new Date(activity.timestamp).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {timeAgo}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
    </>
  );
}

