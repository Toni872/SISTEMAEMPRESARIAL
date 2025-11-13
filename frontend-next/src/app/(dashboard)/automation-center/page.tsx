'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
  TrendingUp,
  Play,
  Pause,
  Settings,
  CheckCircle2,
  Clock,
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

const automationData = [
  { month: 'Ene', ejecuciones: 1240, tiempo_ahorrado: 45, eficiencia: 87 },
  { month: 'Feb', ejecuciones: 1450, tiempo_ahorrado: 52, eficiencia: 89 },
  { month: 'Mar', ejecuciones: 1620, tiempo_ahorrado: 58, eficiencia: 91 },
  { month: 'Abr', ejecuciones: 1580, tiempo_ahorrado: 56, eficiencia: 90 },
  { month: 'May', ejecuciones: 1780, tiempo_ahorrado: 64, eficiencia: 93 },
  { month: 'Jun', ejecuciones: 1950, tiempo_ahorrado: 71, eficiencia: 95 },
];

export default function AutomationCenterPage() {
  const metrics = [
    {
      title: 'Automatizaciones Activas',
      value: '24',
      change: '+3 nuevas',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Ejecuciones Totales',
      value: '1,950',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Play,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Tiempo Ahorrado',
      value: '71 horas',
      change: '+12.3%',
      trend: 'up' as const,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Eficiencia Promedio',
      value: '95%',
      change: '+2.1%',
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
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Centro Automatización
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Centro de automatización de procesos y workflows inteligentes
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
                  <CardTitle>Rendimiento de Automatizaciones</CardTitle>
                  <CardDescription>Ejecuciones y eficiencia</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={automationData}>
                  <defs>
                    <linearGradient id="colorEjecuciones" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="ejecuciones"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorEjecuciones)"
                    name="Ejecuciones"
                  />
                  <Line
                    type="monotone"
                    dataKey="eficiencia"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Eficiencia %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tiempo Ahorrado</CardTitle>
                  <CardDescription>Horas ahorradas por automatización</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={automationData}>
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
                    dataKey="tiempo_ahorrado"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Horas ahorradas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="workflows" className="space-y-4">
            <TabsList>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="scheduled">Programadas</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Workflows Activos</CardTitle>
                      <CardDescription>Automatizaciones configuradas</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Workflow
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'WF-001', name: 'Proceso de Facturación', status: 'active', runs: 1240, success: '98%' },
                      { id: 'WF-002', name: 'Actualización de Inventario', status: 'active', runs: 890, success: '96%' },
                      { id: 'WF-003', name: 'Notificaciones de Clientes', status: 'active', runs: 2340, success: '99%' },
                      { id: 'WF-004', name: 'Sincronización de Datos', status: 'paused', runs: 560, success: '94%' },
                    ].map((wf, index) => (
                      <motion.div
                        key={wf.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            wf.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : 'bg-orange-100 dark:bg-orange-900'
                          }`}>
                            {wf.status === 'active' ? (
                              <Play className={`w-6 h-6 text-emerald-600 dark:text-emerald-400`} />
                            ) : (
                              <Pause className={`w-6 h-6 text-orange-600 dark:text-orange-400`} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {wf.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {wf.runs} ejecuciones
                              </Badge>
                              <Badge variant="default" className="text-xs">
                                {wf.success} éxito
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={wf.status === 'active' ? 'default' : 'outline'}>
                            {wf.status === 'active' ? 'Activo' : 'Pausado'}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Automatizaciones Programadas</CardTitle>
                  <CardDescription>Tareas programadas para ejecución</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de tareas programadas
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Programar Tarea
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Historial de Ejecuciones</CardTitle>
                  <CardDescription>Registro completo de automatizaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Zap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Historial de ejecuciones
                    </p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Historial Completo
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
