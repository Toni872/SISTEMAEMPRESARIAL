import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    Typography,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    TrendingUp,
    TrendingDown,
    Visibility,
    Add as AddStockIcon,
    Remove as RemoveStockIcon,
} from '@mui/icons-material';
import { GET_PRODUCTS, REMOVE_PRODUCT, UPDATE_PRODUCT, UPDATE_PRODUCT_STOCK } from '../../lib/graphql/queries';
import ProductEditForm from './ProductEditForm';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    cost?: number;
    stock: number;
    minStock: number;
    category?: string;
    isActive: boolean;
    description?: string;
}

export default function ProductList() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<string>('all');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [stockQuantity, setStockQuantity] = useState(0);
    const [stockOperation, setStockOperation] = useState<'add' | 'subtract'>('add');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' }>({
        open: false,
        message: '',
    });

    // DATOS DEMO: Productos
    const demoProducts = [
        {
            id: 1,
            name: 'Laptop Dell XPS 15',
            sku: 'LAP-DELL-001',
            price: 1299.99,
            cost: 899.00,
            stock: 45,
            minStock: 10,
            category: 'ELECTRONICS',
            isActive: true,
            description: 'Laptop de alto rendimiento con procesador Intel i7'
        },
        {
            id: 2,
            name: 'Mouse Logitech MX Master 3',
            sku: 'MOU-LOG-002',
            price: 89.99,
            cost: 55.00,
            stock: 120,
            minStock: 20,
            category: 'ELECTRONICS',
            isActive: true,
            description: 'Mouse inalámbrico profesional'
        },
        {
            id: 3,
            name: 'Teclado Mecánico RGB',
            sku: 'KEY-MEC-003',
            price: 139.99,
            cost: 85.00,
            stock: 67,
            minStock: 15,
            category: 'ELECTRONICS',
            isActive: true,
            description: 'Teclado mecánico gaming con iluminación RGB'
        },
        {
            id: 4,
            name: 'Monitor LG 27" 4K',
            sku: 'MON-LG-004',
            price: 449.99,
            cost: 310.00,
            stock: 8,
            minStock: 10,
            category: 'ELECTRONICS',
            isActive: true,
            description: 'Monitor 4K UHD de 27 pulgadas'
        },
        {
            id: 5,
            name: 'Silla Ergonómica',
            sku: 'FUR-CHA-005',
            price: 299.99,
            cost: 180.00,
            stock: 25,
            minStock: 5,
            category: 'FURNITURE',
            isActive: true,
            description: 'Silla de oficina ergonómica con soporte lumbar'
        },
        {
            id: 6,
            name: 'Auriculares Sony WH-1000XM5',
            sku: 'AUD-SON-006',
            price: 349.99,
            cost: 220.00,
            stock: 34,
            minStock: 10,
            category: 'ELECTRONICS',
            isActive: true,
            description: 'Auriculares con cancelación de ruido'
        },
        {
            id: 7,
            name: 'Webcam Logitech C920',
            sku: 'WEB-LOG-007',
            price: 79.99,
            cost: 48.00,
            stock: 56,
            minStock: 15,
            category: 'ELECTRONICS',
            isActive: true,
            description: 'Webcam Full HD 1080p'
        },
        {
            id: 8,
            name: 'Cable HDMI 2.1',
            sku: 'CAB-HDM-008',
            price: 19.99,
            cost: 8.00,
            stock: 4,
            minStock: 20,
            category: 'ACCESSORIES',
            isActive: true,
            description: 'Cable HDMI 2.1 de 2 metros'
        }
    ];

    // Query for products with filters
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
        variables: {
            skip: page * rowsPerPage,
            take: rowsPerPage,
            search: search || undefined,
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
        },
        errorPolicy: 'all', // No romper UI si hay errores (modo visual)
    });

    // Mutation for deleting products
    const [removeProduct] = useMutation(REMOVE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS, variables: { skip: page * rowsPerPage, take: rowsPerPage } }],
    });

    // Mutation for updating stock
    const [updateStock] = useMutation(UPDATE_PRODUCT_STOCK, {
        refetchQueries: [{ query: GET_PRODUCTS, variables: { skip: page * rowsPerPage, take: rowsPerPage } }],
    });

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
            try {
                await removeProduct({ variables: { id } });
                setSnackbar({ open: true, message: 'Producto eliminado exitosamente', severity: 'success' });
            } catch (err) {
                console.error('Error al eliminar producto:', err);
                setSnackbar({ open: true, message: 'Error al eliminar producto', severity: 'error' });
            }
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedProduct(null);
        refetch();
    };

    const handleStockAdjust = (product: Product) => {
        setSelectedProduct(product);
        setStockQuantity(0);
        setStockOperation('add');
        setStockDialogOpen(true);
    };

    const handleStockSubmit = async () => {
        if (!selectedProduct || stockQuantity <= 0) return;
        
        try {
            await updateStock({
                variables: {
                    id: selectedProduct.id,
                    quantity: stockQuantity,
                    operation: stockOperation,
                },
            });
            setSnackbar({ open: true, message: `Stock ${stockOperation === 'add' ? 'aumentado' : 'reducido'} exitosamente`, severity: 'success' });
            setStockDialogOpen(false);
            setSelectedProduct(null);
            refetch();
        } catch (err) {
            console.error('Error al ajustar stock:', err);
            setSnackbar({ open: true, message: 'Error al ajustar stock', severity: 'error' });
        }
    };

    // Type-safe access to products - usar datos demo si hay error
    const products: Product[] = error ? demoProducts : ((data as any)?.products || []);

    // Apply stock filter
    const filteredProducts = products.filter(product => {
        if (stockFilter === 'low') return product.stock <= product.minStock;
        if (stockFilter === 'out') return product.stock === 0;
        if (stockFilter === 'ok') return product.stock > product.minStock;
        return true;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    };

    const formatNumber = (n: number) => n.toLocaleString('es-ES');

    // No mostrar error si hay datos demo

    // Get unique categories for filter
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    label="Buscar productos"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Nombre, SKU, categoría..."
                    sx={{ flex: 2 }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Categoría</InputLabel>
                    <Select value={categoryFilter} label="Categoría" onChange={(e) => setCategoryFilter(e.target.value)}>
                        <MenuItem value="all">Todas</MenuItem>
                        {categories.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Stock</InputLabel>
                    <Select value={stockFilter} label="Stock" onChange={(e) => setStockFilter(e.target.value)}>
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="low">Stock Bajo</MenuItem>
                        <MenuItem value="out">Sin Stock</MenuItem>
                        <MenuItem value="ok">Stock OK</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => refetch()}
                    disabled={loading}
                >
                    Actualizar
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>SKU</strong></TableCell>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Categoría</strong></TableCell>
                            <TableCell align="right"><strong>Precio</strong></TableCell>
                            <TableCell align="right"><strong>Costo</strong></TableCell>
                            <TableCell align="right"><strong>Stock</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No se encontraron productos
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                                            {product.sku}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {product.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {product.category ? (
                                            <Chip label={product.category} size="small" />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">-</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight={600} color="success.main">
                                            {formatCurrency(product.price)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {product.cost ? formatCurrency(product.cost) : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            icon={product.stock <= product.minStock ? <TrendingDown /> : <TrendingUp />}
                                            label={formatNumber(product.stock)}
                                            size="small"
                                            color={
                                                product.stock === 0
                                                    ? 'error'
                                                    : product.stock <= product.minStock
                                                        ? 'warning'
                                                        : 'success'
                                            }
                                        />
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Mín: {product.minStock}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.isActive ? 'Activo' : 'Inactivo'}
                                            size="small"
                                            color={product.isActive ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Ajustar stock">
                                                <IconButton size="small" color="info" onClick={() => handleStockAdjust(product)}>
                                                    {product.stock <= product.minStock ? <AddStockIcon fontSize="small" /> : <RemoveStockIcon fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton size="small" color="primary" onClick={() => handleEdit(product)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(product.id, product.name)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={-1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to }) => `${from}-${to}`}
                />
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
                <DialogTitle>Editar Producto</DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <ProductEditForm product={selectedProduct} onClose={handleEditClose} onSuccess={() => {
                            setSnackbar({ open: true, message: 'Producto actualizado exitosamente', severity: 'success' });
                            handleEditClose();
                        }} />
                    )}
                </DialogContent>
            </Dialog>

            {/* Stock Adjustment Dialog */}
            <Dialog open={stockDialogOpen} onClose={() => setStockDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Ajustar Stock - {selectedProduct?.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Cantidad"
                            type="number"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                            inputProps={{ min: 0 }}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Operación</InputLabel>
                            <Select
                                value={stockOperation}
                                label="Operación"
                                onChange={(e) => setStockOperation(e.target.value as 'add' | 'subtract')}
                            >
                                <MenuItem value="add">Agregar Stock</MenuItem>
                                <MenuItem value="subtract">Reducir Stock</MenuItem>
                            </Select>
                        </FormControl>
                        {selectedProduct && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Stock actual: <strong>{selectedProduct.stock}</strong> unidades
                                {stockOperation === 'add' ? (
                                    <> → Nuevo stock: <strong>{selectedProduct.stock + stockQuantity}</strong></>
                                ) : (
                                    <> → Nuevo stock: <strong>{Math.max(0, selectedProduct.stock - stockQuantity)}</strong></>
                                )}
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStockDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleStockSubmit} variant="contained" disabled={stockQuantity <= 0}>
                        Aplicar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
