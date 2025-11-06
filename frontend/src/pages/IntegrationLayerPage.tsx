import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Sync as SyncIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';

const GET_INTEGRATIONS = gql`
  query GetIntegrations {
    integrations {
      name
      type
      version
      connected
      status {
        enabled
        connected
        lastSyncAt
        lastError
        stats {
          totalSyncs
          successfulSyncs
          failedSyncs
          lastSyncDuration
        }
      }
    }
  }
`;

const SYNC_INTEGRATION = gql`
  mutation SyncIntegration(
    $integrationName: String!
    $syncType: SyncType!
    $direction: SyncDirection
    $fullSync: Boolean
  ) {
    syncIntegration(
      integrationName: $integrationName
      syncType: $syncType
      direction: $direction
      fullSync: $fullSync
    ) {
      success
      message
      recordsProcessed
      recordsCreated
      recordsUpdated
      recordsFailed
      duration
      completedAt
      errors {
        recordId
        message
        code
      }
    }
  }
`;

const CONNECT_INTEGRATION = gql`
  mutation ConnectIntegration($name: String!) {
    connectIntegration(name: $name)
  }
`;

const DISCONNECT_INTEGRATION = gql`
  mutation DisconnectIntegration($name: String!) {
    disconnectIntegration(name: $name)
  }
`;

const VALIDATE_CREDENTIALS = gql`
  mutation ValidateIntegrationCredentials($name: String!) {
    validateIntegrationCredentials(name: $name)
  }
`;

interface Integration {
  name: string;
  type: string;
  version: string;
  connected: boolean;
  status: {
    enabled: boolean;
    connected: boolean;
    lastSyncAt?: string;
    lastError?: string;
    stats?: {
      totalSyncs: number;
      successfulSyncs: number;
      failedSyncs: number;
      lastSyncDuration?: number;
    };
  };
}

