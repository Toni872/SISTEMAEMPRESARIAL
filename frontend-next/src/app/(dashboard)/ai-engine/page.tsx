'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUpRight,
  Play,
  Settings,
  FileText,
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

const aiPerformanceData = [
  { month: 'Ene', accuracy: 87, predictions: 1200, automations: 45 },
  { month: 'Feb', accuracy: 89, predictions: 1350, automations: 52 },
  { month: 'Mar', accuracy: 91, predictions: 1480, automations: 58 },
  { month: 'Abr', accuracy: 93, predictions: 1620, automations: 64 },
  { month: 'May', accuracy: 94, predictions: 1780, automations: 71 },
  { month: 'Jun', accuracy: 95, predictions: 1950, automations: 78 },
];

const predictionsData = [
  { category: 'Ventas', accuracy: 96, count: 450 },
  { category: 'Inventario', accuracy: 94, count: 320 },
  { category: 'Demanda', accuracy: 92, count: 280 },
  { category: 'Finanzas', accuracy: 98, count: 190 },
];

export default function AiEnginePage() {
  const metrics = [
    {
      title: 'Precisión General',
      value: '95%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Automatizaciones Activas',
      value: '24',
      change: '+3 nuevas',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Predicciones Generadas',
      value: '1,950',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Insights Generados',
      value: '156',
      change: '+8 esta semana',
      trend: 'up' as const,
      icon: Brain,
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
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Motor de IA
              </h1>
              <Badge className="mt-1">Inteligencia Artificial</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Análisis predictivo y automatización inteligente para tu negocio
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
                  <CardTitle>Rendimiento del Motor IA</CardTitle>
                  <CardDescription>Evolución de precisión y uso</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={aiPerformanceData}>
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
                    dataKey="accuracy"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Precisión %"
                  />
                  <Line
                    type="monotone"
                    dataKey="predictions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Predicciones"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Precisión por Categoría</CardTitle>
                  <CardDescription>Análisis de predicciones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={predictionsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#8b5cf6" name="Precisión %" />
                  <Bar dataKey="count" fill="#3b82f6" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="automations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="automations">Automatizaciones</TabsTrigger>
              <TabsTrigger value="predictions">Predicciones</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="models">Modelos</TabsTrigger>
            </TabsList>

            <TabsContent value="automations" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Automatizaciones Activas</CardTitle>
                      <CardDescription>Procesos automatizados por IA</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Nueva Automatización
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: '1', name: 'Predicción de Demanda', status: 'active', accuracy: '94%', runs: 1240 },
                      { id: '2', name: 'Optimización de Inventario', status: 'active', accuracy: '91%', runs: 980 },
                      { id: '3', name: 'Análisis de Sentimientos', status: 'active', accuracy: '89%', runs: 756 },
                      { id: '4', name: 'Detección de Fraudes', status: 'active', accuracy: '97%', runs: 542 },
                    ].map((auto, index) => (
                      <motion.div
                        key={auto.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {auto.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="default" className="text-xs">
                                {auto.accuracy} precisión
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {auto.runs} ejecuciones
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            {auto.status}
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

            <TabsContent value="predictions" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Predicciones Recientes</CardTitle>
                  <CardDescription>Últimas predicciones generadas por IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: '1', type: 'Ventas', prediction: 'Aumento del 15%', confidence: '94%', date: '2025-11-13' },
                      { id: '2', type: 'Inventario', prediction: 'Stock bajo en 5 días', confidence: '91%', date: '2025-11-12' },
                      { id: '3', type: 'Demanda', prediction: 'Pico esperado el 20/11', confidence: '88%', date: '2025-11-11' },
                    ].map((pred, index) => (
                      <motion.div
                        key={pred.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 flex items-center justify-center">
                            <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {pred.type}
                            </p>
                            <p className="text-sm text-muted-foreground">{pred.prediction}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(pred.date).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {pred.confidence} confianza
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Insights Generados</CardTitle>
                  <CardDescription>Análisis inteligentes del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: '1', insight: 'Oportunidad de optimizar inventario en categoría Electrónica', impact: 'Alto', date: '2025-11-13' },
                      { id: '2', insight: 'Tendencia positiva detectada en ventas de Q4', impact: 'Medio', date: '2025-11-12' },
                      { id: '3', insight: 'Cliente potencial identificado: TechSolutions SA', impact: 'Alto', date: '2025-11-11' },
                    ].map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900 dark:to-orange-900 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {insight.insight}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(insight.date).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={insight.impact === 'Alto' ? 'default' : 'secondary'}>
                          {insight.impact}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="models" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Modelos de IA</CardTitle>
                  <CardDescription>Modelos entrenados y activos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de modelos de IA
                    </p>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar Modelos
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
