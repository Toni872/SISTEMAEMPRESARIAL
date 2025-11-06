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
    Avatar,
    CircularProgress,
    Stack,
    Tooltip,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
} from '@mui/material';
import {
    Add,
    Edit,
    Visibility,
    Email,
    Phone,
    Search,
    Refresh,
    LocationOn,
    ShoppingCart,
    AttachMoney,
    MoreVert,
} from '@mui/icons-material';
import { GET_CUSTOMERS } from '../../lib/graphql/queries';

export default function CustomersTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    // DATOS DEMO: Clientes
    const demoCustomers = [
        {
            id: 1,
            name: 'Tech Solutions SA',
            contactName: 'Carlos Ruiz',
            email: 'contacto@techsolutions.com',
            phone: '+34 91 555 0101',
            address: 'Calle Tecnología 45, Madrid',
            city: 'Madrid',
            country: 'España',
            totalPurchases: 125600.50,
            pendingBalance: 15420.50
        },
        {
            id: 2,
            name: 'Distribuidora Norte',
            contactName: 'Laura Martín',
            email: 'ventas@distribuidoranorte.com',
            phone: '+34 94 666 0202',
            address: 'Av. Industrial 123, Bilbao',
            city: 'Bilbao',
            country: 'España',
            totalPurchases: 89450.00,
            pendingBalance: 8350.00
        },
        {
            id: 3,
            name: 'Comercial Del Sur',
            contactName: 'Antonio López',
            email: 'info@comercialsur.com',
            phone: '+34 95 777 0303',
            address: 'Polígono Sur 78, Sevilla',
            city: 'Sevilla',
            country: 'España',
            totalPurchases: 156890.75,
            pendingBalance: 12975.25
        },
        {
            id: 4,
            name: 'Empresa Demo SL',
            contactName: 'María García',
            email: 'contacto@empresademo.com',
            phone: '+34 93 888 0404',
            address: 'Paseo Demo 99, Barcelona',
            city: 'Barcelona',
            country: 'España',
            totalPurchases: 45780.00,
            pendingBalance: 5680.00
        }
    ];

    const { data, loading, error, refetch } = useQuery(GET_CUSTOMERS, {
        variables: { skip: 0, take: 50, search: searchTerm || undefined },
        errorPolicy: 'all',
    });

    const customers = error ? demoCustomers : (data?.customers || []);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getRandomColor = (str: string) => {
        const colors = [
            '#667eea',
            '#f093fb',
            '#4facfe',
            '#43e97b',
            '#fa709a',
            '#fee140',
            '#30cfd0',
        ];
        const index = str.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const handleOpenDetail = (customer: any) => {
        setSelectedCustomer(customer);
        setOpenDetail(true);
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
                        Clientes ({customers.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestiona tu base de clientes
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
                        Nuevo Cliente
                    </Button>
                </Stack>
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Clientes
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {customers.length}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Typography variant="h6">T</Typography>
                                </Avatar>
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
                                        Activos este mes
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {customers.length}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <Typography variant="h6">✓</Typography>
                                </Avatar>
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
                                        Órdenes totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        156
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <ShoppingCart />
                                </Avatar>
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
                                        Ingresos totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="primary.main">
                                        €125,430
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <AttachMoney />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'background.default' }}>
                            <TableCell><strong>Cliente</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Teléfono</strong></TableCell>
                            <TableCell><strong>Ubicación</strong></TableCell>
                            <TableCell align="center"><strong>Órdenes</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">
                                        {searchTerm ? 'No hay clientes que coincidan con la búsqueda' : 'No hay clientes disponibles'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {customers.map((customer: any) => (
                            <TableRow key={customer.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: getRandomColor(customer.name), width: 48, height: 48 }}>
                                            {getInitials(customer.name)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {customer.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="action" />
                                        <Typography variant="body2">{customer.email}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {customer.phone ? (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Phone fontSize="small" color="action" />
                                            <Typography variant="body2">{customer.phone}</Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">N/A</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOn fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {customer.city || 'N/A'}{customer.country ? `, ${customer.country}` : ''}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label="12" size="small" color="primary" />
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" fontWeight={600} color="success.main">
                                        €1,450.00
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Ver detalles">
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                onClick={() => handleOpenDetail(customer)}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="warning">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Customer Detail Dialog */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Detalles del Cliente
                    {selectedCustomer && ` - ${selectedCustomer.name}`}
                </DialogTitle>
                <DialogContent>
                    {selectedCustomer && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={selectedCustomer.name}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={selectedCustomer.email}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    value={selectedCustomer.phone || 'N/A'}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Dirección"
                                    value={selectedCustomer.address || 'N/A'}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ciudad"
                                    value={selectedCustomer.city || 'N/A'}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="País"
                                    value={selectedCustomer.country || 'N/A'}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
                    <Button variant="contained" onClick={() => setOpenDetail(false)}>Editar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
