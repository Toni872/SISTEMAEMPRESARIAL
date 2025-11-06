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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    LinearProgress,
} from '@mui/material';
import {
    BusinessCenter,
    Description,
    Settings,
    Work,
    TrendingUp,
    Refresh,
    Download,
    Add,
    Edit,
    Delete,
    Visibility,
    Search,
    FilterList,
    Folder,
    Insights,
    Assessment,
    AutoAwesome,
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

export default function BusinessCorePage() {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [openCreate, setOpenCreate] = useState(false);
    const [openView, setOpenView] = useState(false);

    // Mock data for business processes
    const processes = [
        {
            id: 1,
            name: 'Proceso de Ventas',
            description: 'Gestión completa del ciclo de ventas',
            status: 'active',
            efficiency: 94,
            lastRun: '2024-01-15T10:30:00',
            nextRun: '2024-01-16T10:30:00',
            type: 'sales',
        },
        {
            id: 2,
            name: 'Proceso de Compras',
            description: 'Gestión de compras y proveedores',
            status: 'active',
            efficiency: 87,
            lastRun: '2024-01-15T09:15:00',
            nextRun: '2024-01-16T09:15:00',
            type: 'purchases',
        },
        {
            id: 3,
            name: 'Control de Inventario',
            description: 'Automatización de inventario',
            status: 'warning',
            efficiency: 72,
            lastRun: '2024-01-15T08:00:00',
            nextRun: '2024-01-16T08:00:00',
            type: 'inventory',
        },
        {
            id: 4,
            name: 'Facturación Automática',
            description: 'Generación automática de facturas',
            status: 'active',
            efficiency: 98,
            lastRun: '2024-01-15T11:45:00',
            nextRun: '2024-01-16T11:45:00',
            type: 'billing',
        },
        {
            id: 5,
            name: 'Reportes Mensuales',
            description: 'Generación de reportes ejecutivos',
            status: 'active',
            efficiency: 91,
            lastRun: '2024-01-15T12:00:00',
            nextRun: '2024-02-15T12:00:00',
            type: 'reports',
        },
    ];

    const businessRules = [
        {
            id: 1,
            name: 'Regla de Stock Mínimo',
            description: 'Alertar cuando el stock esté bajo',
            priority: 'high',
            status: 'active',
            lastExecuted: '2024-01-15T10:30:00',
            executions: 1250,
        },
        {
            id: 2,
            name: 'Regla de Descuentos',
            description: 'Aplicar descuentos automáticos',
            priority: 'medium',
            status: 'active',
            lastExecuted: '2024-01-15T10:25:00',
            executions: 842,
        },
        {
            id: 3,
            name: 'Regla de Pagos Vencidos',
            description: 'Notificar pagos vencidos',
            priority: 'high',
            status: 'active',
            lastExecuted: '2024-01-15T10:20:00',
            executions: 156,
        },
        {
            id: 4,
            name: 'Regla de Reabastecimiento',
            description: 'Generar órdenes de compra automáticas',
            priority: 'high',
            status: 'active',
            lastExecuted: '2024-01-15T10:15:00',
            executions: 48,
        },
    ];

    const workflows = [
        {
            id: 1,
            name: 'Flujo de Aprobación de Compras',
            description: 'Proceso de aprobación para órdenes de compra',
            steps: 5,
            status: 'active',
            instances: 156,
            avgTime: '2.5 horas',
        },
        {
            id: 2,
            name: 'Flujo de Facturación',
            description: 'Proceso completo de facturación',
            steps: 4,
            status: 'active',
            instances: 842,
            avgTime: '15 min',
        },
        {
            id: 3,
            name: 'Flujo de Devoluciones',
            description: 'Gestión de devoluciones y reembolsos',
            steps: 7,
            status: 'active',
            instances: 23,
            avgTime: '5 horas',
        },
    ];

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
            active: 'success',
            warning: 'warning',
            error: 'error',
            pending: 'info',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            active: 'Activo',
            warning: 'Advertencia',
            error: 'Error',
            pending: 'Pendiente',
        };
        return labels[status] || status;
    };

    const getPriorityColor = (priority: string) => {
        const colors: Record<string, 'error' | 'warning' | 'success'> = {
            high: 'error',
            medium: 'warning',
            low: 'success',
        };
        return colors[priority] || 'default';
    };

    const getPriorityLabel = (priority: string) => {
        const labels: Record<string, string> = {
            high: 'Alta',
            medium: 'Media',
            low: 'Baja',
        };
        return labels[priority] || priority;
    };

    // Filter data
    const filteredProcesses = processes.filter((process) => {
        const matchesSearch = searchTerm === '' || 
            process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            process.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        totalProcesses: processes.length,
        activeProcesses: processes.filter((p) => p.status === 'active').length,
        avgEfficiency: Math.round(processes.reduce((sum, p) => sum + p.efficiency, 0) / processes.length),
        totalWorkflows: workflows.length,
        totalInstances: workflows.reduce((sum, w) => sum + w.instances, 0),
    };

    return (
        <Container maxWidth="xl" className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <BusinessCenter sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Business Core
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestión centralizada de procesos, reglas de negocio y flujos de trabajo
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
                        <Button variant="contained" startIcon={<Add />}>
                            Nuevo Proceso
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
                                        Procesos Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats.activeProcesses}/{stats.totalProcesses}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Work />
                                </Avatar>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={(stats.activeProcesses / stats.totalProcesses) * 100} 
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
                                        Eficiencia Promedio
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {stats.avgEfficiency}%
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <TrendingUp />
                                </Avatar>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={stats.avgEfficiency} 
                                sx={{ mt: 1 }}
                                color="success"
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
                                        Flujos Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="info.main">
                                        {stats.totalWorkflows}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <Insights />
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
                                        Instancias Totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="secondary.main">
                                        {stats.totalInstances}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    <Assessment />
                                </Avatar>
                            </Stack>
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
                    <Tab icon={<Work />} iconPosition="start" label="Procesos de Negocio" />
                    <Tab icon={<Description />} iconPosition="start" label="Reglas de Negocio" />
                    <Tab icon={<Settings />} iconPosition="start" label="Flujos de Trabajo" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box>
                        {/* Search and Filters */}
                        <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        placeholder="Buscar procesos..."
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
                                            <MenuItem value="active">Activos</MenuItem>
                                            <MenuItem value="warning">Advertencia</MenuItem>
                                            <MenuItem value="error">Error</MenuItem>
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
                                        Nuevo Proceso
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Processes Table */}
                        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell><strong>Proceso</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell><strong>Eficiencia</strong></TableCell>
                                        <TableCell><strong>Última Ejecución</strong></TableCell>
                                        <TableCell><strong>Próxima Ejecución</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProcesses.map((process) => (
                                        <TableRow key={process.id} hover>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {process.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {process.description}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusLabel(process.status)}
                                                    color={getStatusColor(process.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={process.efficiency} 
                                                        sx={{ flex: 1 }}
                                                        color={process.efficiency >= 90 ? 'success' : process.efficiency >= 70 ? 'warning' : 'error'}
                                                    />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {process.efficiency}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(process.lastRun).toLocaleString('es-ES')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(process.nextRun).toLocaleString('es-ES')}
                                                </Typography>
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
                                                    <Tooltip title="Eliminar">
                                                        <IconButton size="small" color="error">
                                                            <Delete fontSize="small" />
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
                    <Box>
                        <Grid container spacing={3}>
                            {businessRules.map((rule) => (
                                <Grid item xs={12} md={6} key={rule.id}>
                                    <Card className="card-hover" sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {rule.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {rule.description}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={getPriorityLabel(rule.priority)}
                                                    color={getPriorityColor(rule.priority)}
                                                    size="small"
                                                />
                                            </Box>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Chip
                                                    icon={<AutoAwesome />}
                                                    label={getStatusLabel(rule.status)}
                                                    color={getStatusColor(rule.status)}
                                                    size="small"
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {rule.executions} ejecuciones
                                                </Typography>
                                            </Stack>
                                            <Box mt={2}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Última ejecución: {new Date(rule.lastExecuted).toLocaleString('es-ES')}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" spacing={1} mt={2}>
                                                <Button size="small" variant="outlined" startIcon={<Edit />}>
                                                    Editar
                                                </Button>
                                                <Button size="small" variant="outlined" startIcon={<Visibility />}>
                                                    Ver
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box>
                        <Grid container spacing={3}>
                            {workflows.map((workflow) => (
                                <Grid item xs={12} md={6} lg={4} key={workflow.id}>
                                    <Card className="card-hover" sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Folder sx={{ fontSize: 40, color: 'primary.main' }} />
                                                <Chip
                                                    label={getStatusLabel(workflow.status)}
                                                    color={getStatusColor(workflow.status)}
                                                    size="small"
                                                />
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                {workflow.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mb={2}>
                                                {workflow.description}
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Pasos
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight={600}>
                                                            {workflow.steps}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Instancias
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight={600}>
                                                            {workflow.instances}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Tiempo promedio
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight={600}>
                                                            {workflow.avgTime}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                <Button size="small" variant="contained" startIcon={<Visibility />}>
                                                    Ver Detalles
                                                </Button>
                                                <Button size="small" variant="outlined" startIcon={<Edit />}>
                                                    Editar
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </TabPanel>
            </Paper>
        </Container>
    );
}







