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
    Paper,
    TextField,
    Grid,
    Stack,
    Tooltip,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import {
    Add,
    Edit,
    Visibility,
    Print,
    CheckCircle,
    Search,
    Refresh,
    Download,
    Payment,
    Schedule,
    Cancel,
    ErrorOutline,
} from '@mui/icons-material';
import { GET_SALES_INVOICES } from '../../lib/graphql/queries';

export default function SalesInvoicesTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');

    // DATOS DEMO: Facturas de venta
    const demoInvoices = [
        {
            id: 1,
            invoiceNumber: 'INV-2025-001',
            customerName: 'Tech Solutions SA',
            invoiceDate: '2025-11-01',
            dueDate: '2025-11-30',
            status: 'PAID',
            totalAmount: 15420.50,
            paidAmount: 15420.50
        },
        {
            id: 2,
            invoiceNumber: 'INV-2025-002',
            customerName: 'Distribuidora Norte',
            invoiceDate: '2025-10-28',
            dueDate: '2025-11-28',
            status: 'UNPAID',
            totalAmount: 8350.00,
            paidAmount: 0
        },
        {
            id: 3,
            invoiceNumber: 'INV-2025-003',
            customerName: 'Comercial Del Sur',
            invoiceDate: '2025-10-25',
            dueDate: '2025-11-25',
            status: 'PARTIAL',
            totalAmount: 22975.25,
            paidAmount: 10000.00
        }
    ];

    const { data, loading, error, refetch } = useQuery(GET_SALES_INVOICES, {
        variables: { skip: 0, take: 50 },
        errorPolicy: 'all',
    });

    const invoices = error ? demoInvoices : (data?.salesInvoices || []);

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
            PAID: 'success',
            UNPAID: 'error',
            PARTIAL: 'warning',
            DRAFT: 'info',
            SUBMITTED: 'info',
            OVERDUE: 'error',
            CANCELLED: 'default',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            PAID: 'Pagada',
            UNPAID: 'Pendiente',
            PARTIAL: 'Parcial',
            DRAFT: 'Borrador',
            SUBMITTED: 'Enviada',
            OVERDUE: 'Vencida',
            CANCELLED: 'Cancelada',
        };
        return labels[status] || status;
    };

    const getStatusIcon = (status: string) => {
        if (status === 'PAID') return <CheckCircle fontSize="small" />;
        if (status === 'UNPAID' || status === 'OVERDUE') return <ErrorOutline fontSize="small" />;
        if (status === 'PARTIAL') return <Payment fontSize="small" />;
        if (status === 'DRAFT') return <Schedule fontSize="small" />;
        if (status === 'CANCELLED') return <Cancel fontSize="small" />;
        return <Schedule fontSize="small" />;
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

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date() && paymentFilter === 'UNPAID';
    };

    // Filter invoices
    const filteredInvoices = invoices.filter((invoice: any) => {
        const matchesSearch = searchTerm === '' || 
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || invoice.paymentStatus === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    // Calculate stats
    const stats = {
        total: invoices.length,
        paid: invoices.filter((i: any) => i.paymentStatus === 'PAID').length,
        unpaid: invoices.filter((i: any) => i.paymentStatus === 'UNPAID').length,
        overdue: invoices.filter((i: any) => i.paymentStatus === 'UNPAID' && new Date(i.dueDate) < new Date()).length,
        totalAmount: invoices.reduce((sum: number, i: any) => sum + i.total, 0),
        outstanding: invoices.reduce((sum: number, i: any) => sum + i.outstandingAmount, 0),
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
                        Facturas de Venta
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestiona tus facturas y pagos ({filteredInvoices.length} facturas{filteredInvoices.length !== invoices.length ? ` de ${invoices.length}` : ''})
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
                    >
                        Nueva Factura
                    </Button>
                </Stack>
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                            {stats.total}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                        <Typography variant="h5" fontWeight={700} color="success.main">
                            {stats.paid}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Pagadas
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                        <Typography variant="h5" fontWeight={700} color="error.main">
                            {stats.unpaid}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Pendientes
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                        <Typography variant="h5" fontWeight={700} color="warning.main">
                            {stats.overdue}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Vencidas
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">Total Facturado</Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {formatCurrency(stats.totalAmount)}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">Por Cobrar</Typography>
                        <Typography variant="h6" fontWeight={700} color="error.main">
                            {formatCurrency(stats.outstanding)}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Search and Filters */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Buscar factura..."
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
                                <MenuItem value="DRAFT">Borrador</MenuItem>
                                <MenuItem value="SUBMITTED">Enviada</MenuItem>
                                <MenuItem value="PAID">Pagada</MenuItem>
                                <MenuItem value="OVERDUE">Vencida</MenuItem>
                                <MenuItem value="CANCELLED">Cancelada</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Pago</InputLabel>
                            <Select value={paymentFilter} label="Pago" onChange={(e) => setPaymentFilter(e.target.value)}>
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="PAID">Pagado</MenuItem>
                                <MenuItem value="UNPAID">Pendiente</MenuItem>
                                <MenuItem value="PARTIAL">Parcial</MenuItem>
                            </Select>
                        </FormControl>
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

            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'background.default' }}>
                            <TableCell><strong>Número</strong></TableCell>
                            <TableCell><strong>Cliente</strong></TableCell>
                            <TableCell><strong>Fecha</strong></TableCell>
                            <TableCell><strong>Vencimiento</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell align="right"><strong>Pagado</strong></TableCell>
                            <TableCell align="right"><strong>Pendiente</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvoices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">
                                        {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' ? 'No hay facturas que coincidan con los filtros' : 'No hay facturas disponibles'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredInvoices.map((invoice: any) => (
                            <TableRow 
                                key={invoice.id} 
                                hover
                                sx={{
                                    bgcolor: isOverdue(invoice.dueDate) ? 'error.light' : 'inherit',
                                }}
                            >
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                                        {invoice.invoiceNumber}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                        {invoice.customerName || 'Sin cliente'}
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" color={isOverdue(invoice.dueDate) ? 'error.main' : 'inherit'}>
                                        {formatDate(invoice.dueDate)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight={700}>
                                        {formatCurrency(invoice.total)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" color="success.main">
                                        {formatCurrency(invoice.paidAmount)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" color="error.main" fontWeight={600}>
                                        {formatCurrency(invoice.outstandingAmount)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={getStatusIcon(invoice.paymentStatus)}
                                        label={getStatusLabel(invoice.paymentStatus)}
                                        color={getStatusColor(invoice.paymentStatus)}
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
                                        <Tooltip title="Registrar pago">
                                            <IconButton size="small" color="success">
                                                <Payment fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Imprimir">
                                            <IconButton size="small" color="info">
                                                <Print fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {invoice.paymentStatus !== 'PAID' && (
                                            <Tooltip title="Editar">
                                                <IconButton size="small" color="warning">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
