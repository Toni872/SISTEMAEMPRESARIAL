import React, { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from '@mui/icons-material'
import { useGetProductsQuery, useCreateProductMutation } from '@/lib/api/products'

export const ProductsList: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const { data, error, isLoading } = useGetProductsQuery({
        skip: 0,
        take: 10,
        search: search || undefined,
    })

    const [createProduct] = useCreateProductMutation()

    const handleCreateProduct = async () => {
        try {
            await createProduct({
                name: 'Producto Nuevo',
                sku: `SKU-${Date.now()}`,
                price: 100,
                stock: 10,
                minStock: 5,
            }).unwrap()
            setOpen(false)
        } catch (error) {
            console.error('Error creating product:', error)
        }
    }

    if (isLoading) return <Typography>Cargando productos...</Typography>
    if (error) return <Typography color="error">Error cargando productos</Typography>

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    Productos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nuevo Producto
                </Button>
            </Box>

            <Box display="flex" gap={2} mb={2}>
                <TextField
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon />,
                    }}
                    sx={{ minWidth: 300 }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>SKU</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={product.stock}
                                        color={product.stock <= product.minStock ? 'error' : 'success'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={product.isActive ? 'Activo' : 'Inactivo'}
                                        color={product.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Crear Nuevo Producto</DialogTitle>
                <DialogContent>
                    <Typography>
                        Aquí iría el formulario para crear un producto...
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCreateProduct} variant="contained">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}