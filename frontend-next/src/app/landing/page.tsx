'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowRight,
  Check,
  BarChart3,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
  Clock,
  Star,
  ChevronRight,
  Menu,
  X,
  DollarSign,
  ShoppingCart,
  Package,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Ejecutivo',
    description: 'Visualiza todas las métricas clave de tu negocio en tiempo real con gráficos interactivos y KPIs personalizables.',
    image: '/dashboard-preview.png',
    benefits: [
      'Métricas en tiempo real',
      'Gráficos interactivos',
      'KPIs personalizables',
      'Alertas inteligentes',
    ],
  },
  {
    icon: Zap,
    title: 'Facturación Automática',
    description: 'Crea, envía y gestiona facturas en segundos. Automatiza recordatorios y seguimientos de pagos.',
    image: '/invoicing-preview.png',
    benefits: [
      'Facturas en 3 clics',
      'Envío automático',
      'Recordatorios de pago',
      'Múltiples plantillas',
    ],
  },
  {
    icon: Shield,
    title: 'Inventario Inteligente',
    description: 'Control total de tu stock con alertas de reabastecimiento automáticas y predicción de demanda con IA.',
    image: '/inventory-preview.png',
    benefits: [
      'Stock en tiempo real',
      'Alertas automáticas',
      'Predicción con IA',
      'Multi-almacén',
    ],
  },
  {
    icon: Users,
    title: 'CRM Integrado',
    description: 'Gestiona tus clientes, oportunidades y ventas desde una única plataforma centralizada.',
    image: '/crm-preview.png',
    benefits: [
      'Pipeline visual',
      'Seguimiento de leads',
      'Automatización de ventas',
      'Historial completo',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Reportes Avanzados',
    description: 'Genera informes detallados con un solo clic. Exporta a PDF, Excel o comparte en tiempo real.',
    image: '/reports-preview.png',
    benefits: [
      'Informes personalizados',
      'Exportación múltiple',
      'Compartir en tiempo real',
      'Análisis predictivo',
    ],
  },
  {
    icon: Sparkles,
    title: 'IA Predictiva',
    description: 'Optimiza precios, predice demanda y automatiza decisiones con nuestro motor de inteligencia artificial.',
    image: '/ai-preview.png',
    benefits: [
      'Predicción de ventas',
      'Optimización de precios',
      'Análisis de tendencias',
      'Recomendaciones automáticas',
    ],
  },
];

const testimonials = [
  {
    name: 'María García',
    role: 'CEO',
    company: 'TechStart Solutions',
    avatar: 'MG',
    content: 'Holded revolucionó nuestra gestión. Ahorramos 15 horas semanales en tareas administrativas.',
    rating: 5,
  },
  {
    name: 'Carlos Ruiz',
    role: 'Director Financiero',
    company: 'Innovate Corp',
    avatar: 'CR',
    content: 'La automatización de facturación es increíble. Nuestro flujo de caja mejoró un 40%.',
    rating: 5,
  },
  {
    name: 'Ana Martínez',
    role: 'Gerente de Operaciones',
    company: 'Global Retail',
    avatar: 'AM',
    content: 'El control de inventario en tiempo real nos ayudó a reducir pérdidas en un 30%.',
    rating: 5,
  },
  {
    name: 'David López',
    role: 'Fundador',
    company: 'StartupHub',
    avatar: 'DL',
    content: 'Perfecto para startups. Escalable, intuitivo y con todo lo que necesitas desde el día 1.',
    rating: 5,
  },
  {
    name: 'Laura Sánchez',
    role: 'Directora Comercial',
    company: 'SalesForce Pro',
    avatar: 'LS',
    content: 'El CRM integrado duplicó nuestra tasa de conversión. Imprescindible para ventas.',
    rating: 5,
  },
  {
    name: 'Roberto Torres',
    role: 'CFO',
    company: 'Finance Plus',
    avatar: 'RT',
    content: 'Los reportes financieros son espectaculares. Toma de decisiones basada en datos reales.',
    rating: 5,
  },
];

const logos = [
  'TechStart', 'Innovate', 'Global', 'StartupHub', 'SalesForce', 'Finance',
  'Digital', 'CloudTech', 'DataPro', 'SmartBiz', 'NextGen', 'ProActive',
];

