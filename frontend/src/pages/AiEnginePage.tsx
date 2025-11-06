import React, { useMemo, useState, useRef } from 'react';
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
} from '@mui/material';
import { Memory, Insights, Speed, Download, Pause, PlayArrow, TableChart } from '@mui/icons-material';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ACTIVE_AI_MODELS, PREDICT_DEMAND, OPTIMIZE_PRICE, GET_AI_METRICS, DEPLOY_AI_MODEL } from '../lib/graphql/queries';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { io, Socket } from 'socket.io-client';

export default function AiEnginePage() {
    const { data: aiData, loading: aiLoading, error: aiError, refetch: refetchAI } = useQuery(GET_ACTIVE_AI_MODELS, {
        pollInterval: 30000, // Auto-actualización cada 30s
        errorPolicy: 'all', // No romper UI si hay errores
    });
    const { data: metricsData, refetch: refetchMetrics } = useQuery(GET_AI_METRICS, {
        errorPolicy: 'all', // No romper UI si hay errores
    });

    const [productId, setProductId] = useState<number>(1);
    const [days, setDays] = useState<number>(30);
    const [currentPrice, setCurrentPrice] = useState<number>(299.99);
    const [stock, setStock] = useState<number>(50);
    const [filters, setFilters] = useState({ model: '', from: '', to: '' });
    const [isPaused, setIsPaused] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' }>({ open: false, message: '' });

    const [runPredict, { data: predictData, loading: predictLoading, error: predictError }] = useLazyQuery(PREDICT_DEMAND);
    const [runOptimize, { data: optimizeData, loading: optimizeLoading, error: optimizeError }] = useLazyQuery(OPTIMIZE_PRICE);

    // MODO DEMO: Datos de demostración si no hay backend
    const demoAiModels = {
        operational: 3,
        total_models: 5,
        gpu_usage: 45,
        cpu_usage: 32
    };
    
    const demoMetrics = {
        overall: {
            predictions_today: 127,
            optimizations_today: 43,
            avg_accuracy: 94.2,
            total_predictions: 1543
        },
        series: [
            { timestamp: '10:00', accuracy: 92 },
            { timestamp: '11:00', accuracy: 93 },
            { timestamp: '12:00', accuracy: 94 },
            { timestamp: '13:00', accuracy: 95 },
            { timestamp: '14:00', accuracy: 94 },
        ],
        recentPredictions: [
            { id: 1, model: 'Demand Predictor v2.1', productName: 'Laptop Dell XPS', prediction: 156, confidence: 92, timestamp: '2025-11-05 14:30' },
            { id: 2, model: 'Sales Forecaster', productName: 'Mouse Logitech', prediction: 89, confidence: 88, timestamp: '2025-11-05 14:15' },
        ],
        recentOptimizations: [
            { id: 1, model: 'Price Optimizer', productName: 'Teclado Mecánico', oldPrice: 129.99, newPrice: 139.99, expectedIncrease: 15, timestamp: '2025-11-05 14:45' },
        ]
    };
    
    const aiModels = useMemo(() => aiError ? demoAiModels : aiData?.activeAIModels, [aiData, aiError]);
    const [liveSeries, setLiveSeries] = useState<any[]>([]);
    const series = [...(aiError || !metricsData ? demoMetrics.series : metricsData?.aiMetrics?.series ?? []), ...liveSeries];
    const overall = aiError || !metricsData ? demoMetrics.overall : metricsData?.aiMetrics?.overall;
    const recentPred = aiError || !metricsData ? demoMetrics.recentPredictions : metricsData?.aiMetrics?.recentPredictions ?? [];
    const recentOpt = aiError || !metricsData ? demoMetrics.recentOptimizations : metricsData?.aiMetrics?.recentOptimizations ?? [];

    const [deployOpen, setDeployOpen] = useState(false);
    const [modelName, setModelName] = useState('Demand Predictor');
    const [modelVersion, setModelVersion] = useState('v2.2');
    const chartRef = useRef<HTMLDivElement>(null);

    const [deployAIModel, { loading: deployLoading }] = useMutation(DEPLOY_AI_MODEL, {
        onCompleted: (data) => {
            setSnackbar({ open: true, message: data.deployAIModel.message, severity: 'success' });
            refetchAI();
            setDeployOpen(false);
        },
        onError: () => setSnackbar({ open: true, message: 'Error al desplegar modelo', severity: 'error' }),
    });

    React.useEffect(() => {
        if (isPaused) return;
        
        // Solo intentar WebSocket si hay URL configurada (modo no-demo)
        const wsUrl = import.meta.env.VITE_WS_URL;
        if (!wsUrl) {
            // Modo demo: no hay WebSocket disponible
            if (import.meta.env.DEV) {
                console.log('⚠️ WebSocket no disponible en modo demo');
            }
            return;
        }
        
        // Intentar conexión WebSocket solo en producción con backend
        try {
            const socket: Socket = io(wsUrl, { 
                transports: ['websocket'], 
                reconnection: true, 
                timeout: 10000 
            });
            
            socket.on('connect', () => {
                console.log('WebSocket conectado');
            });
            socket.on('disconnect', () => {
                console.log('WebSocket desconectado');
            });
            socket.on('connect_error', (error) => {
                // No mostrar error en modo demo
                if (import.meta.env.DEV) {
                    console.log('⚠️ WebSocket error (ignorado en demo):', error);
                }
            });
            socket.on('ai:metrics', (p: any) => {
                setLiveSeries((prev) => [...prev.slice(-200), { ...p, ts: new Date(p.ts).toISOString() }]);
            });
            socket.on('ai:alert', (a: any) => {
                setSnackbar({ open: true, message: `${a.title}: ${a.message}`, severity: 'info' });
            });
            
            return () => {
                socket.close();
            };
        } catch (error) {
            // Capturar cualquier error de WebSocket sin romper la UI
            if (import.meta.env.DEV) {
                console.log('⚠️ Error inicializando WebSocket (ignorado):', error);
            }
        }
    }, [isPaused]);

    const formatNumber = (n: number | undefined) => {
        if (n === undefined || n === null || isNaN(n)) return '0.00';
        return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    const formatPct = (n: number | undefined) => {
        if (n === undefined || n === null || isNaN(n)) return '0.0%';
        return `${(n * 100).toFixed(1)}%`;
    };
    const formatDate = (d: string | Date | undefined) => {
        if (!d) return '-';
        const date = typeof d === 'string' ? new Date(d) : d;
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const exportCSV = () => {
        const headers = 'Timestamp,Accuracy,Latency P95 (ms),Latency P99 (ms),Throughput (RPS),Error Rate\n';
        const rows = series.map((s) => `${s.ts},${s.accuracy},${s.latencyMsP95},${s.latencyMsP99},${s.throughputRps},${s.errorRate}`);
        const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-metrics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setSnackbar({ open: true, message: 'CSV exportado correctamente', severity: 'success' });
    };

    const exportChart = () => {
        if (!chartRef.current) return;
        const svgEl = chartRef.current.querySelector('svg');
        if (!svgEl) {
            setSnackbar({ open: true, message: 'No se encontró el gráfico', severity: 'warning' });
            return;
        }
        const svgData = svgEl.outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-chart-${new Date().toISOString().split('T')[0]}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        setSnackbar({ open: true, message: 'Gráfico exportado como SVG', severity: 'success' });
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Chip icon={<Memory />} label="Motor de IA" color="primary" variant="outlined" />
                    <Typography variant="h5" fontWeight={700}>Inteligencia Artificial Operativa</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Tooltip title={isPaused ? 'Reanudar streaming' : 'Pausar streaming'}>
                        <IconButton onClick={() => setIsPaused(!isPaused)} color="primary">
                            {isPaused ? <PlayArrow /> : <Pause />}
                        </IconButton>
                    </Tooltip>
                    <Button variant="outlined" startIcon={<Download />} onClick={exportCSV}>
                        Exportar CSV
                    </Button>
                    <Button variant="outlined" startIcon={<TableChart />} onClick={exportChart}>
                        Exportar Gráfico
                    </Button>
                </Stack>
            </Box>

            <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 3 }}>
                <TextField size="small" label="Modelo" placeholder="Filtrar por nombre" value={filters.model} onChange={(e) => setFilters({ ...filters, model: e.target.value })} sx={{ width: 200 }} />
                <TextField size="small" label="Desde" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ width: 150 }} />
                <TextField size="small" label="Hasta" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ width: 150 }} />
                <Button variant="outlined" onClick={() => { refetchAI(); refetchMetrics(); setSnackbar({ open: true, message: 'Datos actualizados', severity: 'success' }); }} disabled={aiLoading}>Actualizar</Button>
            </Box>


            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Modelos activos</Typography>
                                    <Typography variant="h4" fontWeight={800}>{aiLoading ? '…' : aiModels?.operational ?? 0}</Typography>
                                </Box>
                                <Insights color="primary" />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">Total: {aiLoading ? '…' : aiModels?.total_models ?? 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">En entrenamiento</Typography>
                                    <Typography variant="h4" fontWeight={800}>{aiLoading ? '…' : aiModels?.training ?? 0}</Typography>
                                </Box>
                                <Speed color="warning" />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">Mantenimiento: {aiLoading ? '…' : aiModels?.maintenance ?? 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Predicción de Demanda" subheader="Ejecuta inferencias sobre un producto" />
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                <TextField size="small" label="Producto ID" type="number" value={productId} onChange={(e) => setProductId(Number(e.target.value))} />
                                <TextField size="small" label="Días" type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
                                <Button variant="contained" onClick={() => runPredict({ variables: { productId, days } })} disabled={predictLoading}>Predecir</Button>
                            </Stack>
                            {predictLoading && <LinearProgress sx={{ mt: 2 }} />}
                            {predictError && <Alert severity="error" sx={{ mt: 2 }}>Error en predicción. Verifica el ID del producto.</Alert>}
                            {predictData?.predictDemand && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2">Resultado</Typography>
                                    <Typography variant="body2">Unidades: {predictData.predictDemand.predicted_units} • Confianza: {formatPct(Number(predictData.predictDemand.confidence))}</Typography>
                                    {predictData.predictDemand.recommendations?.length ? (
                                        <Typography variant="caption" color="text.secondary">{predictData.predictDemand.recommendations.join(' • ')}</Typography>
                                    ) : null}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardHeader title="Rendimiento del Motor de IA" subheader="Accuracy, Latencia y Throughput (Actualización en tiempo real)" />
                        <CardContent>
                            <Box ref={chartRef} sx={{ height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={series}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ts" hide />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#1976d2" name="Accuracy" dot={false} />
                                        <Line yAxisId="right" type="monotone" dataKey="latencyMsP95" stroke="#ef6c00" name="p95 (ms)" dot={false} />
                                        <Line yAxisId="right" type="monotone" dataKey="latencyMsP99" stroke="#d32f2f" name="p99 (ms)" dot={false} />
                                        <Line yAxisId="left" type="monotone" dataKey="throughputRps" stroke="#2e7d32" name="RPS" dot={false} />
                                        <Line yAxisId="left" type="monotone" dataKey="errorRate" stroke="#6a1b9a" name="Error Rate" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                            {overall && (
                                <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
                                    <Chip label={`RPS: ${formatNumber(overall.throughputRps)}`} />
                                    <Chip label={`p95: ${formatNumber(overall.latencyMsP95)} ms`} />
                                    <Chip label={`p99: ${formatNumber(overall.latencyMsP99)} ms`} />
                                    <Chip label={`Errores: ${formatPct(overall.errorRate)}`} />
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardHeader title="Historial reciente" subheader="Predicciones y optimizaciones" />
                        <CardContent>
                            <Typography variant="subtitle2">Predicciones</Typography>
                            {recentPred.length > 0 ? recentPred.map((p: any) => (
                                <Typography key={p.id} variant="body2" color="text.secondary">
                                    {p.id} • Prod {p.productId} • {p.units} uds • {formatPct(p.confidence)}
                                </Typography>
                            )) : <Typography variant="caption" color="text.secondary">Sin predicciones recientes</Typography>}
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2">Optimizaciones</Typography>
                            {recentOpt.length > 0 ? recentOpt.map((o: any) => (
                                <Typography key={o.id} variant="body2" color="text.secondary">
                                    {o.id} • Prod {o.productId} • €{formatNumber(o.optimalPrice)} • {formatPct(o.deltaPct / 100)}
                                </Typography>
                            )) : <Typography variant="caption" color="text.secondary">Sin optimizaciones recientes</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Optimización de Precios" subheader="Sugerencia de precio óptimo" />
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                <TextField size="small" label="Producto ID" type="number" value={productId} onChange={(e) => setProductId(Number(e.target.value))} />
                                <TextField size="small" label="Precio actual" type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} />
                                <TextField size="small" label="Stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                                <Button variant="contained" onClick={() => runOptimize({ variables: { productId, currentPrice, stock } })} disabled={optimizeLoading}>Calcular</Button>
                            </Stack>
                            {optimizeLoading && <LinearProgress sx={{ mt: 2 }} />}
                            {optimizeError && <Alert severity="error" sx={{ mt: 2 }}>Error en optimización. Verifica los parámetros.</Alert>}
                            {optimizeData?.optimizePrice && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2">Sugerencia</Typography>
                                    <Typography variant="body2">Precio óptimo: €{formatNumber(optimizeData.optimizePrice.optimal_price)}</Typography>
                                    <Typography variant="body2">Cambio: {formatPct(optimizeData.optimizePrice.price_change_percentage / 100)}</Typography>
                                    <Typography variant="body2">Incremento esperado ingresos: €{formatNumber(optimizeData.optimizePrice.expected_revenue_increase)}</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Modelos de IA" subheader="Estado operativo" />
                        <CardContent>
                            {aiLoading && <LinearProgress />}
                            {!aiLoading && (
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Versión</TableCell>
                                                <TableCell>Precisión</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {aiModels?.models?.map((m: any, i: number) => (
                                                <TableRow key={i}>
                                                    <TableCell>{m.name}</TableCell>
                                                    <TableCell>
                                                        <Chip size="small" label={m.status} color={m.status === 'operational' ? 'success' : m.status === 'training' ? 'warning' : 'default'} />
                                                    </TableCell>
                                                    <TableCell>{m.version}</TableCell>
                                                    <TableCell>{formatPct(m.accuracy)}</TableCell>
                                                </TableRow>
                                            ))}
                                            {!aiModels?.models?.length && (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography variant="body2" color="text.secondary">Sin modelos registrados</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => setDeployOpen(true)}>Desplegar nuevo modelo</Button>
            </Box>

            <Dialog open={deployOpen} onClose={() => setDeployOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Desplegar nuevo modelo</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="Nombre del modelo" value={modelName} onChange={(e) => setModelName(e.target.value)} />
                        <TextField label="Versión" value={modelVersion} onChange={(e) => setModelVersion(e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeployOpen(false)}>Cancelar</Button>
                    <Button onClick={() => deployAIModel({ variables: { name: modelName, version: modelVersion } })} disabled={deployLoading} variant="contained">
                        {deployLoading ? 'Desplegando...' : 'Desplegar'}
                    </Button>
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
