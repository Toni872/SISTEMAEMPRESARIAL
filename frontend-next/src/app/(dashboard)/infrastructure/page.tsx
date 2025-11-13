'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Server,
  TrendingUp,
  Activity,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Settings,
  RefreshCw,
  Plus,
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

const infrastructureData = [
  { month: 'Ene', servidores: 8, cpu: 65, memoria: 72, uptime: 99.2 },
  { month: 'Feb', servidores: 9, cpu: 68, memoria: 75, uptime: 99.5 },
  { month: 'Mar', servidores: 10, cpu: 62, memoria: 70, uptime: 99.8 },
  { month: 'Abr', servidores: 10, cpu: 64, memoria: 73, uptime: 99.6 },
  { month: 'May', servidores: 11, cpu: 60, memoria: 68, uptime: 99.9 },
  { month: 'Jun', servidores: 12, cpu: 58, memoria: 65, uptime: 99.9 },
];

export default function InfrastructurePage() {
  const metrics = [
    {
      title: 'Servidores Activos',
      value: '12',
      change: '+1 nuevo',
      trend: 'up' as const,
      icon: Server,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Uso de CPU',
      value: '58%',
      change: '-3.3%',
      trend: 'up' as const,
      icon: Cpu,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Uso de Memoria',
      value: '65%',
      change: '-4.3%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Uptime Promedio',
      value: '99.9%',
      change: '+0.1%',
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
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión Infraestructura
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Monitoreo y gestión de infraestructura IT y servidores
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
                  <CardTitle>Rendimiento de Servidores</CardTitle>
                  <CardDescription>CPU y memoria</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={infrastructureData}>
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
                  <Bar dataKey="cpu" fill="#8b5cf6" name="CPU %" />
                  <Bar dataKey="memoria" fill="#3b82f6" name="Memoria %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Uptime y Disponibilidad</CardTitle>
                  <CardDescription>Evolución de disponibilidad</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={infrastructureData}>
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
                    dataKey="uptime"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Uptime %"
                  />
                  <Line
                    type="monotone"
                    dataKey="servidores"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Servidores"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="servers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="servers">Servidores</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>

            <TabsContent value="servers" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Servidores Activos</CardTitle>
                      <CardDescription>Gestión de servidores</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Servidor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'SRV-001', name: 'Servidor Principal', status: 'online', cpu: 58, memoria: 65, uptime: '99.9%' },
                      { id: 'SRV-002', name: 'Servidor de Base de Datos', status: 'online', cpu: 62, memoria: 70, uptime: '99.8%' },
                      { id: 'SRV-003', name: 'Servidor de Aplicaciones', status: 'online', cpu: 55, memoria: 60, uptime: '99.9%' },
                      { id: 'SRV-004', name: 'Servidor de Backup', status: 'maintenance', cpu: 0, memoria: 0, uptime: '98.5%' },
                    ].map((server, index) => (
                      <motion.div
                        key={server.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            server.status === 'online'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : 'bg-orange-100 dark:bg-orange-900'
                          }`}>
                            <Server className={`w-6 h-6 ${
                              server.status === 'online'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {server.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                CPU: {server.cpu}%
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Mem: {server.memoria}%
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Uptime: {server.uptime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={server.status === 'online' ? 'default' : 'outline'}>
                          {server.status === 'online' ? 'En línea' : 'Mantenimiento'}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Monitoreo en Tiempo Real</CardTitle>
                  <CardDescription>Métricas y estado del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Panel de monitoreo en tiempo real
                    </p>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualizar Métricas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Alertas del Sistema</CardTitle>
                  <CardDescription>Notificaciones y eventos críticos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Sistema de alertas de infraestructura
                    </p>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar Alertas
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
