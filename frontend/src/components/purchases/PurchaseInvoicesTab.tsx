import React, { useState } from 'react';
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
} from '@mui/material';
import {
    Add,
    Edit,
    Visibility,
    Print,
    Search,
    Refresh,
    Download,
    Payment,
    Schedule,
    Cancel,
    CheckCircle,
    ErrorOutline,
} from '@mui/icons-material';

export default function PurchaseInvoicesTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');

    // TODO: Implementar query real
    const invoices = [
        {
            id: 1,
            invoiceNumber: 'PINV-2024-001',
            supplierName: 'Proveedor Ejemplo 1',
            date: '2024-01-15',
            dueDate: '2024-02-15',
            status: 'PAID',
            paymentStatus: 'PAID',
            total: 15200.00,
            paid: 15200.00,
            outstanding: 0.00,
        },
        {
            id: 2,
            invoiceNumber: 'PINV-2024-002',
            supplierName: 'Proveedor Ejemplo 2',
            date: '2024-01-16',
            dueDate: '2024-02-16',
            status: 'DRAFT',
            paymentStatus: 'UNPAID',
            total: 8500.00,
            paid: 0.00,
            outstanding: 8500.00,
        },
        {
            id: 3,
            invoiceNumber: 'PINV-2024-003',
            supplierName: 'Proveedor Ejemplo 3',
            date: '2024-01-10',
            dueDate: '2024-02-10',
            status: 'OVERDUE',
            paymentStatus: 'UNPAID',
            total: 12300.00,
            paid: 0.00,
            outstanding: 12300.00,
        },
    ];

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

    const isOverdue = (dueDate: string, status: string) => {
        return new Date(dueDate) < new Date() && status === 'UNPAID';
    };

    // Filter invoices
    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch = searchTerm === '' || 
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.supplierName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || invoice.paymentStatus === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    // Calculate stats
    const stats = {
        total: invoices.length,
        paid: invoices.filter((i) => i.paymentStatus === 'PAID').length,
        unpaid: invoices.filter((i) => i.paymentStatus === 'UNPAID').length,
        overdue: invoices.filter((i) => i.paymentStatus === 'UNPAID' && new Date(i.dueDate) < new Date()).length,
        totalAmount: invoices.reduce((sum, i) => sum + i.total, 0),
        outstanding: invoices.reduce((sum, i) => sum + i.outstanding, 0),
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Facturas de Compra
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestiona tus facturas de proveedores ({filteredInvoices.length} facturas{filteredInvoices.length !== invoices.length ? ` de ${invoices.length}` : ''})
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Actualizar">
                        <IconButton>
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
                        <Typography variant="body2" color="text.secondary">Por Pagar</Typography>
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
                            <TableCell><strong>Proveedor</strong></TableCell>
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
                        {filteredInvoices.map((invoice) => (
                            <TableRow 
                                key={invoice.id} 
                                hover
                                sx={{
                                    bgcolor: isOverdue(invoice.dueDate, invoice.paymentStatus) ? 'error.light' : 'inherit',
                                }}
                            >
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                                        {invoice.invoiceNumber}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                        {invoice.supplierName}
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatDate(invoice.date)}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" color={isOverdue(invoice.dueDate, invoice.paymentStatus) ? 'error.main' : 'inherit'}>
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
                                        {formatCurrency(invoice.paid)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" color="error.main" fontWeight={600}>
                                        {formatCurrency(invoice.outstanding)}
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
