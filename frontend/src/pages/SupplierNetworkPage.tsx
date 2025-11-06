import { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Rating,
    Tab,
    Tabs,
} from '@mui/material';
import {
    TrendingUp,
    LocalShipping,
    CheckCircle,
    Warning,
    Error,
    Schedule,
    LocationOn,
    Star,
    MoreVert,
    Add,
    FileDownload,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function SupplierNetworkPage() {
    const [tabValue, setTabValue] = useState(0);

    // Métricas de la red de proveedores
    const metrics = [
        { label: 'Proveedores Activos', value: '247', change: '+18', trend: 'up', color: '#1976d2' },
        { label: 'Tasa Cumplimiento', value: '94.7%', change: '+2.1%', trend: 'up', color: '#2e7d32' },
        { label: 'Pedidos Pendientes', value: '142', change: '-23', trend: 'down', color: '#ed6c02' },
        { label: 'Rating Promedio', value: '4.3/5', change: '+0.2', trend: 'up', color: '#9c27b0' },
    ];

    // Distribución por categoría
    const categoryData = [
        { name: 'Materias Primas', value: 35, color: '#1976d2' },
        { name: 'Componentes', value: 28, color: '#2e7d32' },
        { name: 'Servicios', value: 22, color: '#ed6c02' },
        { name: 'Logística', value: 15, color: '#9c27b0' },
    ];

    // Performance por región
    const regionData = [
        { region: 'Europa', onTime: 95, delayed: 3, cancelled: 2 },
        { region: 'Asia', onTime: 88, delayed: 8, cancelled: 4 },
        { region: 'América', onTime: 92, delayed: 5, cancelled: 3 },
        { region: 'África', onTime: 78, delayed: 15, cancelled: 7 },
    ];

    // Top proveedores
    const topSuppliers = [
        { name: 'Global Materials Co.', category: 'Materias Primas', rating: 4.9, onTime: 98, orders: 245, revenue: '€847,000', status: 'excellent', country: 'DE' },
        { name: 'Tech Components Ltd.', category: 'Componentes', rating: 4.7, onTime: 96, orders: 198, revenue: '€623,000', status: 'excellent', country: 'CN' },
        { name: 'Swift Logistics Inc.', category: 'Logística', rating: 4.5, onTime: 94, orders: 312, revenue: '€456,000', status: 'good', country: 'NL' },
        { name: 'Premium Services SA', category: 'Servicios', rating: 4.4, onTime: 92, orders: 167, revenue: '€389,000', status: 'good', country: 'ES' },
        { name: 'QuickShip Express', category: 'Logística', rating: 4.2, onTime: 89, orders: 234, revenue: '€312,000', status: 'good', country: 'US' },
        { name: 'Raw Materials Direct', category: 'Materias Primas', rating: 3.8, onTime: 82, orders: 156, revenue: '€278,000', status: 'warning', country: 'BR' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'success';
            case 'good': return 'info';
            case 'warning': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'excellent': return <CheckCircle />;
            case 'good': return <Schedule />;
            case 'warning': return <Warning />;
            default: return <Error />;
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        🌐 Red de Proveedores
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestión y monitoreo de la cadena de suministro
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<FileDownload />} variant="outlined" size="small">
                        Exportar
                    </Button>
                    <Button startIcon={<Add />} variant="contained" size="small">
                        Nuevo Proveedor
                    </Button>
                </Box>
            </Box>

            {/* Métricas principales */}
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
                                    <Chip 
                                        label={metric.change} 
                                        size="small" 
                                        color={metric.trend === 'up' ? 'success' : 'error'}
                                        icon={<TrendingUp fontSize="small" />}
                                    />
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={75} 
                                    sx={{ bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: metric.color } }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Distribución por Categoría */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Distribución por Categoría
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={(entry) => `${entry.value}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                {categoryData.map((cat, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, bgcolor: cat.color, borderRadius: 1 }} />
                                            <Typography variant="body2">{cat.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={600}>{cat.value}%</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance por Región */}
                <Grid item xs={12} md={7}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Performance por Región
                            </Typography>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={regionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="region" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="onTime" fill="#2e7d32" name="A Tiempo" />
                                    <Bar dataKey="delayed" fill="#ed6c02" name="Retrasados" />
                                    <Bar dataKey="cancelled" fill="#d32f2f" name="Cancelados" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Proveedores */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                                Top Proveedores
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Proveedor</TableCell>
                                            <TableCell>Categoría</TableCell>
                                            <TableCell>País</TableCell>
                                            <TableCell>Rating</TableCell>
                                            <TableCell>A Tiempo</TableCell>
                                            <TableCell>Pedidos</TableCell>
                                            <TableCell>Revenue</TableCell>
                                            <TableCell align="center">Estado</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {topSuppliers.map((supplier, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
                                                            {supplier.name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {supplier.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={supplier.category} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <LocationOn fontSize="small" color="action" />
                                                        <Typography variant="body2">{supplier.country}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Rating value={supplier.rating} precision={0.1} size="small" readOnly />
                                                        <Typography variant="body2">{supplier.rating}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={supplier.onTime} 
                                                            sx={{ 
                                                                width: 60, 
                                                                height: 6, 
                                                                borderRadius: 3,
                                                                '& .MuiLinearProgress-bar': { 
                                                                    bgcolor: supplier.onTime > 95 ? 'success.main' : supplier.onTime > 85 ? 'warning.main' : 'error.main' 
                                                                }
                                                            }}
                                                        />
                                                        <Typography variant="body2">{supplier.onTime}%</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{supplier.orders}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {supplier.revenue}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        icon={getStatusIcon(supplier.status)}
                                                        label={supplier.status.toUpperCase()} 
                                                        color={getStatusColor(supplier.status)} 
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small">
                                                        <LocalShipping fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <Star fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <MoreVert fontSize="small" />
                                                    </IconButton>
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
        </Box>
    );
}

