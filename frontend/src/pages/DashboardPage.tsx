import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Stack,
  Button,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  ShoppingCart,
  People,
  AttachMoney,
  Warning,
  LocalShipping,
  Refresh,
  Assessment,
  Speed,
  Autorenew,
  Timeline,
  CheckCircle,
  Schedule,
  Info,
  Download,
  BarChart,
  Analytics,
} from '@mui/icons-material';
import { useAuthStore } from '../store/auth.store';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

const formatNumber = (n: number) => n.toLocaleString('es-ES');

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  action?: React.ReactNode;
}

function StatCard({ title, value, icon, color, subtitle, trend, action }: StatCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box flex={1}>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'fit-content',
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend.isPositive ? (
              <TrendingUp color="success" fontSize="small" />
            ) : (
              <TrendingDown color="error" fontSize="small" />
            )}
            <Typography
              variant="caption"
              color={trend.isPositive ? 'success.main' : 'error.main'}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              vs mes anterior
            </Typography>
          </Box>
        )}
        {action && <Box sx={{ mt: 2 }}>{action}</Box>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [refreshKey, setRefreshKey] = useState(0);

  // Datos demo - Resumen financiero
  const financialData = {
    financialSummary: {
      totalSales: 245680.50,
      totalPurchases: 156420.30,
      netProfit: 89260.20,
      profitMargin: 36.3,
      totalOrders: 156,
      salesOrdersCount: 89,
    }
  };

  // Datos demo - Valor de inventario
  const inventoryData = {
    inventoryValue: {
      totalValue: 456789.25,
      totalProducts: 234,
      lowStockProducts: 12,
      outOfStockProducts: 3,
    }
  };

  // Datos demo - Productos con stock bajo
  const lowStockData = {
    lowStockProducts: [
      { id: 1, name: 'Laptop HP ProBook', sku: 'LAP-HP-001', stock: 3, minStock: 10 },
      { id: 2, name: 'Mouse Logitech MX', sku: 'MOU-LOG-002', stock: 5, minStock: 15 },
      { id: 3, name: 'Teclado Mecánico', sku: 'KEY-MEC-003', stock: 2, minStock: 8 },
      { id: 4, name: 'Monitor Dell 27"', sku: 'MON-DEL-004', stock: 4, minStock: 12 },
    ]
  };

  // Datos demo - Ventas mensuales
  const monthlySalesData = {
    monthlySales: [
      { month: 'Ene', total: 18500 },
      { month: 'Feb', total: 22300 },
      { month: 'Mar', total: 19800 },
      { month: 'Abr', total: 25600 },
      { month: 'May', total: 28900 },
      { month: 'Jun', total: 31200 },
      { month: 'Jul', total: 27800 },
      { month: 'Ago', total: 29500 },
      { month: 'Sep', total: 33100 },
      { month: 'Oct', total: 35400 },
      { month: 'Nov', total: 38200 },
      { month: 'Dic', total: 42500 },
    ]
  };

  // Datos demo - Top productos
  const topProductsData = {
    topProducts: [
      { productId: 1, productName: 'Laptop Dell XPS 15', totalQuantity: 45, totalRevenue: 67500 },
      { productId: 2, productName: 'iPhone 14 Pro', totalQuantity: 78, totalRevenue: 85800 },
      { productId: 3, productName: 'Samsung Galaxy S23', totalQuantity: 62, totalRevenue: 55800 },
      { productId: 4, productName: 'MacBook Pro M2', totalQuantity: 38, totalRevenue: 76000 },
      { productId: 5, productName: 'iPad Air', totalQuantity: 54, totalRevenue: 32400 },
    ]
  };

  // Datos demo - Métricas del dashboard
  const dashboardMetrics = {
    dashboardMetrics: {
      operationalEfficiency: 94.5,
      operationalEfficiencyTrend: 5.2,
      processAutomation: 87.3,
      processAutomationTrend: 8.1,
      aiModels: {
        active: 32,
        training: 5,
      },
      roi: {
        percentage: 42.8,
        operationalSavings: 125000,
      }
    }
  };

  // Datos demo - Datos de rendimiento
  const performanceData = {
    performanceData: [
      { month: 'Ene', efficiency: 88, automation: 82, sales: 75 },
      { month: 'Feb', efficiency: 90, automation: 84, sales: 78 },
      { month: 'Mar', efficiency: 89, automation: 85, sales: 76 },
      { month: 'Abr', efficiency: 91, automation: 86, sales: 80 },
      { month: 'May', efficiency: 93, automation: 87, sales: 82 },
      { month: 'Jun', efficiency: 94, automation: 88, sales: 85 },
    ]
  };

  const canViewFinancials = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClearCache = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el caché y cerrar sesión?')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dashboard Principal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenido, {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rol: <strong>{user?.role}</strong>
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Actualizar datos">
              <IconButton onClick={handleRefresh} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
            {canViewFinancials && (
              <>
                <Button startIcon={<Download />} variant="outlined" size="small">
                  Exportar
                </Button>
                <Button startIcon={<BarChart />} variant="contained" size="small">
                  Ver Reporte Completo
                </Button>
              </>
            )}
            <Tooltip title="Limpiar caché (útil si hay errores de autenticación)">
              <IconButton onClick={handleClearCache} color="warning">
                <Info />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* KPIs Principales */}
      <Grid container spacing={3}>
        {canViewFinancials && financialData && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Ventas Totales"
                value={formatCurrency(financialData.financialSummary.totalSales)}
                icon={<AttachMoney sx={{ fontSize: 32, color: 'success.main' }} />}
                color="#4caf50"
                subtitle={`${financialData.financialSummary.totalOrders} órdenes`}
                trend={{ value: 12.5, isPositive: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Compras Totales"
                value={formatCurrency(financialData.financialSummary.totalPurchases)}
                icon={<LocalShipping sx={{ fontSize: 32, color: 'warning.main' }} />}
                color="#ff9800"
                subtitle={`${financialData.financialSummary.totalOrders} órdenes`}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Ganancia Neta"
                value={formatCurrency(financialData.financialSummary.netProfit)}
                icon={<TrendingUp sx={{ fontSize: 32, color: 'primary.main' }} />}
                color="#2196f3"
                subtitle={`Margen: ${financialData.financialSummary.profitMargin.toFixed(1)}%`}
                trend={{
                  value: financialData.financialSummary.profitMargin,
                  isPositive: financialData.financialSummary.profitMargin > 0,
                }}
              />
            </Grid>
          </>
        )}

        {inventoryData && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Valor de Inventario"
                value={formatCurrency(inventoryData.inventoryValue.totalValue)}
                icon={<Inventory sx={{ fontSize: 32, color: 'info.main' }} />}
                color="#00bcd4"
                subtitle={`${inventoryData.inventoryValue.totalProducts} productos`}
                trend={inventoryData.inventoryValue.lowStockProducts > 0 ? { value: inventoryData.inventoryValue.lowStockProducts * 5, isPositive: false } : undefined}
              />
            </Grid>

            {inventoryData.inventoryValue.lowStockProducts > 0 && (
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Stock Bajo"
                  value={inventoryData.inventoryValue.lowStockProducts}
                  icon={<Warning sx={{ fontSize: 32, color: 'error.main' }} />}
                  color="#f44336"
                  subtitle="Productos con stock crítico"
                  action={
                    <Button size="small" variant="outlined" color="error" startIcon={<Warning />}>
                      Ver Alertas
                    </Button>
                  }
                />
              </Grid>
            )}
          </>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Órdenes de Venta"
            value={financialData?.financialSummary.salesOrdersCount || 0}
            icon={<ShoppingCart sx={{ fontSize: 32, color: 'secondary.main' }} />}
            color="#9c27b0"
            subtitle="Total de órdenes"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios Activos"
            value="4"
            icon={<People sx={{ fontSize: 32, color: 'success.dark' }} />}
            color="#388e3c"
            subtitle="En el sistema"
          />
        </Grid>
      </Grid>

      {/* Métricas Avanzadas */}
      {canViewFinancials && dashboardMetrics && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Eficiencia Operacional
                  </Typography>
                  <Speed sx={{ fontSize: 28, color: 'primary.main' }} />
                </Stack>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {dashboardMetrics.dashboardMetrics.operationalEfficiency.toFixed(1)}%
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TrendingUp fontSize="small" color="success" />
                  <Typography variant="caption" color="success.main">
                    +{dashboardMetrics.dashboardMetrics.operationalEfficiencyTrend?.toFixed(1) || 0}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Automatización
                  </Typography>
                  <Autorenew sx={{ fontSize: 28, color: 'warning.main' }} />
                </Stack>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {dashboardMetrics.dashboardMetrics.processAutomation.toFixed(1)}%
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TrendingUp fontSize="small" color="success" />
                  <Typography variant="caption" color="success.main">
                    +{dashboardMetrics.dashboardMetrics.processAutomationTrend?.toFixed(1) || 0}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Modelos IA Activos
                  </Typography>
                  <Assessment sx={{ fontSize: 28, color: 'info.main' }} />
                </Stack>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {dashboardMetrics.dashboardMetrics.aiModels.active}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dashboardMetrics.dashboardMetrics.aiModels.training} en entrenamiento
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    ROI
                  </Typography>
                  <Timeline sx={{ fontSize: 28, color: 'success.main' }} />
                </Stack>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {dashboardMetrics.dashboardMetrics.roi.percentage.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="success.main">
                  €{formatNumber(Math.round(dashboardMetrics.dashboardMetrics.roi.operationalSavings))} ahorros
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Gráficos y Análisis */}
      {canViewFinancials && monthlySalesData && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={700}>
                    Ventas Mensuales
                  </Typography>
                  <Button size="small" startIcon={<Download />}>
                    Exportar
                  </Button>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={monthlySalesData.monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#1976d2" name="Ventas (€)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Top 5 Productos
                </Typography>
                <List>
                  {topProductsData?.topProducts?.map((product: any, index: number) => (
                    <ListItem key={product.productId} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.productName}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {formatNumber(product.totalQuantity)} unidades
                            </Typography>
                            <Typography component="span" variant="body2" fontWeight={600} color="primary.main" sx={{ ml: 1 }}>
                              {formatCurrency(product.totalRevenue)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Performance Trend */}
      {canViewFinancials && performanceData && performanceData.performanceData && performanceData.performanceData.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={700}>
                    Tendencia de Rendimiento
                  </Typography>
                  <Button size="small" startIcon={<Analytics />}>
                    Ver Detalles
                  </Button>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <RechartsTooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="efficiency" stroke="#2196f3" name="Eficiencia" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="automation" stroke="#4caf50" name="Automatización" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#ff9800" name="Ventas" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Alertas de Stock Bajo */}
      {lowStockData && lowStockData.lowStockProducts.length > 0 && (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="error" />
                <Typography variant="h6" fontWeight="bold">
                  Alertas de Stock Bajo
                </Typography>
                <Chip label={lowStockData.lowStockProducts.length} color="error" size="small" />
              </Box>
              <Button size="small" startIcon={<ShoppingCart />}>
                Crear Orden Compra
              </Button>
            </Box>
            <Grid container spacing={2}>
              {lowStockData.lowStockProducts.map((product: Product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        SKU: {product.sku}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          Stock: <strong>{product.stock}</strong>
                        </Typography>
                        <Typography variant="body2" color="error">
                          Mínimo: {product.minStock}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(product.stock / product.minStock) * 100}
                          color="error"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      )}

      {/* Info para Roles con Permisos Limitados */}
      {!canViewFinancials && (
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Alert severity="info" icon={<Info />}>
            Tu rol actual ({user?.role}) no tiene permisos para ver información financiera completa.
          </Alert>
        </Grid>
      )}

      {/* Resumen Rápido de Acciones */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Acciones Rápidas
              </Typography>
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Button variant="outlined" startIcon={<ShoppingCart />} fullWidth size="large" sx={{ justifyContent: 'flex-start' }}>
                  Nueva Orden de Venta
                </Button>
                <Button variant="outlined" startIcon={<LocalShipping />} fullWidth size="large" sx={{ justifyContent: 'flex-start' }}>
                  Nueva Orden de Compra
                </Button>
                <Button variant="outlined" startIcon={<Inventory />} fullWidth size="large" sx={{ justifyContent: 'flex-start' }}>
                  Agregar Producto
                </Button>
                <Button variant="outlined" startIcon={<People />} fullWidth size="large" sx={{ justifyContent: 'flex-start' }}>
                  Gestionar Usuarios
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Estado del Sistema
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2">Módulo de Ventas</Typography>
                  </Box>
                  <Chip label="Operativo" color="success" size="small" />
                </Box>
                <Divider />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2">Módulo de Inventario</Typography>
                  </Box>
                  <Chip label="Operativo" color="success" size="small" />
                </Box>
                <Divider />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2">Módulo de IA</Typography>
                  </Box>
                  <Chip label="Operativo" color="success" size="small" />
                </Box>
                <Divider />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule color="info" />
                    <Typography variant="body2">Última actualización</Typography>
                  </Box>
                  <Typography variant="caption">{new Date().toLocaleTimeString('es-ES')}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
