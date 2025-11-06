import React, { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Button,
    Stack,
    Chip,
    IconButton,
    Tooltip,
    Paper,
} from '@mui/material';
import { 
    TrendingUp, 
    TrendingDown, 
    AttachMoney, 
    ShoppingCart, 
    Inventory,
    Refresh,
    Download,
    FilterList,
    AutoGraph,
} from '@mui/icons-material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_ACTIVE_AI_MODELS, PREDICT_DEMAND, OPTIMIZE_PRICE, GET_MONTHLY_SALES, GET_TOP_PRODUCTS } from '../../lib/graphql/queries';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

export default function AnalyticsTab() {
    const [timeframe, setTimeframe] = useState('month');
    const [productId, setProductId] = useState<number>(1);
    const [days, setDays] = useState<number>(30);
    const [currentPrice, setCurrentPrice] = useState<number>(299.99);
    const [stock, setStock] = useState<number>(50);

    const { data: aiData, loading: aiLoading, refetch: refetchAI } = useQuery(GET_ACTIVE_AI_MODELS);
    const { data: monthlySalesData, refetch: refetchSales } = useQuery(GET_MONTHLY_SALES, {
        variables: { year: new Date().getFullYear() },
    });
    const { data: topProductsData, refetch: refetchTopProducts } = useQuery(GET_TOP_PRODUCTS, {
        variables: { limit: 5 },
    });
    const { data: predictData, refetch: refetchPrediction } = useQuery(PREDICT_DEMAND, {
        variables: { productId, days },
    });
    const [runOptimizePrice, { data: optimizeData, loading: optimizeLoading }] = useLazyQuery(OPTIMIZE_PRICE);

    const aiModels = useMemo(() => {
        const fallback = { total_models: 0, operational: 0, training: 0, maintenance: 0 } as any;
        return aiData?.activeAIModels ?? fallback;
    }, [aiData]);

    const demandPrediction = predictData?.predictDemand;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('es-ES').format(value);
    };

    // Prepare chart data
    const monthlyChartData = useMemo(() => {
        if (!monthlySalesData?.monthlySales) return [];
        return monthlySalesData.monthlySales.map((month: any) => ({
            name: month.month,
            value: month.totalSales,
        }));
    }, [monthlySalesData]);

    const topProductsChartData = useMemo(() => {
        if (!topProductsData?.topProducts) return [];
        return topProductsData.topProducts.map((product: any) => ({
            name: product.name,
            value: product.totalQuantity,
            sales: product.totalSales,
        }));
    }, [topProductsData]);

    return (
        <Box>
            {/* Header Actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700}>Análisis Detallado</Typography>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Actualizar todos los datos">
                        <IconButton onClick={() => {
                            refetchAI();
                            refetchSales();
                            refetchTopProducts();
                            refetchPrediction();
                        }}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                    <Button variant="outlined" startIcon={<Download />}>
                        Exportar Datos
                    </Button>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Período</InputLabel>
                        <Select
                            value={timeframe}
                            label="Período"
                            onChange={(e) => setTimeframe(e.target.value)}
                        >
                            <MenuItem value="week">Esta Semana</MenuItem>
                            <MenuItem value="month">Este Mes</MenuItem>
                            <MenuItem value="quarter">Este Trimestre</MenuItem>
                            <MenuItem value="year">Este Año</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            {/* Métricas Principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card className="card-hover" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ventas Totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {formatCurrency(245000)}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AttachMoney fontSize="large" />
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <TrendingUp color="success" fontSize="small" />
                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                    +12.5% vs período anterior
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Órdenes Procesadas
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="secondary">
                                        342
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        backgroundColor: 'secondary.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ShoppingCart fontSize="large" />
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                +5.2% vs período anterior
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Modelos IA Activos</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {aiLoading ? '...' : aiModels.operational}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        backgroundColor: 'success.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Inventory fontSize="large" />
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Total: {aiLoading ? '...' : aiModels.total_models} • Training: {aiLoading ? '...' : aiModels.training}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Precisión IA</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="info.main">
                                        94.2%
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        backgroundColor: 'info.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AutoGraph fontSize="large" />
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Modelos operativos en producción
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Monthly Sales Chart */}
                <Grid item xs={12} md={8}>
                    <Card className="card-hover">
                        <CardHeader 
                            title="Tendencia de Ventas Mensuales"
                            action={
                                <Chip icon={<TrendingUp />} label="+12.5%" color="success" size="small" />
                            }
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                    <Bar dataKey="value" fill="#667eea" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Products Pie Chart */}
                <Grid item xs={12} md={4}>
                    <Card className="card-hover">
                        <CardHeader title="Productos Top" />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={topProductsChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {topProductsChartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* AI Predictions Row */}
            <Grid container spacing={3}>
                {/* Demand Prediction */}
                <Grid item xs={12} md={6}>
                    <Card className="card-hover">
                        <CardHeader 
                            title="Predicción de Demanda (IA)" 
                            action={
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        size="small"
                                        label="Producto ID"
                                        type="number"
                                        value={productId}
                                        onChange={(e) => setProductId(Number(e.target.value))}
                                        sx={{ width: 100 }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Días"
                                        type="number"
                                        value={days}
                                        onChange={(e) => setDays(Number(e.target.value))}
                                        sx={{ width: 80 }}
                                    />
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => refetchPrediction({ productId, days })}
                                    >
                                        Actualizar
                                    </Button>
                                </Stack>
                            }
                        />
                        <CardContent>
                            <Box sx={{ display: 'grid', gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Producto {productId} • Horizonte: {days} días
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="primary">
                                        {demandPrediction ? `${formatNumber(demandPrediction.predicted_units)} uds` : '...'}
                                    </Typography>
                                </Box>
                                {demandPrediction && (
                                    <>
                                        <Chip 
                                            icon={<AutoGraph />}
                                            label={`Confianza: ${(Number(demandPrediction.confidence) * 100).toFixed(0)}%`} 
                                            color="success" 
                                        />
                                        {demandPrediction.recommendations && demandPrediction.recommendations.length > 0 && (
                                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                    Recomendaciones:
                                                </Typography>
                                                {demandPrediction.recommendations.map((r: string, i: number) => (
                                                    <Typography key={i} variant="body2" display="block">• {r}</Typography>
                                                ))}
                                            </Paper>
                                        )}
                                    </>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Price Optimization */}
                <Grid item xs={12} md={6}>
                    <Card className="card-hover">
                        <CardHeader title="Optimización de Precios (IA)" />
                        <CardContent>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                <TextField
                                    size="small"
                                    label="Precio Actual"
                                    type="number"
                                    value={currentPrice}
                                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                                />
                                <TextField
                                    size="small"
                                    label="Stock"
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                />
                                <Button
                                    variant="contained"
                                    disabled={optimizeLoading}
                                    onClick={() => runOptimizePrice({ variables: { productId, currentPrice, stock } })}
                                >
                                    {optimizeLoading ? 'Calculando...' : 'Calcular'}
                                </Button>
                            </Box>
                            {optimizeData?.optimizePrice && (
                                <Box sx={{ display: 'grid', gap: 1 }}>
                                    <Typography variant="body1" fontWeight={600}>
                                        Precio Óptimo: {formatCurrency(optimizeData.optimizePrice.optimal_price)}
                                    </Typography>
                                    <Chip 
                                        label={`Cambio: ${optimizeData.optimizePrice.price_change_percentage}%`}
                                        color={Number(optimizeData.optimizePrice.price_change_percentage) >= 0 ? 'success' : 'warning'}
                                    />
                                    <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            Incremento esperado:
                                        </Typography>
                                        <Typography variant="h6" color="success.main">
                                            {formatCurrency(optimizeData.optimizePrice.expected_revenue_increase)}
                                        </Typography>
                                    </Paper>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
