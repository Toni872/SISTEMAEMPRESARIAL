import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Avatar,
    TextField,
    Grid,
    InputAdornment,
    Stack,
    Tooltip,
    Card,
    CardContent,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Search,
    PersonAdd,
    AdminPanelSettings,
    ManageAccounts,
    AccountCircle,
    Refresh,
    Block,
    CheckCircle,
    People,
    Security,
    Accessibility,
} from '@mui/icons-material';
import { useAuthStore } from '../store/auth.store';

export default function UsersPage() {
    const { user: currentUser } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [refreshKey, setRefreshKey] = useState(0);

    // Datos demo - Usuarios del sistema
    const users = [
        {
            id: 1,
            firstName: 'Admin',
            lastName: 'Sistema',
            email: 'admin@erp.com',
            role: 'ADMIN',
            isActive: true,
            lastLogin: '2025-11-06 14:30',
            createdAt: '2024-01-15',
        },
        {
            id: 2,
            firstName: 'María',
            lastName: 'García',
            email: 'maria.garcia@erp.com',
            role: 'MANAGER',
            isActive: true,
            lastLogin: '2025-11-06 12:15',
            createdAt: '2024-02-20',
        },
        {
            id: 3,
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@erp.com',
            role: 'USER',
            isActive: true,
            lastLogin: '2025-11-06 10:45',
            createdAt: '2024-03-10',
        },
        {
            id: 4,
            firstName: 'Ana',
            lastName: 'Martínez',
            email: 'ana.martinez@erp.com',
            role: 'USER',
            isActive: true,
            lastLogin: '2025-11-05 16:20',
            createdAt: '2024-04-05',
        },
        {
            id: 5,
            firstName: 'Carlos',
            lastName: 'López',
            email: 'carlos.lopez@erp.com',
            role: 'READONLY',
            isActive: false,
            lastLogin: '2025-10-28 09:30',
            createdAt: '2024-05-12',
        },
        {
            id: 6,
            firstName: 'Laura',
            lastName: 'Fernández',
            email: 'laura.fernandez@erp.com',
            role: 'MANAGER',
            isActive: true,
            lastLogin: '2025-11-06 11:00',
            createdAt: '2024-06-18',
        },
        {
            id: 7,
            firstName: 'Pedro',
            lastName: 'Sánchez',
            email: 'pedro.sanchez@erp.com',
            role: 'USER',
            isActive: true,
            lastLogin: '2025-11-06 13:45',
            createdAt: '2024-07-22',
        },
        {
            id: 8,
            firstName: 'Isabel',
            lastName: 'Rodríguez',
            email: 'isabel.rodriguez@erp.com',
            role: 'USER',
            isActive: false,
            lastLogin: '2025-10-15 14:20',
            createdAt: '2024-08-30',
        },
    ];

    // Métricas
    const userMetrics = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        managers: users.filter(u => u.role === 'MANAGER').length,
        regularUsers: users.filter(u => u.role === 'USER').length,
        readonly: users.filter(u => u.role === 'READONLY').length,
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const getRoleLabel = (role: string) => {
        const roleLabels: Record<string, string> = {
            ADMIN: 'Administrador',
            MANAGER: 'Gerente',
            USER: 'Usuario',
            READONLY: 'Solo Lectura',
        };
        return roleLabels[role] || role;
    };

    const getRoleColor = (role: string) => {
        const roleColors: Record<string, any> = {
            ADMIN: 'error',
            MANAGER: 'warning',
            USER: 'primary',
            READONLY: 'default',
        };
        return roleColors[role] || 'default';
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <AdminPanelSettings />;
            case 'MANAGER':
                return <ManageAccounts />;
            case 'USER':
                return <AccountCircle />;
            case 'READONLY':
                return <Accessibility />;
            default:
                return <AccountCircle />;
        }
    };

    // Filtrado
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && user.isActive) ||
            (statusFilter === 'inactive' && !user.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <Container maxWidth="xl" className="page-enter">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <People sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Gestión de Usuarios
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Administra usuarios, roles y permisos del sistema
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Actualizar datos">
                            <IconButton onClick={handleRefresh} color="primary">
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="contained" startIcon={<PersonAdd />}>
                            Nuevo Usuario
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* KPIs Principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Usuarios
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800}>
                                        {userMetrics.total}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Registrados en el sistema
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <People sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Usuarios Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="success.main">
                                        {userMetrics.active}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {((userMetrics.active / userMetrics.total) * 100).toFixed(0)}% del total
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                                    <CheckCircle sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Administradores
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="error.main">
                                        {userMetrics.admins}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Acceso completo
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                                    <Security sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="card-hover">
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Gerentes
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="warning.main">
                                        {userMetrics.managers}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Gestión avanzada
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                                    <ManageAccounts sx={{ fontSize: 32 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filtros y Búsqueda */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                value={roleFilter}
                                label="Rol"
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <MenuItem value="all">Todos los roles</MenuItem>
                                <MenuItem value="ADMIN">Administrador</MenuItem>
                                <MenuItem value="MANAGER">Gerente</MenuItem>
                                <MenuItem value="USER">Usuario</MenuItem>
                                <MenuItem value="READONLY">Solo Lectura</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Estado"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="active">Activos</MenuItem>
                                <MenuItem value="inactive">Inactivos</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla de Usuarios */}
            <Paper sx={{ borderRadius: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Usuario</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Rol</strong></TableCell>
                                <TableCell><strong>Estado</strong></TableCell>
                                <TableCell><strong>Último Acceso</strong></TableCell>
                                <TableCell><strong>Fecha Registro</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar sx={{ bgcolor: getRoleColor(user.role) + '.main' }}>
                                                {getInitials(user.firstName, user.lastName)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {user.id}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{user.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={getRoleIcon(user.role)}
                                            label={getRoleLabel(user.role)}
                                            color={getRoleColor(user.role)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={user.isActive ? <CheckCircle /> : <Block />}
                                            label={user.isActive ? 'Activo' : 'Inactivo'}
                                            color={user.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.lastLogin}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.createdAt}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Editar usuario">
                                                <IconButton size="small" color="primary">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar usuario">
                                                <IconButton size="small" color="error">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}
