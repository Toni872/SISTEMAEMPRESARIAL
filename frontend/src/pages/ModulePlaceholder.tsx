import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

export default function ModulePlaceholder({ title, description }: { title: string; description?: string }) {
    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {description || 'Módulo en preparación. Próximamente funcionalidades completas integradas al ERP.'}
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Esta es una vista temporal para navegación. Integraremos KPIs, tablas y flujos según el diseño ejecutivo.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}









