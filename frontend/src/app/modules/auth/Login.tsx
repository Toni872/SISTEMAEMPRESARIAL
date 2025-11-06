import React from 'react'
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
} from '@mui/material'

export const Login: React.FC = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="background.default"
        >
            <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" textAlign="center" mb={3}>
                        Sistema ERP
                    </Typography>

                    <Box component="form" display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 2 }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}