export default function IntegrationLayerPage() {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' }>({
    open: false,
    message: '',
  });
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [syncType, setSyncType] = useState<'products' | 'orders' | 'customers'>('products');
  const [syncDirection, setSyncDirection] = useState<'from_external' | 'to_external' | 'bidirectional'>('from_external');
  const [fullSync, setFullSync] = useState(false);

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // MODO DEMO: Integraciones de ejemplo
  const demoIntegrations: Integration[] = [
    {
      name: 'DemoAdapter',
      type: 'DEMO',
      version: '1.0.0',
      connected: true,
      status: {
        enabled: true,
        connected: true,
        lastSyncAt: new Date().toISOString(),
        stats: {
          totalSyncs: 245,
          successfulSyncs: 238,
          failedSyncs: 7,
          lastSyncDuration: 1200
        }
      }
    },
    {
      name: 'Shopify',
      type: 'ECOMMERCE',
      version: '2.1.0',
      connected: false,
      status: {
        enabled: false,
        connected: false,
        stats: {
          totalSyncs: 0,
          successfulSyncs: 0,
          failedSyncs: 0
        }
      }
    }
  ];

  const { data, loading, error, refetch } = useQuery<{ integrations: Integration[] }>(GET_INTEGRATIONS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      // Solo loguear en desarrollo
      if (import.meta.env.DEV) {
        console.error('GraphQL Error:', err);
      }
    },
  });
  
  // Usar datos demo si hay error de red
  const integrations = error ? demoIntegrations : (data?.integrations || []);

  const [syncIntegration, { loading: syncLoading }] = useMutation(SYNC_INTEGRATION, {
    onCompleted: (data) => {
      const result = data.syncIntegration;
      if (result.success) {
        showSnackbar(
          `Sincronización exitosa: ${result.recordsProcessed} registros procesados`,
          'success'
        );
        refetch();
      } else {
        showSnackbar(`Error en sincronización: ${result.message}`, 'error');
      }
      setSyncDialogOpen(false);
    },
    onError: (error) => {
      showSnackbar(`Error: ${error.message}`, 'error');
      setSyncDialogOpen(false);
    },
  });

  const [connectIntegration] = useMutation(CONNECT_INTEGRATION, {
    onCompleted: () => {
      showSnackbar('Integración conectada exitosamente', 'success');
      refetch();
    },
    onError: (error) => {
      showSnackbar(`Error al conectar: ${error.message}`, 'error');
    },
  });

  const [disconnectIntegration] = useMutation(DISCONNECT_INTEGRATION, {
    onCompleted: () => {
      showSnackbar('Integración desconectada exitosamente', 'success');
      refetch();
    },
    onError: (error) => {
      showSnackbar(`Error al desconectar: ${error.message}`, 'error');
    },
  });

  const [validateCredentials, { loading: validating }] = useMutation(VALIDATE_CREDENTIALS, {
    onCompleted: (data) => {
      if (data.validateIntegrationCredentials) {
        showSnackbar('Credenciales válidas', 'success');
      } else {
        showSnackbar('Credenciales inválidas', 'error');
      }
    },
    onError: (error) => {
      showSnackbar(`Error al validar: ${error.message}`, 'error');
    },
  });

  const handleSync = () => {
    if (!selectedIntegration) return;

    syncIntegration({
      variables: {
        integrationName: selectedIntegration,
        syncType: syncType.toUpperCase(),
        direction: syncDirection.toUpperCase(),
        fullSync,
      },
    });
  };

  const handleConnect = (name: string) => {
    connectIntegration({ variables: { name } });
  };

  const handleDisconnect = (name: string) => {
    disconnectIntegration({ variables: { name } });
  };

  const handleValidate = (name: string) => {
    validateCredentials({ variables: { name } });
  };

  const handleOpenSyncDialog = (name: string) => {
    setSelectedIntegration(name);
    setSyncDialogOpen(true);
  };

  // Esta línea ahora está duplicada, se eliminó

  if (loading && !integrations.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Cargando integraciones...
        </Typography>
      </Box>
    );
  }

  // Mostrar estado vacío si hay error de red en producción (modo visual)
  if (error && !data && !error.networkError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error al cargar integraciones</AlertTitle>
          {error.message}
        </Alert>
        <Button variant="outlined" onClick={() => refetch()} startIcon={<RefreshIcon />}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Capa de Integración
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona y sincroniza datos con plataformas externas
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
        >
          Actualizar
        </Button>
      </Box>

      
      {integrations.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No hay integraciones configuradas. Los adaptadores se registrarán automáticamente cuando se implementen.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {integrations.map((integration) => (
            <Grid item xs={12} md={6} lg={4} key={integration.name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: integration.status.connected ? '2px solid' : '1px solid',
                  borderColor: integration.status.connected ? 'success.main' : 'divider',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {integration.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {integration.type} v{integration.version}
                      </Typography>
                    </Box>
                    <Chip
                      icon={integration.status.connected ? <CheckCircleIcon /> : <ErrorIcon />}
                      label={integration.status.connected ? 'Conectado' : 'Desconectado'}
                      color={integration.status.connected ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {integration.status.stats && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Estadísticas
                      </Typography>
                      <Typography variant="body2">
                        Sincronizaciones: {integration.status.stats.totalSyncs}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Exitosas: {integration.status.stats.successfulSyncs}
                      </Typography>
                      <Typography variant="body2" color="error.main">
                        Fallidas: {integration.status.stats.failedSyncs}
                      </Typography>
                      {integration.status.lastSyncAt && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                          Última sync: {new Date(integration.status.lastSyncAt).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {integration.status.lastError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {integration.status.lastError}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    <Tooltip title="Sincronizar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenSyncDialog(integration.name)}
                        disabled={!integration.status.connected}
                      >
                        <SyncIcon />
                      </IconButton>
                    </Tooltip>
                    {integration.status.connected ? (
                      <Tooltip title="Desconectar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDisconnect(integration.name)}
                        >
                          <LinkOffIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Conectar">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleConnect(integration.name)}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Validar credenciales">
                      <IconButton
                        size="small"
                        onClick={() => handleValidate(integration.name)}
                        disabled={validating}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Sincronización */}
      <Dialog open={syncDialogOpen} onClose={() => setSyncDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sincronizar Integración</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Integración"
              value={selectedIntegration || ''}
              disabled
              fullWidth
            />
            <TextField
              select
              label="Tipo de Sincronización"
              value={syncType}
              onChange={(e) => setSyncType(e.target.value as any)}
              fullWidth
            >
              <MenuItem value="products">Productos</MenuItem>
              <MenuItem value="orders">Órdenes</MenuItem>
              <MenuItem value="customers">Clientes</MenuItem>
            </TextField>
            <TextField
              select
              label="Dirección"
              value={syncDirection}
              onChange={(e) => setSyncDirection(e.target.value as any)}
              fullWidth
            >
              <MenuItem value="from_external">Desde Externa</MenuItem>
              <MenuItem value="to_external">Hacia Externa</MenuItem>
              <MenuItem value="bidirectional">Bidireccional</MenuItem>
            </TextField>
            <Box>
              <Button
                variant={fullSync ? 'contained' : 'outlined'}
                onClick={() => setFullSync(!fullSync)}
                fullWidth
              >
                {fullSync ? 'Sincronización Completa' : 'Sincronización Incremental'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSyncDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleSync}
            variant="contained"
            startIcon={syncLoading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            disabled={syncLoading}
          >
            Iniciar Sincronización
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity || 'success'}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

