'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  BarChart3,
  Users,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Download,
  Filter,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

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

const analyticsData = [
  { month: 'Ene', usuarios: 245, sesiones: 1240, eventos: 4560, conversiones: 12 },
  { month: 'Feb', usuarios: 289, sesiones: 1450, eventos: 5230, conversiones: 15 },
  { month: 'Mar', usuarios: 312, sesiones: 1620, eventos: 5890, conversiones: 18 },
  { month: 'Abr', usuarios: 298, sesiones: 1580, eventos: 5720, conversiones: 16 },
  { month: 'May', usuarios: 335, sesiones: 1780, eventos: 6420, conversiones: 21 },
  { month: 'Jun', usuarios: 358, sesiones: 1950, eventos: 6890, conversiones: 24 },
];

const pieData = [
  { name: 'Ventas', value: 35, color: '#8b5cf6' },
  { name: 'Marketing', value: 25, color: '#3b82f6' },
  { name: 'Operaciones', value: 20, color: '#10b981' },
  { name: 'Soporte', value: 20, color: '#f59e0b' },
];

export default function PlatformAnalyticsPage() {
  const metrics = [
    {
      title: 'Usuarios Activos',
      value: '358',
      change: '+12.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Sesiones Totales',
      value: '1,950',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Tasa de Conversión',
      value: '1.23%',
      change: '+8.5%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Eventos Totales',
      value: '6,890',
      change: '+15.2%',
      trend: 'up' as const,
      icon: BarChart3,
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
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Plataforma Analytics
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Analytics avanzado y business intelligence de la plataforma
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
                  <CardTitle>Métricas de Plataforma</CardTitle>
                  <CardDescription>Usuarios, sesiones y eventos</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData}>
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
                  <Bar dataKey="sesiones" fill="#3b82f6" name="Sesiones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Distribución por Área</CardTitle>
                  <CardDescription>Uso por departamento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { name, percent } = props;
                      return `${name} ${((percent || 0) * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
              <TabsTrigger value="exports">Exportaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Dashboard Analytics</CardTitle>
                      <CardDescription>Vista general de métricas</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
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
                        dataKey="eventos"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Eventos"
                      />
                      <Line
                        type="monotone"
                        dataKey="conversiones"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Conversiones"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Reportes Generados</CardTitle>
                  <CardDescription>Análisis y reportes disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de reportes analíticos
                    </p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Reportes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exports" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Exportaciones</CardTitle>
                  <CardDescription>Exportar datos y análisis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Download className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Exportar datos analíticos
                    </p>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Datos
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
