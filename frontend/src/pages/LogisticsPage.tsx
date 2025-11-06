import React, { useMemo, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Chip,
    Stack,
    TextField,
    Button,
    Divider,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    IconButton,
    Tooltip,
    Snackbar,
    Tabs,
    Tab,
    Badge,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    Autocomplete,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    ListItemSecondaryAction,
} from '@mui/material';
import {
    LocalShipping,
    Inventory,
    MapOutlined,
    Speed,
    CheckCircle,
    Warning,
    Error,
    Refresh,
    Add,
    Edit,
    Delete,
    Visibility,
    TrendingUp,
    TrendingDown,
    Schedule,
    LocationOn,
    AccessTime,
    Route,
    AccountCircle,
    DirectionsCar,
    Warehouse,
    ReceiptLong,
    Analytics,
} from '@mui/icons-material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function LogisticsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' }>({
        open: false,
        message: '',
    });
    const [createRouteOpen, setCreateRouteOpen] = useState(false);
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    // Mock data - Datos simulados profesionales
    const logisticsMetrics = {
        activeRoutes: 47,
        deliveriesToday: 312,
        onTimeDeliveryRate: 96.8,
        averageDeliveryTime: 2.4,
        vehiclesActive: 18,
        capacityUtilization: 78.5,
        totalShipments: 12456,
        pendingShipments: 23,
        warehouses: 5,
        inventoryValue: 2450000,
        driversActive: 22,
        avgFuelCost: 45.2,
        totalDistance: 12450,
    };

    const routes = [
        { id: 1, name: 'Ruta Norte', start: 'Almacén Central', end: 'Cliente Norte', stops: 12, driver: 'Juan Pérez', vehicle: 'VH-001', status: 'in-transit', estimatedArrival: '14:30', progress: 68, distance: 245, fuelUsed: 18.5, avgSpeed: 62 },
        { id: 2, name: 'Ruta Sur A', start: 'Almacén Central', end: 'Cliente Sur', stops: 8, driver: 'María López', vehicle: 'VH-002', status: 'delivered', estimatedArrival: '11:15', progress: 100, distance: 182, fuelUsed: 13.8, avgSpeed: 58 },
        { id: 3, name: 'Ruta Este', start: 'Almacén Este', end: 'Cliente Este', stops: 15, driver: 'Carlos Ruiz', vehicle: 'VH-003', status: 'scheduled', estimatedArrival: '16:00', progress: 0, distance: 312, fuelUsed: 0, avgSpeed: 0 },
        { id: 4, name: 'Ruta Oeste', start: 'Almacén Central', end: 'Cliente Oeste', stops: 10, driver: 'Ana García', vehicle: 'VH-004', status: 'in-transit', estimatedArrival: '13:45', progress: 45, distance: 198, fuelUsed: 15.2, avgSpeed: 55 },
    ];

    const shipments = [
        { id: 'SH-001', orderId: 'ORD-12345', origin: 'Almacén Central', destination: 'Cliente A', status: 'in-transit', carrier: 'Express Logistics', estimatedDelivery: '2025-10-30 15:00', trackingNumber: 'EXP123456789', weight: 125.5, dimensions: '100x80x60', priority: 'High' },
        { id: 'SH-002', orderId: 'ORD-12346', origin: 'Almacén Este', destination: 'Cliente B', status: 'delivered', carrier: 'Fast Delivery', actualDelivery: '2025-10-30 11:30', trackingNumber: 'FD987654321', weight: 78.2, dimensions: '80x60x40', priority: 'Normal' },
        { id: 'SH-003', orderId: 'ORD-12347', origin: 'Almacén Centro', destination: 'Cliente C', status: 'pending', carrier: 'Prime Logistics', estimatedDelivery: '2025-10-31 09:00', trackingNumber: 'PL456789123', weight: 45.3, dimensions: '60x40x30', priority: 'Urgent' },
    ];

    const warehouses = [
        { id: 1, name: 'Almacén Central', location: 'Madrid', capacity: 10000, occupied: 7850, utilization: 78.5, status: 'operational', lastUpdate: '2025-10-30 14:20', products: 234, orders: 45 },
        { id: 2, name: 'Almacén Este', location: 'Barcelona', capacity: 8000, occupied: 6200, utilization: 77.5, status: 'operational', lastUpdate: '2025-10-30 14:18', products: 189, orders: 38 },
        { id: 3, name: 'Almacén Sur', location: 'Sevilla', capacity: 6000, occupied: 4800, utilization: 80.0, status: 'operational', lastUpdate: '2025-10-30 14:15', products: 156, orders: 29 },
        { id: 4, name: 'Almacén Norte', location: 'Bilbao', capacity: 5000, occupied: 3500, utilization: 70.0, status: 'low-stock', lastUpdate: '2025-10-30 14:22', products: 98, orders: 15 },
    ];

    const drivers = [
        { id: 1, name: 'Juan Pérez', status: 'active', vehicle: 'VH-001', currentRoute: 'Ruta Norte', deliveriesToday: 12, rating: 4.8, hoursWorked: 6.5 },
        { id: 2, name: 'María López', status: 'active', vehicle: 'VH-002', currentRoute: 'Ruta Sur A', deliveriesToday: 8, rating: 4.9, hoursWorked: 4.2 },
        { id: 3, name: 'Carlos Ruiz', status: 'scheduled', vehicle: 'VH-003', currentRoute: 'Ruta Este', deliveriesToday: 0, rating: 4.7, hoursWorked: 0 },
        { id: 4, name: 'Ana García', status: 'active', vehicle: 'VH-004', currentRoute: 'Ruta Oeste', deliveriesToday: 10, rating: 5.0, hoursWorked: 5.8 },
    ];

    const vehicles = [
        { id: 1, plate: 'VH-001', type: 'Camión Mediano', driver: 'Juan Pérez', status: 'in-use', mileage: 125000, lastService: '2025-09-15', nextService: '2025-11-15', fuelLevel: 65, location: 'En ruta' },
        { id: 2, plate: 'VH-002', type: 'Furgoneta', driver: 'María López', status: 'in-use', mileage: 98000, lastService: '2025-10-01', nextService: '2025-12-01', fuelLevel: 42, location: 'En ruta' },
        { id: 3, plate: 'VH-003', type: 'Camión Grande', driver: 'Carlos Ruiz', status: 'maintenance', mileage: 185000, lastService: '2025-10-25', nextService: '2025-11-25', fuelLevel: 85, location: 'Almacén Central' },
        { id: 4, plate: 'VH-004', type: 'Furgoneta', driver: 'Ana García', status: 'in-use', mileage: 112000, lastService: '2025-09-30', nextService: '2025-11-30', fuelLevel: 28, location: 'En ruta' },
    ];

    const performanceData = [
        { day: 'Lun', deliveries: 245, onTime: 98.4, distance: 5420, fuelCost: 1245 },
        { day: 'Mar', deliveries: 312, onTime: 96.8, distance: 6820, fuelCost: 1580 },
        { day: 'Mié', deliveries: 298, onTime: 97.2, distance: 6540, fuelCost: 1512 },
        { day: 'Jue', deliveries: 334, onTime: 95.5, distance: 7320, fuelCost: 1695 },
        { day: 'Vie', deliveries: 312, onTime: 96.8, distance: 6840, fuelCost: 1585 },
        { day: 'Sáb', deliveries: 189, onTime: 98.9, distance: 4120, fuelCost: 955 },
        { day: 'Dom', deliveries: 145, onTime: 99.3, distance: 3180, fuelCost: 735 },
    ];

    const warehouseDistribution = [
        { name: 'Central', value: 35, fill: '#1976d2' },
        { name: 'Este', value: 28, fill: '#43a047' },
        { name: 'Sur', value: 22, fill: '#fb8c00' },
        { name: 'Norte', value: 15, fill: '#e53935' },
    ];

    const formatNumber = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const formatCurrency = (n: number) => `€${n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'operational':
            case 'active':
            case 'in-use':
                return 'success';
            case 'in-transit':
                return 'info';
            case 'scheduled':
            case 'low-stock':
                return 'warning';
            case 'pending':
            case 'maintenance':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'operational':
                return <CheckCircle />;
            case 'in-transit':
            case 'active':
            case 'in-use':
                return <Schedule />;
            case 'scheduled':
            case 'low-stock':
                return <Warning />;
            case 'pending':
            case 'maintenance':
                return <Error />;
            default:
                return <Error />;
        }
    };

    const handleCreateRoute = () => {
        setSnackbar({ open: true, message: 'Ruta creada exitosamente', severity: 'success' });
        setCreateRouteOpen(false);
    };

    const handleCreateTransfer = () => {
        setSnackbar({ open: true, message: 'Transferencia creada exitosamente', severity: 'success' });
        setTransferDialogOpen(false);
        setActiveStep(0);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Chip icon={<LocalShipping />} label="Logística Inteligente" color="primary" variant="outlined" />
                    <Typography variant="h5" fontWeight={700}>Centro de Operaciones Logísticas</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Actualizar datos en tiempo real">
                        <IconButton color="primary">
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setCreateRouteOpen(true)}>
                        Nueva Ruta
                    </Button>
                </Stack>
            </Box>

            {/* KPIs Principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Rutas Activas</Typography>
                                    <Typography variant="h4" fontWeight={800}>{logisticsMetrics.activeRoutes}</Typography>
                                </Box>
                                <MapOutlined color="primary" sx={{ fontSize: 40 }} />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">{logisticsMetrics.vehiclesActive} vehículos • {logisticsMetrics.driversActive} conductores</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Entregas Hoy</Typography>
                                    <Typography variant="h4" fontWeight={800}>{logisticsMetrics.deliveriesToday}</Typography>
                                </Box>
                                <LocalShipping color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <TrendingUp fontSize="small" color="success" />
                                <Typography variant="caption" color="success.main">+{logisticsMetrics.onTimeDeliveryRate}% a tiempo</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Tiempo Promedio</Typography>
                                    <Typography variant="h4" fontWeight={800}>{logisticsMetrics.averageDeliveryTime}h</Typography>
                                </Box>
                                <Speed color="warning" sx={{ fontSize: 40 }} />
                            </Stack>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <TrendingDown fontSize="small" color="success" />
                                <Typography variant="caption" color="success.main">-5.2% vs mes anterior</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Distancia Total</Typography>
                                    <Typography variant="h4" fontWeight={800}>{logisticsMetrics.totalDistance.toLocaleString('es-ES')} km</Typography>
                                </Box>
                                <Route color="info" sx={{ fontSize: 40 }} />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">€{logisticsMetrics.avgFuelCost} coste/100km</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs de navegación */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
                    <Tab icon={<Route />} label={`Rutas (${routes.length})`} iconPosition="start" />
                    <Tab icon={<LocalShipping />} label={<Badge badgeContent={logisticsMetrics.pendingShipments} color="error">Envíos</Badge>} iconPosition="start" />
                    <Tab icon={<Warehouse />} label={`Almacenes (${warehouses.length})`} iconPosition="start" />
                    <Tab icon={<AccountCircle />} label={`Conductores (${drivers.length})`} iconPosition="start" />
                    <Tab icon={<DirectionsCar />} label={`Vehículos (${vehicles.length})`} iconPosition="start" />
                    <Tab icon={<Analytics />} label="Rendimiento" iconPosition="start" />
                </Tabs>
            </Paper>

            {/* Contenido de Tabs */}
            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader title="Gestión de Rutas" subheader="Rutas activas y su estado en tiempo real" />
                            <CardContent>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Ruta</TableCell>
                                                <TableCell>Conductor/Vehículo</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Paradas</TableCell>
                                                <TableCell>Distancia</TableCell>
                                                <TableCell>Progreso</TableCell>
                                                <TableCell>ETA</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {routes.map((route) => (
                                                <TableRow key={route.id}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {route.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {route.start} → {route.end}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{route.driver}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {route.vehicle}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={getStatusIcon(route.status)} label={route.status} size="small" color={getStatusColor(route.status) as any} />
                                                    </TableCell>
                                                    <TableCell>{route.stops}</TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2">{route.distance} km</Typography>
                                                            {route.avgSpeed > 0 && <Typography variant="caption" color="text.secondary">{route.avgSpeed} km/h</Typography>}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <LinearProgress variant="determinate" value={route.progress} sx={{ width: 80, height: 8, borderRadius: 1 }} />
                                                            <Typography variant="caption">{route.progress}%</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{route.estimatedArrival}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
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
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardHeader title="Optimización de Rutas" />
                            <CardContent>
                                <Stack spacing={2}>
                                    <Autocomplete
                                        size="small"
                                        options={warehouses.map((w) => w.name)}
                                        renderInput={(params) => <TextField {...params} label="Origen" />}
                                    />
                                    <TextField label="Destino" placeholder="Seleccionar destino" size="small" fullWidth />
                                    <TextField label="Número de paradas" type="number" defaultValue={5} size="small" fullWidth />
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Prioridad</InputLabel>
                                        <Select defaultValue="normal" label="Prioridad">
                                            <MenuItem value="low">Baja</MenuItem>
                                            <MenuItem value="normal">Normal</MenuItem>
                                            <MenuItem value="high">Alta</MenuItem>
                                            <MenuItem value="urgent">Urgente</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button variant="contained" fullWidth onClick={() => setSnackbar({ open: true, message: 'Ruta optimizada calculada', severity: 'success' })}>
                                        Calcular Ruta Óptima
                                    </Button>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" gutterBottom>
                                    Última optimización
                                </Typography>
                                <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                                    <Typography variant="body2">
                                        Distancia total: <strong>342 km</strong>
                                    </Typography>
                                    <Typography variant="body2">
                                        Tiempo estimado: <strong>4.2 horas</strong>
                                    </Typography>
                                    <Typography variant="body2">
                                        Combustible: <strong>24.8 L</strong>
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                        Ahorro vs ruta manual: <strong>12%</strong>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Gestión de Envíos" subheader="Seguimiento y control de envíos" />
                            <CardContent>
                                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                    <TextField size="small" placeholder="Buscar por código, orden o seguimiento..." sx={{ flex: 1 }} />
                                    <Select defaultValue="all" size="small" sx={{ minWidth: 150 }}>
                                        <MenuItem value="all">Todos los estados</MenuItem>
                                        <MenuItem value="pending">Pendientes</MenuItem>
                                        <MenuItem value="in-transit">En tránsito</MenuItem>
                                        <MenuItem value="delivered">Entregados</MenuItem>
                                    </Select>
                                    <Button variant="outlined">Filtrar</Button>
                                    <Button variant="contained" startIcon={<Add />}>Nuevo Envío</Button>
                                </Stack>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Orden</TableCell>
                                                <TableCell>Origen</TableCell>
                                                <TableCell>Destino</TableCell>
                                                <TableCell>Transportista</TableCell>
                                                <TableCell>Peso/Dimensión</TableCell>
                                                <TableCell>Prioridad</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Entrega</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {shipments.map((shipment) => (
                                                <TableRow key={shipment.id}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {shipment.id}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {shipment.trackingNumber}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{shipment.orderId}</TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <LocationOn fontSize="small" color="primary" />
                                                            {shipment.origin}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <LocationOn fontSize="small" color="error" />
                                                            {shipment.destination}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{shipment.carrier}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{shipment.weight} kg</Typography>
                                                        <Typography variant="caption" color="text.secondary">{shipment.dimensions}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={shipment.priority} size="small" color={shipment.priority === 'Urgent' ? 'error' : shipment.priority === 'High' ? 'warning' : 'default'} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={getStatusIcon(shipment.status)} label={shipment.status} size="small" color={getStatusColor(shipment.status) as any} />
                                                    </TableCell>
                                                    <TableCell>
                                                        {shipment.actualDelivery || shipment.estimatedDelivery}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            <Tooltip title="Rastrear envío">
                                                                <IconButton size="small" color="info">
                                                                    <Visibility fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Ver historial">
                                                                <IconButton size="small" color="primary">
                                                                    <ReceiptLong fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader title="Red de Almacenes" subheader="Estado y ocupación de almacenes" />
                            <CardContent>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Almacén</TableCell>
                                                <TableCell>Ubicación</TableCell>
                                                <TableCell>Capacidad</TableCell>
                                                <TableCell>Ocupación</TableCell>
                                                <TableCell>Utilización</TableCell>
                                                <TableCell>Productos</TableCell>
                                                <TableCell>Órdenes</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {warehouses.map((wh) => (
                                                <TableRow key={wh.id}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {wh.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{wh.location}</TableCell>
                                                    <TableCell>{formatNumber(wh.capacity)} m²</TableCell>
                                                    <TableCell>{formatNumber(wh.occupied)} m²</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <LinearProgress variant="determinate" value={wh.utilization} sx={{ width: 100, height: 8, borderRadius: 1 }} />
                                                            <Typography variant="caption">{wh.utilization}%</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{wh.products}</TableCell>
                                                    <TableCell>{wh.orders}</TableCell>
                                                    <TableCell>
                                                        <Chip icon={getStatusIcon(wh.status)} label={wh.status} size="small" color={getStatusColor(wh.status) as any} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            <Tooltip title="Ver inventario">
                                                                <IconButton size="small" color="primary">
                                                                    <Visibility fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Crear transferencia">
                                                                <IconButton size="small" color="success" onClick={() => setTransferDialogOpen(true)}>
                                                                    <LocalShipping fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardHeader title="Resumen de Inventario" />
                            <CardContent>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Valor Total
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700} color="primary">
                                            {formatCurrency(logisticsMetrics.inventoryValue)}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Distribución por Almacén
                                        </Typography>
                                        <Box sx={{ height: 200, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={warehouseDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={70}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {warehouseDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Box>
                                    <Divider />
                                    <Button variant="contained" fullWidth startIcon={<Add />} onClick={() => setTransferDialogOpen(true)}>
                                        Nueva Transferencia
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 3 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader title="Gestión de Conductores" subheader="Estado y rendimiento de conductores" />
                            <CardContent>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Conductor</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Vehículo</TableCell>
                                                <TableCell>Ruta Actual</TableCell>
                                                <TableCell>Entregas Hoy</TableCell>
                                                <TableCell>Horas</TableCell>
                                                <TableCell>Calificación</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {drivers.map((driver) => (
                                                <TableRow key={driver.id}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Avatar sx={{ width: 32, height: 32 }}>
                                                                {driver.name.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {driver.name}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={getStatusIcon(driver.status)} label={driver.status} size="small" color={getStatusColor(driver.status) as any} />
                                                    </TableCell>
                                                    <TableCell>{driver.vehicle}</TableCell>
                                                    <TableCell>{driver.currentRoute}</TableCell>
                                                    <TableCell>{driver.deliveriesToday}</TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <AccessTime fontSize="small" />
                                                            {driver.hoursWorked}h
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <Typography variant="body2">{driver.rating}</Typography>
                                                            <TrendingUp fontSize="small" color="success" />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            <Tooltip title="Ver detalles">
                                                                <IconButton size="small" color="primary">
                                                                    <Visibility fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Ver historial">
                                                                <IconButton size="small" color="info">
                                                                    <ReceiptLong fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardHeader title="Rendimiento Conductores" />
                            <CardContent>
                                <Stack spacing={2}>
                                    <Typography variant="subtitle2">Entregas promedio por conductor</Typography>
                                    <Typography variant="h4">12.5</Typography>
                                    <Divider />
                                    <Typography variant="subtitle2">Calificación promedio</Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="h4">4.85</Typography>
                                        <TrendingUp color="success" />
                                    </Box>
                                    <Divider />
                                    <Typography variant="subtitle2">Conductores activos</Typography>
                                    <Typography variant="h4">{logisticsMetrics.driversActive}</Typography>
                                    <Divider />
                                    <Button variant="outlined" fullWidth startIcon={<Add />}>
                                        Asignar Nuevo Conductor
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 4 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader title="Gestión de Vehículos" subheader="Estado y mantenimiento de vehículos" />
                            <CardContent>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Vehículo</TableCell>
                                                <TableCell>Tipo</TableCell>
                                                <TableCell>Conductor</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Kilometraje</TableCell>
                                                <TableCell>Combustible</TableCell>
                                                <TableCell>Último Mant.</TableCell>
                                                <TableCell>Próximo Mant.</TableCell>
                                                <TableCell>Ubicación</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {vehicles.map((vehicle) => (
                                                <TableRow key={vehicle.id}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {vehicle.plate}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{vehicle.type}</TableCell>
                                                    <TableCell>{vehicle.driver}</TableCell>
                                                    <TableCell>
                                                        <Chip icon={getStatusIcon(vehicle.status)} label={vehicle.status} size="small" color={getStatusColor(vehicle.status) as any} />
                                                    </TableCell>
                                                    <TableCell>{formatNumber(vehicle.mileage)} km</TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <Box sx={{ width: 60, height: 8, bgcolor: 'background.default', borderRadius: 1 }}>
                                                                <Box sx={{ width: `${vehicle.fuelLevel}%`, height: '100%', bgcolor: vehicle.fuelLevel < 30 ? 'error.main' : vehicle.fuelLevel < 50 ? 'warning.main' : 'success.main', borderRadius: 1 }} />
                                                            </Box>
                                                            <Typography variant="caption">{vehicle.fuelLevel}%</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{vehicle.lastService}</TableCell>
                                                    <TableCell>{vehicle.nextService}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption">{vehicle.location}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            <Tooltip title="Ver detalles">
                                                                <IconButton size="small" color="primary">
                                                                    <Visibility fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Agendar mantenimiento">
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
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardHeader title="Resumen de Vehículos" />
                            <CardContent>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            En uso
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="success.main">
                                            {vehicles.filter((v) => v.status === 'in-use').length}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            En mantenimiento
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="warning.main">
                                            {vehicles.filter((v) => v.status === 'maintenance').length}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Disponibles
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {vehicles.filter((v) => v.status === 'active' || v.status === 'scheduled').length}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Typography variant="subtitle2">Combustible promedio</Typography>
                                    <LinearProgress variant="determinate" value={vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length} sx={{ height: 10, borderRadius: 1 }} />
                                    <Typography variant="caption" align="center">
                                        {Math.round(vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length)}%
                                    </Typography>
                                    <Divider />
                                    <Button variant="contained" fullWidth startIcon={<Add />}>
                                        Registrar Nuevo Vehículo
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 5 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader title="Rendimiento Semanal" subheader="Entregas, tasa de a tiempo, distancia y costes" />
                            <CardContent>
                                <Box sx={{ height: 350 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={performanceData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="deliveries" fill="#1976d2" name="Entregas" />
                                            <Bar yAxisId="right" dataKey="onTime" fill="#4caf50" name="Tasa A Tiempo %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardHeader title="Métricas Clave" />
                            <CardContent>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Total de Envíos
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {formatNumber(logisticsMetrics.totalShipments)}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Tasa de Entrega a Tiempo
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="success.main">
                                            {logisticsMetrics.onTimeDeliveryRate}%
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Tiempo Promedio
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {logisticsMetrics.averageDeliveryTime}h
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Envíos Pendientes
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="warning.main">
                                            {logisticsMetrics.pendingShipments}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Distancia Semanal
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="info.main">
                                            {performanceData.reduce((acc, d) => acc + d.distance, 0).toLocaleString('es-ES')} km
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Coste Combustible
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700} color="error.main">
                                            {formatCurrency(performanceData.reduce((acc, d) => acc + d.fuelCost, 0))}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Diálogos */}
            <Dialog open={createRouteOpen} onClose={() => setCreateRouteOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Crear Nueva Ruta</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField label="Nombre de la ruta" defaultValue="Nueva Ruta" fullWidth />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={warehouses.map((w) => w.name)}
                                    renderInput={(params) => <TextField {...params} label="Origen" />}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Destino" fullWidth />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Select defaultValue="" label="Conductor" fullWidth>
                                    {drivers.map((d) => (
                                        <MenuItem key={d.id} value={d.id}>
                                            {d.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Select defaultValue="" label="Vehículo" fullWidth>
                                    {vehicles.filter((v) => v.status !== 'in-use' && v.status !== 'maintenance').map((v) => (
                                        <MenuItem key={v.id} value={v.id}>
                                            {v.plate} - {v.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                        <TextField label="Número de paradas" type="number" defaultValue={5} fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>Prioridad</InputLabel>
                            <Select defaultValue="normal" label="Prioridad">
                                <MenuItem value="low">Baja</MenuItem>
                                <MenuItem value="normal">Normal</MenuItem>
                                <MenuItem value="high">Alta</MenuItem>
                                <MenuItem value="urgent">Urgente</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateRouteOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCreateRoute} variant="contained">
                        Crear Ruta
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={transferDialogOpen} onClose={() => { setTransferDialogOpen(false); setActiveStep(0); }} maxWidth="sm" fullWidth>
                <DialogTitle>Nueva Transferencia entre Almacenes</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep} sx={{ my: 3 }}>
                        <Step>
                            <StepLabel>Origen</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Destino</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Productos</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Confirmar</StepLabel>
                        </Step>
                    </Stepper>
                    {activeStep === 0 && (
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Selecciona el almacén de origen
                            </Typography>
                            <Select label="Almacén de Origen" fullWidth>
                                {warehouses.map((w) => (
                                    <MenuItem key={w.id} value={w.id}>
                                        {w.name} - {w.location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    )}
                    {activeStep === 1 && (
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Selecciona el almacén destino
                            </Typography>
                            <Select label="Almacén de Destino" fullWidth>
                                {warehouses.map((w) => (
                                    <MenuItem key={w.id} value={w.id}>
                                        {w.name} - {w.location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    )}
                    {activeStep === 2 && (
                        <Stack spacing={2}>
                            <TextField label="Cantidad" type="number" fullWidth />
                            <TextField label="Productos" multiline rows={3} placeholder="Seleccionar productos a transferir..." fullWidth />
                            <TextField label="Prioridad" defaultValue="Normal" fullWidth />
                            <TextField label="Fecha estimada" type="date" InputLabelProps={{ shrink: true }} fullWidth />
                        </Stack>
                    )}
                    {activeStep === 3 && (
                        <Stack spacing={2}>
                            <Typography variant="subtitle2" gutterBottom>
                                Resumen de Transferencia
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemText primary="De" secondary="Almacén Central - Madrid" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="A" secondary="Almacén Este - Barcelona" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Productos" secondary="3 productos" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Total" secondary="45 unidades" />
                                </ListItem>
                            </List>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    {activeStep > 0 && (
                        <Button onClick={() => setActiveStep((prev) => prev - 1)}>Anterior</Button>
                    )}
                    <Button onClick={() => setTransferDialogOpen(false)}>Cancelar</Button>
                    {activeStep < 3 ? (
                        <Button onClick={() => setActiveStep((prev) => prev + 1)} variant="contained">
                            Siguiente
                        </Button>
                    ) : (
                        <Button onClick={handleCreateTransfer} variant="contained">
                            Confirmar Transferencia
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity || 'info'}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
