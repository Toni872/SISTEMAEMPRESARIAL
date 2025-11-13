'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  TrendingUp,
  Mail,
  Phone,
  Send,
  AlertTriangle,
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

const communicationsData = [
  { month: 'Ene', emails: 1240, sms: 890, llamadas: 145, mensajes: 2340 },
  { month: 'Feb', emails: 1450, sms: 1020, llamadas: 162, mensajes: 2680 },
  { month: 'Mar', emails: 1620, sms: 1150, llamadas: 178, mensajes: 2950 },
  { month: 'Abr', emails: 1580, sms: 1080, llamadas: 172, mensajes: 2830 },
  { month: 'May', emails: 1780, sms: 1320, llamadas: 195, mensajes: 3295 },
  { month: 'Jun', emails: 1950, sms: 1450, llamadas: 210, mensajes: 3610 },
];

export default function CommunicationsCenterPage() {
  const metrics = [
    {
      title: 'Mensajes Enviados',
      value: '3,610',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Send,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Emails Enviados',
      value: '1,950',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Mail,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'SMS Enviados',
      value: '1,450',
      change: '+12.3%',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Llamadas Realizadas',
      value: '210',
      change: '+7.7%',
      trend: 'up' as const,
      icon: Phone,
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
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Centro Comunicaciones
              </h1>
              <Badge className="mt-1">Módulo Ejecutivo</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Centro unificado de comunicaciones y mensajería
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
                  <CardTitle>Actividad de Comunicaciones</CardTitle>
                  <CardDescription>Emails, SMS y llamadas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={communicationsData}>
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
                  <Bar dataKey="emails" fill="#8b5cf6" name="Emails" />
                  <Bar dataKey="sms" fill="#3b82f6" name="SMS" />
                  <Bar dataKey="llamadas" fill="#10b981" name="Llamadas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Total de Mensajes</CardTitle>
                  <CardDescription>Evolución de comunicaciones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={communicationsData}>
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
                    dataKey="mensajes"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Total Mensajes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="messages" className="space-y-4">
            <TabsList>
              <TabsTrigger value="messages">Mensajes</TabsTrigger>
              <TabsTrigger value="campaigns">Campañas</TabsTrigger>
              <TabsTrigger value="templates">Plantillas</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Mensajes Recientes</CardTitle>
                      <CardDescription>Últimas comunicaciones enviadas</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Mensaje
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'MSG-001', type: 'Email', destinatario: 'cliente@example.com', estado: 'enviado', fecha: '2025-11-13' },
                      { id: 'MSG-002', type: 'SMS', destinatario: '+34 600 123 456', estado: 'enviado', fecha: '2025-11-13' },
                      { id: 'MSG-003', type: 'Email', destinatario: 'proveedor@example.com', estado: 'pendiente', fecha: '2025-11-12' },
                      { id: 'MSG-004', type: 'Llamada', destinatario: '+34 600 789 012', estado: 'completada', fecha: '2025-11-12' },
                    ].map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            msg.type === 'Email'
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : msg.type === 'SMS'
                              ? 'bg-purple-100 dark:bg-purple-900'
                              : 'bg-emerald-100 dark:bg-emerald-900'
                          }`}>
                            {msg.type === 'Email' ? (
                              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            ) : msg.type === 'SMS' ? (
                              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {msg.type} a {msg.destinatario}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(msg.fecha).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={msg.estado === 'enviado' || msg.estado === 'completada' ? 'default' : 'outline'}>
                          {msg.estado}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Campañas de Comunicación</CardTitle>
                  <CardDescription>Gestión de campañas masivas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de campañas de comunicación
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Campaña
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Plantillas de Mensajes</CardTitle>
                  <CardDescription>Plantillas predefinidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gestión de plantillas de mensajes
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Plantilla
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
