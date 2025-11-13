'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Truck,
  Plus,
  TrendingUp,
  Package,
  Users,
  FileText,
  Eye,
  Download,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Building2,
} from 'lucide-react';

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

const mockPurchaseOrders = [
  {
    id: 'PO-001',
    supplier: 'TechSupply SA',
    amount: 12500.00,
    status: 'pending',
    date: '2025-11-10',
    items: 8,
  },
  {
    id: 'PO-002',
    supplier: 'ElectroComponents',
    amount: 8900.50,
    status: 'approved',
    date: '2025-11-08',
    items: 12,
  },
  {
    id: 'PO-003',
    supplier: 'Office Supplies Pro',
    amount: 3450.75,
    status: 'received',
    date: '2025-11-05',
    items: 5,
  },
];

const mockSuppliers = [
  {
    id: '1',
    name: 'TechSupply SA',
    email: 'contacto@techsupply.com',
    phone: '+34 912 345 678',
    totalOrders: 15,
    totalAmount: 125000.00,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'ElectroComponents',
    email: 'sales@electrocomp.es',
    phone: '+34 913 456 789',
    totalOrders: 23,
    totalAmount: 189000.50,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Office Supplies Pro',
    email: 'info@officesupplies.com',
    phone: '+34 914 567 890',
    totalOrders: 8,
    totalAmount: 45000.75,
    rating: 4.6,
  },
];

export default function PurchasesPage() {
  const totalPurchases = mockPurchaseOrders.reduce((sum, po) => sum + po.amount, 0);
  const pendingOrders = mockPurchaseOrders.filter(po => po.status === 'pending').length;
  const approvedOrders = mockPurchaseOrders.filter(po => po.status === 'approved').length;

  const metrics = [
    {
      title: 'Compras Totales',
      value: `€${totalPurchases.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: Truck,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Órdenes Activas',
      value: mockPurchaseOrders.length.toString(),
      change: `${pendingOrders} pendientes`,
      trend: 'up' as const,
      icon: Package,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Proveedores',
      value: mockSuppliers.length.toString(),
      change: '+2 nuevos',
      trend: 'up' as const,
      icon: Building2,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Aprobadas',
      value: approvedOrders.toString(),
      change: `${((approvedOrders / mockPurchaseOrders.length) * 100).toFixed(0)}%`,
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
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión de Compras
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Administra órdenes de compra y proveedores
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : Clock;
            
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

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="orders">Órdenes de Compra</TabsTrigger>
                <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
                <TabsTrigger value="invoices">Facturas de Compra</TabsTrigger>
              </TabsList>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Orden
              </Button>
            </div>

            <TabsContent value="orders" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Órdenes de Compra</CardTitle>
                      <CardDescription>Gestión de órdenes activas</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPurchaseOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            order.status === 'received'
                              ? 'bg-emerald-100 dark:bg-emerald-900'
                              : order.status === 'approved'
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : 'bg-orange-100 dark:bg-orange-900'
                          }`}>
                            <Package className={`w-6 h-6 ${
                              order.status === 'received'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : order.status === 'approved'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {order.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.supplier}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.items} artículos • {new Date(order.date).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-neutral-900 dark:text-white">
                              €{order.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                            <Badge
                              variant={
                                order.status === 'received'
                                  ? 'default'
                                  : order.status === 'approved'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="mt-1"
                            >
                              {order.status === 'received' ? 'Recibida' : order.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Proveedores</CardTitle>
                      <CardDescription>Base de datos de proveedores</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Proveedor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSuppliers.map((supplier, index) => (
                      <motion.div
                        key={supplier.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {supplier.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{supplier.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {supplier.phone} • {supplier.totalOrders} órdenes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-neutral-900 dark:text-white">
                            €{supplier.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <span className="text-xs text-muted-foreground">Rating:</span>
                            <Badge variant="secondary" className="text-xs">
                              {supplier.rating} ⭐
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Facturas de Compra</CardTitle>
                      <CardDescription>Facturas recibidas de proveedores</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No hay facturas de compra registradas
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Factura
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
