import { Box, Grid, Card, CardContent, Typography, Chip, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Storage, CloudQueue, Speed, Memory, CheckCircle, Warning, Error } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function InfrastructurePage() {
    const metrics = [
        { label: 'Uptime', value: '99.98%', status: 'Excellent', color: '#2e7d32' },
        { label: 'CPU Usage', value: '45%', status: 'Normal', color: '#1976d2' },
        { label: 'Memory', value: '67%', status: 'Normal', color: '#ed6c02' },
        { label: 'Storage', value: '52%', status: 'Normal', color: '#9c27b0' },
    ];

    const servers = [
        { name: 'Server-01 (API)', cpu: 45, memory: 67, disk: 52, status: 'healthy', uptime: '99.98%' },
        { name: 'Server-02 (DB)', cpu: 72, memory: 84, disk: 78, status: 'warning', uptime: '99.95%' },
        { name: 'Server-03 (Cache)', cpu: 23, memory: 34, disk: 15, status: 'healthy', uptime: '99.99%' },
        { name: 'Server-04 (Worker)', cpu: 56, memory: 61, disk: 45, status: 'healthy', uptime: '99.97%' },
    ];

    const performanceData = [
        { time: '00:00', cpu: 45, memory: 62, network: 34 },
        { time: '04:00', cpu: 38, memory: 58, network: 28 },
        { time: '08:00', cpu: 65, memory: 74, network: 56 },
        { time: '12:00', cpu: 82, memory: 81, network: 78 },
        { time: '16:00', cpu: 75, memory: 77, network: 68 },
        { time: '20:00', cpu: 52, memory: 64, network: 45 },
        { time: '24:00', cpu: 45, memory: 62, network: 34 },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy': return <CheckCircle color="success" />;
            case 'warning': return <Warning color="warning" />;
            case 'critical': return <Error color="error" />;
            default: return <CheckCircle />;
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>🖥️ Gestión de Infraestructura</Typography>
                <Typography variant="body2" color="text.secondary">Monitoreo y gestión de servidores y recursos</Typography>
            </Box>

            <Grid container spacing={3}>
                {metrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" gutterBottom>{metric.label}</Typography>
                                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{metric.value}</Typography>
                                <Chip label={metric.status} size="small" color="success" />
                                <LinearProgress variant="determinate" value={parseFloat(metric.value)} sx={{ mt: 2, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: metric.color } }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Performance Histórica</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="cpu" stroke="#1976d2" strokeWidth={2} name="CPU %" />
                                    <Line type="monotone" dataKey="memory" stroke="#2e7d32" strokeWidth={2} name="Memoria %" />
                                    <Line type="monotone" dataKey="network" stroke="#ed6c02" strokeWidth={2} name="Red %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>Servidores</Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Servidor</TableCell>
                                            <TableCell align="center">CPU</TableCell>
                                            <TableCell align="center">Memoria</TableCell>
                                            <TableCell align="center">Disco</TableCell>
                                            <TableCell>Uptime</TableCell>
                                            <TableCell align="center">Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {servers.map((server, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Storage color="action" />
                                                        <Typography variant="body2" fontWeight={600}>{server.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress variant="determinate" value={server.cpu} sx={{ width: 60, height: 6, borderRadius: 3 }} />
                                                        <Typography variant="body2">{server.cpu}%</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress variant="determinate" value={server.memory} sx={{ width: 60, height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { bgcolor: server.memory > 80 ? 'warning.main' : 'primary.main' } }} />
                                                        <Typography variant="body2">{server.memory}%</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress variant="determinate" value={server.disk} sx={{ width: 60, height: 6, borderRadius: 3 }} />
                                                        <Typography variant="body2">{server.disk}%</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><Typography variant="body2">{server.uptime}</Typography></TableCell>
                                                <TableCell align="center">
                                                    <Chip icon={getStatusIcon(server.status)} label={server.status.toUpperCase()} color={server.status === 'healthy' ? 'success' : 'warning'} size="small" />
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

