import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    InputAdornment,
    CircularProgress,
    Stack,
    Tooltip,
    Card,
    CardContent,
    Select,
    FormControl,
    InputLabel,
    LinearProgress,
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
    Download,
    Block,
    CheckCircle,
    FilterList,
    People,
    Security,
    Accessibility,
    Visibility,
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useAuthStore } from '../store/auth.store';
import { GET_USERS, REMOVE_USER, UPDATE_USER } from '../lib/graphql/queries';

export default function UsersPage() {
    const { user: currentUser } = useAuthStore();
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // MODO DEMO: Usuarios de ejemplo
    const demoUsers = [
        {
            id: 1,
            firstName: 'Admin',
            lastName: 'Sistema',
            email: 'admin@erp.com',
            role: 'ADMIN',
            isActive: true
        },
        {
            id: 2,
            firstName: 'María',
            lastName: 'García',
            email: 'manager@erp.com',
            role: 'MANAGER',
            isActive: true
        },
        {
            id: 3,
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'user@erp.com',
            role: 'USER',
            isActive: true
        },
        {
            id: 4,
            firstName: 'Ana',
            lastName: 'Martínez',
            email: 'ana.martinez@erp.com',
            role: 'USER',
            isActive: true
        },
        {
            id: 5,
            firstName: 'Carlos',
            lastName: 'López',
            email: 'carlos.lopez@erp.com',
            role: 'READONLY',
            isActive: false
        }
    ];

    const { data, loading, error, refetch } = useQuery(GET_USERS, {
        variables: { skip: 0, take: 50, search: searchTerm || undefined },
        errorPolicy: 'all', // No romper UI si hay errores
    });

    const [deleteUser] = useMutation(REMOVE_USER);
    const [updateUser] = useMutation(UPDATE_USER);

    const users = error ? demoUsers : (data?.users || []);

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser({ variables: { id: userId } });
            refetch();
            setOpenDelete(false);
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const handleToggleStatus = async (usr: any) => {
        try {
            await updateUser({
                variables: {
                    updateUserInput: {
                        id: usr.id,
                        isActive: !usr.isActive,
                    },
                },
            });
            refetch();
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
            ADMIN: 'error',
            MANAGER: 'warning',
            USER: 'info',
            READONLY: 'success',
        };
        return colors[role] || 'default';
    };

    const getRoleIcon = (role: string): React.ReactElement => {
        const icons: Record<string, React.ReactElement> = {
            ADMIN: <AdminPanelSettings fontSize="small" />,
            MANAGER: <ManageAccounts fontSize="small" />,
            USER: <AccountCircle fontSize="small" />,
            READONLY: <Accessibility fontSize="small" />,
        };
        return icons[role] || <AccountCircle fontSize="small" />;
    };

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            ADMIN: 'Administrador',
            MANAGER: 'Gerente',
            USER: 'Usuario',
            READONLY: 'Solo Lectura',
        };
        return labels[role] || role;
    };

    // Filter users
    const filteredUsers = users.filter((usr: any) => {
        const matchesSearch = searchTerm === '' || 
            usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${usr.firstName} ${usr.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || usr.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && usr.isActive) ||
            (statusFilter === 'inactive' && !usr.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: users.length,
        active: users.filter((u: any) => u.isActive).length,
        inactive: users.filter((u: any) => u.isActive === false).length,
        admin: users.filter((u: any) => u.role === 'ADMIN').length,
        manager: users.filter((u: any) => u.role === 'MANAGER').length,
        user: users.filter((u: any) => u.role === 'USER').length,
        readonly: users.filter((u: any) => u.role === 'READONLY').length,
        activePercentage: users.length > 0 ? (users.filter((u: any) => u.isActive).length / users.length) * 100 : 0,
    };

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // No mostrar error si hay datos demo disponibles

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
                            <IconButton onClick={() => refetch()}>
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                        <Button variant="outlined" startIcon={<Download />}>
                            Exportar
                        </Button>
                        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}>
                            Nuevo Usuario
                        </Button>
                    </Stack>
                </Stack>
            </Box>


            {/* KPIs Overview */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Usuarios
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats.total}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <People />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Usuarios Activos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {stats.active}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <CheckCircle />
                                </Avatar>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={stats.activePercentage} 
                                sx={{ mt: 1 }}
                                color="success"
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Administradores
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="error.main">
                                        {stats.admin}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'error.main' }}>
                                    <Security />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Usuarios Inactivos
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="warning.main">
                                        {stats.inactive}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <Block />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filters */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Rol</InputLabel>
                            <Select value={roleFilter} label="Rol" onChange={(e) => setRoleFilter(e.target.value)}>
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
                            <Select value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value)}>
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="active">Activos</MenuItem>
                                <MenuItem value="inactive">Inactivos</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={() => {
                                setRoleFilter('all');
                                setStatusFilter('all');
                                setSearchTerm('');
                            }}
                        >
                            Limpiar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'background.default' }}>
                            <TableCell><strong>Usuario</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Rol</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">
                                        {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? 'No hay usuarios que coincidan con los filtros' : 'No hay usuarios disponibles'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredUsers.map((usr: any) => (
                            <TableRow key={usr.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                            {getInitials(usr.firstName || 'U', usr.lastName || 'S')}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {usr.firstName} {usr.lastName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{usr.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={getRoleIcon(usr.role)}
                                        label={getRoleLabel(usr.role)}
                                        color={getRoleColor(usr.role)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={usr.isActive ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                                        label={usr.isActive ? 'Activo' : 'Inactivo'}
                                        color={usr.isActive ? 'success' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Ver detalles">
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedUser(usr);
                                                    setOpenEdit(true);
                                                }}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton 
                                                size="small" 
                                                color="warning"
                                                onClick={() => {
                                                    setSelectedUser(usr);
                                                    setOpenEdit(true);
                                                }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {usr.id !== currentUser?.id && (
                                            <Tooltip title="Activar/Desactivar">
                                                <IconButton
                                                    size="small"
                                                    color={usr.isActive ? 'error' : 'success'}
                                                    onClick={() => handleToggleStatus(usr)}
                                                >
                                                    {usr.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {usr.id !== currentUser?.id && usr.role !== 'ADMIN' && (
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => {
                                                        setSelectedUser(usr);
                                                        setOpenDelete(true);
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create User Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nuevo Usuario</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Nombre" required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Apellido" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" type="email" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Contraseña" type="password" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Rol"
                                    select
                                    required
                                    defaultValue="USER"
                                >
                                    <MenuItem value="ADMIN">Administrador</MenuItem>
                                    <MenuItem value="MANAGER">Gerente</MenuItem>
                                    <MenuItem value="USER">Usuario</MenuItem>
                                    <MenuItem value="READONLY">Solo Lectura</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={() => setOpenCreate(false)}>
                        Crear Usuario
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Nombre" defaultValue={selectedUser.firstName} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Apellido" defaultValue={selectedUser.lastName} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Email" type="email" defaultValue={selectedUser.email} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Rol"
                                        select
                                        defaultValue={selectedUser.role}
                                    >
                                        <MenuItem value="ADMIN">Administrador</MenuItem>
                                        <MenuItem value="MANAGER">Gerente</MenuItem>
                                        <MenuItem value="USER">Usuario</MenuItem>
                                        <MenuItem value="READONLY">Solo Lectura</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={() => setOpenEdit(false)}>
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar a {selectedUser?.firstName} {selectedUser?.lastName}?
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
                    <Button 
                        variant="contained" 
                        color="error"
                        onClick={() => handleDeleteUser(selectedUser?.id)}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
