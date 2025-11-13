'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Calendar,
  Eye,
  Download,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
} from 'lucide-react';
import { mockInvoices, mockCustomers } from '@/lib/mock-data';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

const salesData = [
  { month: 'Ene', ventas: 12500, facturas: 45 },
  { month: 'Feb', ventas: 18900, facturas: 62 },
  { month: 'Mar', ventas: 22100, facturas: 78 },
  { month: 'Abr', ventas: 19800, facturas: 71 },
  { month: 'May', ventas: 25600, facturas: 89 },
  { month: 'Jun', ventas: 28900, facturas: 102 },
];

export default function SalesPage() {
  const totalSales = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid');
  const pendingInvoices = mockInvoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue');
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const metrics = [
    {
      title: 'Ventas Totales',
      value: `€${totalSales.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: '+18.7%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Facturas Pagadas',
      value: paidInvoices.length.toString(),
      change: `${((paidInvoices.length / mockInvoices.length) * 100).toFixed(0)}%`,
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Pendientes de Pago',
      value: `€${pendingAmount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: `${pendingInvoices.length} facturas`,
      trend: 'down' as const,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: 'Clientes Activos',
      value: mockCustomers.length.toString(),
      change: '+3 nuevos',
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
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
                  <CardDescription>Últimos 6 meses</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={salesData}>
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
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Facturas por Estado</CardTitle>
                  <CardDescription>Distribución actual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">Pagadas</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 dark:text-white">
                      {paidInvoices.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      €{paidAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
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
                      {pendingInvoices.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      €{pendingAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                {overdueInvoices.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-neutral-900 dark:text-white">Vencidas</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {overdueInvoices.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        €{overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
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
                <TabsTrigger value="invoices">Facturas</TabsTrigger>
                <TabsTrigger value="orders">Pedidos</TabsTrigger>
                <TabsTrigger value="customers">Clientes</TabsTrigger>
              </TabsList>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Venta
              </Button>
            </div>

            <TabsContent value="invoices" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Facturas Emitidas</CardTitle>
                      <CardDescription>Listado completo de facturas</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockInvoices.map((invoice, index) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            invoice.status === 'paid'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : invoice.status === 'pending'
                              ? 'bg-orange-100 dark:bg-orange-900'
                              : 'bg-red-100 dark:bg-red-900'
                          }`}>
                            <FileText className={`w-6 h-6 ${
                              invoice.status === 'paid'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : invoice.status === 'pending'
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-red-600 dark:text-red-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {invoice.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {invoice.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(invoice.date).toLocaleDateString('es-ES', {
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
                              className="mt-1"
                            >
                              {invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Cliente
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockCustomers.map((customer, index) => (
                      <motion.div
                        key={customer.id}
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
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {customer.phone} • {customer.company}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-neutral-900 dark:text-white">
                            €{customer.totalPurchases.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-muted-foreground">Total compras</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Última: {new Date(customer.lastPurchase).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pedidos de Venta</CardTitle>
                      <CardDescription>Gestión de pedidos activos</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Pedido
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No hay pedidos activos en este momento
                    </p>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Pedido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </>
  );
}
