import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    Card,
    CardContent,
    Button,
    Grid,
    Stack,
    IconButton,
    Tooltip,
    Avatar,
} from '@mui/material';
import {
    PointOfSale,
    Receipt,
    People,
    TrendingUp,
    AddCircle,
    Refresh,
    AttachMoney,
    ShoppingCart,
} from '@mui/icons-material';
import SalesOrdersTab from '../components/sales/SalesOrdersTab';
import SalesInvoicesTab from '../components/sales/SalesInvoicesTab';
import CustomersTab from '../components/sales/CustomersTab';

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

export default function SalesPage() {
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // Datos demo - Resumen financiero de ventas
    const salesMetrics = {
        totalSales: 245680.50,
        salesOrders: 89,
        invoiced: 198450.30,
        pending: 47230.20,
        customers: 156,
        avgOrderValue: 2760.23,
    };

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
                        <PointOfSale sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Módulo de Ventas
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestión de órdenes de venta, facturas y clientes
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Actualizar datos">
                            <IconButton onClick={handleRefresh} color="primary">
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="contained" startIcon={<AddCircle />}>
                            Nueva Venta
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* KPIs Principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ventas Totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="success.main">
                                        {formatCurrency(salesMetrics.totalSales)}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                                        <TrendingUp fontSize="small" color="success" />
                                        <Typography variant="caption" color="success.main">
                                            +18.3% vs mes anterior
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

                <Grid item xs={12} md={4}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Órdenes de Venta
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800}>
                                        {salesMetrics.salesOrders}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Valor promedio: {formatCurrency(salesMetrics.avgOrderValue)}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <ShoppingCart sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Clientes Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="info.main">
                                        {salesMetrics.customers}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Base de clientes
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                                    <People sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Estado de Facturación */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Receipt color="success" />
                                <Typography variant="h6" fontWeight={600}>
                                    Facturado
                                </Typography>
                            </Stack>
                            <Typography variant="h3" fontWeight={800} color="success.main">
                                {formatCurrency(salesMetrics.invoiced)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {((salesMetrics.invoiced / salesMetrics.totalSales) * 100).toFixed(1)}% del total
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Receipt color="warning" />
                                <Typography variant="h6" fontWeight={600}>
                                    Pendiente de Facturar
                                </Typography>
                            </Stack>
                            <Typography variant="h3" fontWeight={800} color="warning.main">
                                {formatCurrency(salesMetrics.pending)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {((salesMetrics.pending / salesMetrics.totalSales) * 100).toFixed(1)}% del total
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
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
                    <Tab icon={<ShoppingCart />} iconPosition="start" label="Órdenes de Venta" />
                    <Tab icon={<Receipt />} iconPosition="start" label="Facturas" />
                    <Tab icon={<People />} iconPosition="start" label="Clientes" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <SalesOrdersTab />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <SalesInvoicesTab />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <CustomersTab />
                </TabPanel>
            </Paper>
        </Container>
    );
}
