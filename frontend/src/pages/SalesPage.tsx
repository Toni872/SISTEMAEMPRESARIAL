import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
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
    Chip,
} from '@mui/material';
import {
    PointOfSale,
    Receipt,
    People,
    TrendingUp,
    AddCircle,
    ShoppingCart,
    Refresh,
    Download,
    Assessment,
    Dashboard,
} from '@mui/icons-material';
import SalesOrdersTab from '../components/sales/SalesOrdersTab';
import SalesInvoicesTab from '../components/sales/SalesInvoicesTab';
import CustomersTab from '../components/sales/CustomersTab';
import { GET_FINANCIAL_SUMMARY } from '../lib/graphql/queries';

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

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Fetch real financial data
    const { data: financialData, loading: financialLoading } = useQuery(GET_FINANCIAL_SUMMARY);

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
                            <IconButton>
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="outlined" startIcon={<Download />}>
                            Exportar
                        </Button>
                        <Button variant="contained" startIcon={<AddCircle />}>
                            Nueva Venta
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
                                        <ShoppingCart sx={{ fontSize: 32, color: 'primary.main' }} />
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
                                            Total Órdenes
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {financialData.financialSummary.totalOrders}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'success.light', borderRadius: 2, p: 2 }}>
                                        <PointOfSale sx={{ fontSize: 32, color: 'success.main' }} />
                                    </Box>
                                </Stack>
                                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                                    <TrendingUp fontSize="small" color="success" />
                                    <Typography variant="caption" color="success.main">
                                        +8.2% vs mes anterior
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
                                            Facturas Pendientes
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="warning.main">
                                            {financialData.financialSummary.pendingOrders}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'warning.light', borderRadius: 2, p: 2 }}>
                                        <Receipt sx={{ fontSize: 32, color: 'warning.main' }} />
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
                                            Clientes Activos
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="info.main">
                                            156
                                        </Typography>
                                    </Box>
                                    <Box sx={{ bgcolor: 'info.light', borderRadius: 2, p: 2 }}>
                                        <People sx={{ fontSize: 32, color: 'info.main' }} />
                                    </Box>
                                </Stack>
                                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                                    <TrendingUp fontSize="small" color="success" />
                                    <Typography variant="caption" color="success.main">
                                        +15.8% vs mes anterior
                                    </Typography>
                                </Box>
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
                    <Tab
                        icon={<ShoppingCart />}
                        iconPosition="start"
                        label="Órdenes de Venta"
                    />
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
