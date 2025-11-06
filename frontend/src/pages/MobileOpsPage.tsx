import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    Button,
    Stack,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Avatar,
    Badge,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Smartphone,
    LocationOn,
    Person,
    DirectionsWalk,
    ShoppingCart,
    Inventory,
    LocalShipping,
    Notifications,
    Sync,
    CheckCircle,
    Error,
    Schedule,
    TrendingUp,
    Refresh,
    Download,
    Add,
    Edit,
    Delete,
    Visibility,
    Search,
    FilterList,
    OfflineBolt,
    QrCodeScanner,
    CloudSync,
    Assessment,
} from '@mui/icons-material';

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

export default function MobileOpsPage() {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock data for mobile operations
    const fieldAgents = [
        {
            id: 1,
            name: 'Juan Pérez',
            device: 'Samsung Galaxy S21',
            os: 'Android',
            status: 'online',
            lastSync: '2024-01-15T12:30:00',
            location: 'Madrid Centro',
            visitsToday: 8,
            syncedVisits: 8,
            connectivity: '4G',
            battery: 78,
        },
        {
            id: 2,
            name: 'María García',
            device: 'iPhone 13 Pro',
            os: 'iOS',
            status: 'online',
            lastSync: '2024-01-15T12:28:00',
            location: 'Barcelona Norte',
            visitsToday: 12,
            syncedVisits: 12,
            connectivity: 'WiFi',
            battery: 92,
        },
        {
            id: 3,
            name: 'Carlos López',
            device: 'Xiaomi Redmi Note 11',
            os: 'Android',
            status: 'offline',
            lastSync: '2024-01-15T10:15:00',
            location: 'Valencia Sur',
            visitsToday: 5,
            syncedVisits: 4,
            connectivity: 'Desconectado',
            battery: 45,
        },
        {
            id: 4,
            name: 'Ana Martínez',
            device: 'iPhone 12',
            os: 'iOS',
            status: 'online',
            lastSync: '2024-01-15T12:25:00',
            location: 'Sevilla Oeste',
            visitsToday: 9,
            syncedVisits: 9,
            connectivity: '5G',
            battery: 65,
        },
    ];

    const mobileOrders = [
        {
            id: 1,
            orderNumber: 'MO-2024-001',
            agent: 'Juan Pérez',
            client: 'Supermercado Central',
            amount: 1250.00,
            items: 12,
            status: 'delivered',
            syncStatus: 'synced',
            createdAt: '2024-01-15T11:00:00',
            deliveredAt: '2024-01-15T11:45:00',
        },
        {
            id: 2,
            orderNumber: 'MO-2024-002',
            agent: 'María García',
            client: 'Farmacia del Sol',
            amount: 850.00,
            items: 8,
            status: 'pending',
            syncStatus: 'synced',
            createdAt: '2024-01-15T12:00:00',
        },
        {
            id: 3,
            orderNumber: 'MO-2024-003',
            agent: 'Carlos López',
            client: 'Tienda Market',
            amount: 450.00,
            items: 5,
            status: 'delivered',
            syncStatus: 'pending',
            createdAt: '2024-01-15T10:30:00',
            deliveredAt: '2024-01-15T11:00:00',
        },
    ];

    const inventoryChecks = [
        {
            id: 1,
            agent: 'Juan Pérez',
            warehouse: 'Almacén Madrid',
            product: 'Laptop Empresarial',
            scanned: 25,
            recorded: 25,
            match: true,
            timestamp: '2024-01-15T11:30:00',
        },
        {
            id: 2,
            agent: 'María García',
            warehouse: 'Almacén Barcelona',
            product: 'Silla Ergonómica',
            scanned: 40,
            recorded: 38,
            match: false,
            timestamp: '2024-01-15T11:45:00',
        },
        {
            id: 3,
            agent: 'Ana Martínez',
            warehouse: 'Almacén Sevilla',
            product: 'Mouse Inalámbrico',
            scanned: 150,
            recorded: 150,
            match: true,
            timestamp: '2024-01-15T12:00:00',
        },
    ];

    const deliveries = [
        {
            id: 1,
            agent: 'Juan Pérez',
            client: 'Supermercado Central',
            package: 'PKG-001',
            status: 'delivered',
            estimated: '2024-01-15T11:30:00',
            actual: '2024-01-15T11:28:00',
            onTime: true,
        },
        {
            id: 2,
            agent: 'María García',
            client: 'Farmacia del Sol',
            package: 'PKG-002',
            status: 'in_transit',
            estimated: '2024-01-15T13:00:00',
            onTime: true,
        },
        {
            id: 3,
            agent: 'Ana Martínez',
            client: 'Tienda Market',
            package: 'PKG-003',
            status: 'delayed',
            estimated: '2024-01-15T12:00:00',
            actual: '2024-01-15T12:45:00',
            onTime: false,
        },
    ];

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
            online: 'success',
            offline: 'error',
            synced: 'success',
            pending: 'warning',
            delivered: 'success',
            in_transit: 'info',
            delayed: 'error',
            pending_sync: 'warning',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            online: 'En Línea',
            offline: 'Desconectado',
            synced: 'Sincronizado',
            pending: 'Pendiente',
            delivered: 'Entregado',
            in_transit: 'En Tránsito',
            delayed: 'Retrasado',
            pending_sync: 'Pendiente Sinc',
        };
        return labels[status] || status;
    };

    // Filter data
    const filteredAgents = fieldAgents.filter((agent) => {
        const matchesSearch = searchTerm === '' || 
            agent.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        totalAgents: fieldAgents.length,
        onlineAgents: fieldAgents.filter((a) => a.status === 'online').length,
        totalVisits: fieldAgents.reduce((sum, a) => sum + a.visitsToday, 0),
        syncedVisits: fieldAgents.reduce((sum, a) => sum + a.syncedVisits, 0),
        totalOrders: mobileOrders.length,
        pendingSync: mobileOrders.filter((o) => o.syncStatus === 'pending').length,
        avgBattery: Math.round(fieldAgents.reduce((sum, a) => sum + a.battery, 0) / fieldAgents.length),
    };

    return (
        <Container maxWidth="xl" className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Smartphone sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Operaciones Móviles
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestión de equipos de campo, órdenes móviles y sincronización offline
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Sincronizar todo">
                            <IconButton>
                                <CloudSync />
                            </IconButton>
                        </Tooltip>
                        <Button variant="outlined" startIcon={<Download />}>
                            Exportar
                        </Button>
                        <Button variant="contained" startIcon={<Add />}>
                            Nueva Operación
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* KPIs Overview */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Agentes Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats.onlineAgents}/{stats.totalAgents}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Person />
                                </Avatar>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={(stats.onlineAgents / stats.totalAgents) * 100} 
                                sx={{ mt: 1 }}
                                color="primary"
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Visitas Hoy
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="info.main">
                                        {stats.totalVisits}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <DirectionsWalk />
                                </Avatar>
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                                {stats.syncedVisits} sincronizadas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Órdenes Móviles
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {stats.totalOrders}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <ShoppingCart />
                                </Avatar>
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                                {stats.pendingSync} pendientes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Batería Promedio
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="warning.main">
                                        {stats.avgBattery}%
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <OfflineBolt />
                                </Avatar>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={stats.avgBattery} 
                                sx={{ mt: 1 }}
                                color="warning"
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper elevation={2} sx={{ borderRadius: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
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
                    <Tab icon={<Person />} iconPosition="start" label="Agentes de Campo" />
                    <Tab icon={<ShoppingCart />} iconPosition="start" label="Órdenes Móviles" />
                    <Tab icon={<Inventory />} iconPosition="start" label="Inventario Móvil" />
                    <Tab icon={<LocalShipping />} iconPosition="start" label="Entregas" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box>
                        {/* Search and Filters */}
                        <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        placeholder="Buscar agentes..."
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
                                            <MenuItem value="all">Todos</MenuItem>
                                            <MenuItem value="online">En Línea</MenuItem>
                                            <MenuItem value="offline">Desconectados</MenuItem>
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
                                    <Button fullWidth variant="contained" startIcon={<Add />}>
                                        Agregar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Agents Table */}
                        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell><strong>Agente</strong></TableCell>
                                        <TableCell><strong>Dispositivo</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell><strong>Ubicación</strong></TableCell>
                                        <TableCell><strong>Visitas Hoy</strong></TableCell>
                                        <TableCell><strong>Batería</strong></TableCell>
                                        <TableCell><strong>Última Sinc</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAgents.map((agent) => (
                                        <TableRow key={agent.id} hover>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                                        {agent.name.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {agent.name}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {agent.device}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {agent.os}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    color={agent.status === 'online' ? 'success' : 'error'} 
                                                    variant="dot"
                                                    overlap="circular"
                                                >
                                                    <Chip
                                                        icon={agent.status === 'online' ? <CheckCircle /> : <Error />}
                                                        label={getStatusLabel(agent.status)}
                                                        color={getStatusColor(agent.status)}
                                                        size="small"
                                                    />
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <LocationOn fontSize="small" color="action" />
                                                    <Typography variant="body2">
                                                        {agent.location}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {agent.connectivity}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {agent.visitsToday}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {agent.syncedVisits} sinc.
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 100 }}>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={agent.battery} 
                                                        sx={{ flex: 1 }}
                                                        color={agent.battery > 50 ? 'success' : agent.battery > 20 ? 'warning' : 'error'}
                                                    />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {agent.battery}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(agent.lastSync).toLocaleString('es-ES')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Ver detalles">
                                                        <IconButton size="small" color="primary">
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Sincronizar">
                                                        <IconButton size="small" color="info">
                                                            <Sync fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Localizar">
                                                        <IconButton size="small" color="success">
                                                            <LocationOn fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                        {mobileOrders.map((order) => (
                            <Grid item xs={12} md={6} lg={4} key={order.id}>
                                <Card className="card-hover" sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                                    {order.orderNumber}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {order.client}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={getStatusLabel(order.status)}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                            />
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Stack spacing={1}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="text.secondary">
                                                        Agente:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {order.agent}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="text.secondary">
                                                        Importe:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600} color="primary.main">
                                                        €{order.amount.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="text.secondary">
                                                        Artículos:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {order.items}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    icon={order.syncStatus === 'synced' ? <CloudSync /> : <OfflineBolt />}
                                                    label={getStatusLabel(order.syncStatus)}
                                                    color={getStatusColor(order.syncStatus)}
                                                    size="small"
                                                />
                                            </Stack>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Button size="small" variant="contained" startIcon={<Visibility />} fullWidth>
                                                Ver
                                            </Button>
                                            <Button size="small" variant="outlined" startIcon={<Sync />} fullWidth>
                                                Sinc.
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box>
                        <Stack direction="row" spacing={1} justifyContent="flex-end" mb={3}>
                            <Button variant="outlined" startIcon={<QrCodeScanner />}>
                                Escanear QR
                            </Button>
                            <Button variant="contained" startIcon={<CloudSync />}>
                                Sincronizar Inventario
                            </Button>
                        </Stack>
                        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell><strong>Agente</strong></TableCell>
                                        <TableCell><strong>Almacén</strong></TableCell>
                                        <TableCell><strong>Producto</strong></TableCell>
                                        <TableCell><strong>Escaneado</strong></TableCell>
                                        <TableCell><strong>Registrado</strong></TableCell>
                                        <TableCell><strong>Coincide</strong></TableCell>
                                        <TableCell><strong>Fecha</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inventoryChecks.map((check) => (
                                        <TableRow key={check.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {check.agent}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {check.warehouse}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {check.product}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={600}>
                                                    {check.scanned}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2">
                                                    {check.recorded}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={check.match ? <CheckCircle /> : <Error />}
                                                    label={check.match ? 'Sí' : 'No'}
                                                    color={check.match ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(check.timestamp).toLocaleString('es-ES')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <Box>
                        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell><strong>Agente</strong></TableCell>
                                        <TableCell><strong>Cliente</strong></TableCell>
                                        <TableCell><strong>Paquete</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell><strong>Estimado</strong></TableCell>
                                        <TableCell><strong>Real</strong></TableCell>
                                        <TableCell><strong>Puntual</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {deliveries.map((delivery) => (
                                        <TableRow key={delivery.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {delivery.agent}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {delivery.client}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                                                    {delivery.package}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusLabel(delivery.status)}
                                                    color={getStatusColor(delivery.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(delivery.estimated).toLocaleTimeString('es-ES')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {delivery.actual ? new Date(delivery.actual).toLocaleTimeString('es-ES') : '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {delivery.status === 'delivered' && (
                                                    <Chip
                                                        icon={delivery.onTime ? <CheckCircle /> : <Error />}
                                                        label={delivery.onTime ? 'Puntual' : 'Retrasado'}
                                                        color={delivery.onTime ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </TabPanel>
            </Paper>
        </Container>
    );
}







