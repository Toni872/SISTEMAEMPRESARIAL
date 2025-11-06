import React, { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    Paper,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const steps = ['Información de la Empresa', 'Configuración Inicial', 'Completado'];

interface CompanyData {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    phone?: string;
    email?: string;
    website?: string;
    currency?: string;
}

const SetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [companyData, setCompanyData] = useState<CompanyData>({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        taxId: '',
        phone: '',
        email: '',
        website: '',
        currency: 'USD',
    });

    // Check if setup is complete
    const { data: setupStatus } = useQuery({
        queryKey: ['setup-status'],
        queryFn: async () => {
            const response = await axios.get('/api/setup/status');
            return response.data;
        },
    });

    // Create company mutation
    const createCompanyMutation = useMutation({
        mutationFn: async (data: CompanyData) => {
            const response = await axios.post('/api/setup/company', data);
            return response.data;
        },
        onSuccess: () => {
            setActiveStep((prev) => prev + 1);
        },
    });

    const handleNext = () => {
        if (activeStep === 0) {
            // Validate company data
            if (!companyData.name.trim()) {
                alert('El nombre de la empresa es requerido');
                return;
            }
            createCompanyMutation.mutate(companyData);
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleFinish = () => {
        navigate('/dashboard');
    };

    const handleInputChange = (field: keyof CompanyData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCompanyData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    // If setup is already complete, redirect to dashboard
    if (setupStatus?.isSetupComplete) {
        navigate('/dashboard');
        return null;
    }

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Información de la Empresa
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nombre de la Empresa *"
                                value={companyData.name}
                                onChange={handleInputChange('name')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="ID Fiscal"
                                value={companyData.taxId}
                                onChange={handleInputChange('taxId')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dirección"
                                value={companyData.address}
                                onChange={handleInputChange('address')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Ciudad"
                                value={companyData.city}
                                onChange={handleInputChange('city')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Código Postal"
                                value={companyData.postalCode}
                                onChange={handleInputChange('postalCode')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="País"
                                value={companyData.country}
                                onChange={handleInputChange('country')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                value={companyData.phone}
                                onChange={handleInputChange('phone')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={companyData.email}
                                onChange={handleInputChange('email')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Sitio Web"
                                value={companyData.website}
                                onChange={handleInputChange('website')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Moneda"
                                value={companyData.currency}
                                onChange={handleInputChange('currency')}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Box textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            Configuración Inicial
                        </Typography>
                        <Typography>
                            La configuración básica se ha completado. Puedes personalizar más opciones después.
                        </Typography>
                    </Box>
                );
            case 2:
                return (
                    <Box textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            ¡Configuración Completada!
                        </Typography>
                        <Typography>
                            Tu empresa ha sido configurada exitosamente. Ahora puedes comenzar a usar el sistema.
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Configuración Inicial
                </Typography>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ mt: 2, mb: 2 }}>
                    {renderStepContent(activeStep)}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Atrás
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === steps.length - 1 ? (
                        <Button onClick={handleFinish} variant="contained">
                            Ir al Dashboard
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            variant="contained"
                            disabled={createCompanyMutation.isPending}
                        >
                            {createCompanyMutation.isPending ? 'Guardando...' : 'Siguiente'}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default SetupPage;