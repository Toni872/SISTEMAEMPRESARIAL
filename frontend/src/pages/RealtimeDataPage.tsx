import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    LinearProgress,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Tooltip,
} from '@mui/material';
import {
    Refresh,
    Circle,
    TrendingUp,
    TrendingDown,
    Speed,
    Storage,
    NetworkCheck,
    Timeline,
    Notifications,
    Info,
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface RealtimeMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    status: 'healthy' | 'warning' | 'critical';
    lastUpdate: Date;
}

interface StreamData {
    timestamp: string;
    value: number;
    label?: string;
}

interface Alert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: Date;
}

export default function RealtimeDataPage() {
    const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | '30m'>('5m');
    const [isConnected, setIsConnected] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    
    // Métricas en tiempo real
    const [metrics, setMetrics] = useState<RealtimeMetric[]>([
        {
            id: '1',
            name: 'Transacciones/seg',
            value: 124.5,
            unit: 'tps',
            trend: 'up',
            change: 12.3,
            status: 'healthy',
            lastUpdate: new Date(),
        },
        {
            id: '2',
            name: 'Uso de CPU',
            value: 67.8,
            unit: '%',
            trend: 'stable',
            change: 0.5,
            status: 'healthy',
            lastUpdate: new Date(),
        },
        {
            id: '3',
            name: 'Memoria RAM',
            value: 82.4,
            unit: '%',
            trend: 'up',
            change: 5.2,
            status: 'warning',
            lastUpdate: new Date(),
        },
        {
            id: '4',
            name: 'Latencia API',
            value: 45.2,
            unit: 'ms',
            trend: 'down',
            change: -8.1,
            status: 'healthy',
            lastUpdate: new Date(),
        },
        {
            id: '5',
            name: 'Conexiones activas',
            value: 1847,
            unit: 'conn',
            trend: 'up',
            change: 234,
            status: 'healthy',
            lastUpdate: new Date(),
        },
        {
            id: '6',
            name: 'Tráfico de red',
            value: 156.7,
            unit: 'MB/s',
            trend: 'stable',
            change: 2.1,
            status: 'healthy',
            lastUpdate: new Date(),
        },
    ]);

    // Datos de stream (últimos 20 puntos)
    const [streamData, setStreamData] = useState<StreamData[]>(() => {
        const initialData: StreamData[] = [];
        const now = new Date();
        for (let i = 19; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * 3000);
            initialData.push({
                timestamp: timestamp.toLocaleTimeString(),
                value: Math.floor(Math.random() * 50) + 80,
            });
        }
        return initialData;
    });

    // Alertas en tiempo real
    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: '1',
            type: 'warning',
            message: 'Uso de memoria superior al 80%',
            timestamp: new Date(Date.now() - 120000),
        },
        {
            id: '2',
            type: 'success',
            message: 'Backup completado exitosamente',
            timestamp: new Date(Date.now() - 300000),
        },
        {
            id: '3',
            type: 'info',
            message: 'Nuevo nodo añadido al cluster',
            timestamp: new Date(Date.now() - 480000),
        },
    ]);

    // Datos de performance histórica
    const [performanceData, setPerformanceData] = useState<any[]>(() => {
        const data = [];
        for (let i = 0; i < 24; i++) {
            data.push({
                time: `${i}:00`,
                cpu: Math.floor(Math.random() * 40) + 40,
                memory: Math.floor(Math.random() * 30) + 60,
                network: Math.floor(Math.random() * 50) + 50,
            });
        }
        return data;
    });

    // Simular actualización en tiempo real
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            // Actualizar métricas
            setMetrics(prev => prev.map(metric => {
                const randomChange = (Math.random() - 0.5) * 10;
                const newValue = Math.max(0, Math.min(100, metric.value + randomChange));
                const trend = randomChange > 2 ? 'up' : randomChange < -2 ? 'down' : 'stable';
                
                let status: 'healthy' | 'warning' | 'critical' = 'healthy';
                if (metric.name.includes('Memoria') || metric.name.includes('CPU')) {
                    if (newValue > 90) status = 'critical';
                    else if (newValue > 75) status = 'warning';
                }

                return {
                    ...metric,
                    value: newValue,
                    trend,
                    change: randomChange,
                    status,
                    lastUpdate: new Date(),
                };
            }));

            // Actualizar stream de datos
            setStreamData(prev => {
                const newData = [...prev.slice(1)];
                newData.push({
                    timestamp: new Date().toLocaleTimeString(),
                    value: Math.floor(Math.random() * 50) + 80,
                });
                return newData;
            });

            // Simular conexión WebSocket
            setIsConnected(Math.random() > 0.05); // 95% uptime

        }, 3000); // Actualizar cada 3 segundos

        return () => clearInterval(interval);
    }, [autoRefresh]);

    const handleRefresh = () => {
        setMetrics(prev => prev.map(m => ({ ...m, lastUpdate: new Date() })));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'success';
            case 'warning': return 'warning';
            case 'critical': return 'error';
            default: return 'default';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp fontSize="small" sx={{ color: 'success.main' }} />;
            case 'down': return <TrendingDown fontSize="small" sx={{ color: 'error.main' }} />;
            default: return <Circle fontSize="small" sx={{ color: 'text.secondary' }} />;
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        📡 Datos en Tiempo Real
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitoreo y streaming de métricas del sistema en vivo
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip 
                        icon={<Circle sx={{ fontSize: 12 }} />} 
                        label={isConnected ? 'Conectado' : 'Desconectado'} 
                        color={isConnected ? 'success' : 'error'}
                        size="small"
                    />
                    <ToggleButtonGroup
                        value={timeRange}
                        exclusive
                        onChange={(e, newValue) => newValue && setTimeRange(newValue)}
                        size="small"
                    >
                        <ToggleButton value="1m">1m</ToggleButton>
                        <ToggleButton value="5m">5m</ToggleButton>
                        <ToggleButton value="15m">15m</ToggleButton>
                        <ToggleButton value="30m">30m</ToggleButton>
                    </ToggleButtonGroup>
                    <Tooltip title={autoRefresh ? 'Pausar actualización' : 'Reanudar actualización'}>
                        <IconButton 
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            color={autoRefresh ? 'primary' : 'default'}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Métricas en Tiempo Real */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {metrics.map((metric) => (
                    <Grid item xs={12} sm={6} md={4} key={metric.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {metric.name}
                                    </Typography>
                                    <Chip 
                                        label={metric.status} 
                                        color={getStatusColor(metric.status)} 
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                                    <Typography variant="h4" fontWeight={700}>
                                        {metric.value.toFixed(1)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {metric.unit}
                                    </Typography>
                                    {getTrendIcon(metric.trend)}
                                    <Typography 
                                        variant="body2" 
                                        color={metric.change > 0 ? 'success.main' : metric.change < 0 ? 'error.main' : 'text.secondary'}
                                    >
                                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    Actualizado: {metric.lastUpdate.toLocaleTimeString()}
                                </Typography>
                                {metric.status === 'warning' || metric.status === 'critical' ? (
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={metric.value} 
                                        color={metric.status === 'critical' ? 'error' : 'warning'}
                                        sx={{ mt: 1 }}
                                    />
                                ) : null}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Stream de Datos en Vivo */}
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Timeline color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Stream de Transacciones
                                    </Typography>
                                </Box>
                                <Chip 
                                    icon={<Circle sx={{ fontSize: 10, animation: 'pulse 2s infinite' }} />}
                                    label="Live" 
                                    color="error"
                                    size="small"
                                />
                            </Box>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={streamData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="timestamp" 
                                        tick={{ fontSize: 12 }}
                                        interval={4}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <RechartsTooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#8884d8" 
                                        fillOpacity={1} 
                                        fill="url(#colorValue)" 
                                        animationDuration={500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Chip icon={<Speed />} label={`Promedio: ${(streamData.reduce((acc, d) => acc + d.value, 0) / streamData.length).toFixed(1)} tps`} size="small" />
                                <Chip icon={<TrendingUp />} label={`Máximo: ${Math.max(...streamData.map(d => d.value))} tps`} size="small" />
                                <Chip icon={<TrendingDown />} label={`Mínimo: ${Math.min(...streamData.map(d => d.value))} tps`} size="small" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Alertas en Tiempo Real */}
                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Notifications color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Alertas Recientes
                                </Typography>
                                <Chip label={alerts.length} size="small" color="primary" />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {alerts.map((alert) => (
                                    <Alert 
                                        key={alert.id} 
                                        severity={alert.type}
                                        icon={<Info fontSize="small" />}
                                    >
                                        <Typography variant="body2" fontWeight={600}>
                                            {alert.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {Math.floor((Date.now() - alert.timestamp.getTime()) / 60000)} min ago
                                        </Typography>
                                    </Alert>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance Histórica */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <NetworkCheck color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Performance Últimas 24h
                                </Typography>
                            </Box>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memoria %" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="network" stroke="#ffc658" name="Red %" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tabla de Conexiones Activas */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Storage color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Conexiones Activas
                                </Typography>
                                <Chip label="1,847 activas" size="small" color="success" />
                            </Box>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>IP</TableCell>
                                            <TableCell>Protocolo</TableCell>
                                            <TableCell>Duración</TableCell>
                                            <TableCell>Datos enviados</TableCell>
                                            <TableCell>Latencia</TableCell>
                                            <TableCell align="center">Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {[
                                            { client: 'Dashboard-WebApp', ip: '192.168.1.105', protocol: 'WSS', duration: '45m 23s', data: '2.4 MB', latency: '12ms', status: 'healthy' },
                                            { client: 'Mobile-App-iOS', ip: '10.0.1.42', protocol: 'HTTPS/2', duration: '12m 08s', data: '847 KB', latency: '45ms', status: 'healthy' },
                                            { client: 'BI-Analytics', ip: '172.16.0.88', protocol: 'WSS', duration: '2h 15m', data: '15.2 MB', latency: '8ms', status: 'healthy' },
                                            { client: 'API-Integration', ip: '203.0.113.45', protocol: 'REST', duration: '5m 32s', data: '1.2 MB', latency: '156ms', status: 'warning' },
                                            { client: 'Warehouse-Scanner', ip: '192.168.2.201', protocol: 'MQTT', duration: '3h 42m', data: '524 KB', latency: '23ms', status: 'healthy' },
                                        ].map((connection, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                                                            {connection.client.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body2">{connection.client}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{connection.ip}</TableCell>
                                                <TableCell>
                                                    <Chip label={connection.protocol} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>{connection.duration}</TableCell>
                                                <TableCell>{connection.data}</TableCell>
                                                <TableCell>{connection.latency}</TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={connection.status === 'healthy' ? 'OK' : 'Lento'} 
                                                        color={connection.status === 'healthy' ? 'success' : 'warning'} 
                                                        size="small"
                                                    />
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

            {/* CSS para animación pulse */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </Box>
    );
}

