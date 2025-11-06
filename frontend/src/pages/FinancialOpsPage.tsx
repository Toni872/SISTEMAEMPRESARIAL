import { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
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
    Tab,
    Tabs,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    AccountBalance,
    Receipt,
    CreditCard,
    Payment,
    MoreVert,
    FileDownload,
    Add,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinancialOpsPage() {
    const [tabValue, setTabValue] = useState(0);

    // Métricas financieras
    const metrics = [
        { label: 'Ingresos del Mes', value: '€487,250', change: '+15.3%', trend: 'up', color: '#2e7d32' },
        { label: 'Gastos Operativos', value: '€234,120', change: '+8.2%', trend: 'up', color: '#ed6c02' },
        { label: 'Margen Neto', value: '€253,130', change: '+22.1%', trend: 'up', color: '#1976d2' },
        { label: 'Flujo de Caja', value: '€198,450', change: '-5.4%', trend: 'down', color: '#9c27b0' },
    ];

    // Distribución de ingresos
    const revenueData = [
        { name: 'Ventas Productos', value: 45, color: '#1976d2' },
        { name: 'Servicios', value: 30, color: '#2e7d32' },
        { name: 'Suscripciones', value: 15, color: '#ed6c02' },
        { name: 'Otros', value: 10, color: '#9c27b0' },
    ];

    // Tendencia financiera mensual
    const monthlyTrend = [
        { month: 'Ene', ingresos: 420, gastos: 280, margen: 140 },
        { month: 'Feb', ingresos: 445, gastos: 295, margen: 150 },
        { month: 'Mar', ingresos: 465, gastos: 310, margen: 155 },
        { month: 'Abr', ingresos: 475, gastos: 318, margen: 157 },
        { month: 'May', ingresos: 480, gastos: 325, margen: 155 },
        { month: 'Jun', ingresos: 487, gastos: 234, margen: 253 },
    ];

    // Transacciones recientes
    const transactions = [
        { id: 'TRX-2024-001', type: 'Ingreso', concept: 'Venta orden #45123', amount: '€12,450', status: 'completed', date: '2024-06-15', category: 'Ventas' },
        { id: 'TRX-2024-002', type: 'Gasto', concept: 'Pago proveedores', amount: '-€8,900', status: 'completed', date: '2024-06-15', category: 'Compras' },
        { id: 'TRX-2024-003', type: 'Ingreso', concept: 'Suscripción mensual', amount: '€2,300', status: 'completed', date: '2024-06-14', category: 'Suscripciones' },
        { id: 'TRX-2024-004', type: 'Gasto', concept: 'Nómina empleados', amount: '-€45,670', status: 'pending', date: '2024-06-14', category: 'RRHH' },
        { id: 'TRX-2024-005', type: 'Ingreso', concept: 'Venta orden #45089', amount: '€18,750', status: 'completed', date: '2024-06-13', category: 'Ventas' },
        { id: 'TRX-2024-006', type: 'Gasto', concept: 'Servicios cloud', amount: '-€1,850', status: 'completed', date: '2024-06-13', category: 'IT' },
    ];

    // Cuentas bancarias
    const accounts = [
        { name: 'Cuenta Corriente Principal', bank: 'BBVA', balance: '€245,890', iban: '**** 4523', status: 'active' },
        { name: 'Cuenta Ahorro Empresarial', bank: 'Santander', balance: '€156,340', iban: '**** 7891', status: 'active' },
        { name: 'Cuenta Operaciones', bank: 'CaixaBank', balance: '€89,120', iban: '**** 2345', status: 'active' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        💰 Operaciones Financieras
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestión financiera y contabilidad en tiempo real
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<FileDownload />} variant="outlined" size="small">
                        Exportar
                    </Button>
                    <Button startIcon={<Add />} variant="contained" size="small">
                        Nueva Transacción
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
                                    <Typography variant="h5" fontWeight={700}>
                                        {metric.value}
                                    </Typography>
                                    <Chip 
                                        label={metric.change} 
                                        size="small" 
                                        color={metric.trend === 'up' ? (metric.label.includes('Gastos') ? 'warning' : 'success') : 'error'}
                                        icon={metric.trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
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
                {/* Tendencia Financiera */}
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Tendencia Financiera
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="ingresos" stroke="#2e7d32" strokeWidth={2} name="Ingresos (K€)" />
                                    <Line type="monotone" dataKey="gastos" stroke="#d32f2f" strokeWidth={2} name="Gastos (K€)" />
                                    <Line type="monotone" dataKey="margen" stroke="#1976d2" strokeWidth={2} name="Margen (K€)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Distribución de Ingresos */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Distribución Ingresos
                            </Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={revenueData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={(entry) => `${entry.value}%`}
                                    >
                                        {revenueData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                {revenueData.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: 1 }} />
                                            <Typography variant="body2">{item.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={600}>{item.value}%</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Cuentas Bancarias */}
                <Grid item xs={12} lg={5}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                                Cuentas Bancarias
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {accounts.map((account, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {account.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {account.bank} - {account.iban}
                                                    </Typography>
                                                </Box>
                                                <Chip label={account.status} color="success" size="small" />
                                            </Box>
                                            <Typography variant="h5" fontWeight={700} color="primary">
                                                {account.balance}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Transacciones Recientes */}
                <Grid item xs={12} lg={7}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                                Transacciones Recientes
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Concepto</TableCell>
                                            <TableCell>Categoría</TableCell>
                                            <TableCell align="right">Monto</TableCell>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell align="center">Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {tx.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        icon={tx.type === 'Ingreso' ? <TrendingUp /> : <TrendingDown />}
                                                        label={tx.type} 
                                                        color={tx.type === 'Ingreso' ? 'success' : 'warning'}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {tx.concept}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={tx.category} size="small" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography 
                                                        variant="body2" 
                                                        fontWeight={600}
                                                        color={tx.type === 'Ingreso' ? 'success.main' : 'error.main'}
                                                    >
                                                        {tx.amount}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {tx.date}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={tx.status} 
                                                        color={tx.status === 'completed' ? 'success' : 'warning'}
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
        </Box>
    );
}

