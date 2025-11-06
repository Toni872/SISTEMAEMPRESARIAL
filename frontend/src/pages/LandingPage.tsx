import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    AppBar,
    Toolbar,
    Stack,
    Divider,
    Link,
    Chip,
    useScrollTrigger,
    Slide,
    Fade,
} from '@mui/material';
import {
    Dashboard,
    Security,
    Speed,
    Inventory,
    Analytics,
    Psychology,
    ArrowForward,
    Business,
} from '@mui/icons-material';

// Componente para navbar que aparece al hacer scroll
const HideOnScroll = ({ children }: { children: React.ReactElement }) => {
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    const features = [
        {
            icon: <Dashboard sx={{ fontSize: 40 }} />,
            title: 'Dashboard Ejecutivo',
            description: 'Métricas en tiempo real con visualizaciones interactivas para toma de decisiones informadas',
            color: '#1976d2',
        },
        {
            icon: <Psychology sx={{ fontSize: 40 }} />,
            title: 'Motor de IA',
            description: 'Predicción de demanda y optimización de precios con modelos de machine learning',
            color: '#9c27b0',
        },
        {
            icon: <Inventory sx={{ fontSize: 40 }} />,
            title: 'Gestión de Inventario',
            description: 'Control inteligente de stock con alertas automáticas y sincronización en tiempo real',
            color: '#2e7d32',
        },
        {
            icon: <Analytics sx={{ fontSize: 40 }} />,
            title: 'Analytics Avanzado',
            description: 'Reportes predictivos, análisis de tendencias y visualizaciones personalizables',
            color: '#ed6c02',
        },
        {
            icon: <Security sx={{ fontSize: 40 }} />,
            title: 'Seguridad Enterprise',
            description: 'Cifrado end-to-end, autenticación multifactor y control de acceso granular (RBAC)',
            color: '#d32f2f',
        },
        {
            icon: <Speed sx={{ fontSize: 40 }} />,
            title: 'Alto Rendimiento',
            description: 'Arquitectura escalable con colas asíncronas y caché distribuido para millones de transacciones',
            color: '#0288d1',
        },
    ];

    const stats = [
        { value: '15+', label: 'Módulos Integrados' },
        { value: '99.9%', label: 'Uptime Garantizado' },
        { value: '<200ms', label: 'Tiempo de Respuesta' },
        { value: '24/7', label: 'Soporte Técnico' },
    ];

    const techStack = [
        { name: 'TypeScript', category: 'Language' },
        { name: 'React 18', category: 'Frontend' },
        { name: 'NestJS', category: 'Backend' },
        { name: 'GraphQL', category: 'API' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'Redis', category: 'Cache' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'Python/FastAPI', category: 'AI Engine' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Navigation Bar */}
            <HideOnScroll>
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business sx={{ fontSize: 32, color: 'primary.main' }} />
                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                Sistema ERP
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button color="inherit" sx={{ color: 'text.primary' }}>
                                Características
                            </Button>
                            <Button color="inherit" sx={{ color: 'text.primary' }}>
                                Tecnología
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleGetStarted}
                                endIcon={<ArrowForward />}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Acceder
                            </Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>

            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    pt: { xs: 15, md: 18 },
                    pb: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in timeout={1000}>
                        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                            <Chip
                                label="En Construcción Activa"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    mb: 3,
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                fontWeight="bold"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    lineHeight: 1.2,
                                    mb: 3,
                                }}
                            >
                                ERP Empresarial
                                <br />
                                <Box component="span" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                    Full-Stack
                                </Box>
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    opacity: 0.95,
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                                }}
                            >
                                La plataforma integral para gestionar tu negocio con inteligencia artificial,
                                análisis en tiempo real y arquitectura escalable.
                            </Typography>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="center"
                                sx={{ mt: 4 }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleGetStarted}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#667eea',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Comenzar Ahora
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                    onClick={() => {
                                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Ver Demo
                                </Button>
                            </Stack>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container maxWidth="lg" sx={{ py: 6, mt: -4, position: 'relative', zIndex: 2 }}>
                <Card
                    elevation={8}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Grid container>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Box
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        borderRight: { md: index < stats.length - 1 ? 1 : 0 },
                                        borderColor: 'divider',
                                        borderBottom: { xs: index < stats.length - 2 ? 1 : 0, md: 0 },
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        fontWeight="bold"
                                        color="primary.main"
                                        sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            </Container>

            {/* Features Section */}
            <Box id="features" sx={{ py: 10, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h3"
                            component="h2"
                            gutterBottom
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                        >
                            Características Principales
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                            Todo lo que necesitas para gestionar tu empresa de forma integral y eficiente
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Fade in timeout={800} style={{ transitionDelay: `${index * 100}ms` }}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            p: 3,
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: `0 12px 40px ${feature.color}20`,
                                                borderColor: feature.color,
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: feature.color,
                                                mb: 2,
                                                display: 'inline-flex',
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: `${feature.color}10`,
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                                            {feature.description}
                                        </Typography>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Tech Stack Section */}
            <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            Stack Tecnológico
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                            Construido con las mejores tecnologías del ecosistema moderno
                        </Typography>
                    </Box>

                    <Grid container spacing={2} justifyContent="center">
                        {techStack.map((tech, index) => (
                            <Grid item key={index}>
                                <Chip
                                    label={tech.name}
                                    sx={{
                                        px: 2,
                                        py: 3,
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Backend robusto con NestJS, GraphQL y Prisma • Frontend moderno con React 18 y
                            Material-UI • IA con Python y FastAPI • DevOps con Docker y despliegue en Vercel
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: 10,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            ¿Listo para transformar tu negocio?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}>
                            Únete a empresas que confían en nuestro ERP para gestionar sus operaciones de forma
                            inteligente y eficiente
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleGetStarted}
                                endIcon={<ArrowForward />}
                                sx={{
                                    bgcolor: 'white',
                                    color: '#667eea',
                                    px: 5,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.95)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Empezar Gratis
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                Ver Documentación
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: 'grey.900', color: 'grey.300', py: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Business sx={{ fontSize: 32, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    Sistema ERP
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
                                Plataforma ERP empresarial full-stack construida con las mejores tecnologías
                                modernas para gestión integral de negocios.
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Link
                                    href="https://github.com/Toni872/SISTEMAEMPRESARIAL"
                                    target="_blank"
                                    color="inherit"
                                    sx={{ '&:hover': { color: 'primary.main' } }}
                                >
                                    GitHub
                                </Link>
                                <Link
                                    href="https://frontend-aopijxall-toni872s-projects.vercel.app"
                                    target="_blank"
                                    color="inherit"
                                    sx={{ '&:hover': { color: 'primary.main' } }}
                                >
                                    Demo
                                </Link>
                            </Stack>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" fontWeight="bold" color="white" gutterBottom>
                                Producto
                            </Typography>
                            <Stack spacing={1}>
                                <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                                    Características
                                </Link>
                                <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                                    Tecnología
                                </Link>
                                <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                                    Roadmap
                                </Link>
                            </Stack>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" fontWeight="bold" color="white" gutterBottom>
                                Recursos
                            </Typography>
                            <Stack spacing={1}>
                                <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                                    Documentación
                                </Link>
                                <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                                    API Reference
                                </Link>
                                <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                                    Soporte
                                </Link>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" fontWeight="bold" color="white" gutterBottom>
                                Estado del Proyecto
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
                                Este proyecto está en construcción activa. Algunas funcionalidades están
                                completamente implementadas, otras están en desarrollo.
                            </Typography>
                            <Chip
                                label="En Desarrollo"
                                size="small"
                                sx={{
                                    bgcolor: 'warning.main',
                                    color: 'white',
                                    fontWeight: 600,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2">
                            © 2024 Sistema ERP. Todos los derechos reservados.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Desarrollado con ❤️ usando React, NestJS y TypeScript
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
