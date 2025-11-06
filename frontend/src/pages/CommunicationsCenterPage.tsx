import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, Button, TextField, InputAdornment } from '@mui/material';
import { Email, Message, Phone, VideoCall, Send, Search } from '@mui/icons-material';

export default function CommunicationsCenterPage() {
    const channels = [
        { name: 'Email', count: 247, icon: <Email />, color: '#1976d2' },
        { name: 'Chat', count: 189, icon: <Message />, color: '#2e7d32' },
        { name: 'Llamadas', count: 94, icon: <Phone />, color: '#ed6c02' },
        { name: 'Videollamadas', count: 32, icon: <VideoCall />, color: '#9c27b0' },
    ];

    const recentMessages = [
        { sender: 'María González', message: 'Necesito los reportes de Q2', time: 'Hace 5 min', avatar: 'M', status: 'unread' },
        { sender: 'Carlos Ruiz', message: 'Reunión confirmada para mañana', time: 'Hace 12 min', avatar: 'C', status: 'read' },
        { sender: 'Ana Martínez', message: 'Presupuesto aprobado', time: 'Hace 1h', avatar: 'A', status: 'read' },
        { sender: 'Luis Fernández', message: 'Adjunto el contrato firmado', time: 'Hace 2h', avatar: 'L', status: 'read' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>💬 Centro de Comunicaciones</Typography>
                <Typography variant="body2" color="text.secondary">Hub centralizado de comunicaciones internas y externas</Typography>
            </Box>

            <Grid container spacing={3}>
                {channels.map((channel, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: channel.color }}>{channel.icon}</Avatar>
                                    <Typography variant="h4" fontWeight={700}>{channel.count}</Typography>
                                </Box>
                                <Typography variant="h6">{channel.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12} md={8}>
                    <Card sx={{ height: 600 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>Mensajes</Typography>
                                <TextField size="small" placeholder="Buscar..." InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {recentMessages.map((msg, index) => (
                                    <Card key={index} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                                        <CardContent sx={{ py: 1.5 }}>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>{msg.avatar}</Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body1" fontWeight={600}>{msg.sender}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{msg.time}</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">{msg.message}</Typography>
                                                </Box>
                                                {msg.status === 'unread' && <Chip label="Nuevo" size="small" color="primary" />}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Nuevo Mensaje</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                <TextField fullWidth size="small" label="Para" placeholder="Destinatario" />
                                <TextField fullWidth size="small" label="Asunto" placeholder="Asunto del mensaje" />
                                <TextField fullWidth multiline rows={8} label="Mensaje" placeholder="Escribe tu mensaje aquí..." />
                                <Button variant="contained" startIcon={<Send />} fullWidth>Enviar</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

