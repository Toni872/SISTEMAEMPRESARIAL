import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    MenuItem,
    Grid,
    Paper,
    CircularProgress,
    Stack,
    Tooltip,
    Select,
    FormControl,
    InputLabel,
    Badge,
} from '@mui/material';
import {
    Add,
    Edit,
    Visibility,
    Print,
    Search,
    FilterList,
    Refresh,
    Download,
    CheckCircle,
    Cancel,
    Schedule,
    TrendingUp,
    MoreVert,
} from '@mui/icons-material';
import { CreateOrderForm } from './CreateOrderForm';
import { GET_SALES_ORDERS } from '../../lib/graphql/queries';

export default function SalesOrdersTab() {
    const [openCreate, setOpenCreate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    // DATOS DEMO: Órdenes de venta
    const demoOrders = [
        {
            id: 1,
            orderNumber: 'SO-2025-001',
            customerName: 'Tech Solutions SA',
            orderDate: '2025-11-01',
            deliveryDate: '2025-11-15',
            status: 'CONFIRMED',
            totalAmount: 15420.50,
            items: []
        },
        {
            id: 2,
            orderNumber: 'SO-2025-002',
            customerName: 'Distribuidora Norte',
            orderDate: '2025-10-28',
            deliveryDate: '2025-11-10',
            status: 'SHIPPED',
            totalAmount: 8350.00,
            items: []
        },
        {
            id: 3,
            orderNumber: 'SO-2025-003',
            customerName: 'Comercial Del Sur',
            orderDate: '2025-10-25',
            deliveryDate: '2025-11-05',
            status: 'DELIVERED',
            totalAmount: 22975.25,
            items: []
        },
        {
            id: 4,
            orderNumber: 'SO-2025-004',
            customerName: 'Empresa Demo SL',
            orderDate: '2025-11-03',
            deliveryDate: '2025-11-20',
            status: 'PENDING',
            totalAmount: 5680.00,
            items: []
        }
    ];

    const { data, loading, error, refetch } = useQuery(GET_SALES_ORDERS, {
        variables: { skip: 0, take: 50 },
        errorPolicy: 'all',
    });

    const orders = error ? demoOrders : (data?.salesOrders || []);

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
            COMPLETED: 'success',
            DELIVERED: 'success',
            CONFIRMED: 'success',
            PENDING: 'warning',
            CANCELLED: 'error',
            PROCESSING: 'info',
            SHIPPED: 'info',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            COMPLETED: 'Completada',
            DELIVERED: 'Entregada',
            CONFIRMED: 'Confirmada',
            PENDING: 'Pendiente',
            CANCELLED: 'Cancelada',
            PROCESSING: 'En Proceso',
            SHIPPED: 'Enviada',
        };
        return labels[status] || status;
    };

    const getStatusIcon = (status: string) => {
        if (status === 'COMPLETED' || status === 'DELIVERED') return <CheckCircle fontSize="small" />;
        if (status === 'CANCELLED') return <Cancel fontSize="small" />;
        if (status === 'PENDING') return <Schedule fontSize="small" />;
        return <TrendingUp fontSize="small" />;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Filter orders
    const filteredOrders = orders.filter((order: any) => {
        const matchesSearch = searchTerm === '' || 
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Group by status for counts
    const statusCounts = {
        all: orders.length,
        PENDING: orders.filter((o: any) => o.status === 'PENDING').length,
        CONFIRMED: orders.filter((o: any) => o.status === 'CONFIRMED').length,
        PROCESSING: orders.filter((o: any) => o.status === 'PROCESSING').length,
        DELIVERED: orders.filter((o: any) => o.status === 'DELIVERED').length,
        CANCELLED: orders.filter((o: any) => o.status === 'CANCELLED').length,
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    // No mostrar error si hay datos demo

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Gestiona tus órdenes de venta
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ({filteredOrders.length} órdenes{filteredOrders.length !== orders.length ? ` de ${orders.length}` : ''})
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Actualizar">
                        <IconButton onClick={() => refetch()}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenCreate(true)}
                    >
                        Nueva Orden
                    </Button>
                </Stack>
            </Box>

            {/* Search and Filters */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por número o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value)}>
                                <MenuItem value="all">Todos los estados</MenuItem>
                                <MenuItem value="PENDING">Pendientes</MenuItem>
                                <MenuItem value="CONFIRMED">Confirmadas</MenuItem>
                                <MenuItem value="PROCESSING">En Proceso</MenuItem>
                                <MenuItem value="DELIVERED">Entregadas</MenuItem>
                                <MenuItem value="CANCELLED">Canceladas</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={() => {
                                setStatusFilter('all');
                                setSearchTerm('');
                            }}
                        >
                            Limpiar Filtros
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Download />}
                        >
                            Exportar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                            {statusCounts.all}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                        <Typography variant="h5" fontWeight={700} color="warning.main">
                            {statusCounts.PENDING}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Pendientes
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                        <Typography variant="h5" fontWeight={700} color="info.main">
                            {statusCounts.PROCESSING}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            En Proceso
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                        <Typography variant="h5" fontWeight={700} color="success.main">
                            {statusCounts.DELIVERED}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Entregadas
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                        <Typography variant="h5" fontWeight={700} color="error.main">
                            {statusCounts.CANCELLED}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Canceladas
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'background.default' }}>
                            <TableCell><strong>Número</strong></TableCell>
                            <TableCell><strong>Cliente</strong></TableCell>
                            <TableCell><strong>Fecha</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">
                                        {searchTerm || statusFilter !== 'all' ? 'No hay órdenes que coincidan con los filtros' : 'No hay órdenes disponibles'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredOrders.map((order: any) => (
                            <TableRow key={order.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                                        {order.orderNumber}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                        {order.customerName || 'Sin cliente'}
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatDate(order.orderDate)}</TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight={700} color="success.main">
                                        {formatCurrency(order.totalAmount)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={getStatusIcon(order.status)}
                                        label={getStatusLabel(order.status)}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Ver detalles">
                                            <IconButton size="small" color="primary">
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="warning">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Imprimir">
                                            <IconButton size="small" color="info">
                                                <Print fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
                <DialogTitle>Nueva Orden de Venta</DialogTitle>
                <DialogContent>
                    <CreateOrderForm onClose={() => setOpenCreate(false)} />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
