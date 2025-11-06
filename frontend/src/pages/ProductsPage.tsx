import { useState } from 'react';
import { Box, Tabs, Tab, Paper, Grid, Card, CardContent, Typography, Stack, Chip, Button, IconButton, Tooltip, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment } from '@mui/material';
import { Inventory, Add, GridView, ViewList, FilterList, Refresh, TrendingUp, Warning, AttachMoney, Assessment } from '@mui/icons-material';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductImportExport from '../components/products/ProductImportExport';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_INVENTORY_VALUE, GET_LOW_STOCK_PRODUCTS } from '../lib/graphql/queries';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`products-tabpanel-${index}`}
      aria-labelledby={`products-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProductsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  // Fetch summary data
  const { data: inventoryData } = useQuery(GET_INVENTORY_VALUE, { errorPolicy: 'all' });
  const { data: lowStockData } = useQuery(GET_LOW_STOCK_PRODUCTS, { errorPolicy: 'all' });
  const { data: productsData } = useQuery(GET_PRODUCTS, { 
    variables: { skip: 0, take: 1 },
    errorPolicy: 'all',
  });

  const totalProducts = inventoryData?.inventoryValue?.totalProducts || 0;
  const totalValue = inventoryData?.inventoryValue?.totalValue || 0;
  const lowStockCount = inventoryData?.inventoryValue?.lowStockProducts || 0;
  const outOfStockCount = inventoryData?.inventoryValue?.outOfStockProducts || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <Box>
      {/* Header con KPIs */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Inventory sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Gestión de Productos
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Filtros">
              <IconButton onClick={handleFilterMenuOpen}>
                <FilterList />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar">
              <IconButton>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<Add />} onClick={() => setTabValue(1)}>
              Nuevo Producto
            </Button>
          </Stack>
        </Stack>

        {/* KPIs */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Productos
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {totalProducts}
                    </Typography>
                  </Box>
                  <Inventory sx={{ fontSize: 40, color: 'primary.main' }} />
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
                      Valor Inventario
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {formatCurrency(totalValue)}
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
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
                      Stock Bajo
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="warning.main">
                      {lowStockCount}
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
                </Stack>
                {lowStockCount > 0 && (
                  <Chip label={`${outOfStockCount} agotados`} size="small" color="error" sx={{ mt: 1 }} />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tasa Activos
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {totalProducts > 0 ? Math.round((totalProducts - lowStockCount - outOfStockCount) / totalProducts * 100) : 0}%
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Lista de Productos" icon={<ViewList />} iconPosition="start" />
          <Tab label="Nuevo Producto" icon={<Add />} iconPosition="start" />
          <Tab label="Importar/Exportar" icon={<Assessment />} iconPosition="start" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <ProductList />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ProductForm />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ProductImportExport />
      </TabPanel>

      {/* Filter Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterMenuClose}>
        <MenuItem onClick={handleFilterMenuClose}>Todas las categorías</MenuItem>
        <MenuItem onClick={handleFilterMenuClose}>Solo activos</MenuItem>
        <MenuItem onClick={handleFilterMenuClose}>Stock bajo</MenuItem>
        <MenuItem onClick={handleFilterMenuClose}>Sin stock</MenuItem>
      </Menu>
    </Box>
  );
}
