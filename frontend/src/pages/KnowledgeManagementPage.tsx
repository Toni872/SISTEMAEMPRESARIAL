import { Box, Grid, Card, CardContent, Typography, Chip, Button, TextField, InputAdornment, Avatar } from '@mui/material';
import { School, MenuBook, VideoLibrary, Quiz, Search, Add, TrendingUp } from '@mui/icons-material';

export default function KnowledgeManagementPage() {
    const stats = [
        { label: 'Artículos', value: '1,247', icon: <MenuBook />, color: '#1976d2' },
        { label: 'Videos', value: '342', icon: <VideoLibrary />, color: '#2e7d32' },
        { label: 'Cursos', value: '89', icon: <School />, color: '#ed6c02' },
        { label: 'Quizzes', value: '156', icon: <Quiz />, color: '#9c27b0' },
    ];

    const categories = [
        { name: 'Onboarding', articles: 45, icon: '🎓' },
        { name: 'Procesos', articles: 128, icon: '📋' },
        { name: 'Tecnología', articles: 89, icon: '💻' },
        { name: 'Ventas', articles: 67, icon: '💼' },
        { name: 'Soporte', articles: 234, icon: '🛠️' },
        { name: 'Legal', articles: 56, icon: '⚖️' },
    ];

    const recentArticles = [
        { title: 'Guía completa del sistema ERP', author: 'Carlos Ruiz', views: 1247, date: '2024-06-15', category: 'Tecnología' },
        { title: 'Proceso de ventas optimizado', author: 'María González', views: 892, date: '2024-06-14', category: 'Ventas' },
        { title: 'Manual de onboarding', author: 'Ana Martínez', views: 1567, date: '2024-06-12', category: 'Onboarding' },
        { title: 'Políticas de seguridad 2024', author: 'Luis Fernández', views: 734, date: '2024-06-10', category: 'Legal' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>📚 Gestión del Conocimiento</Typography>
                    <Typography variant="body2" color="text.secondary">Base de conocimiento y recursos de aprendizaje</Typography>
                </Box>
                <Button startIcon={<Add />} variant="contained">Crear Artículo</Button>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: stat.color }}>{stat.icon}</Avatar>
                                    <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
                                </Box>
                                <Typography variant="h6">{stat.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <TextField fullWidth placeholder="Buscar en la base de conocimiento..." InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>Categorías</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {categories.map((cat, index) => (
                                    <Card key={index} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                                        <CardContent sx={{ py: 1.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h6">{cat.icon}</Typography>
                                                    <Typography variant="body1" fontWeight={600}>{cat.name}</Typography>
                                                </Box>
                                                <Chip label={`${cat.articles} artículos`} size="small" />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>Artículos Recientes</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {recentArticles.map((article, index) => (
                                    <Card key={index} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="h6">{article.title}</Typography>
                                                <Chip label={article.category} size="small" />
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{article.author.charAt(0)}</Avatar>
                                                <Typography variant="body2" color="text.secondary">{article.author}</Typography>
                                                <Typography variant="body2" color="text.secondary">•</Typography>
                                                <Typography variant="body2" color="text.secondary">{article.date}</Typography>
                                                <Typography variant="body2" color="text.secondary">•</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <TrendingUp fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">{article.views} vistas</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

