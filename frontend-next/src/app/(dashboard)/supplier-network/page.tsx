'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Network,
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Eye,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

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

const supplierData = [
  { month: 'Ene', proveedores: 24, ordenes: 124, valor: 125000 },
  { month: 'Feb', proveedores: 28, ordenes: 145, valor: 145000 },
  { month: 'Mar', proveedores: 32, ordenes: 162, valor: 162000 },
  { month: 'Abr', proveedores: 30, ordenes: 158, valor: 158000 },
  { month: 'May', proveedores: 35, ordenes: 178, valor: 175000 },
  { month: 'Jun', proveedores: 38, ordenes: 195, valor: 189000 },
];

export default function SupplierNetworkPage() {
  const metrics = [
    {
      title: 'Proveedores Activos',
      value: '38',
      change: '+8 nuevos',
      trend: 'up' as const,
      icon: Building2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Órdenes Totales',
      value: '195',
      change: '+12.5%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Valor Total',
      value: '€189K',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Network,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Tiempo Promedio',
      value: '2.1 días',
      change: '-5.2%',
      trend: 'up' as const,
      icon: Clock,
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
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Red de Proveedores
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gestión de red de proveedores y relaciones comerciales
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : AlertTriangle;
            
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

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Red de Proveedores</CardTitle>
                  <CardDescription>Proveedores y órdenes</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierData}>
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
                  <Legend />
                  <Bar dataKey="proveedores" fill="#8b5cf6" name="Proveedores" />
                  <Bar dataKey="ordenes" fill="#3b82f6" name="Órdenes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Valor de Compras</CardTitle>
                  <CardDescription>Evolución del valor total</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={supplierData}>
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
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Valor (€)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="suppliers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
              <TabsTrigger value="orders">Órdenes</TabsTrigger>
              <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Proveedores Registrados</CardTitle>
                      <CardDescription>Gestión de proveedores</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Proveedor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'SUP-001', name: 'TechSupply SA', status: 'active', orders: 45, rating: '4.8' },
                      { id: 'SUP-002', name: 'Global Materials', status: 'active', orders: 32, rating: '4.6' },
                      { id: 'SUP-003', name: 'Quality Parts Inc', status: 'active', orders: 28, rating: '4.9' },
                      { id: 'SUP-004', name: 'Fast Logistics', status: 'pending', orders: 12, rating: '4.2' },
                    ].map((supplier, index) => (
                      <motion.div
                        key={supplier.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            supplier.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : 'bg-orange-100 dark:bg-orange-900'
                          }`}>
                            <Building2 className={`w-6 h-6 ${
                              supplier.status === 'active'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {supplier.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {supplier.orders} órdenes
                              </Badge>
                              <Badge variant="default" className="text-xs">
                                ⭐ {supplier.rating}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'outline'}>
                          {supplier.status === 'active' ? 'Activo' : 'Pendiente'}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Órdenes a Proveedores</CardTitle>
                  <CardDescription>Gestión de órdenes de compra</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de órdenes de compra
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Orden
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Rendimiento de Proveedores</CardTitle>
                  <CardDescription>Métricas y evaluaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Network className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Análisis de rendimiento de proveedores
                    </p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Reportes
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
