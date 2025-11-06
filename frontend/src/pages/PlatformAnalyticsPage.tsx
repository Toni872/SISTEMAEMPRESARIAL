import { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    LinearProgress,
    Tab,
    Tabs,
    Button,
} from '@mui/material';
import {
    TrendingUp,
    Insights,
    Speed,
    PieChart as PieChartIcon,
    Timeline,
    Download,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PlatformAnalyticsPage() {
    const [period, setPeriod] = useState('month');

    const metrics = [
        { label: 'Total Usuarios', value: '15,847', change: '+18.2%', color: '#1976d2' },
        { label: 'Sesiones Activas', value: '3,245', change: '+12.5%', color: '#2e7d32' },
        { label: 'Tiempo Promedio', value: '42 min', change: '+8.3%', color: '#ed6c02' },
        { label: 'Tasa Conversión', value: '12.8%', change: '+3.4%', color: '#9c27b0' },
    ];

    const usageData = [
        { month: 'Ene', usuarios: 12400, sesiones: 28400, conversiones: 1450 },
        { month: 'Feb', usuarios: 13100, sesiones: 31200, conversiones: 1620 },
        { month: 'Mar', usuarios: 13800, sesiones: 34100, conversiones: 1780 },
        { month: 'Abr', usuarios: 14500, sesiones: 36800, conversiones: 1890 },
        { month: 'May', usuarios: 15200, sesiones: 39200, conversiones: 1950 },
        { month: 'Jun', usuarios: 15847, sesiones: 41500, conversiones: 2034 },
    ];

    const moduleUsage = [
        { name: 'Dashboard', value: 28, color: '#1976d2' },
        { name: 'Ventas', value: 22, color: '#2e7d32' },
        { name: 'Inventario', value: 18, color: '#ed6c02' },
        { name: 'Reportes', value: 15, color: '#9c27b0' },
        { name: 'Otros', value: 17, color: '#757575' },
    ];

    const performanceMetrics = [
        { metric: 'Tiempo Carga', value: 1.2, target: 2.0, unit: 's' },
        { metric: 'API Response', value: 145, target: 200, unit: 'ms' },
        { metric: 'Uptime', value: 99.8, target: 99.5, unit: '%' },
        { metric: 'Error Rate', value: 0.3, target: 1.0, unit: '%' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        📊 Plataforma Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Análisis avanzado de uso y rendimiento de la plataforma
                    </Typography>
                </Box>
                <Button startIcon={<Download />} variant="contained">
                    Exportar Reporte
                </Button>
            </Box>

            {/* Métricas Principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {metrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {metric.label}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                                    <Typography variant="h4" fontWeight={700}>
                                        {metric.value}
                                    </Typography>
                                    <Chip label={metric.change} size="small" color="success" icon={<TrendingUp fontSize="small" />} />
                                </Box>
                                <LinearProgress variant="determinate" value={75} sx={{ bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: metric.color } }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Tendencia de Uso */}
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Tendencia de Uso
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={usageData}>
                                    <defs>
                                        <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorSesiones" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="usuarios" stroke="#1976d2" fillOpacity={1} fill="url(#colorUsuarios)" name="Usuarios" />
                                    <Area type="monotone" dataKey="sesiones" stroke="#2e7d32" fillOpacity={1} fill="url(#colorSesiones)" name="Sesiones" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Uso por Módulo */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Uso por Módulo
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={moduleUsage} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={(entry) => `${entry.value}%`}>
                                        {moduleUsage.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Métricas de Performance */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                                Métricas de Performance
                            </Typography>
                            <Grid container spacing={2}>
                                {performanceMetrics.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">{item.metric}</Typography>
                                                <Chip label={item.value < item.target ? 'Óptimo' : 'Revisar'} size="small" color={item.value < item.target ? 'success' : 'warning'} />
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                                                <Typography variant="h5" fontWeight={700}>{item.value}</Typography>
                                                <Typography variant="body2" color="text.secondary">{item.unit}</Typography>
                                            </Box>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={(item.value / item.target) * 100} 
                                                sx={{ 
                                                    height: 8, 
                                                    borderRadius: 4,
                                                    bgcolor: 'grey.200',
                                                    '& .MuiLinearProgress-bar': { 
                                                        bgcolor: item.value < item.target ? 'success.main' : 'warning.main' 
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                Target: {item.target} {item.unit}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

