import { Box, Grid, Card, CardContent, Typography, Chip, Button, LinearProgress } from '@mui/material';
import { Science, Psychology, AutoAwesome, TrendingUp, BugReport, Build } from '@mui/icons-material';

export default function LabPage() {
    const experiments = [
        { name: 'IA Predictiva Avanzada', description: 'Modelos ML para predicción de demanda', status: 'active', progress: 75, category: 'AI/ML', icon: <Psychology /> },
        { name: 'Blockchain Integration', description: 'Trazabilidad con blockchain', status: 'testing', progress: 45, category: 'Blockchain', icon: <Build /> },
        { name: 'Voice Commands', description: 'Control por voz del sistema', status: 'development', progress: 30, category: 'NLP', icon: <AutoAwesome /> },
        { name: 'Quantum Optimization', description: 'Algoritmos cuánticos para logística', status: 'research', progress: 15, category: 'Quantum', icon: <Science /> },
        { name: 'AR Dashboard', description: 'Dashboard en realidad aumentada', status: 'prototype', progress: 60, category: 'AR/VR', icon: <TrendingUp /> },
        { name: 'Auto-Healing System', description: 'Sistema auto-reparador con IA', status: 'testing', progress: 82, category: 'DevOps', icon: <BugReport /> },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'testing': return 'info';
            case 'development': return 'warning';
            case 'research': return 'default';
            case 'prototype': return 'secondary';
            default: return 'default';
        }
    };

    const stats = [
        { label: 'Experimentos Activos', value: '12', icon: <Science />, color: '#1976d2' },
        { label: 'En Producción', value: '5', icon: <TrendingUp />, color: '#2e7d32' },
        { label: 'En Testing', value: '4', icon: <BugReport />, color: '#ed6c02' },
        { label: 'En Investigación', value: '8', icon: <Psychology />, color: '#9c27b0' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>🔬 Laboratorio Experimental</Typography>
                    <Typography variant="body2" color="text.secondary">Innovación y desarrollo de nuevas tecnologías</Typography>
                </Box>
                <Button startIcon={<Science />} variant="contained">Nuevo Experimento</Button>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ bgcolor: stat.color, borderRadius: 2, p: 1, display: 'flex' }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h3" fontWeight={700}>{stat.value}</Typography>
                                </Box>
                                <Typography variant="body1" fontWeight={600}>{stat.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {experiments.map((exp, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {exp.icon}
                                        <Chip label={exp.category} size="small" variant="outlined" />
                                    </Box>
                                    <Chip label={exp.status} size="small" color={getStatusColor(exp.status)} />
                                </Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>{exp.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{exp.description}</Typography>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">Progreso</Typography>
                                        <Typography variant="caption" fontWeight={600}>{exp.progress}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={exp.progress} sx={{ height: 8, borderRadius: 4 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

