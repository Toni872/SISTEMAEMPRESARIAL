'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  TrendingUp,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Eye,
  Settings,
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

const securityData = [
  { month: 'Ene', amenazas: 12, bloqueos: 8, auditorias: 24, cumplimiento: 92 },
  { month: 'Feb', amenazas: 15, bloqueos: 10, auditorias: 28, cumplimiento: 94 },
  { month: 'Mar', amenazas: 8, bloqueos: 6, auditorias: 32, cumplimiento: 96 },
  { month: 'Abr', amenazas: 10, bloqueos: 7, auditorias: 30, cumplimiento: 95 },
  { month: 'May', amenazas: 6, bloqueos: 4, auditorias: 35, cumplimiento: 97 },
  { month: 'Jun', amenazas: 4, bloqueos: 2, auditorias: 38, cumplimiento: 98 },
];

export default function SecurityGovernancePage() {
  const metrics = [
    {
      title: 'Nivel de Seguridad',
      value: '98%',
      change: '+1.0%',
      trend: 'up' as const,
      icon: Shield,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Amenazas Bloqueadas',
      value: '4',
      change: '-33.3%',
      trend: 'up' as const,
      icon: Lock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Auditorías Completadas',
      value: '38',
      change: '+8.6%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Cumplimiento Normativo',
      value: '98%',
      change: '+1.0%',
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Seguridad y Gobernanza
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gestión de seguridad, cumplimiento normativo y gobernanza
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
                  <CardTitle>Seguridad del Sistema</CardTitle>
                  <CardDescription>Amenazas y bloqueos</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={securityData}>
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
                  <Bar dataKey="amenazas" fill="#ef4444" name="Amenazas" />
                  <Bar dataKey="bloqueos" fill="#10b981" name="Bloqueos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cumplimiento Normativo</CardTitle>
                  <CardDescription>Evolución del cumplimiento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={securityData}>
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
                    dataKey="cumplimiento"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Cumplimiento %"
                  />
                  <Line
                    type="monotone"
                    dataKey="auditorias"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Auditorías"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="threats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="threats">Amenazas</TabsTrigger>
              <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
              <TabsTrigger value="audits">Auditorías</TabsTrigger>
            </TabsList>

            <TabsContent value="threats" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Amenazas Detectadas</CardTitle>
                      <CardDescription>Monitoreo de seguridad</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'THR-001', type: 'Intento de acceso no autorizado', severity: 'high', status: 'bloqueado', date: '2025-11-13' },
                      { id: 'THR-002', type: 'Actividad sospechosa detectada', severity: 'medium', status: 'bloqueado', date: '2025-11-12' },
                      { id: 'THR-003', type: 'Intento de inyección SQL', severity: 'high', status: 'bloqueado', date: '2025-11-11' },
                      { id: 'THR-004', type: 'Tráfico anómalo', severity: 'low', status: 'monitoreado', date: '2025-11-10' },
                    ].map((threat, index) => (
                      <motion.div
                        key={threat.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            threat.severity === 'high'
                              ? 'bg-red-100 dark:bg-red-900'
                              : threat.severity === 'medium'
                              ? 'bg-orange-100 dark:bg-orange-900'
                              : 'bg-yellow-100 dark:bg-yellow-900'
                          }`}>
                            <AlertTriangle className={`w-6 h-6 ${
                              threat.severity === 'high'
                                ? 'text-red-600 dark:text-red-400'
                                : threat.severity === 'medium'
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {threat.type}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={threat.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                {threat.severity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(threat.date).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={threat.status === 'bloqueado' ? 'default' : 'outline'}>
                          {threat.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Cumplimiento Normativo</CardTitle>
                  <CardDescription>Estado de cumplimiento de regulaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de cumplimiento normativo
                    </p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Reportes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audits" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Auditorías de Seguridad</CardTitle>
                  <CardDescription>Registro de auditorías realizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Historial de auditorías de seguridad
                    </p>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Auditorías
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
