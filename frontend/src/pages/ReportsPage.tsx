import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
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
    Analytics,
    Print,
} from '@mui/icons-material';
import AnalyticsTab from '../components/reports/AnalyticsTab';
import { GET_FINANCIAL_SUMMARY, GET_MONTHLY_SALES, GET_TOP_PRODUCTS } from '../lib/graphql/queries';

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

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Fetch real data
    const { data: financialData, loading: financialLoading } = useQuery(GET_FINANCIAL_SUMMARY);
    const { data: monthlySalesData } = useQuery(GET_MONTHLY_SALES, {
        variables: { year: new Date().getFullYear() },
    });
    const { data: topProductsData } = useQuery(GET_TOP_PRODUCTS, {
        variables: { limit: 5 },
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    };

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
        {
            id: 5,
            title: 'Reporte de Clientes',
            description: 'Análisis de clientes y segmentación',
            icon: <Assessment fontSize="large" />,
            type: 'customers',
            color: '#4299e1',
        },
        {
            id: 6,
            title: 'Reporte de Proveedores',
            description: 'Rendimiento y análisis de proveedores',
            icon: <Timeline fontSize="large" />,
            type: 'suppliers',
            color: '#f56565',
        },
    ];

    return (
        <Container maxWidth="xl" className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Reportes y Análisis
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Genera reportes detallados de todas las áreas del sistema
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Actualizar datos">
                            <IconButton>
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="outlined" startIcon={<Download />}>
                            Exportar
                        </Button>
                        <Button variant="contained" startIcon={<Print />}>
                            Imprimir
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* KPIs Overview */}
            {!financialLoading && financialData && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Ventas Totales
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="primary.main">
                                            {formatCurrency(financialData.financialSummary.totalSales)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'primary.light', borderRadius: 2, p: 2 }}>
                                        <BarChart sx={{ fontSize: 32, color: 'primary.main' }} />
                                    </Box>
                                </Stack>
                                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                                    <TrendingUp fontSize="small" color="success" />
                                    <Typography variant="caption" color="success.main">
                                        +12.5% vs mes anterior
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Compras Totales
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="secondary.main">
                                            {formatCurrency(financialData.financialSummary.totalPurchases)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'secondary.light', borderRadius: 2, p: 2 }}>
                                        <Timeline sx={{ fontSize: 32, color: 'secondary.main' }} />
                                    </Box>
                                </Stack>
                                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                                    <TrendingUp fontSize="small" color="success" />
                                    <Typography variant="caption" color="success.main">
                                        +8.4% vs mes anterior
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Ganancia Neta
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="success.main">
                                            {formatCurrency(financialData.financialSummary.totalSales - financialData.financialSummary.totalPurchases)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'success.light', borderRadius: 2, p: 2 }}>
                                        <TrendingUp sx={{ fontSize: 32, color: 'success.main' }} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Productos Top
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="info.main">
                                            {topProductsData?.topProducts?.length || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'info.light', borderRadius: 2, p: 2 }}>
                                        <PieChart sx={{ fontSize: 32, color: 'info.main' }} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Paper elevation={2} sx={{ mt: 3, borderRadius: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
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
                    <Tab icon={<Assessment />} iconPosition="start" label="Reportes Disponibles" />
                    <Tab icon={<BarChart />} iconPosition="start" label="Análisis Avanzado" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        {reports.map((report) => (
                            <Grid item xs={12} sm={6} md={4} key={report.id}>
                                <Card
                                    className="card-hover"
                                    sx={{
                                        height: '100%',
                                        transition: 'all 0.3s ease',
                                        border: 1,
                                        borderColor: 'divider',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            borderColor: report.color,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 2,
                                                    backgroundColor: report.color,
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 2,
                                                }}
                                            >
                                                {report.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                {report.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mb={2}>
                                                {report.description}
                                            </Typography>
                                            <Stack spacing={1} sx={{ width: '100%' }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<PictureAsPdf />}
                                                    fullWidth
                                                    sx={{ bgcolor: report.color, '&:hover': { bgcolor: report.color, opacity: 0.9 } }}
                                                >
                                                    Generar PDF
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Description />}
                                                    fullWidth
                                                    sx={{ borderColor: report.color, color: report.color }}
                                                >
                                                    Ver en Pantalla
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <AnalyticsTab />
                </TabPanel>
            </Paper>
        </Container>
    );
}
