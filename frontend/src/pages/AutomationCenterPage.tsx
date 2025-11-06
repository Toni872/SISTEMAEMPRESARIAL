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
    Switch,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Badge,
} from '@mui/material';
import {
    PowerSettingsNew,
    Build,
    TrendingUp,
    Refresh,
    Download,
    Add,
    Edit,
    Delete,
    Visibility,
    Search,
    FilterList,
    PlayArrow,
    Stop,
    Pause,
    Schedule,
    CheckCircle,
    Warning,
    Error,
    Speed,
    Insights,
    SmartToy,
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

export default function AutomationCenterPage() {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [openCreate, setOpenCreate] = useState(false);

    // Mock data for automations
    const automations = [
        {
            id: 1,
            name: 'Automatización de Facturación',
            description: 'Generación automática de facturas mensuales',
            status: 'running',
            trigger: 'schedule',
            frequency: 'Mensual',
            lastRun: '2024-01-15T10:30:00',
            nextRun: '2024-02-15T10:30:00',
            successRate: 98,
            executions: 1250,
            avgTime: '2.5 min',
        },
        {
            id: 2,
            name: 'Alertas de Stock Bajo',
            description: 'Notificaciones automáticas de inventario',
            status: 'running',
            trigger: 'event',
            frequency: 'En Tiempo Real',
            lastRun: '2024-01-15T11:00:00',
            nextRun: '-',
            successRate: 99,
            executions: 3420,
            avgTime: '30 seg',
        },
        {
            id: 3,
            name: 'Reabastecimiento Automático',
            description: 'Órdenes de compra automáticas',
            status: 'paused',
            trigger: 'schedule',
            frequency: 'Diario',
            lastRun: '2024-01-14T08:00:00',
            nextRun: '2024-01-16T08:00:00',
            successRate: 87,
            executions: 156,
            avgTime: '5 min',
        },
        {
            id: 4,
            name: 'Reportes Ejecutivos',
            description: 'Generación de reportes semanales',
            status: 'running',
            trigger: 'schedule',
            frequency: 'Semanal',
            lastRun: '2024-01-14T09:00:00',
            nextRun: '2024-01-21T09:00:00',
            successRate: 95,
            executions: 52,
            avgTime: '10 min',
        },
        {
            id: 5,
            name: 'Backup Automático',
            description: 'Respaldo de datos diario',
            status: 'running',
            trigger: 'schedule',
            frequency: 'Diario',
            lastRun: '2024-01-15T02:00:00',
            nextRun: '2024-01-16T02:00:00',
            successRate: 100,
            executions: 365,
            avgTime: '15 min',
        },
    ];

    const bots = [
        {
            id: 1,
            name: 'Bot de Integración API',
            description: 'Sincronización con sistemas externos',
            status: 'active',
            uptime: '99.8%',
            cpu: 45,
            memory: 62,
            requests: 12500,
        },
        {
            id: 2,
            name: 'Bot de Procesamiento',
            description: 'Procesamiento de transacciones',
            status: 'active',
            uptime: '99.5%',
            cpu: 78,
            memory: 85,
            requests: 8450,
        },
        {
            id: 3,
            name: 'Bot de Notificaciones',
            description: 'Envío de notificaciones masivas',
            status: 'warning',
            uptime: '97.2%',
            cpu: 25,
            memory: 38,
            requests: 3200,
        },
    ];

    const workflows = [
        {
            id: 1,
            name: 'Flujo de Aprobación',
            description: 'Aprobación automática de órdenes',
            status: 'active',
            enabled: true,
            steps: 5,
            avgExecutionTime: '30 seg',
            successRate: 94,
        },
        {
            id: 2,
            name: 'Flujo de Validación',
            description: 'Validación de datos de entrada',
            status: 'active',
            enabled: true,
            steps: 3,
            avgExecutionTime: '10 seg',
            successRate: 96,
        },
        {
            id: 3,
            name: 'Flujo de Enriquecimiento',
            description: 'Enriquecimiento de información',
            status: 'paused',
            enabled: false,
            steps: 8,
            avgExecutionTime: '2 min',
            successRate: 89,
        },
    ];

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
            running: 'success',
            active: 'success',
            paused: 'warning',
            stopped: 'error',
            error: 'error',
            warning: 'warning',
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            running: 'Ejecutando',
            active: 'Activo',
            paused: 'Pausado',
            stopped: 'Detenido',
            error: 'Error',
            warning: 'Advertencia',
        };
        return labels[status] || status;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'running':
            case 'active':
                return <CheckCircle fontSize="small" />;
            case 'paused':
                return <Pause fontSize="small" />;
            case 'warning':
                return <Warning fontSize="small" />;
            case 'error':
            case 'stopped':
                return <Error fontSize="small" />;
            default:
                return <PowerSettingsNew fontSize="small" />;
        }
    };

    // Filter data
    const filteredAutomations = automations.filter((automation) => {
        const matchesSearch = searchTerm === '' || 
            automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            automation.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        totalAutomations: automations.length,
        runningAutomations: automations.filter((a) => a.status === 'running').length,
        avgSuccessRate: Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length),
        totalExecutions: automations.reduce((sum, a) => sum + a.executions, 0),
        totalBots: bots.length,
        activeBots: bots.filter((b) => b.status === 'active').length,
    };

    return (
        <Container maxWidth="xl" className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <SmartToy sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Centro de Automatización
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestión de automatizaciones, bots y flujos de trabajo inteligentes
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
                        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}>
                            Nueva Automatización
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
                                        Automatizaciones Activas
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats.runningAutomations}/{stats.totalAutomations}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <PowerSettingsNew />
                                </Avatar>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={(stats.runningAutomations / stats.totalAutomations) * 100} 
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
                                        Tasa de Éxito
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {stats.avgSuccessRate}%
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <TrendingUp />
                                </Avatar>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={stats.avgSuccessRate} 
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
                                        Ejecuciones Totales
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="info.main">
                                        {stats.totalExecutions.toLocaleString('es-ES')}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <Speed />
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
                                        Bots Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="secondary.main">
                                        {stats.activeBots}/{stats.totalBots}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    <Build />
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
                    <Tab icon={<PowerSettingsNew />} iconPosition="start" label="Automatizaciones" />
                    <Tab icon={<Build />} iconPosition="start" label="Bots & Scripts" />
                    <Tab icon={<Insights />} iconPosition="start" label="Flujos RPA" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box>
                        {/* Search and Filters */}
                        <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        placeholder="Buscar automatizaciones..."
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
                                            <MenuItem value="running">Ejecutando</MenuItem>
                                            <MenuItem value="paused">Pausados</MenuItem>
                                            <MenuItem value="stopped">Detenidos</MenuItem>
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
                                        Crear
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Automations Table */}
                        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell><strong>Automatización</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell><strong>Trigger</strong></TableCell>
                                        <TableCell><strong>Tasa Éxito</strong></TableCell>
                                        <TableCell><strong>Última Ejecución</strong></TableCell>
                                        <TableCell><strong>Próxima Ejecución</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAutomations.map((automation) => (
                                        <TableRow key={automation.id} hover>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {automation.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {automation.description}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(automation.status)}
                                                    label={getStatusLabel(automation.status)}
                                                    color={getStatusColor(automation.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {automation.frequency}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={automation.successRate} 
                                                        sx={{ flex: 1 }}
                                                        color={automation.successRate >= 95 ? 'success' : automation.successRate >= 85 ? 'warning' : 'error'}
                                                    />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {automation.successRate}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(automation.lastRun).toLocaleString('es-ES')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {automation.nextRun !== '-' ? new Date(automation.nextRun).toLocaleString('es-ES') : '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    {automation.status === 'running' && (
                                                        <Tooltip title="Pausar">
                                                            <IconButton size="small" color="warning">
                                                                <Pause fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {automation.status === 'paused' && (
                                                        <Tooltip title="Reanudar">
                                                            <IconButton size="small" color="success">
                                                                <PlayArrow fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
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
                    <Grid container spacing={3}>
                        {bots.map((bot) => (
                            <Grid item xs={12} md={6} lg={4} key={bot.id}>
                                <Card className="card-hover" sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Build sx={{ fontSize: 40, color: 'primary.main' }} />
                                            <Chip
                                                icon={getStatusIcon(bot.status)}
                                                label={getStatusLabel(bot.status)}
                                                color={getStatusColor(bot.status)}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {bot.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            {bot.description}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Uptime
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {bot.uptime}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Requests
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {bot.requests.toLocaleString('es-ES')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        CPU
                                                    </Typography>
                                                    <LinearProgress variant="determinate" value={bot.cpu} color={bot.cpu > 70 ? 'error' : 'primary'} sx={{ mt: 0.5 }} />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {bot.cpu}%
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Memoria
                                                    </Typography>
                                                    <LinearProgress variant="determinate" value={bot.memory} color={bot.memory > 80 ? 'error' : 'secondary'} sx={{ mt: 0.5 }} />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {bot.memory}%
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Button size="small" variant="contained" startIcon={<Visibility />}>
                                                Ver
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
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        {workflows.map((workflow) => (
                            <Grid item xs={12} md={6} lg={4} key={workflow.id}>
                                <Card className="card-hover" sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Insights sx={{ fontSize: 40, color: 'primary.main' }} />
                                            <Box display="flex" gap={1}>
                                                <Chip
                                                    label={getStatusLabel(workflow.status)}
                                                    color={getStatusColor(workflow.status)}
                                                    size="small"
                                                />
                                                <Switch checked={workflow.enabled} size="small" />
                                            </Box>
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
                                                        Tiempo
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {workflow.avgExecutionTime}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tasa de éxito
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={workflow.successRate} 
                                                        sx={{ mt: 0.5 }}
                                                        color={workflow.successRate >= 90 ? 'success' : 'warning'}
                                                    />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {workflow.successRate}%
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Button size="small" variant="contained" startIcon={<Visibility />}>
                                                Ver
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
                </TabPanel>
            </Paper>
        </Container>
    );
}

