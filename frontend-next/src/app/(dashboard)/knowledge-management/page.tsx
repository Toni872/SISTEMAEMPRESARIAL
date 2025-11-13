'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  TrendingUp,
  FileText,
  Users,
  Search,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Eye,
  Download,
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

const knowledgeData = [
  { month: 'Ene', articulos: 124, consultas: 890, contribuciones: 45, usuarios: 245 },
  { month: 'Feb', articulos: 145, consultas: 1020, contribuciones: 52, usuarios: 289 },
  { month: 'Mar', articulos: 162, consultas: 1150, contribuciones: 58, usuarios: 312 },
  { month: 'Abr', articulos: 158, consultas: 1080, contribuciones: 56, usuarios: 298 },
  { month: 'May', articulos: 178, consultas: 1320, contribuciones: 64, usuarios: 335 },
  { month: 'Jun', articulos: 195, consultas: 1450, contribuciones: 71, usuarios: 358 },
];

export default function KnowledgeManagementPage() {
  const metrics = [
    {
      title: 'Artículos Totales',
      value: '1,245',
      change: '+12.5%',
      trend: 'up' as const,
      icon: FileText,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Consultas Realizadas',
      value: '1,450',
      change: '+12.3%',
      trend: 'up' as const,
      icon: Search,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Contribuciones',
      value: '71',
      change: '+12.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Usuarios Activos',
      value: '358',
      change: '+8.2%',
      trend: 'up' as const,
      icon: BookOpen,
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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión Conocimiento
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Base de conocimiento corporativa y gestión del saber
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
                  <CardTitle>Actividad del Conocimiento</CardTitle>
                  <CardDescription>Artículos y consultas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={knowledgeData}>
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
                  <Bar dataKey="articulos" fill="#8b5cf6" name="Artículos" />
                  <Bar dataKey="consultas" fill="#3b82f6" name="Consultas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contribuciones y Usuarios</CardTitle>
                  <CardDescription>Evolución de participación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={knowledgeData}>
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
                    dataKey="contribuciones"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Contribuciones"
                  />
                  <Line
                    type="monotone"
                    dataKey="usuarios"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Usuarios"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="articles" className="space-y-4">
            <TabsList>
              <TabsTrigger value="articles">Artículos</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="search">Búsqueda</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Base de Conocimiento</CardTitle>
                      <CardDescription>Artículos y documentación</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Artículo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'ART-001', title: 'Guía de Uso del Sistema ERP', categoria: 'Documentación', vistas: 1240, autor: 'Admin' },
                      { id: 'ART-002', title: 'Procedimiento de Facturación', categoria: 'Procesos', vistas: 890, autor: 'María G.' },
                      { id: 'ART-003', title: 'FAQ - Preguntas Frecuentes', categoria: 'Ayuda', vistas: 2340, autor: 'Soporte' },
                      { id: 'ART-004', title: 'Mejores Prácticas de Ventas', categoria: 'Ventas', vistas: 1560, autor: 'Carlos L.' },
                    ].map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {article.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {article.categoria}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {article.vistas} vistas • Por {article.autor}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Categorías de Conocimiento</CardTitle>
                  <CardDescription>Organización por categorías</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de categorías de conocimiento
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Búsqueda Avanzada</CardTitle>
                  <CardDescription>Buscar en la base de conocimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Búsqueda inteligente en la base de conocimiento
                    </p>
                    <Button variant="outline">
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
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
