import { ReactNode, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Speed,
  Inventory,
  ShoppingCart,
  LocalShipping,
  People,
  Assessment,
  Logout,
  ChevronLeft,
  Home,
  Memory,
  Business,
  Bolt,
  PhoneIphone,
  Layers,
  Cloud,
  Group,
  Store,
  AccountBalance,
  Insights,
  Description,
  Security,
  Tune,
  Forum,
  School,
  Construction,
  Science,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/auth.store';

const DRAWER_WIDTH = 260;

interface MenuItemType {
  text: string;
  icon: ReactNode;
  path: string;
  roles?: Array<'ADMIN' | 'MANAGER' | 'USER' | 'READONLY'>;
}

const menuItems: MenuItemType[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  { text: 'Motor de IA', icon: <Memory />, path: '/ai-engine', roles: ['ADMIN','MANAGER'] },
  // Núcleo
  {
    text: 'Productos',
    icon: <Inventory />,
    path: '/products',
  },
  {
    text: 'Ventas',
    icon: <ShoppingCart />,
    path: '/sales',
  },
  {
    text: 'Compras',
    icon: <LocalShipping />,
    path: '/purchases',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    text: 'Usuarios',
    icon: <People />,
    path: '/users',
    roles: ['ADMIN'],
  },
  {
    text: 'Reportes',
    icon: <Assessment />,
    path: '/reports',
    roles: ['ADMIN', 'MANAGER'],
  },
  // Módulos Ejecutivos ampliados
  { text: 'Logística Inteligente', icon: <LocalShipping />, path: '/logistics', roles: ['ADMIN','MANAGER'] },
  { text: 'Business Core', icon: <Business />, path: '/business-core', roles: ['ADMIN','MANAGER'] },
  { text: 'Centro Automatización', icon: <Bolt />, path: '/automation-center', roles: ['ADMIN','MANAGER'] },
  { text: 'Operaciones Móviles', icon: <PhoneIphone />, path: '/mobile-ops', roles: ['ADMIN','MANAGER'] },
  { text: 'Capa Integración', icon: <Layers />, path: '/integration-layer', roles: ['ADMIN','MANAGER'] },
  { text: 'Datos Tiempo Real', icon: <Cloud />, path: '/realtime-data', roles: ['ADMIN','MANAGER'] },
  { text: 'Customer Engagement', icon: <Group />, path: '/customer-engagement', roles: ['ADMIN','MANAGER'] },
  { text: 'Red de Proveedores', icon: <Store />, path: '/supplier-network', roles: ['ADMIN','MANAGER'] },
  { text: 'Operaciones Financieras', icon: <AccountBalance />, path: '/financial-ops', roles: ['ADMIN','MANAGER'] },
  { text: 'Plataforma Analytics', icon: <Insights />, path: '/platform-analytics', roles: ['ADMIN','MANAGER'] },
  { text: 'Gestión Documental', icon: <Description />, path: '/document-management', roles: ['ADMIN','MANAGER'] },
  { text: 'Seguridad y Gobernanza', icon: <Security />, path: '/security-governance', roles: ['ADMIN','MANAGER'] },
  { text: 'Motor Configuración', icon: <Tune />, path: '/config-engine', roles: ['ADMIN','MANAGER'] },
  { text: 'Centro Comunicaciones', icon: <Forum />, path: '/communications-center', roles: ['ADMIN','MANAGER'] },
  { text: 'Gestión Conocimiento', icon: <School />, path: '/knowledge-management', roles: ['ADMIN','MANAGER'] },
  { text: 'Gestión Infraestructura', icon: <Construction />, path: '/infrastructure', roles: ['ADMIN','MANAGER'] },
  { text: 'Laboratorio Experimental', icon: <Science />, path: '/lab', roles: ['ADMIN','MANAGER'] },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuthStore();

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleGoToLanding = () => {
    logout(); // Cerrar sesión para volver a la landing
    navigate('/');
    handleClose();
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const canAccessMenuItem = (item: MenuItemType) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || 'READONLY');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'MANAGER':
        return 'warning';
      case 'USER':
        return 'info';
      default:
        return 'default';
    }
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Dashboard color="primary" />
          <Typography variant="h6" fontWeight="bold" color="primary">
            Sistema ERP
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.firstName.charAt(0)}
            {user?.lastName.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={user?.role}
          size="small"
          color={getRoleColor(user?.role || '')}
          sx={{ mt: 1 }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.filter(canAccessMenuItem).map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
          ml: { md: `${drawerOpen ? DRAWER_WIDTH : 0}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión Empresarial
          </Typography>
          <Button variant="outlined" color="inherit" size="small" onClick={() => handleNavigate('/ai-engine')} sx={{ mr: 1 }}>
            Motor de IA
          </Button>
          <Box>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleGoToLanding}>
                <ListItemIcon>
                  <Home fontSize="small" />
                </ListItemIcon>
                Volver a Landing
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            overflowY: 'auto',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
