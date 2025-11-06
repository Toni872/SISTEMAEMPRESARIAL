import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Stack,
    Avatar,
    Chip,
    Paper,
    IconButton,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Dashboard,
    Inventory,
    PointOfSale,
    ShoppingBag,
    People,
    Assessment,
    Psychology,
    LocalShipping,
    Security,
    Speed,
    TrendingUp,
    CheckCircle,
    Star,
    ArrowForward,
    PlayArrow,
    Email,
    Phone,
    LinkedIn,
    GitHub,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    // Características principales
    const features = [
        {
            id: 1,
            icon: <Dashboard sx={{ fontSize: 40 }} />,
            title: 'Dashboard Inteligente',
            description: 'Visualiza todas tus métricas clave en tiempo real con gráficos interactivos y KPIs personalizables.',
            color: '#667eea',
        },
        {
            id: 2,
            icon: <Psychology sx={{ fontSize: 40 }} />,
            title: 'Motor de IA',
            description: 'Predicciones de demanda, optimización de precios y análisis predictivo con machine learning.',
            color: '#48bb78',
        },
        {
            id: 3,
            icon: <Inventory sx={{ fontSize: 40 }} />,
            title: 'Gestión de Inventario',
            description: 'Control total de productos, stock, categorías y alertas automáticas de reposición.',
            color: '#ed8936',
        },
        {
            id: 4,
            icon: <PointOfSale sx={{ fontSize: 40 }} />,
            title: 'Ventas Avanzadas',
            description: 'Órdenes, facturas, clientes y análisis de ventas con seguimiento completo del ciclo.',
            color: '#9f7aea',
        },
        {
            id: 5,
            icon: <ShoppingBag sx={{ fontSize: 40 }} />,
            title: 'Compras Optimizadas',
            description: 'Gestión de proveedores, órdenes de compra y recepciones con control de costos.',
            color: '#38b2ac',
        },
        {
            id: 6,
            icon: <Assessment sx={{ fontSize: 40 }} />,
            title: 'Reportes y Análisis',
            description: 'Informes detallados, gráficos avanzados y exportación en múltiples formatos.',
            color: '#f56565',
        },
    ];

    // Módulos del sistema
    const modules = [
        { name: 'Dashboard', icon: <Dashboard />, count: '15+ KPIs' },
        { name: 'Productos', icon: <Inventory />, count: '234 items' },
        { name: 'Ventas', icon: <PointOfSale />, count: '€245K' },
        { name: 'Compras', icon: <ShoppingBag />, count: '€156K' },
        { name: 'Usuarios', icon: <People />, count: '8 roles' },
        { name: 'Reportes', icon: <Assessment />, count: '12 tipos' },
        { name: 'Motor IA', icon: <Psychology />, count: '32 modelos' },
        { name: 'Logística', icon: <LocalShipping />, count: 'Real-time' },
    ];

    // Estadísticas
    const stats = [
        { value: '28', label: 'Módulos', icon: <Dashboard />, color: 'primary' },
        { value: '100%', label: 'Funcional', icon: <CheckCircle />, color: 'success' },
        { value: '94.2%', label: 'Accuracy IA', icon: <Psychology />, color: 'info' },
        { value: '24/7', label: 'Disponible', icon: <Speed />, color: 'warning' },
    ];

    // Testimonios (simulados)
    const testimonials = [
        {
            name: 'María García',
            role: 'CEO, TechCorp',
            avatar: 'MG',
            rating: 5,
            text: 'Sistema ERP completo y profesional. La interfaz es intuitiva y las funcionalidades cubren todas nuestras necesidades.',
        },
        {
            name: 'Juan Pérez',
            role: 'CFO, InnovateLab',
            avatar: 'JP',
            rating: 5,
            text: 'El motor de IA ha revolucionado nuestra gestión de inventario. Las predicciones son increíblemente precisas.',
        },
        {
            name: 'Ana Martínez',
            role: 'CTO, DataFlow',
            avatar: 'AM',
            rating: 5,
            text: 'Implementación rápida y soporte excepcional. Los reportes en tiempo real nos han dado una ventaja competitiva.',
        },
    ];

    const handleGetStarted = () => {
        navigate('/dashboard');
    };

    const handleViewDemo = () => {
        navigate('/dashboard');
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    pt: 12,
                    pb: 8,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        bgcolor: alpha('#fff', 0.1),
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -150,
                        left: -150,
                        width: 500,
                        height: 500,
                        borderRadius: '50%',
                        bgcolor: alpha('#fff', 0.05),
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Chip
                                label="Sistema ERP Empresarial"
                                sx={{
                                    bgcolor: alpha('#fff', 0.2),
                                    color: 'white',
                                    fontWeight: 600,
                                    mb: 3,
                                }}
                            />
                            <Typography variant="h2" fontWeight={800} gutterBottom>
                                Gestiona tu Empresa con Inteligencia
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                                Sistema ERP completo con 28 módulos integrados, Motor de IA avanzado y análisis en tiempo real
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    onClick={handleGetStarted}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        '&:hover': {
                                            bgcolor: alpha('#fff', 0.9),
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    Comenzar Ahora
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<PlayArrow />}
                                    onClick={handleViewDemo}
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: alpha('#fff', 0.1),
                                        },
                                    }}
                                >
                                    Ver Demo
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Animated dashboard preview */}
                                <Paper
                                    elevation={24}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        bgcolor: 'background.paper',
                                        width: '100%',
                                        maxWidth: 500,
                                        animation: 'float 3s ease-in-out infinite',
                                        '@keyframes float': {
                                            '0%, 100%': { transform: 'translateY(0px)' },
                                            '50%': { transform: 'translateY(-20px)' },
                                        },
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        {stats.map((stat, index) => (
                                            <Grid item xs={6} key={index}>
                                                <Card>
                                                    <CardContent>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: `${stat.color}.main`,
                                                                    width: 40,
                                                                    height: 40,
                                                                }}
                                                            >
                                                                {stat.icon}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="h5" fontWeight={800}>
                                                                    {stat.value}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {stat.label}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Bar */}
            <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    }}
                >
                    <Grid container spacing={4}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Stack alignItems="center" spacing={1}>
                                    <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 56, height: 56 }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Typography variant="h3" fontWeight={800}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {stat.label}
                                    </Typography>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip label="Características" color="primary" sx={{ mb: 2, fontWeight: 600 }} />
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        Todo lo que Necesitas en un Solo Sistema
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                        Potencia tu empresa con módulos integrados, inteligencia artificial y análisis en tiempo real
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {features.map((feature) => (
                        <Grid item xs={12} md={4} key={feature.id}>
                            <Card
                                onMouseEnter={() => setHoveredFeature(feature.id)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    transform: hoveredFeature === feature.id ? 'translateY(-8px)' : 'translateY(0)',
                                    boxShadow: hoveredFeature === feature.id ? 8 : 2,
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: feature.color,
                                            width: 72,
                                            height: 72,
                                            mb: 3,
                                        }}
                                    >
                                        {feature.icon}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight={700} gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Modules Grid */}
            <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 12 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Chip label="Módulos" color="primary" sx={{ mb: 2, fontWeight: 600 }} />
                        <Typography variant="h3" fontWeight={800} gutterBottom>
                            28 Módulos Integrados
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Cada módulo diseñado para maximizar tu productividad
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {modules.map((module, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Paper
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '& .MuiSvgIcon-root': {
                                                color: 'white',
                                            },
                                        },
                                    }}
                                >
                                    <Box sx={{ color: 'primary.main', mb: 1 }}>{module.icon}</Box>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        {module.name}
                                    </Typography>
                                    <Chip label={module.count} size="small" />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip label="Testimonios" color="primary" sx={{ mb: 2, fontWeight: 600 }} />
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        Lo que Dicen Nuestros Clientes
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Empresas que confían en nuestro sistema
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                                        ))}
                                    </Stack>
                                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                                        "{testimonial.text}"
                                    </Typography>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                            {testimonial.avatar}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {testimonial.role}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    py: 12,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight={800} gutterBottom>
                            ¿Listo para Transformar tu Empresa?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Únete a cientos de empresas que ya están optimizando sus operaciones con nuestro sistema ERP
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                onClick={handleGetStarted}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    px: 5,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        bgcolor: alpha('#fff', 0.9),
                                    },
                                }}
                            >
                                Comenzar Gratis
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleViewDemo}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    px: 5,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: alpha('#fff', 0.1),
                                    },
                                }}
                            >
                                Solicitar Demo
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', py: 6, borderTop: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Dashboard sx={{ fontSize: 32, color: 'primary.main' }} />
                                <Typography variant="h5" fontWeight={800}>
                                    ERP System
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Sistema ERP empresarial completo con inteligencia artificial y análisis en tiempo real.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton size="small" color="primary">
                                    <Email />
                                </IconButton>
                                <IconButton size="small" color="primary">
                                    <LinkedIn />
                                </IconButton>
                                <IconButton size="small" color="primary">
                                    <GitHub />
                                </IconButton>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={4}>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        Producto
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Características
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Precios
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Demo
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        Empresa
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Sobre Nosotros
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Contacto
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Blog
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        Recursos
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Documentación
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            API
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Soporte
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        Legal
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Privacidad
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Términos
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Cookies
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            © 2025 ERP System. Desarrollado por{' '}
                            <Typography component="span" variant="body2" fontWeight={700} color="primary.main">
                                Antonio Lloret Sánchez
                            </Typography>
                            . Todos los derechos reservados.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
