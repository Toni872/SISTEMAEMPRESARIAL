'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plug,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Plus,
  Settings,
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

const integrationData = [
  { month: 'Ene', conexiones: 12, sincronizaciones: 1240, uptime: 98.5 },
  { month: 'Feb', conexiones: 15, sincronizaciones: 1450, uptime: 99.2 },
  { month: 'Mar', conexiones: 18, sincronizaciones: 1620, uptime: 99.5 },
  { month: 'Abr', conexiones: 16, sincronizaciones: 1580, uptime: 99.1 },
  { month: 'May', conexiones: 20, sincronizaciones: 1780, uptime: 99.8 },
  { month: 'Jun', conexiones: 24, sincronizaciones: 1950, uptime: 99.9 },
];

export default function IntegrationLayerPage() {
  const metrics = [
    {
      title: 'Integraciones Activas',
      value: '24',
      change: '+4 nuevas',
      trend: 'up' as const,
      icon: Plug,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Sincronizaciones',
      value: '1,950',
      change: '+12.5%',
      trend: 'up' as const,
      icon: RefreshCw,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Uptime Promedio',
      value: '99.9%',
      change: '+0.4%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Errores',
      value: '2',
      change: '-60%',
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
              <Plug className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Capa Integración
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gestión de integraciones y conexiones con sistemas externos
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
                  <CardTitle>Rendimiento de Integraciones</CardTitle>
                  <CardDescription>Conexiones y sincronizaciones</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={integrationData}>
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
                  <Bar dataKey="conexiones" fill="#8b5cf6" name="Conexiones" />
                  <Bar dataKey="sincronizaciones" fill="#3b82f6" name="Sincronizaciones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Uptime de Integraciones</CardTitle>
                  <CardDescription>Disponibilidad del sistema</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={integrationData}>
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
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="integrations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="integrations">Integraciones</TabsTrigger>
              <TabsTrigger value="apis">APIs</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Integraciones Configuradas</CardTitle>
                      <CardDescription>Gestión de conexiones externas</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Integración
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'INT-001', name: 'Stripe Payment', status: 'active', syncs: 1240, lastSync: 'Hace 5 min' },
                      { id: 'INT-002', name: 'Shopify E-commerce', status: 'active', syncs: 890, lastSync: 'Hace 12 min' },
                      { id: 'INT-003', name: 'Salesforce CRM', status: 'active', syncs: 2340, lastSync: 'Hace 2 min' },
                      { id: 'INT-004', name: 'QuickBooks Accounting', status: 'error', syncs: 560, lastSync: 'Hace 1 hora' },
                    ].map((integration, index) => (
                      <motion.div
                        key={integration.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            integration.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : 'bg-red-100 dark:bg-red-900'
                          }`}>
                            <Plug className={`w-6 h-6 ${
                              integration.status === 'active'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {integration.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {integration.syncs} sincronizaciones
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Última: {integration.lastSync}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={integration.status === 'active' ? 'default' : 'destructive'}>
                            {integration.status === 'active' ? 'Activo' : 'Error'}
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

            <TabsContent value="apis" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>APIs Disponibles</CardTitle>
                  <CardDescription>Endpoints y documentación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Plug className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de APIs y endpoints
                    </p>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar APIs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Logs de Integración</CardTitle>
                  <CardDescription>Registro de actividades y errores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Visualización de logs de integración
                    </p>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualizar Logs
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
