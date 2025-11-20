'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Truck,
  Users,
  FileText,
  Settings,
  Brain,
  Box,
  Building2,
  Zap,
  Smartphone,
  Layers,
  Cloud,
  UserCircle,
  Store,
  DollarSign,
  TrendingUp,
  Archive,
  Shield,
  Sliders,
  MessageSquare,
  BookOpen,
  Server,
  Beaker,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Repeat,
  Receipt,
  Calculator,
  FolderTree,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible } from '@/components/ui/collapsible';

interface MenuItem {
  text: string;
  icon: React.ElementType;
  path: string;
  roles?: Array<'ADMIN' | 'MANAGER' | 'USER' | 'READONLY'>;
  badge?: string;
}

interface MenuCategory {
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
  defaultOpen?: boolean;
}

const menuCategories: MenuCategory[] = [
  {
    title: 'General',
    icon: BarChart3,
    items: [
      { text: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    ],
    defaultOpen: true,
  },
  {
    title: 'Ventas',
    icon: ShoppingCart,
    items: [
      { text: 'Ventas', icon: ShoppingCart, path: '/sales' },
      { text: 'Facturas Recurrentes', icon: Repeat, path: '/recurring-invoices' },
      { text: 'Plantillas de Factura', icon: FileText, path: '/invoice-templates' },
    ],
    defaultOpen: true,
  },
  {
    title: 'Compras',
    icon: Truck,
    items: [
      { text: 'Compras', icon: Truck, path: '/purchases' },
    ],
    defaultOpen: true,
  },
  {
    title: 'Fiscalidad',
    icon: Receipt,
    items: [
      { text: 'Declaraciones Fiscales', icon: FileText, path: '/tax' },
      { text: 'Modelo 303 (IVA)', icon: Calculator, path: '/tax/model-303' },
      { text: 'Modelo 111 (IRPF)', icon: Calculator, path: '/tax/model-111' },
    ],
    defaultOpen: true,
  },
  {
    title: 'Verifactu',
    icon: Shield,
    items: [
      { text: 'Registro de Facturas', icon: Shield, path: '/verifactu' },
    ],
    defaultOpen: true,
  },
  {
    title: 'Inventario',
    icon: Package,
    items: [
      { text: 'Productos', icon: Package, path: '/products' },
    ],
    defaultOpen: true,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const canAccessMenuItem = (item: MenuItem): boolean => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    return item.roles.includes(user.role as 'ADMIN' | 'MANAGER' | 'USER' | 'READONLY');
  };

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-neutral-900 dark:text-white">ERP Sistema</span>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="md:hidden"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
            {user.role}
          </Badge>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {menuCategories.map((category) => {
            const filteredItems = category.items.filter(canAccessMenuItem);
            
            // Si no hay items accesibles, no mostrar la categoría
            if (filteredItems.length === 0) return null;

            // Si está colapsado, mostrar solo el icono de la categoría principal
            // Si hay solo un item, mostrar ese item directamente
            if (collapsed) {
              // Si hay solo un item, mostrar ese item
              if (filteredItems.length === 1) {
                const item = filteredItems[0];
                const Icon = item.icon;
                const isActive = pathname === item.path;

                if (!Icon) return null;

                return (
                  <Link key={item.path} href={item.path} prefetch={true}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-center',
                        isActive &&
                          'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      )}
                      title={item.text}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                    </Button>
                  </Link>
                );
              }

              // Si hay múltiples items, mostrar el icono de la categoría
              // El usuario puede expandir el sidebar para ver los subitems
              const CategoryIcon = category.icon;
              const hasActiveItem = filteredItems.some(item => pathname === item.path);

              return (
                <div key={category.title} className="relative group">
                  <Button
                    variant={hasActiveItem ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-center',
                      hasActiveItem &&
                        'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    )}
                    title={category.title}
                  >
                    <CategoryIcon className="w-5 h-5 flex-shrink-0" />
                  </Button>
                </div>
              );
            }

            // Si hay solo un item, mostrar sin collapsible
            if (filteredItems.length === 1) {
              const item = filteredItems[0];
              const Icon = item.icon;
              const isActive = pathname === item.path;

              if (!Icon) return null;

              return (
                <Link key={item.path} href={item.path} prefetch={true}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      isActive &&
                        'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{item.text}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            }

            // Múltiples items: usar collapsible
            return (
              <Collapsible
                key={category.title}
                title={category.title}
                icon={category.icon}
                defaultOpen={category.defaultOpen}
              >
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  if (!Icon) return null;

                  return (
                    <Link key={item.path} href={item.path} prefetch={true}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 h-9',
                          isActive &&
                            'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left truncate text-sm">{item.text}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </Collapsible>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-neutral-200 dark:border-neutral-800"
        >
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-72',
          className
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 md:hidden z-30 rounded-full shadow-lg bg-gradient-to-br from-purple-600 to-blue-600"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  );
}

