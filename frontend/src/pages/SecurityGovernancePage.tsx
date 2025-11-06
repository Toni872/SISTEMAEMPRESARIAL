import { Box, Grid, Card, CardContent, Typography, Chip, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button } from '@mui/material';
import { Security, Shield, VpnKey, Warning, CheckCircle, Error, CloudDone, Add } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function SecurityGovernancePage() {
    const metrics = [
        { label: 'Nivel Seguridad', value: '94%', status: 'Excelente', color: '#2e7d32' },
        { label: 'Amenazas Bloqueadas', value: '1,247', change: '+89', color: '#1976d2' },
        { label: 'Incidentes Activos', value: '3', change: '-12', color: '#ed6c02' },
        { label: 'Cumplimiento', value: '98.5%', status: 'Alto', color: '#9c27b0' },
    ];

    const threats = [
        { type: 'Malware', count: 547, severity: 'high', color: '#d32f2f' },
        { type: 'Phishing', count: 412, severity: 'medium', color: '#ed6c02' },
        { type: 'DDoS', count: 156, severity: 'high', color: '#d32f2f' },
        { type: 'Acceso no autorizado', count: 132, severity: 'critical', color: '#b71c1c' },
    ];

    const securityLogs = [
        { event: 'Login fallido múltiple', user: 'unknown@external.com', ip: '203.0.113.45', severity: 'high', time: 'Hace 5 min', status: 'Bloqueado' },
        { event: 'Cambio de permisos', user: 'admin@erp.com', ip: '192.168.1.10', severity: 'medium', time: 'Hace 12 min', status: 'Auditado' },
        { event: 'Acceso fuera de horario', user: 'usuario@erp.com', ip: '10.0.1.25', severity: 'low', time: 'Hace 25 min', status: 'Permitido' },
        { event: 'Descarga masiva datos', user: 'manager@erp.com', ip: '192.168.1.45', severity: 'high', time: 'Hace 1h', status: 'Revisando' },
    ];

    const compliance = [
        { standard: 'GDPR', status: 'Compliant', score: 98, color: '#2e7d32' },
        { standard: 'ISO 27001', status: 'Compliant', score: 96, color: '#2e7d32' },
        { standard: 'SOC 2', status: 'In Progress', score: 85, color: '#ed6c02' },
        { standard: 'PCI DSS', status: 'Compliant', score: 100, color: '#2e7d32' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        🔒 Seguridad y Gobernanza
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitoreo de seguridad, cumplimiento y gobernanza de datos
                    </Typography>
                </Box>
                <Button startIcon={<Add />} variant="contained">Nueva Política</Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                {metrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" gutterBottom>{metric.label}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                                    <Typography variant="h4" fontWeight={700}>{metric.value}</Typography>
                                    {metric.status && <Chip label={metric.status} size="small" color="success" />}
                                    {metric.change && <Chip label={metric.change} size="small" color="info" />}
                                </Box>
                                <LinearProgress variant="determinate" value={parseInt(metric.value)} sx={{ bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: metric.color } }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Amenazas Detectadas</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={threats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#d32f2f" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Cumplimiento Normativo</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                {compliance.map((item, index) => (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>{item.standard}</Typography>
                                            <Chip label={item.status} size="small" color={item.status === 'Compliant' ? 'success' : 'warning'} />
                                        </Box>
                                        <LinearProgress variant="determinate" value={item.score} sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: item.color } }} />
                                        <Typography variant="caption" color="text.secondary">Score: {item.score}%</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>Logs de Seguridad</Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Evento</TableCell>
                                            <TableCell>Usuario</TableCell>
                                            <TableCell>IP</TableCell>
                                            <TableCell>Severidad</TableCell>
                                            <TableCell>Tiempo</TableCell>
                                            <TableCell align="center">Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {securityLogs.map((log, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {log.severity === 'high' ? <Warning color="error" /> : log.severity === 'medium' ? <Warning color="warning" /> : <CheckCircle color="success" />}
                                                        <Typography variant="body2">{log.event}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{log.user}</TableCell>
                                                <TableCell>{log.ip}</TableCell>
                                                <TableCell>
                                                    <Chip label={log.severity} size="small" color={log.severity === 'high' ? 'error' : log.severity === 'medium' ? 'warning' : 'success'} />
                                                </TableCell>
                                                <TableCell>{log.time}</TableCell>
                                                <TableCell align="center">
                                                    <Chip label={log.status} size="small" color={log.status === 'Bloqueado' ? 'error' : log.status === 'Permitido' ? 'success' : 'info'} />
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

