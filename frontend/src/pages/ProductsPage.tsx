import { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Avatar,
    LinearProgress,
} from '@mui/material';
import {
    Inventory,
    Add,
    Refresh,
    TrendingUp,
    Warning,
    AttachMoney,
    Assessment,
    ShoppingCart,
} from '@mui/icons-material';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductImportExport from '../components/products/ProductImportExport';

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

export default function ProductsPage() {
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // Datos demo - Resumen de inventario
    const inventoryMetrics = {
        totalProducts: 234,
        totalValue: 456789.25,
        lowStockProducts: 12,
        outOfStockProducts: 3,
        totalCategories: 18,
        avgPrice: 1951.66,
    };

    // Datos demo - Productos con stock bajo
    const lowStockProducts = [
        { id: 1, name: 'Laptop HP ProBook', sku: 'LAP-HP-001', stock: 3, minStock: 10, price: 899.99 },
        { id: 2, name: 'Mouse Logitech MX', sku: 'MOU-LOG-002', stock: 5, minStock: 15, price: 79.99 },
        { id: 3, name: 'Teclado Mecánico', sku: 'KEY-MEC-003', stock: 2, minStock: 8, price: 149.99 },
        { id: 4, name: 'Monitor Dell 27"', sku: 'MON-DEL-004', stock: 4, minStock: 12, price: 399.99 },
    ];

    // Datos demo - Categorías top
    const topCategories = [
        { name: 'Laptops', products: 45, value: 125000, percentage: 27.4 },
        { name: 'Smartphones', products: 78, value: 98000, percentage: 21.5 },
        { name: 'Monitores', products: 34, value: 67000, percentage: 14.7 },
        { name: 'Accesorios', products: 156, value: 45000, percentage: 9.8 },
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
        <Box className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Inventory sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Gestión de Productos
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Administra tu catálogo, inventario y precios
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Actualizar datos">
                            <IconButton onClick={handleRefresh} color="primary">
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="contained" startIcon={<Add />}>
                            Nuevo Producto
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
                                        Total Productos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800}>
                                        {inventoryMetrics.totalProducts}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {inventoryMetrics.totalCategories} categorías
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <Inventory sx={{ fontSize: 32 }} />
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
                                        Valor Total
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="success.main">
                                        {formatCurrency(inventoryMetrics.totalValue)}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                                        <TrendingUp fontSize="small" color="success" />
                                        <Typography variant="caption" color="success.main">
                                            +12.5% vs mes anterior
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
                                        Stock Bajo
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="warning.main">
                                        {inventoryMetrics.lowStockProducts}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Requieren reposición
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                                    <Warning sx={{ fontSize: 32 }} />
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
                                        Sin Stock
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="error.main">
                                        {inventoryMetrics.outOfStockProducts}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Acción inmediata
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                                    <ShoppingCart sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Alertas de Stock Bajo */}
            {lowStockProducts.length > 0 && (
                <Card sx={{ mb: 3, borderLeft: 4, borderColor: 'warning.main' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Warning color="warning" />
                                <Typography variant="h6" fontWeight={600}>
                                    Productos con Stock Bajo
                                </Typography>
                                <Chip label={lowStockProducts.length} color="warning" size="small" />
                            </Stack>
                            <Button size="small" startIcon={<ShoppingCart />} variant="outlined">
                                Crear Orden de Compra
                            </Button>
                        </Stack>
                        <Grid container spacing={2}>
                            {lowStockProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={3} key={product.id}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            '&:hover': {
                                                boxShadow: 2,
                                                borderColor: 'warning.main',
                                            },
                                        }}
                                    >
                                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                            SKU: {product.sku}
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Chip label={`Stock: ${product.stock}`} size="small" color="error" />
                                            <Chip label={`Min: ${product.minStock}`} size="small" variant="outlined" />
                                        </Stack>
                                        <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                                            {formatCurrency(product.price)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Categorías Top */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Assessment color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Categorías Principales
                        </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        {topCategories.map((category, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        {category.name}
                                    </Typography>
                                    <Typography variant="h5" fontWeight={800} color="primary.main" gutterBottom>
                                        {formatCurrency(category.value)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        {category.products} productos
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={category.percentage}
                                        sx={{ mt: 1, height: 8, borderRadius: 1 }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        {category.percentage}% del total
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

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
                    <Tab icon={<Inventory />} iconPosition="start" label="Catálogo" />
                    <Tab icon={<Add />} iconPosition="start" label="Nuevo Producto" />
                    <Tab icon={<Assessment />} iconPosition="start" label="Importar/Exportar" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <ProductList />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <ProductForm />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <ProductImportExport />
                </TabPanel>
            </Paper>
        </Box>
    );
}
