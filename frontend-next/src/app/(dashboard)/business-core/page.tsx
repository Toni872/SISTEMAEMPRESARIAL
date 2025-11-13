'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Plus,
  Eye,
  BarChart3,
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

const businessData = [
  { month: 'Ene', ingresos: 125000, gastos: 98000, profit: 27000 },
  { month: 'Feb', ingresos: 145000, gastos: 105000, profit: 40000 },
  { month: 'Mar', ingresos: 162000, gastos: 112000, profit: 50000 },
  { month: 'Abr', ingresos: 158000, gastos: 110000, profit: 48000 },
  { month: 'May', ingresos: 175000, gastos: 118000, profit: 57000 },
  { month: 'Jun', ingresos: 189000, gastos: 122000, profit: 67000 },
];

export default function BusinessCorePage() {
  const metrics = [
    {
      title: 'Ingresos Totales',
      value: '€189,000',
      change: '+12.8%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Objetivos Cumplidos',
      value: '87%',
      change: '+5.2%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Equipos Activos',
      value: '12',
      change: '+2 nuevos',
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'KPIs en Verde',
      value: '18/24',
      change: '+3 mejorados',
      trend: 'up' as const,
      icon: Activity,
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
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Business Core
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Núcleo de operaciones del negocio y gestión estratégica
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : Activity;
            
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
                  <CardTitle>Rendimiento Financiero</CardTitle>
                  <CardDescription>Ingresos, gastos y beneficios</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={businessData}>
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
                  <Bar dataKey="ingresos" fill="#8b5cf6" name="Ingresos" />
                  <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                  <Bar dataKey="profit" fill="#10b981" name="Beneficio" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tendencia de Crecimiento</CardTitle>
                  <CardDescription>Evolución mensual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={businessData}>
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
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Ingresos"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Beneficio"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="operations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="operations">Operaciones</TabsTrigger>
              <TabsTrigger value="objectives">Objetivos</TabsTrigger>
              <TabsTrigger value="teams">Equipos</TabsTrigger>
            </TabsList>

            <TabsContent value="operations" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Operaciones Core</CardTitle>
                      <CardDescription>Gestión de operaciones principales</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Operación
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'OP-001', name: 'Proceso de Ventas', status: 'active', efficiency: '94%', volume: 1250 },
                      { id: 'OP-002', name: 'Gestión de Inventario', status: 'active', efficiency: '91%', volume: 890 },
                      { id: 'OP-003', name: 'Atención al Cliente', status: 'active', efficiency: '96%', volume: 2340 },
                      { id: 'OP-004', name: 'Procesamiento de Pedidos', status: 'active', efficiency: '89%', volume: 1560 },
                    ].map((op, index) => (
                      <motion.div
                        key={op.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {op.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {op.efficiency} eficiencia
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {op.volume} transacciones
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="default" className="text-xs">
                          {op.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="objectives" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Objetivos Estratégicos</CardTitle>
                  <CardDescription>Metas y KPIs del negocio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de objetivos estratégicos
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Objetivo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Equipos</CardTitle>
                  <CardDescription>Gestión de equipos de trabajo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de equipos
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Equipo
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
