import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface PerformanceChartProps {
    title: string;
    subtitle?: string;
    data: Array<{
        name: string;
        [key: string]: string | number;
    }>;
    lines: Array<{
        dataKey: string;
        color: string;
        name: string;
    }>;
    type?: 'line' | 'area';
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
    title,
    subtitle,
    data,
    lines,
    type = 'line',
}) => {
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
                                background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                            }}
                        >
                            AN
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography variant="caption" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 300,
                    }}
                >
                    {data && data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            {type === 'area' ? (
                                <AreaChart data={data}>
                                    <defs>
                                        {lines.map((line, index) => (
                                            <linearGradient
                                                key={index}
                                                id={`gradient-${line.dataKey}`}
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor={line.color}
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor={line.color}
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888"
                                        style={{ fontSize: '0.75rem' }}
                                    />
                                    <YAxis stroke="#888" style={{ fontSize: '0.75rem' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: 8,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Legend />
                                    {lines.map((line, index) => (
                                        <Area
                                            key={index}
                                            type="monotone"
                                            dataKey={line.dataKey}
                                            stroke={line.color}
                                            fill={`url(#gradient-${line.dataKey})`}
                                            strokeWidth={2}
                                            name={line.name}
                                        />
                                    ))}
                                </AreaChart>
                            ) : (
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888"
                                        style={{ fontSize: '0.75rem' }}
                                    />
                                    <YAxis stroke="#888" style={{ fontSize: '0.75rem' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: 8,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Legend />
                                    {lines.map((line, index) => (
                                        <Line
                                            key={index}
                                            type="monotone"
                                            dataKey={line.dataKey}
                                            stroke={line.color}
                                            strokeWidth={2}
                                            name={line.name}
                                            dot={{ fill: line.color, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    ))}
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                color: 'text.secondary',
                                py: 4,
                            }}
                        >
                            <Typography variant="body2">
                                📊 Gráfica de Tendencias de Performance
                            </Typography>
                            <Typography variant="caption">
                                Métricas de eficiencia por módulo - Últimos 30 días
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
