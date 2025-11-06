import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Tooltip } from '@mui/material';
import {
    Psychology,
    LocalShipping,
    AutoAwesome,
    People,
    Inventory,
    AccountBalance,
    Analytics,
    PhoneAndroid,
    Security,
    Science,
} from '@mui/icons-material';

interface Module {
    id: string;
    name: string;
    icon: React.ReactNode;
    status: 'active' | 'warning' | 'inactive';
    color: string;
}

const modules: Module[] = [
    {
        id: 'ai-engine',
        name: 'AI Engine',
        icon: <Psychology />,
        status: 'active',
        color: '#2196f3',
    },
    {
        id: 'logistics-core',
        name: 'Logistics Core',
        icon: <LocalShipping />,
        status: 'active',
        color: '#ff9800',
    },
    {
        id: 'automation-hub',
        name: 'Automation Hub',
        icon: <AutoAwesome />,
        status: 'active',
        color: '#9c27b0',
    },
    {
        id: 'customer-engagement',
        name: 'Customer Engagement',
        icon: <People />,
        status: 'active',
        color: '#673ab7',
    },
    {
        id: 'supplier-network',
        name: 'Supplier Network',
        icon: <Inventory />,
        status: 'active',
        color: '#e91e63',
    },
    {
        id: 'financial-operations',
        name: 'Financial Operations',
        icon: <AccountBalance />,
        status: 'active',
        color: '#f44336',
    },
    {
        id: 'analytics-platform',
        name: 'Analytics Platform',
        icon: <Analytics />,
        status: 'active',
        color: '#3f51b5',
    },
    {
        id: 'mobile-field-ops',
        name: 'Mobile Field Ops',
        icon: <PhoneAndroid />,
        status: 'active',
        color: '#9c27b0',
    },
    {
        id: 'security-governance',
        name: 'Security Governance',
        icon: <Security />,
        status: 'active',
        color: '#607d8b',
    },
    {
        id: 'experimentation-lab',
        name: 'Experimentation Lab',
        icon: <Science />,
        status: 'active',
        color: '#00bcd4',
    },
];

const getStatusColor = (status: Module['status']) => {
    switch (status) {
        case 'active':
            return '#4caf50';
        case 'warning':
            return '#ff9800';
        case 'inactive':
            return '#f44336';
        default:
            return '#9e9e9e';
    }
};

export const ModuleStatus: React.FC = () => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ mb: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                            }}
                        >
                            ST
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Estado Operacional de Módulos del Sistema
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {modules.map((module) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={module.id}>
                            <Tooltip title={`${module.name} - ${module.status}`} arrow>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(0,0,0,0.02)',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.04)',
                                            transform: 'translateY(-4px)',
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '50%',
                                            backgroundColor: `${module.color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            mb: 1,
                                            color: module.color,
                                        }}
                                    >
                                        {module.icon}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            fontWeight: 500,
                                            mb: 1,
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {module.name}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: getStatusColor(module.status),
                                            margin: '0 auto',
                                            boxShadow: `0 0 8px ${getStatusColor(module.status)}`,
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};
