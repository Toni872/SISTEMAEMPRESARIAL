'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Plus,
  TrendingUp,
  Mail,
  Shield,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Key,
  MoreVertical,
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

const mockUsers = [
  { id: '1', name: 'Antonio Administrador', email: 'admin@erp.com', role: 'ADMIN', status: 'active', lastLogin: '2025-11-13T10:30:00Z' },
  { id: '2', name: 'María Usuario', email: 'usuario@erp.com', role: 'USER', status: 'active', lastLogin: '2025-11-13T09:15:00Z' },
  { id: '3', name: 'Carlos Manager', email: 'manager@erp.com', role: 'MANAGER', status: 'active', lastLogin: '2025-11-12T16:45:00Z' },
  { id: '4', name: 'Demo Usuario', email: 'demo@erp.com', role: 'USER', status: 'active', lastLogin: '2025-11-11T14:20:00Z' },
  { id: '5', name: 'Ana García', email: 'ana@erp.com', role: 'USER', status: 'inactive', lastLogin: '2025-11-05T11:00:00Z' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const adminCount = mockUsers.filter(u => u.role === 'ADMIN').length;
  const managerCount = mockUsers.filter(u => u.role === 'MANAGER').length;
  const userCount = mockUsers.filter(u => u.role === 'USER').length;

  const metrics = [
    {
      title: 'Total Usuarios',
      value: mockUsers.length.toString(),
      change: `+${mockUsers.length - 4}`,
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Usuarios Activos',
      value: activeUsers.toString(),
      change: `${((activeUsers / mockUsers.length) * 100).toFixed(0)}%`,
      trend: 'up' as const,
      icon: UserPlus,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Administradores',
      value: adminCount.toString(),
      change: 'Acceso total',
      trend: 'up' as const,
      icon: Shield,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Managers',
      value: managerCount.toString(),
      change: `${userCount} usuarios`,
      trend: 'up' as const,
      icon: Mail,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'MANAGER':
        return 'default';
      case 'USER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

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
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión de Usuarios
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Administra usuarios y permisos del sistema
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : Users;
            
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

        {/* Toolbar */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar usuarios por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Key className="w-4 h-4 mr-2" />
                    Permisos
                  </Button>
                  <Button className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users List */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usuarios del Sistema</CardTitle>
                  <CardDescription>
                    Mostrando {filteredUsers.length} de {mockUsers.length} usuarios
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.15 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {user.name}
                          </p>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={user.status === 'active' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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
