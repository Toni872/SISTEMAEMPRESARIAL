import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import {
    Box,
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
import { UPDATE_PRODUCT, GET_PRODUCTS } from '../../lib/graphql/queries';

interface Product {
    id: number;
    name: string;
    sku: string;
    description?: string;
    price: number;
    cost?: number;
    stock: number;
    minStock: number;
    maxStock?: number;
    category?: string;
    isActive: boolean;
}

interface ProductEditFormProps {
    product: Product;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProductEditForm({ product, onClose, onSuccess }: ProductEditFormProps) {
    const [formData, setFormData] = useState({
        id: product.id,
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        price: product.price,
        cost: product.cost || 0,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock || 0,
        category: product.category || '',
        isActive: product.isActive,
    });

    const [updateProduct, { loading, error }] = useMutation(UPDATE_PRODUCT, {
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
            await updateProduct({
                variables: {
                    updateProductInput: {
                        id: formData.id,
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

            onSuccess();
        } catch (err) {
            console.error('Error al actualizar producto:', err);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error al actualizar producto: {error.message}
                </Alert>
            )}

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
                                onClick={onClose}
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
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}







