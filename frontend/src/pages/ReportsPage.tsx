import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    Button,
    Stack,
    IconButton,
    Tooltip,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Assessment,
    PictureAsPdf,
    Description,
    BarChart,
    Timeline,
    PieChart,
    TrendingUp,
    Refresh,
    Download,
    Print,
    AttachMoney,
    Inventory,
    ShoppingBag,
} from '@mui/icons-material';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ReportsPage() {
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // Datos demo - Resumen financiero
    const financialMetrics = {
        totalSales: 245680.50,
        totalPurchases: 156420.30,
        netProfit: 89260.20,
        profitMargin: 36.3,
    };

    // Datos demo - Ventas mensuales
    const monthlySales = [
        { month: 'Ene', sales: 18500, purchases: 12300, profit: 6200 },
        { month: 'Feb', sales: 22300, purchases: 14100, profit: 8200 },
        { month: 'Mar', sales: 19800, purchases: 13500, profit: 6300 },
        { month: 'Abr', sales: 25600, purchases: 15800, profit: 9800 },
        { month: 'May', sales: 28900, purchases: 17200, profit: 11700 },
        { month: 'Jun', sales: 31200, purchases: 18900, profit: 12300 },
        { month: 'Jul', sales: 27800, purchases: 16500, profit: 11300 },
        { month: 'Ago', sales: 29500, purchases: 17800, profit: 11700 },
        { month: 'Sep', sales: 33100, purchases: 19200, profit: 13900 },
        { month: 'Oct', sales: 35400, purchases: 20500, profit: 14900 },
        { month: 'Nov', sales: 38200, purchases: 21800, profit: 16400 },
        { month: 'Dic', sales: 42500, purchases: 24200, profit: 18300 },
    ];

    // Datos demo - Top productos
    const topProducts = [
        { name: 'Laptop Dell XPS', sales: 67500, quantity: 45 },
        { name: 'iPhone 14 Pro', sales: 85800, quantity: 78 },
        { name: 'Samsung Galaxy S23', sales: 55800, quantity: 62 },
        { name: 'MacBook Pro M2', sales: 76000, quantity: 38 },
        { name: 'iPad Air', sales: 32400, quantity: 54 },
    ];

    // Datos demo - Distribución de ventas por categoría
    const salesByCategory = [
        { name: 'Laptops', value: 125000, percentage: 27.4 },
        { name: 'Smartphones', value: 98000, percentage: 21.5 },
        { name: 'Monitores', value: 67000, percentage: 14.7 },
        { name: 'Accesorios', value: 45000, percentage: 9.8 },
        { name: 'Tablets', value: 56000, percentage: 12.3 },
        { name: 'Otros', value: 64680, percentage: 14.3 },
    ];

    const COLORS = ['#667eea', '#48bb78', '#ed8936', '#9f7aea', '#38b2ac', '#f56565'];

    // Reportes disponibles
    const reports = [
        {
            id: 1,
            title: 'Reporte de Ventas Mensual',
            description: 'Análisis de ventas del mes actual',
            icon: <BarChart fontSize="large" />,
            type: 'sales',
            color: '#667eea',
        },
        {
            id: 2,
            title: 'Reporte de Inventario',
            description: 'Estado actual de productos y stock',
            icon: <Assessment fontSize="large" />,
            type: 'inventory',
            color: '#48bb78',
        },
        {
            id: 3,
            title: 'Reporte de Compras',
            description: 'Análisis de compras y proveedores',
            icon: <Timeline fontSize="large" />,
            type: 'purchases',
            color: '#9f7aea',
        },
        {
            id: 4,
            title: 'Reporte Financiero',
            description: 'Balance y estado financiero',
            icon: <PieChart fontSize="large" />,
            type: 'financial',
            color: '#ed8936',
        },
    ];

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    };

    return (
        <Container maxWidth="xl" className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Reportes y Análisis
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Informes detallados y análisis de datos empresariales
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Actualizar datos">
                            <IconButton onClick={handleRefresh} color="primary">
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="outlined" startIcon={<Print />}>
                            Imprimir
                        </Button>
                        <Button variant="contained" startIcon={<Download />}>
                            Exportar
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* KPIs Principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ventas Totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="success.main">
                                        {formatCurrency(financialMetrics.totalSales)}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                                        <TrendingUp fontSize="small" color="success" />
                                        <Typography variant="caption" color="success.main">
                                            +18.3% vs anterior
                                        </Typography>
                                    </Box>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                                    <AttachMoney sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Compras Totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="error.main">
                                        {formatCurrency(financialMetrics.totalPurchases)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Costos operativos
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                                    <ShoppingBag sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Beneficio Neto
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="primary.main">
                                        {formatCurrency(financialMetrics.netProfit)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Margen: {financialMetrics.profitMargin}%
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <TrendingUp sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Margen de Beneficio
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="info.main">
                                        {financialMetrics.profitMargin}%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Rentabilidad
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                                    <Assessment sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Reportes Disponibles */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Reportes Disponibles
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {reports.map((report) => (
                            <Grid item xs={12} sm={6} md={3} key={report.id}>
                                <Paper
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <Box sx={{ color: report.color, mb: 1 }}>
                                        {report.icon}
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        {report.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        {report.description}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                                        <Button size="small" startIcon={<PictureAsPdf />}>
                                            PDF
                                        </Button>
                                        <Button size="small" startIcon={<Description />}>
                                            Excel
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Tabs de Análisis */}
            <Paper sx={{ borderRadius: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, v) => setTabValue(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            minHeight: 64,
                        },
                    }}
                >
                    <Tab icon={<BarChart />} iconPosition="start" label="Ventas Mensuales" />
                    <Tab icon={<Timeline />} iconPosition="start" label="Top Productos" />
                    <Tab icon={<PieChart />} iconPosition="start" label="Por Categoría" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={monthlySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#667eea" name="Ventas" />
                                <Bar dataKey="purchases" fill="#ed8936" name="Compras" />
                                <Bar dataKey="profit" fill="#48bb78" name="Beneficio" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#667eea" name="Ventas (€)" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ height: 400 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={salesByCategory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.percentage}%`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {salesByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                {salesByCategory.map((category, index) => (
                                    <Paper key={index} sx={{ p: 2 }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Box
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: 1,
                                                        bgcolor: COLORS[index % COLORS.length],
                                                    }}
                                                />
                                                <Typography variant="body2" fontWeight={600}>
                                                    {category.name}
                                                </Typography>
                                            </Stack>
                                            <Stack alignItems="flex-end">
                                                <Typography variant="h6" fontWeight={700}>
                                                    {formatCurrency(category.value)}
                                                </Typography>
                                                <Chip label={`${category.percentage}%`} size="small" />
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        </Container>
    );
}
