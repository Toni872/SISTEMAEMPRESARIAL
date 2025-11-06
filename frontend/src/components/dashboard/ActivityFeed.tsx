import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';
import {
    CheckCircle,
    AutoAwesome,
    Receipt,
    TrendingUp,
    Verified,
    Assessment,
} from '@mui/icons-material';

interface Activity {
    id: string;
    title: string;
    timestamp: string;
    type: 'optimization' | 'ai' | 'automation' | 'analytics' | 'leads' | 'report';
    icon?: React.ReactNode;
    iconBgColor?: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

const getActivityConfig = (type: Activity['type']) => {
    const configs = {
        optimization: {
            icon: <CheckCircle />,
            bgColor: '#2196f3',
            label: 'Optimización',
        },
        ai: {
            icon: <AutoAwesome />,
            bgColor: '#9c27b0',
            label: 'IA',
        },
        automation: {
            icon: <Receipt />,
            bgColor: '#ff9800',
            label: 'Automatización',
        },
        analytics: {
            icon: <TrendingUp />,
            bgColor: '#4caf50',
            label: 'Análisis',
        },
        leads: {
            icon: <Verified />,
            bgColor: '#00bcd4',
            label: 'Leads',
        },
        report: {
            icon: <Assessment />,
            bgColor: '#009688',
            label: 'Reporte',
        },
    };
    return configs[type];
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
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
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                            }}
                        >
                            AC
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Registro de Actividades
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {activities.length > 0 ? (
                        activities.map((activity) => {
                            const config = getActivityConfig(activity.type);
                            return (
                                <Box
                                    key={activity.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(0,0,0,0.02)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.04)',
                                            transform: 'translateX(4px)',
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: config.bgColor,
                                        }}
                                    >
                                        {config.icon}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 500, mb: 0.5 }}
                                        >
                                            {activity.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Hace {activity.timestamp}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={config.label}
                                        size="small"
                                        sx={{
                                            backgroundColor: `${config.bgColor}15`,
                                            color: config.bgColor,
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                        }}
                                    />
                                </Box>
                            );
                        })
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 4,
                                color: 'text.secondary',
                            }}
                        >
                            <Typography variant="body2">
                                No hay actividades recientes
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
