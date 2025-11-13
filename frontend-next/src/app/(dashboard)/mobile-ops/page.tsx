'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Smartphone,
  TrendingUp,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Eye,
  Download,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

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

const mobileData = [
  { month: 'Ene', usuarios: 45, operaciones: 1240, tiempo: 2.8 },
  { month: 'Feb', usuarios: 52, operaciones: 1450, tiempo: 2.5 },
  { month: 'Mar', usuarios: 58, operaciones: 1620, tiempo: 2.3 },
  { month: 'Abr', usuarios: 56, operaciones: 1580, tiempo: 2.4 },
  { month: 'May', usuarios: 64, operaciones: 1780, tiempo: 2.2 },
  { month: 'Jun', usuarios: 71, operaciones: 1950, tiempo: 2.1 },
];

export default function MobileOpsPage() {
  const metrics = [
    {
      title: 'Usuarios Móviles',
      value: '71',
      change: '+12.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Operaciones Móviles',
      value: '1,950',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Tiempo Promedio',
      value: '2.1 min',
      change: '-8.7%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Dispositivos Activos',
      value: '89',
      change: '+5 nuevos',
      trend: 'up' as const,
      icon: Smartphone,
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
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Operaciones Móviles
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gestión de operaciones y procesos desde dispositivos móviles
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
                  <CardTitle>Uso de Operaciones Móviles</CardTitle>
                  <CardDescription>Usuarios y operaciones</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mobileData}>
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
                  <Bar dataKey="usuarios" fill="#8b5cf6" name="Usuarios" />
                  <Bar dataKey="operaciones" fill="#3b82f6" name="Operaciones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tiempo de Operación</CardTitle>
                  <CardDescription>Eficiencia en operaciones móviles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mobileData}>
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
                    dataKey="tiempo"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Tiempo (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="devices" className="space-y-4">
            <TabsList>
              <TabsTrigger value="devices">Dispositivos</TabsTrigger>
              <TabsTrigger value="apps">Aplicaciones</TabsTrigger>
              <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Dispositivos Registrados</CardTitle>
                      <CardDescription>Gestión de dispositivos móviles</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Dispositivo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'DEV-001', name: 'iPhone 14 Pro', user: 'Juan Pérez', status: 'active', lastActive: 'Hace 5 min' },
                      { id: 'DEV-002', name: 'Samsung Galaxy S23', user: 'María García', status: 'active', lastActive: 'Hace 12 min' },
                      { id: 'DEV-003', name: 'iPad Pro', user: 'Carlos López', status: 'active', lastActive: 'Hace 1 hora' },
                      { id: 'DEV-004', name: 'Android Tablet', user: 'Ana Martínez', status: 'inactive', lastActive: 'Hace 2 días' },
                    ].map((device, index) => (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            device.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : 'bg-neutral-100 dark:bg-neutral-800'
                          }`}>
                            <Smartphone className={`w-6 h-6 ${
                              device.status === 'active'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-neutral-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {device.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {device.user} • {device.lastActive}
                            </p>
                          </div>
                        </div>
                        <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                          {device.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apps" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Aplicaciones Móviles</CardTitle>
                  <CardDescription>Apps disponibles para operaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Smartphone className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de aplicaciones móviles
                    </p>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar App
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Sesiones Activas</CardTitle>
                  <CardDescription>Usuarios conectados desde móviles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Monitoreo de sesiones móviles
                    </p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Sesiones
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
