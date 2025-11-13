'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sliders,
  TrendingUp,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Save,
  RefreshCw,
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

const configData = [
  { month: 'Ene', cambios: 24, aplicados: 22, errores: 2, eficiencia: 92 },
  { month: 'Feb', cambios: 28, aplicados: 26, errores: 2, eficiencia: 93 },
  { month: 'Mar', cambios: 32, aplicados: 31, errores: 1, eficiencia: 97 },
  { month: 'Abr', cambios: 30, aplicados: 29, errores: 1, eficiencia: 97 },
  { month: 'May', cambios: 35, aplicados: 34, errores: 1, eficiencia: 97 },
  { month: 'Jun', cambios: 38, aplicados: 37, errores: 1, eficiencia: 97 },
];

export default function ConfigEnginePage() {
  const metrics = [
    {
      title: 'Configuraciones Activas',
      value: '156',
      change: '+8 nuevas',
      trend: 'up' as const,
      icon: Settings,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Cambios Aplicados',
      value: '37',
      change: '+8.8%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Tasa de Éxito',
      value: '97%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Errores',
      value: '1',
      change: '-50%',
      trend: 'up' as const,
      icon: AlertTriangle,
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
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Motor Configuración
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Motor de configuración y personalización del sistema
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
                  <CardTitle>Rendimiento de Configuración</CardTitle>
                  <CardDescription>Cambios y aplicaciones</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={configData}>
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
                  <Bar dataKey="cambios" fill="#8b5cf6" name="Cambios" />
                  <Bar dataKey="aplicados" fill="#10b981" name="Aplicados" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Eficiencia de Configuración</CardTitle>
                  <CardDescription>Tasa de éxito</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={configData}>
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
                    dataKey="eficiencia"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Eficiencia %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="settings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="settings">Configuraciones</TabsTrigger>
              <TabsTrigger value="templates">Plantillas</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Configuraciones del Sistema</CardTitle>
                      <CardDescription>Gestión de configuraciones</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Nueva Configuración
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'CFG-001', name: 'Configuración de Notificaciones', status: 'activa', cambios: 3, ultimaMod: '2025-11-13' },
                      { id: 'CFG-002', name: 'Configuración de Seguridad', status: 'activa', cambios: 2, ultimaMod: '2025-11-12' },
                      { id: 'CFG-003', name: 'Configuración de Integraciones', status: 'activa', cambios: 5, ultimaMod: '2025-11-11' },
                      { id: 'CFG-004', name: 'Configuración de Reportes', status: 'pendiente', cambios: 1, ultimaMod: '2025-11-10' },
                    ].map((config, index) => (
                      <motion.div
                        key={config.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            config.status === 'activa'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : 'bg-orange-100 dark:bg-orange-900'
                          }`}>
                            <Sliders className={`w-6 h-6 ${
                              config.status === 'activa'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {config.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {config.cambios} cambios
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Última mod: {new Date(config.ultimaMod).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={config.status === 'activa' ? 'default' : 'outline'}>
                          {config.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Plantillas de Configuración</CardTitle>
                  <CardDescription>Plantillas predefinidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de plantillas de configuración
                    </p>
                    <Button variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Crear Plantilla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Historial de Cambios</CardTitle>
                  <CardDescription>Registro de modificaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <RefreshCw className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Historial completo de cambios de configuración
                    </p>
                    <Button variant="outline">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Ver Historial
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
