import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Chip,
    Stack,
    Button,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Avatar,
} from '@mui/material';
import {
    Memory,
    Insights,
    Speed,
    Refresh,
    TrendingUp,
    Psychology,
    Analytics,
    AutoAwesome,
    CheckCircle,
    Schedule,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function AiEnginePage() {
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // Datos demo - Modelos de IA activos
    const aiModels = [
        {
            id: 1,
            name: 'Demand Predictor v2.1',
            type: 'Predicción',
            status: 'active',
            accuracy: 94.2,
            predictions: 1543,
            lastRun: '2025-11-06 14:30',
            avgTime: '1.2s',
        },
        {
            id: 2,
            name: 'Price Optimizer',
            type: 'Optimización',
            status: 'active',
            accuracy: 91.8,
            predictions: 876,
            lastRun: '2025-11-06 14:45',
            avgTime: '0.8s',
        },
        {
            id: 3,
            name: 'Sales Forecaster',
            type: 'Pronóstico',
            status: 'active',
            accuracy: 89.5,
            predictions: 2341,
            lastRun: '2025-11-06 14:20',
            avgTime: '2.1s',
        },
        {
            id: 4,
            name: 'Churn Predictor',
            type: 'Predicción',
            status: 'training',
            accuracy: 87.3,
            predictions: 456,
            lastRun: '2025-11-06 12:00',
            avgTime: '1.5s',
        },
    ];

    // Datos demo - Métricas generales
    const metrics = {
        totalModels: 32,
        activeModels: 28,
        predictionsToday: 1247,
        optimizationsToday: 543,
        avgAccuracy: 92.4,
        totalPredictions: 45678,
        gpuUsage: 67,
        cpuUsage: 45,
    };

    // Datos demo - Serie temporal de accuracy
    const accuracySeries = [
        { time: '10:00', accuracy: 91.2, predictions: 45 },
        { time: '11:00', accuracy: 92.5, predictions: 67 },
        { time: '12:00', accuracy: 93.1, predictions: 89 },
        { time: '13:00', accuracy: 94.2, predictions: 102 },
        { time: '14:00', accuracy: 93.8, predictions: 95 },
        { time: '15:00', accuracy: 92.4, predictions: 78 },
    ];

    // Datos demo - Predicciones recientes
    const recentPredictions = [
        {
            id: 1,
            model: 'Demand Predictor v2.1',
            product: 'Laptop Dell XPS 15',
            prediction: 156,
            confidence: 94.2,
            timestamp: '2025-11-06 14:30:15',
        },
        {
            id: 2,
            model: 'Sales Forecaster',
            product: 'Mouse Logitech MX',
            prediction: 89,
            confidence: 91.8,
            timestamp: '2025-11-06 14:28:42',
        },
        {
            id: 3,
            model: 'Demand Predictor v2.1',
            product: 'Teclado Mecánico RGB',
            prediction: 234,
            confidence: 89.5,
            timestamp: '2025-11-06 14:25:33',
        },
        {
            id: 4,
            model: 'Churn Predictor',
            product: 'Monitor Dell 27"',
            prediction: 67,
            confidence: 87.3,
            timestamp: '2025-11-06 14:22:18',
        },
    ];

    // Datos demo - Optimizaciones recientes
    const recentOptimizations = [
        {
            id: 1,
            model: 'Price Optimizer',
            product: 'iPhone 14 Pro',
            oldPrice: 1099.99,
            newPrice: 1149.99,
            expectedIncrease: 15.2,
            timestamp: '2025-11-06 14:45:22',
        },
        {
            id: 2,
            model: 'Price Optimizer',
            product: 'Samsung Galaxy S23',
            oldPrice: 899.99,
            newPrice: 849.99,
            expectedIncrease: 8.5,
            timestamp: '2025-11-06 14:40:11',
        },
        {
            id: 3,
            model: 'Price Optimizer',
            product: 'MacBook Pro M2',
            oldPrice: 1999.99,
            newPrice: 2099.99,
            expectedIncrease: 12.3,
            timestamp: '2025-11-06 14:35:45',
        },
    ];

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'training':
                return 'warning';
            case 'error':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'training':
                return 'Entrenando';
            case 'error':
                return 'Error';
            default:
                return status;
        }
    };

    return (
        <Box className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Motor de Inteligencia Artificial
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Modelos predictivos, optimización y análisis avanzado con IA
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Actualizar datos">
                            <IconButton onClick={handleRefresh} color="primary">
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="contained" startIcon={<AutoAwesome />}>
                            Entrenar Modelo
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
                                        Modelos Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800}>
                                        {metrics.activeModels}/{metrics.totalModels}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <Memory sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={(metrics.activeModels / metrics.totalModels) * 100}
                                sx={{ mt: 2, height: 8, borderRadius: 1 }}
                                color="primary"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Predicciones Hoy
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="success.main">
                                        {metrics.predictionsToday.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                                    <Insights sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                            <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                                <TrendingUp fontSize="small" color="success" />
                                <Typography variant="caption" color="success.main">
                                    +{metrics.optimizationsToday} optimizaciones
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Accuracy Promedio
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="info.main">
                                        {metrics.avgAccuracy}%
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                                    <Analytics sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={metrics.avgAccuracy}
                                sx={{ mt: 2, height: 8, borderRadius: 1 }}
                                color="info"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Uso de GPU
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="warning.main">
                                        {metrics.gpuUsage}%
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                                    <Speed sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={metrics.gpuUsage}
                                sx={{ mt: 2, height: 8, borderRadius: 1 }}
                                color="warning"
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
                    <Tab icon={<Memory />} iconPosition="start" label="Modelos Activos" />
                    <Tab icon={<Analytics />} iconPosition="start" label="Métricas" />
                    <Tab icon={<Insights />} iconPosition="start" label="Predicciones" />
                    <Tab icon={<AutoAwesome />} iconPosition="start" label="Optimizaciones" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Modelo</strong></TableCell>
                                    <TableCell><strong>Tipo</strong></TableCell>
                                    <TableCell><strong>Estado</strong></TableCell>
                                    <TableCell><strong>Accuracy</strong></TableCell>
                                    <TableCell><strong>Predicciones</strong></TableCell>
                                    <TableCell><strong>Última Ejecución</strong></TableCell>
                                    <TableCell><strong>Tiempo Promedio</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {aiModels.map((model) => (
                                    <TableRow key={model.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {model.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={model.type} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={model.status === 'active' ? <CheckCircle /> : <Schedule />}
                                                label={getStatusLabel(model.status)}
                                                color={getStatusColor(model.status) as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={model.accuracy}
                                                    sx={{ flex: 1, height: 8, borderRadius: 1 }}
                                                    color={model.accuracy >= 90 ? 'success' : 'warning'}
                                                />
                                                <Typography variant="body2" fontWeight={600}>
                                                    {model.accuracy}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {model.predictions.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {model.lastRun}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={model.avgTime} size="small" color="info" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Accuracy en Tiempo Real" />
                                <CardContent>
                                    <Box sx={{ height: 350 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={accuracySeries}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="time" />
                                                <YAxis domain={[85, 100]} />
                                                <RechartsTooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="accuracy"
                                                    stroke="#1976d2"
                                                    strokeWidth={3}
                                                    name="Accuracy (%)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Predicciones por Hora" />
                                <CardContent>
                                    <Box sx={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={accuracySeries}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="time" />
                                                <YAxis />
                                                <RechartsTooltip />
                                                <Legend />
                                                <Bar dataKey="predictions" fill="#4caf50" name="Predicciones" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Modelo</strong></TableCell>
                                    <TableCell><strong>Producto</strong></TableCell>
                                    <TableCell><strong>Predicción</strong></TableCell>
                                    <TableCell><strong>Confianza</strong></TableCell>
                                    <TableCell><strong>Timestamp</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentPredictions.map((pred) => (
                                    <TableRow key={pred.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {pred.model}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{pred.product}</TableCell>
                                        <TableCell>
                                            <Chip label={pred.prediction} color="primary" />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={pred.confidence}
                                                    sx={{ flex: 1, height: 8, borderRadius: 1 }}
                                                    color="success"
                                                />
                                                <Typography variant="body2" fontWeight={600}>
                                                    {pred.confidence}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {pred.timestamp}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Modelo</strong></TableCell>
                                    <TableCell><strong>Producto</strong></TableCell>
                                    <TableCell><strong>Precio Anterior</strong></TableCell>
                                    <TableCell><strong>Precio Nuevo</strong></TableCell>
                                    <TableCell><strong>Aumento Esperado</strong></TableCell>
                                    <TableCell><strong>Timestamp</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentOptimizations.map((opt) => (
                                    <TableRow key={opt.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {opt.model}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{opt.product}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                €{opt.oldPrice.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                €{opt.newPrice.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<TrendingUp />}
                                                label={`+${opt.expectedIncrease}%`}
                                                color="success"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {opt.timestamp}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </Paper>
        </Box>
    );
}
