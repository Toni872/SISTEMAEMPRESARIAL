import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
    Alert,
    FormControlLabel,
    Switch,
    InputAdornment,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { CREATE_PRODUCT, GET_PRODUCTS } from '../../lib/graphql/queries';

interface ProductFormData {
    name: string;
    sku: string;
    description: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    maxStock: number;
    category: string;
    isActive: boolean;
}

export default function ProductForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        sku: '',
        description: '',
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 0,
        maxStock: 0,
        category: '',
        isActive: true,
    });

    const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS, variables: { skip: 0, take: 10 } }],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createProduct({
                variables: {
                    createProductInput: {
                        name: formData.name,
                        sku: formData.sku,
                        description: formData.description || undefined,
                        price: formData.price,
                        cost: formData.cost || undefined,
                        stock: formData.stock,
                        minStock: formData.minStock,
                        maxStock: formData.maxStock || undefined,
                        category: formData.category || undefined,
                        isActive: formData.isActive,
                    },
                },
            });

            // Success - navigate back to product list
            navigate('/products');
        } catch (err) {
            console.error('Error al crear producto:', err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Nuevo Producto
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error al crear producto: {error.message}
                </Alert>
            )}

            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Información Básica */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Información Básica
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Nombre del Producto"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                helperText="Código único del producto"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Categoría"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Precios */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Precios
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Precio de Venta"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Costo"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Grid>

                        {/* Inventario */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Inventario
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock Actual"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock Mínimo"
                                name="minStock"
                                value={formData.minStock}
                                onChange={handleChange}
                                inputProps={{ min: 0 }}
                                helperText="Alerta cuando esté por debajo"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock Máximo"
                                name="maxStock"
                                value={formData.maxStock}
                                onChange={handleChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        {/* Estado */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        name="isActive"
                                        color="primary"
                                    />
                                }
                                label="Producto Activo"
                            />
                        </Grid>

                        {/* Buttons */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={() => navigate('/products')}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Producto'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
