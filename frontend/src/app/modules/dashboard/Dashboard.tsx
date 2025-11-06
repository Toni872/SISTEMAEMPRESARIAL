import React from 'react'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
} from '@mui/material'

export const Dashboard: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                🏢 Dashboard ERP - Sistema Empresarial
            </Typography>

            <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                Bienvenido al sistema de gestión empresarial
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Productos
                            </Typography>
                            <Typography variant="h5" component="div">
                                1,245
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Ventas Hoy
                            </Typography>
                            <Typography variant="h5" component="div">
                                $24,567
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pedidos Pendientes
                            </Typography>
                            <Typography variant="h5" component="div">
                                18
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Stock Bajo
                            </Typography>
                            <Typography variant="h5" component="div">
                                7
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Actividad Reciente
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Aquí se mostrarán las actividades recientes del sistema...
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}