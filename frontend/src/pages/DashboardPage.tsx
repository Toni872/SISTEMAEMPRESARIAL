import { useQuery } from '@apollo/client';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
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
  Error,
  Schedule,
  Info,
  Download,
  BarChart,
  Analytics,
} from '@mui/icons-material';
import { useAuthStore } from '../store/auth.store';
import type { Product } from '../types';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  GET_FINANCIAL_SUMMARY,
  GET_INVENTORY_VALUE,
  GET_LOW_STOCK_PRODUCTS,
  GET_MONTHLY_SALES,
  GET_TOP_PRODUCTS,
  GET_DASHBOARD_METRICS,
  GET_PERFORMANCE_DATA,
} from '../lib/graphql/queries';

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

  const { data: financialData, loading: financialLoading, error: financialError, refetch: refetchFinancial } =
    useQuery(GET_FINANCIAL_SUMMARY, {
      skip: user?.role === 'USER' || user?.role === 'READONLY',
      errorPolicy: 'all',
    });

  const { data: inventoryData, loading: inventoryLoading, refetch: refetchInventory } = useQuery(
    GET_INVENTORY_VALUE,
    { errorPolicy: 'all' }
  );

  const { data: lowStockData, loading: lowStockLoading } = useQuery(
    GET_LOW_STOCK_PRODUCTS,
    { errorPolicy: 'all' }
  );

  const { data: monthlySalesData, loading: monthlySalesLoading } = useQuery(
    GET_MONTHLY_SALES,
    {
      variables: { year: new Date().getFullYear() },
      skip: user?.role === 'USER' || user?.role === 'READONLY',
      errorPolicy: 'all',
    }
  );

  const { data: topProductsData, loading: topProductsLoading } = useQuery(
    GET_TOP_PRODUCTS,
    {
      variables: { limit: 5 },
      skip: user?.role === 'USER' || user?.role === 'READONLY',
      errorPolicy: 'all',
    }
  );

  const { data: dashboardMetrics, loading: dashboardMetricsLoading } = useQuery(
    GET_DASHBOARD_METRICS
  );

  const { data: performanceData, loading: performanceLoading } = useQuery(
    GET_PERFORMANCE_DATA,
    {
      variables: { period: 'year' },
      skip: user?.role === 'USER' || user?.role === 'READONLY',
    }
  );

  const canViewFinancials = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleRefresh = () => {
    refetchFinancial();
    refetchInventory();
  };

  const handleClearCache = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el caché y cerrar sesión?')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  // Mostrar loading solo para datos críticos
  if (inventoryLoading || lowStockLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

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

            {/* Ocultar errores de red - modo visual sin backend */}
      {financialError && import.meta.env.DEV && financialError.networkError && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetchFinancial()}>
              Reintentar
            </Button>
          }
        >
          <AlertTitle>Modo Visual</AlertTitle>
          El backend no está disponible. Mostrando datos de ejemplo.
        </Alert>
      )}

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
