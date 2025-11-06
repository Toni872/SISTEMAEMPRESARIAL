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
    Tab,
    Tabs,
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
} from '@mui/material';
import {
    TrendingUp,
    Email,
    Phone,
    Message,
    Favorite,
    Star,
    MoreVert,
    PersonAdd,
    Campaign,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function CustomerEngagementPage() {
    const [tabValue, setTabValue] = useState(0);

    // Métricas de engagement
    const metrics = [
        { label: 'Clientes Activos', value: '12,485', change: '+12.5%', trend: 'up', color: '#1976d2' },
        { label: 'Tasa de Retención', value: '87.3%', change: '+3.2%', trend: 'up', color: '#2e7d32' },
        { label: 'NPS Score', value: '72', change: '+5', trend: 'up', color: '#ed6c02' },
        { label: 'Satisfacción', value: '4.6/5', change: '+0.3', trend: 'up', color: '#9c27b0' },
    ];

    // Canales de comunicación
    const channels = [
        { name: 'Email', value: 45, color: '#1976d2' },
        { name: 'Teléfono', value: 25, color: '#2e7d32' },
        { name: 'Chat', value: 20, color: '#ed6c02' },
        { name: 'Redes Sociales', value: 10, color: '#9c27b0' },
    ];

    // Clientes VIP
    const vipCustomers = [
        { name: 'María González', company: 'Tech Solutions SA', engagement: 95, revenue: '€245,000', avatar: 'M', tier: 'Platinum' },
        { name: 'Carlos Ruiz', company: 'Innovate Corp', engagement: 92, revenue: '€198,000', avatar: 'C', tier: 'Platinum' },
        { name: 'Ana Martínez', company: 'Digital Plus', engagement: 88, revenue: '€167,000', avatar: 'A', tier: 'Gold' },
        { name: 'Luis Fernández', company: 'Smart Business', engagement: 85, revenue: '€142,000', avatar: 'L', tier: 'Gold' },
        { name: 'Isabel Torres', company: 'Future Tech', engagement: 82, revenue: '€128,000', avatar: 'I', tier: 'Gold' },
    ];

    // Engagement histórico
    const engagementData = [
        { month: 'Ene', email: 2400, phone: 1398, chat: 800 },
        { month: 'Feb', email: 2800, phone: 1600, chat: 950 },
        { month: 'Mar', email: 3200, phone: 1800, chat: 1100 },
        { month: 'Abr', email: 3600, phone: 2000, chat: 1250 },
        { month: 'May', email: 4000, phone: 2200, chat: 1400 },
        { month: 'Jun', email: 4400, phone: 2400, chat: 1550 },
    ];

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    👥 Customer Engagement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Gestión de relaciones y engagement con clientes
                </Typography>
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
                                        color="success"
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
                {/* Canales de Comunicación */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Canales de Comunicación
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={channels}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {channels.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                {channels.map((channel, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, bgcolor: channel.color, borderRadius: 1 }} />
                                            <Typography variant="body2">{channel.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={600}>{channel.value}%</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Engagement Histórico */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Historial de Interacciones
                            </Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="email" stroke="#1976d2" strokeWidth={2} name="Email" />
                                    <Line type="monotone" dataKey="phone" stroke="#2e7d32" strokeWidth={2} name="Teléfono" />
                                    <Line type="monotone" dataKey="chat" stroke="#ed6c02" strokeWidth={2} name="Chat" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Clientes VIP */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Clientes VIP
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button startIcon={<PersonAdd />} variant="outlined" size="small">
                                        Añadir Cliente
                                    </Button>
                                    <Button startIcon={<Campaign />} variant="contained" size="small">
                                        Campaña
                                    </Button>
                                </Box>
                            </Box>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Empresa</TableCell>
                                            <TableCell>Tier</TableCell>
                                            <TableCell>Engagement</TableCell>
                                            <TableCell>Revenue Anual</TableCell>
                                            <TableCell>Rating</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vipCustomers.map((customer, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ bgcolor: 'primary.main' }}>{customer.avatar}</Avatar>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {customer.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{customer.company}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={customer.tier} 
                                                        color={customer.tier === 'Platinum' ? 'primary' : 'warning'}
                                                        size="small"
                                                        icon={<Star />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={customer.engagement} 
                                                            sx={{ width: 80, height: 6, borderRadius: 3 }}
                                                        />
                                                        <Typography variant="body2">{customer.engagement}%</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {customer.revenue}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Rating value={4.5} precision={0.5} size="small" readOnly />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small">
                                                        <Email fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <Phone fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <Message fontSize="small" />
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

