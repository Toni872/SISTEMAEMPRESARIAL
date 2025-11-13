'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Box,
  TrendingUp,
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Eye,
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

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

const logisticsData = [
  { month: 'Ene', entregas: 245, tiempo: 2.8, costo: 12500 },
  { month: 'Feb', entregas: 289, tiempo: 2.5, costo: 11800 },
  { month: 'Mar', entregas: 312, tiempo: 2.3, costo: 11200 },
  { month: 'Abr', entregas: 298, tiempo: 2.4, costo: 11500 },
  { month: 'May', entregas: 335, tiempo: 2.2, costo: 10800 },
  { month: 'Jun', entregas: 358, tiempo: 2.1, costo: 10500 },
];

export default function LogisticsPage() {
  const metrics = [
    {
      title: 'Entregas Completadas',
      value: '358',
      change: '+12.5%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Tiempo Promedio',
      value: '2.1 días',
      change: '-8.7%',
      trend: 'up' as const,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Rutas Activas',
      value: '24',
      change: '+3 nuevas',
      trend: 'up' as const,
      icon: MapPin,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Costo Total',
      value: '€10,500',
      change: '-5.2%',
      trend: 'up' as const,
      icon: Truck,
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
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Logística Inteligente
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gestión avanzada de logística y cadena de suministro optimizada
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
                  <CardTitle>Rendimiento Logístico</CardTitle>
                  <CardDescription>Entregas y tiempos de entrega</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={logisticsData}>
                  <defs>
                    <linearGradient id="colorEntregas" x1="0" y1="0" x2="0" y2="1">
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
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="entregas"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorEntregas)"
                    name="Entregas"
                  />
                  <Line
                    type="monotone"
                    dataKey="tiempo"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Tiempo (días)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Optimización de Costos</CardTitle>
                  <CardDescription>Evolución de costos logísticos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={logisticsData}>
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
                    dataKey="costo"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Costo (€)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="shipments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="shipments">Envíos</TabsTrigger>
              <TabsTrigger value="routes">Rutas</TabsTrigger>
              <TabsTrigger value="warehouses">Almacenes</TabsTrigger>
            </TabsList>

            <TabsContent value="shipments" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Envíos Activos</CardTitle>
                      <CardDescription>Gestión de envíos en curso</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Envío
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'SH-001', destination: 'Madrid', status: 'en_transit', eta: '2 días', packages: 12 },
                      { id: 'SH-002', destination: 'Barcelona', status: 'delivered', eta: 'Completado', packages: 8 },
                      { id: 'SH-003', destination: 'Valencia', status: 'pending', eta: '3 días', packages: 15 },
                      { id: 'SH-004', destination: 'Sevilla', status: 'en_transit', eta: '1 día', packages: 6 },
                    ].map((shipment, index) => (
                      <motion.div
                        key={shipment.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            shipment.status === 'delivered'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : shipment.status === 'en_transit'
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : 'bg-orange-100 dark:bg-orange-900'
                          }`}>
                            <Truck className={`w-6 h-6 ${
                              shipment.status === 'delivered'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : shipment.status === 'en_transit'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {shipment.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {shipment.destination} • {shipment.packages} paquetes
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              ETA: {shipment.eta}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              shipment.status === 'delivered'
                                ? 'default'
                                : shipment.status === 'en_transit'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {shipment.status === 'delivered' ? 'Entregado' : shipment.status === 'en_transit' ? 'En tránsito' : 'Pendiente'}
                          </Badge>
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

            <TabsContent value="routes" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Rutas Optimizadas</CardTitle>
                  <CardDescription>Rutas inteligentes activas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de rutas optimizadas
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Ruta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warehouses" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Almacenes</CardTitle>
                  <CardDescription>Red de almacenes y distribución</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Box className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de almacenes
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Almacén
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
