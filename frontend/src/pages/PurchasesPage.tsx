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
    ShoppingBag,
    Receipt,
    Business,
    TrendingDown,
    AddCircle,
    Refresh,
    AttachMoney,
    LocalShipping,
} from '@mui/icons-material';
import PurchaseOrdersTab from '../components/purchases/PurchaseOrdersTab';
import SuppliersTab from '../components/purchases/SuppliersTab';

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

export default function PurchasesPage() {
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // Datos demo - Resumen financiero de compras
    const purchaseMetrics = {
        totalPurchases: 156420.30,
        purchaseOrders: 67,
        received: 134200.50,
        pending: 22219.80,
        suppliers: 45,
        avgOrderValue: 2334.63,
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
                        <ShoppingBag sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Módulo de Compras
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestión de órdenes de compra, recepciones y proveedores
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
                            Nueva Compra
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
                                        Compras Totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="error.main">
                                        {formatCurrency(purchaseMetrics.totalPurchases)}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                                        <TrendingDown fontSize="small" color="success" />
                                        <Typography variant="caption" color="success.main">
                                            -5.2% vs mes anterior
                                        </Typography>
                                    </Box>
                                </Box>
                                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
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
                                        Órdenes de Compra
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800}>
                                        {purchaseMetrics.purchaseOrders}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Valor promedio: {formatCurrency(purchaseMetrics.avgOrderValue)}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <LocalShipping sx={{ fontSize: 32 }} />
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
                                        Proveedores Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="info.main">
                                        {purchaseMetrics.suppliers}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Red de proveedores
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                                    <Business sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Estado de Recepciones */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Receipt color="success" />
                                <Typography variant="h6" fontWeight={600}>
                                    Recibido
                                </Typography>
                            </Stack>
                            <Typography variant="h3" fontWeight={800} color="success.main">
                                {formatCurrency(purchaseMetrics.received)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {((purchaseMetrics.received / purchaseMetrics.totalPurchases) * 100).toFixed(1)}% del total
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
                                    Pendiente de Recibir
                                </Typography>
                            </Stack>
                            <Typography variant="h3" fontWeight={800} color="warning.main">
                                {formatCurrency(purchaseMetrics.pending)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {((purchaseMetrics.pending / purchaseMetrics.totalPurchases) * 100).toFixed(1)}% del total
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
                    <Tab icon={<LocalShipping />} iconPosition="start" label="Órdenes de Compra" />
                    <Tab icon={<Business />} iconPosition="start" label="Proveedores" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <PurchaseOrdersTab />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <SuppliersTab />
                </TabPanel>
            </Paper>
        </Container>
    );
}
