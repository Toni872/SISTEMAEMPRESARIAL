import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Person,
  VpnKey,
} from '@mui/icons-material';
import { useAuthStore } from '../store/auth.store';

interface LoginData {
  login: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [login, { loading }] = useMutation<LoginData>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { accessToken, user } = data.login;
      setAuth(accessToken, { ...user, id: parseInt(user.id), role: user.role as "ADMIN" | "MANAGER" | "USER" | "READONLY" });
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
      
      // MODO DEMO: Si hay error de red (sin backend), permitir acceso demo
      if (error.networkError) {
        console.log('🔵 MODO DEMO ACTIVADO - Sin conexión al backend');
        // Usuarios demo disponibles
        const demoUsers: Record<string, { id: number; email: string; firstName: string; lastName: string; role: "ADMIN" | "MANAGER" | "USER" }> = {
          'admin@erp.com': { id: 1, email: 'admin@erp.com', firstName: 'Admin', lastName: 'Demo', role: 'ADMIN' },
          'manager@erp.com': { id: 2, email: 'manager@erp.com', firstName: 'Manager', lastName: 'Demo', role: 'MANAGER' },
          'user@erp.com': { id: 3, email: 'user@erp.com', firstName: 'Usuario', lastName: 'Demo', role: 'USER' },
        };
        
        const demoUser = demoUsers[email.toLowerCase()];
        if (demoUser && password === 'admin123') {
          // Acceso demo exitoso
          setAuth('demo-token-visual-mode', demoUser);
          navigate('/dashboard');
          return;
        }
        
        // Si el email no es demo o la contraseña es incorrecta, mostrar mensaje
        setError('🎭 MODO DEMO ACTIVADO\n\nSin conexión al backend. Usa estas credenciales:\n\n👤 Admin: admin@erp.com / admin123\n👤 Manager: manager@erp.com / admin123\n👤 Usuario: user@erp.com / admin123');
        return;
      }
      
      // Error de GraphQL (credenciales inválidas con backend activo)
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const gqlError = error.graphQLErrors[0];
        setError(gqlError.message || 'Credenciales inválidas. Por favor intenta nuevamente.');
        return;
      }
      
      // Error genérico
      setError('Error al iniciar sesión. Por favor intenta nuevamente.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      await login({
        variables: { email, password },
      });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'manager' | 'user') => {
    const credentials = {
      admin: { email: 'admin@erp.com', password: 'admin123' },
      manager: { email: 'manager@erp.com', password: 'admin123' },
      user: { email: 'user@erp.com', password: 'admin123' },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={10}
          sx={{
            borderRadius: 3,
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: 'primary.main',
                  width: 64,
                  height: 64,
                }}
              >
                <LockOutlined fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h4" fontWeight="bold">
                Sistema ERP
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ingresa tus credenciales para continuar
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity={error.includes('MODO DEMO') ? 'info' : 'error'} 
                sx={{ mb: 2 }}
              >
                <Typography component="div" sx={{ whiteSpace: 'pre-line' }}>
                  {error}
                </Typography>
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  Acceso rápido de prueba:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleQuickLogin('admin')}
                    disabled={loading}
                    sx={{ flex: 1, textTransform: 'none' }}
                  >
                    Admin
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleQuickLogin('manager')}
                    disabled={loading}
                    sx={{ flex: 1, textTransform: 'none' }}
                  >
                    Manager
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleQuickLogin('user')}
                    disabled={loading}
                    sx={{ flex: 1, textTransform: 'none' }}
                  >
                    User
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          color="white"
          align="center"
          display="block"
          sx={{ mt: 3 }}
        >
          Sistema ERP v1.0.0 - Todos los derechos reservados
        </Typography>
      </Container>
    </Box>
  );
}