const pricing = [
  {
    name: 'Starter',
    price: '29',
    description: 'Perfecto para autónomos y pequeños negocios',
    features: [
      'Hasta 50 facturas/mes',
      '1 usuario',
      'Dashboard básico',
      'Soporte por email',
      'Inventario básico',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '79',
    description: 'Ideal para empresas en crecimiento',
    features: [
      'Facturas ilimitadas',
      'Hasta 10 usuarios',
      'Dashboard avanzado',
      'Soporte prioritario',
      'IA predictiva',
      'CRM completo',
      'Reportes avanzados',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Para grandes empresas con necesidades específicas',
    features: [
      'Todo de Professional',
      'Usuarios ilimitados',
      'Soporte 24/7',
      'Onboarding personalizado',
      'API dedicada',
      'SLA garantizado',
    ],
    highlighted: false,
  },
];

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ERP Sistema
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Funcionalidades
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Testimonios
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Precios
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Acceder al Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-neutral-700 dark:text-neutral-200">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Empieza gratis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-neutral-950 dark:via-purple-950/20 dark:to-neutral-950 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <Sparkles className="w-3 h-3 mr-1" />
                Nuevo: IA Predictiva integrada
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-neutral-900 dark:text-white">
                Gestión empresarial{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  inteligente
                </span>
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                {isAuthenticated
                  ? `Accede a todas las funcionalidades del sistema.`
                  : 'El software en la nube que tiene todo lo que necesitas para gestionar tu empresa. Facturación, inventario, CRM y más, todo en un solo lugar.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg h-14">
                      Acceder al Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg h-14">
                        Empieza gratis
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="text-lg h-14 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700">
                      Ver demo
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white dark:border-neutral-950 flex items-center justify-center text-white text-sm font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="ml-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      +2,500 empresas confían en nosotros
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-200/50 dark:border-purple-800/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-blue-500/10 to-purple-500/10" />
                <div className="bg-white dark:bg-neutral-900 p-6">
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="flex-1" />
                    <div className="w-20 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                  </div>

                  {/* Dashboard Preview */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center px-4 gap-3 shadow-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-medium">Dashboard</span>
                      <div className="flex-1" />
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-28 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl p-4 border border-purple-200 dark:border-purple-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <div className="px-2 py-0.5 bg-green-500/20 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">+12%</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">€45.2K</div>
                        <div className="text-xs text-purple-600/70 dark:text-purple-400/70">Ingresos Totales</div>
                      </div>
                      <div className="h-28 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-4 border border-blue-200 dark:border-blue-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 text-white" />
                          </div>
                          <div className="px-2 py-0.5 bg-green-500/20 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">+8%</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">1,245</div>
                        <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Ventas del Mes</div>
                      </div>
                      <div className="h-28 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div className="px-2 py-0.5 bg-green-500/20 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">+15%</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">892</div>
                        <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Clientes Activos</div>
                      </div>
                      <div className="h-28 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl p-4 border border-orange-200 dark:border-orange-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          <div className="px-2 py-0.5 bg-green-500/20 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">+5%</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">3,456</div>
                        <div className="text-xs text-orange-600/70 dark:text-orange-400/70">Productos</div>
                      </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-gradient-to-br from-neutral-50 to-purple-50/50 dark:from-neutral-800 dark:to-purple-950/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-neutral-900 dark:text-white">Ventas Mensuales</span>
                        </div>
                        <div className="flex gap-3 items-center">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">2024</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">2025</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-36 flex items-end gap-1.5">
                        {[45, 62, 38, 71, 55, 82, 68, 91, 75, 88, 65, 79].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-purple-500 via-purple-400 to-blue-400 dark:from-purple-600 dark:via-purple-500 dark:to-blue-500 rounded-t shadow-sm hover:shadow-md transition-shadow"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 px-1">
                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month) => (
                          <span key={month} className="text-[10px] text-neutral-500 dark:text-neutral-500 font-medium">{month}</span>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">Actividad Reciente</span>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">Nueva venta realizada</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Hace 5 minutos</div>
                        </div>
                        <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded text-xs font-medium text-purple-600 dark:text-purple-400">€1,250</div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">Cliente nuevo registrado</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Hace 12 minutos</div>
                        </div>
                        <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 rounded text-xs font-medium text-emerald-600 dark:text-emerald-400">Nuevo</div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">Producto actualizado</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Hace 1 hora</div>
                        </div>
                        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs font-medium text-blue-600 dark:text-blue-400">Stock</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logos Carousel */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-purple-950/30 border-y border-purple-200/50 dark:border-purple-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-purple-600/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <p className="text-center text-base font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-8">
            Empresas que ya confían en nosotros
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-purple-50 via-blue-50 to-transparent dark:from-purple-950/30 dark:via-blue-950/30 z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-purple-50 via-blue-50 to-transparent dark:from-purple-950/30 dark:via-blue-950/30 z-10" />
            <motion.div
              animate={{ x: [0, -1920] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="flex gap-16 items-center"
            >
              {[...logos, ...logos, ...logos].map((logo, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-6 py-3 rounded-lg bg-white dark:bg-neutral-800 border border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-600"
                >
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {logo}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Funcionalidades</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Todo lo que necesitas en{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                un solo lugar
              </span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Potentes herramientas diseñadas para hacer crecer tu negocio
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'
                    }`}
                >
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">{feature.title}</h3>
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-neutral-700 dark:text-neutral-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="group text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700">
                      Más información
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  <div className={isEven ? 'lg:col-start-2' : ''}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                      <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 p-8 flex items-center justify-center">
                        {/* Mockup específico por feature */}
                        {index === 0 && (
                          <div className="w-full h-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 space-y-4">
                            {/* Dashboard Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Ventas hoy</div>
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">€12,450</div>
                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 23.5%</div>
                              </div>
                              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Facturas</div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">87</div>
                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 12.3%</div>
                              </div>
                              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Clientes</div>
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,234</div>
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">↑ 8.1%</div>
                              </div>
                              <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Pendientes</div>
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">€3,210</div>
                                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">15 facturas</div>
                              </div>
                            </div>
                            {/* Chart Preview */}
                            <div className="h-32 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800 flex items-end justify-around">
                              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                <div key={i} className="w-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t" style={{ height: `${height}%` }} />
                              ))}
                            </div>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="w-full h-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 space-y-3">
                            {/* Invoice List */}
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
                              <div className="text-sm font-bold text-neutral-900 dark:text-white">Facturas Recientes</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">Ver todas →</div>
                            </div>
                            {[
                              { id: 'INV-2024-001', client: 'Acme Corp', amount: '€2,450.00', status: 'Pagada', color: 'green' },
                              { id: 'INV-2024-002', client: 'Tech Solutions', amount: '€1,890.00', status: 'Pendiente', color: 'orange' },
                              { id: 'INV-2024-003', client: 'Global Industries', amount: '€5,230.00', status: 'Pagada', color: 'green' },
                            ].map((invoice, i) => (
                              <div key={i} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-4 flex items-center gap-4 border border-purple-100 dark:border-purple-900">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                  #{i + 1}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="text-sm font-bold text-neutral-900 dark:text-white">{invoice.client}</div>
                                  <div className="text-xs text-neutral-600 dark:text-neutral-400">{invoice.id}</div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="text-sm font-bold text-neutral-900 dark:text-white">{invoice.amount}</div>
                                  <div className={`text-xs px-2 py-1 rounded-full ${invoice.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400'}`}>
                                    {invoice.status}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {index === 2 && (
                          <div className="w-full h-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6">
                            {/* Inventory Grid */}
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700 mb-4">
                              <div className="text-sm font-bold text-neutral-900 dark:text-white">Productos en Stock</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">324 items</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { name: 'MacBook Pro', stock: 24, status: 'high', color: 'green' },
                                { name: 'iPhone 15', stock: 45, status: 'high', color: 'green' },
                                { name: 'AirPods Pro', stock: 12, status: 'medium', color: 'orange' },
                                { name: 'iPad Air', stock: 8, status: 'low', color: 'red' },
                                { name: 'Apple Watch', stock: 31, status: 'high', color: 'green' },
                                { name: 'Magic Mouse', stock: 5, status: 'low', color: 'red' },
                              ].map((product, i) => (
                                <div key={i} className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-3 border border-purple-100 dark:border-purple-900 space-y-2">
                                  <div className="w-full h-16 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 rounded flex items-center justify-center">
                                    <div className="w-8 h-8 bg-white dark:bg-neutral-700 rounded" />
                                  </div>
                                  <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">{product.name}</div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Stock: {product.stock}</div>
                                    <div className={`w-2 h-2 rounded-full ${product.color === 'green' ? 'bg-green-500' : product.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {index === 3 && (
                          <div className="w-full h-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6">
                            {/* CRM Pipeline */}
                            <div className="text-sm font-bold text-neutral-900 dark:text-white mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">Pipeline de Ventas</div>
                            <div className="flex gap-3">
                              {[
                                { stage: 'Leads', count: 12, deals: [{ name: 'Acme Corp', value: '€15K' }, { name: 'Tech Inc', value: '€8K' }] },
                                { stage: 'Contacto', count: 8, deals: [{ name: 'Global SA', value: '€25K' }, { name: 'StartupXYZ', value: '€12K' }] },
                                { stage: 'Propuesta', count: 5, deals: [{ name: 'Enterprise', value: '€45K' }, { name: 'MidMarket', value: '€18K' }] },
                                { stage: 'Cerrado', count: 3, deals: [{ name: 'BigCorp', value: '€60K' }, { name: 'Partner', value: '€22K' }] },
                              ].map((column) => (
                                <div key={column.stage} className="flex-1 space-y-2">
                                  <div className="bg-purple-100 dark:bg-purple-900/50 rounded px-2 py-1.5 text-xs flex items-center justify-between border border-purple-200 dark:border-purple-800">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">{column.stage}</span>
                                    <span className="text-purple-600 dark:text-purple-400">{column.count}</span>
                                  </div>
                                  <div className="space-y-2">
                                    {column.deals.map((deal, i) => (
                                      <div key={i} className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-2 border border-purple-100 dark:border-purple-900">
                                        <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1">{deal.name}</div>
                                        <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{deal.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {index === 4 && (
                          <div className="w-full h-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 space-y-4">
                            {/* Reports Dashboard */}
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
                              <div className="text-sm font-bold text-neutral-900 dark:text-white">Análisis de Ventas</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">Último mes</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-950/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Ingresos</div>
                                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">€45.2K</div>
                                <div className="text-xs text-green-600 dark:text-green-400">↑ 18.2%</div>
                              </div>
                              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Conversión</div>
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">24.8%</div>
                                <div className="text-xs text-green-600 dark:text-green-400">↑ 5.3%</div>
                              </div>
                              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/50 dark:to-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">ROI</div>
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">285%</div>
                                <div className="text-xs text-green-600 dark:text-green-400">↑ 12.5%</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {[
                                { label: 'Productos', value: 85, amount: '€38.2K' },
                                { label: 'Servicios', value: 65, amount: '€29.4K' },
                                { label: 'Consultoría', value: 92, amount: '€41.5K' },
                                { label: 'Soporte', value: 48, amount: '€21.6K' },
                              ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item.label}</span>
                                    <span className="text-neutral-900 dark:text-white font-bold">{item.amount}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${item.value}%` }} />
                                    </div>
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 w-10 text-right">{item.value}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {index === 5 && (
                          <div className="w-full h-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 space-y-4">
                            {/* Automation Workflows */}
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
                              <div className="text-sm font-bold text-neutral-900 dark:text-white">Automatizaciones Activas</div>
                              <div className="text-xs text-green-600 dark:text-green-400">● 12 activas</div>
                            </div>
                            <div className="space-y-3">
                              {[
                                { name: 'Enviar facturas automáticamente', trigger: 'Al crear pedido', status: 'active', runs: 245 },
                                { name: 'Recordatorio pago pendiente', trigger: 'Cada 7 días', status: 'active', runs: 89 },
                                { name: 'Actualizar inventario', trigger: 'Tiempo real', status: 'active', runs: 1240 },
                                { name: 'Email bienvenida cliente', trigger: 'Nuevo registro', status: 'active', runs: 156 },
                              ].map((workflow, i) => (
                                <div key={i} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-3 border border-purple-100 dark:border-purple-900">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-bold text-neutral-900 dark:text-white mb-1">{workflow.name}</div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                          🔄 {workflow.trigger}
                                        </div>
                                        <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                                          {workflow.runs} ejecuciones
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-32 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Testimonios</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Lo que dicen nuestros{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                clientes
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base text-neutral-900 dark:text-white">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                          {testimonial.role} · {testimonial.company}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 dark:text-neutral-300">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Números que hablan por sí solos
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Miles de empresas confían en nosotros para gestionar su negocio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '2,500+', label: 'Empresas activas', icon: Users },
              { number: '99.9%', label: 'Uptime garantizado', icon: Shield },
              { number: '50M+', label: 'Facturas procesadas', icon: Zap },
              { number: '24/7', label: 'Soporte técnico', icon: Clock },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-lg text-white/80">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Precios</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Planes para cada{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                tipo de negocio
              </span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              Empieza gratis. Sin tarjeta de crédito.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full ${plan.highlighted
                    ? 'border-purple-600 shadow-xl scale-105'
                    : ''
                    }`}
                >
                  <CardHeader>
                    {plan.highlighted && (
                      <Badge className="w-fit mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        Más popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl text-neutral-900 dark:text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                        {plan.price === 'Custom' ? 'Custom' : `€${plan.price}`}
                      </span>
                      {plan.price !== 'Custom' && (
                        <span className="text-neutral-600 dark:text-neutral-400">/mes</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.highlighted
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        : 'text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
                        }`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.price === 'Custom' ? 'Contactar' : 'Empezar ahora'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">FAQ</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Preguntas frecuentes
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Todo lo que necesitas saber sobre nuestro ERP
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: '¿Necesito conocimientos técnicos para usar el sistema?',
                a: 'No, nuestro ERP está diseñado para ser intuitivo y fácil de usar. Incluye tutoriales interactivos y soporte 24/7.',
              },
              {
                q: '¿Puedo importar mis datos existentes?',
                a: 'Sí, ofrecemos herramientas de importación para Excel, CSV y conexión directa con otros sistemas ERP.',
              },
              {
                q: '¿Cómo funciona la facturación?',
                a: 'Facturamos mensualmente según el plan elegido. Puedes cancelar en cualquier momento sin penalización.',
              },
              {
                q: '¿Los datos están seguros?',
                a: 'Absolutamente. Usamos encriptación de nivel bancario, backups diarios y cumplimos con GDPR y SOC 2.',
              },
              {
                q: '¿Ofrecen periodo de prueba?',
                a: 'Sí, todos los planes incluyen 14 días de prueba gratuita sin necesidad de tarjeta de crédito.',
              },
              {
                q: '¿Puedo cambiar de plan después?',
                a: 'Por supuesto. Puedes actualizar o degradar tu plan en cualquier momento desde el panel de control.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-neutral-900 dark:text-white flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        ?
                      </div>
                      {faq.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 dark:text-neutral-300 pl-9">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              ¿No encuentras lo que buscas?
            </p>
            <Button variant="outline" size="lg" className="text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700">
              Contactar con soporte
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {isAuthenticated
                ? `Accede a tu panel de control.`
                : 'Únete a más de 2,500 empresas que ya están creciendo con nuestro ERP'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-neutral-100 text-lg h-14"
                  >
                    Acceder al Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-neutral-100 text-lg h-14"
                    >
                      Empieza gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 text-lg h-14"
                  >
                    Hablar con ventas
                  </Button>
                </>
              )}
            </div>
            <p className="mt-6 text-sm text-white/80">
              Sin tarjeta de crédito · Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-neutral-900 via-purple-950/50 to-blue-950/50 text-neutral-400 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ERP Sistema</span>
              </div>
              <p className="text-sm text-neutral-400">
                La plataforma todo-en-uno para gestionar tu empresa.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Producto</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Precios</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Integraciones</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Empresa</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Sobre nosotros</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Carreras</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Términos</Link></li>
                <li><Link href="#" className="hover:text-purple-400 dark:hover:text-blue-400 transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-800/50 pt-8 text-sm text-center text-neutral-400">
            <p className="bg-gradient-to-r from-purple-400/80 to-blue-400/80 bg-clip-text text-transparent">
              © 2025 ERP Sistema. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

