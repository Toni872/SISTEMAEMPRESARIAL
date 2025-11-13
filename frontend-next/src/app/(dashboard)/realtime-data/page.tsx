'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Radio,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  RefreshCw,
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

const realtimeData = [
  { time: '00:00', eventos: 45, latencia: 12, throughput: 1250 },
  { time: '04:00', eventos: 38, latencia: 15, throughput: 980 },
  { time: '08:00', eventos: 125, latencia: 8, throughput: 2340 },
  { time: '12:00', eventos: 189, latencia: 6, throughput: 3450 },
  { time: '16:00', eventos: 156, latencia: 7, throughput: 2890 },
  { time: '20:00', eventos: 98, latencia: 10, throughput: 1780 },
];

export default function RealtimeDataPage() {
  const metrics = [
    {
      title: 'Eventos en Tiempo Real',
      value: '189',
      change: '+15.2%',
      trend: 'up' as const,
      icon: Radio,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Latencia Promedio',
      value: '6ms',
      change: '-25%',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Throughput',
      value: '3,450',
      change: '+18.5%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Conexiones Activas',
      value: '156',
      change: '+8 nuevas',
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
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Datos Tiempo Real
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Monitoreo y gestión de datos en tiempo real del sistema
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
                  <CardTitle>Eventos en Tiempo Real</CardTitle>
                  <CardDescription>Actividad del sistema</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={realtimeData}>
                  <defs>
                    <linearGradient id="colorEventos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
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
                    dataKey="eventos"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorEventos)"
                    name="Eventos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rendimiento del Sistema</CardTitle>
                  <CardDescription>Latencia y throughput</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realtimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="latencia"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Latencia (ms)"
                  />
                  <Line
                    type="monotone"
                    dataKey="throughput"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Throughput"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="streams" className="space-y-4">
            <TabsList>
              <TabsTrigger value="streams">Streams</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>

            <TabsContent value="streams" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Streams de Datos Activos</CardTitle>
                      <CardDescription>Flujos de datos en tiempo real</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'STR-001', name: 'Stream de Ventas', status: 'active', events: 1240, latency: '6ms' },
                      { id: 'STR-002', name: 'Stream de Inventario', status: 'active', events: 890, latency: '8ms' },
                      { id: 'STR-003', name: 'Stream de Clientes', status: 'active', events: 2340, latency: '5ms' },
                      { id: 'STR-004', name: 'Stream de Logs', status: 'paused', events: 560, latency: '12ms' },
                    ].map((stream, index) => (
                      <motion.div
                        key={stream.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            stream.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : 'bg-neutral-100 dark:bg-neutral-800'
                          }`}>
                            <Radio className={`w-6 h-6 ${
                              stream.status === 'active'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-neutral-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {stream.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {stream.events} eventos
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Latencia: {stream.latency}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={stream.status === 'active' ? 'default' : 'secondary'}>
                          {stream.status === 'active' ? 'Activo' : 'Pausado'}
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
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Alertas en Tiempo Real</CardTitle>
                  <CardDescription>Notificaciones y eventos críticos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Sistema de alertas en tiempo real
                    </p>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
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
