'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Beaker,
  TrendingUp,
  Zap,
  TestTube,
  AlertTriangle,
  Activity,
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

const labData = [
  { month: 'Ene', experimentos: 12, exitosos: 8, fallidos: 4, innovaciones: 2 },
  { month: 'Feb', experimentos: 15, exitosos: 11, fallidos: 4, innovaciones: 3 },
  { month: 'Mar', experimentos: 18, exitosos: 15, fallidos: 3, innovaciones: 4 },
  { month: 'Abr', experimentos: 16, exitosos: 14, fallidos: 2, innovaciones: 3 },
  { month: 'May', experimentos: 20, exitosos: 18, fallidos: 2, innovaciones: 5 },
  { month: 'Jun', experimentos: 24, exitosos: 21, fallidos: 3, innovaciones: 6 },
];

export default function LabPage() {
  const metrics = [
    {
      title: 'Experimentos Activos',
      value: '24',
      change: '+20%',
      trend: 'up' as const,
      icon: Beaker,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Tasa de Éxito',
      value: '87.5%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Innovaciones',
      value: '6',
      change: '+20%',
      trend: 'up' as const,
      icon: Beaker,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'En Desarrollo',
      value: '8',
      change: '+3 nuevos',
      trend: 'up' as const,
      icon: TestTube,
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
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Laboratorio Experimental
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo - Beta</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Laboratorio de innovación y experimentación con nuevas tecnologías
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
                  <CardTitle>Rendimiento de Experimentos</CardTitle>
                  <CardDescription>Éxitos y fallos</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={labData}>
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
                  <Bar dataKey="exitosos" fill="#10b981" name="Exitosos" />
                  <Bar dataKey="fallidos" fill="#ef4444" name="Fallidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Innovaciones</CardTitle>
                  <CardDescription>Evolución de innovaciones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={labData}>
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
                    dataKey="innovaciones"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Innovaciones"
                  />
                  <Line
                    type="monotone"
                    dataKey="experimentos"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Experimentos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="experiments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="experiments">Experimentos</TabsTrigger>
              <TabsTrigger value="innovations">Innovaciones</TabsTrigger>
              <TabsTrigger value="prototypes">Prototipos</TabsTrigger>
            </TabsList>

            <TabsContent value="experiments" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Experimentos Activos</CardTitle>
                      <CardDescription>Gestión de experimentos en curso</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Experimento
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'EXP-001', name: 'IA Predictiva Avanzada', status: 'exitoso', progreso: 100, fecha: '2025-11-13' },
                      { id: 'EXP-002', name: 'Automatización de Procesos', status: 'en_curso', progreso: 75, fecha: '2025-11-12' },
                      { id: 'EXP-003', name: 'Integración Blockchain', status: 'en_curso', progreso: 45, fecha: '2025-11-11' },
                      { id: 'EXP-004', name: 'Análisis de Sentimientos', status: 'fallido', progreso: 0, fecha: '2025-11-10' },
                    ].map((exp, index) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            exp.status === 'exitoso'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : exp.status === 'en_curso'
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : 'bg-red-100 dark:bg-red-900'
                          }`}>
                            <Beaker className={`w-6 h-6 ${
                              exp.status === 'exitoso'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : exp.status === 'en_curso'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-red-600 dark:text-red-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {exp.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {exp.progreso}% completado
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(exp.fecha).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          exp.status === 'exitoso' ? 'default' :
                          exp.status === 'en_curso' ? 'secondary' :
                          'destructive'
                        }>
                          {exp.status === 'exitoso' ? 'Exitoso' : exp.status === 'en_curso' ? 'En curso' : 'Fallido'}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="innovations" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Innovaciones Desarrolladas</CardTitle>
                  <CardDescription>Nuevas funcionalidades y tecnologías</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Beaker className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de innovaciones desarrolladas
                    </p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Innovaciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prototypes" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Prototipos</CardTitle>
                  <CardDescription>Prototipos en desarrollo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TestTube className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de prototipos experimentales
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Prototipo
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
