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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    Store,
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import { GET_SUPPLIERS } from '../../lib/graphql/queries';

export default function SuppliersTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

    // MODO DEMO: Proveedores de ejemplo
    const demoSuppliers = [
        {
            id: 1,
            name: 'Proveedor Demo SA',
            contactName: 'Juan López',
            email: 'contacto@proveedor-demo.com',
            phone: '+34 91 234 5678',
            address: 'Calle Principal 123, Madrid',
            city: 'Madrid',
            country: 'España',
            totalPurchases: 45670.50,
            pendingOrders: 3
        },
        {
            id: 2,
            name: 'Suministros Tecnológicos',
            contactName: 'María García',
            email: 'ventas@suministros-tech.com',
            phone: '+34 93 456 7890',
            address: 'Av. Tecnológica 456, Barcelona',
            city: 'Barcelona',
            country: 'España',
            totalPurchases: 123450.00,
            pendingOrders: 5
        },
        {
            id: 3,
            name: 'Distribuidora Global',
            contactName: 'Carlos Rodríguez',
            email: 'info@distribuidora-global.com',
            phone: '+34 96 789 0123',
            address: 'Polígono Industrial 789, Valencia',
            city: 'Valencia',
            country: 'España',
            totalPurchases: 89750.25,
            pendingOrders: 2
        }
    ];

    const { data, loading, error, refetch } = useQuery(GET_SUPPLIERS, {
        variables: { skip: 0, take: 50, search: searchTerm || undefined },
        errorPolicy: 'all', // No romper UI si hay errores
    });

    const suppliers = error ? demoSuppliers : (data?.suppliers || []);

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
            '#9f7aea',
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

    const handleOpenDetail = (supplier: any) => {
        setSelectedSupplier(supplier);
        setOpenDetail(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    // No mostrar error si hay datos demo disponibles

    return (
        <Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Proveedores ({suppliers.length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestiona tu base de proveedores
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
                        Nuevo Proveedor
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
                                        Total Proveedores
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {suppliers.length}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    <Typography variant="h6">P</Typography>
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
                                        Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {suppliers.length}
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
                                        42
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
                                        Total Compras
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="secondary.main">
                                        €95,200
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    <Store />
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
                            placeholder="Buscar proveedor..."
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
                            <TableCell><strong>Proveedor</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Teléfono</strong></TableCell>
                            <TableCell><strong>Ubicación</strong></TableCell>
                            <TableCell align="center"><strong>Órdenes</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">
                                        {searchTerm ? 'No hay proveedores que coincidan con la búsqueda' : 'No hay proveedores disponibles'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {suppliers.map((supplier: any) => (
                            <TableRow key={supplier.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: getRandomColor(supplier.name), width: 48, height: 48 }}>
                                            {getInitials(supplier.name)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {supplier.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="action" />
                                        <Typography variant="body2">{supplier.email}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {supplier.phone ? (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Phone fontSize="small" color="action" />
                                            <Typography variant="body2">{supplier.phone}</Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">N/A</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOn fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {supplier.city || 'N/A'}{supplier.country ? `, ${supplier.country}` : ''}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label="8" size="small" color="secondary" />
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" fontWeight={600} color="secondary.main">
                                        €5,487.00
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Ver detalles">
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                onClick={() => handleOpenDetail(supplier)}
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

            {/* Supplier Detail Dialog */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Detalles del Proveedor
                    {selectedSupplier && ` - ${selectedSupplier.name}`}
                </DialogTitle>
                <DialogContent>
                    {selectedSupplier && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={selectedSupplier.name}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={selectedSupplier.email}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    value={selectedSupplier.phone || 'N/A'}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Dirección"
                                    value={selectedSupplier.address || 'N/A'}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ciudad"
                                    value={selectedSupplier.city || 'N/A'}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="País"
                                    value={selectedSupplier.country || 'N/A'}
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
