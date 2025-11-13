'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  ArrowUpRight,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

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

const reportTypes = [
  {
    title: 'Reporte de Ventas',
    description: 'Análisis detallado de ventas por período',
    icon: TrendingUp,
    color: 'emerald',
    category: 'sales',
  },
  {
    title: 'Reporte de Inventario',
    description: 'Estado actual del inventario y movimientos',
    icon: BarChart3,
    color: 'blue',
    category: 'inventory',
  },
  {
    title: 'Reporte Financiero',
    description: 'Balance y estado de resultados',
    icon: PieChart,
    color: 'purple',
    category: 'financial',
  },
  {
    title: 'Reporte de Actividad',
    description: 'Actividad de usuarios y operaciones',
    icon: Activity,
    color: 'orange',
    category: 'activity',
  },
];

const salesReportData = [
  { month: 'Ene', ventas: 12500, ingresos: 18900 },
  { month: 'Feb', ventas: 18900, ingresos: 25600 },
  { month: 'Mar', ventas: 22100, ingresos: 31200 },
  { month: 'Abr', ventas: 19800, ingresos: 28900 },
  { month: 'May', ventas: 25600, ingresos: 34500 },
  { month: 'Jun', ventas: 28900, ingresos: 41200 },
];

const categoryData = [
  { name: 'Electrónica', value: 35, color: '#8b5cf6' },
  { name: 'Accesorios', value: 28, color: '#3b82f6' },
  { name: 'Mobiliario', value: 22, color: '#10b981' },
  { name: 'Otros', value: 15, color: '#f59e0b' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Reportes y Analítica
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Genera y descarga reportes detallados del sistema
          </p>
        </motion.div>

        {/* Report Types Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedReport(report.category)}
                >
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-lg bg-${report.color}-100 dark:bg-${report.color}-900 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${report.color}-600 dark:text-${report.color}-400`} />
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {report.description}
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Generar
                    </Button>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Evolución de Ventas</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Ver más
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesReportData}>
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
                    dataKey="ventas"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Ventas"
                  />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Ingresos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Distribución por Categoría</CardTitle>
                  <CardDescription>Ventas por categoría de producto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
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
                    {categoryData.map((entry, index) => (
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
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Reports */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reportes Recientes</CardTitle>
                  <CardDescription>Últimos reportes generados</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: '1', name: 'Reporte de Ventas - Noviembre 2025', type: 'Ventas', date: '2025-11-13', size: '2.4 MB' },
                  { id: '2', name: 'Reporte de Inventario - Noviembre 2025', type: 'Inventario', date: '2025-11-12', size: '1.8 MB' },
                  { id: '3', name: 'Reporte Financiero - Octubre 2025', type: 'Financiero', date: '2025-11-01', size: '3.2 MB' },
                ].map((report, index) => (
                  <motion.div
                    key={report.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {report.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {report.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.date).toLocaleDateString('es-ES')} • {report.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
