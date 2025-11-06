import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
    trend?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
    progress?: {
        value: number;
        color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    };
    metrics?: Array<{
        label: string;
        value: string | number;
        color: string;
    }>;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    iconBgColor,
    iconColor,
    trend,
    progress,
    metrics,
}) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                {/* Icon Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        left: 20,
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: iconBgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3,
                    }}
                >
                    <Box sx={{ color: iconColor, fontSize: 28 }}>{icon}</Box>
                </Box>

                {/* Content */}
                <Box sx={{ mt: 5 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.875rem',
                            opacity: 0.9,
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            mt: 1,
                            mb: 0.5,
                            fontSize: '2.5rem',
                        }}
                    >
                        {value}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.8,
                            fontSize: '0.875rem',
                        }}
                    >
                        {subtitle}
                    </Typography>

                    {/* Progress Bar */}
                    {progress && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={progress.value}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3,
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {/* Trend Indicator */}
                    {trend && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 2,
                                gap: 0.5,
                            }}
                        >
                            {trend.isPositive ? (
                                <TrendingUp sx={{ fontSize: 18, color: '#4caf50' }} />
                            ) : (
                                <TrendingDown sx={{ fontSize: 18, color: '#f44336' }} />
                            )}
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '0.75rem',
                                    color: trend.isPositive ? '#4caf50' : '#f44336',
                                    fontWeight: 600,
                                }}
                            >
                                {trend.isPositive ? '+' : ''}{trend.value}% {trend.label}
                            </Typography>
                        </Box>
                    )}

                    {/* Additional Metrics */}
                    {metrics && metrics.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {metrics.map((metric, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: metric.color,
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: '0.75rem',
                                            opacity: 0.9,
                                        }}
                                    >
                                        {metric.value} {metric.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
