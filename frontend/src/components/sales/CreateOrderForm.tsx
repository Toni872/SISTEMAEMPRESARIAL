import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    IconButton,
    Typography,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export const CreateOrderForm = ({ onClose }: { onClose: () => void }) => {
    const [items, setItems] = useState([
        { productId: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);

    const handleAddItem = () => {
        setItems([...items, { productId: '', quantity: 1, unitPrice: 0, total: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].total =
                newItems[index].quantity * newItems[index].unitPrice;
        }
        setItems(newItems);
    };

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Cliente"
                        select
                        required
                        className="input-apple"
                    >
                        <MenuItem value="1">Cliente Ejemplo 1</MenuItem>
                        <MenuItem value="2">Cliente Ejemplo 2</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Fecha de Entrega"
                        InputLabelProps={{ shrink: true }}
                        className="input-apple"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Notas"
                        placeholder="Notas adicionales..."
                        className="input-apple"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Productos</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={handleAddItem}
                    >
                        Agregar Producto
                    </Button>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="right">Precio Unit.</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="center">Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                            select
                                            size="small"
                                            value={item.productId}
                                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                            sx={{ minWidth: 200 }}
                                        >
                                            <MenuItem value="">Seleccionar...</MenuItem>
                                            <MenuItem value="1">Producto 1 - $1000</MenuItem>
                                            <MenuItem value="2">Producto 2 - $2000</MenuItem>
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', +e.target.value)}
                                            sx={{ width: 80 }}
                                            inputProps={{ min: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItem(index, 'unitPrice', +e.target.value)}
                                            sx={{ width: 120 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        ${item.total.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveItem(index)}
                                            disabled={items.length === 1}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Subtotal
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            IVA (16%)
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="body2">${tax.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" fontWeight={600}>
                            Total
                        </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="h6" fontWeight={600}>
                            ${total.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={onClose} variant="outlined" className="btn-apple-secondary">
                    Cancelar
                </Button>
                <Button onClick={onClose} variant="contained" className="btn-apple-primary">
                    Crear Orden
                </Button>
            </Box>
        </Box>
    );
};



