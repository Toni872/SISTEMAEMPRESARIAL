import { Box, Grid, Card, CardContent, Typography, Chip, Switch, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Settings, Tune, Notifications, Language, Palette, Save } from '@mui/icons-material';

export default function ConfigEnginePage() {
    const configSections = [
        { title: 'General', icon: <Settings />, settings: [
            { name: 'Nombre de la empresa', value: 'Mi Empresa SA', type: 'text' },
            { name: 'Idioma', value: 'Español', type: 'select', options: ['Español', 'English', 'Français'] },
            { name: 'Zona horaria', value: 'Europe/Madrid', type: 'select' },
            { name: 'Formato de fecha', value: 'DD/MM/YYYY', type: 'select' },
        ]},
        { title: 'Notificaciones', icon: <Notifications />, settings: [
            { name: 'Email notifications', value: true, type: 'boolean' },
            { name: 'Push notifications', value: true, type: 'boolean' },
            { name: 'SMS notifications', value: false, type: 'boolean' },
        ]},
        { title: 'Apariencia', icon: <Palette />, settings: [
            { name: 'Tema', value: 'light', type: 'select', options: ['light', 'dark', 'auto'] },
            { name: 'Color primario', value: '#1976d2', type: 'color' },
            { name: 'Densidad', value: 'comfortable', type: 'select', options: ['compact', 'comfortable', 'spacious'] },
        ]},
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>⚙️ Motor de Configuración</Typography>
                    <Typography variant="body2" color="text.secondary">Personalización y ajustes del sistema</Typography>
                </Box>
                <Button startIcon={<Save />} variant="contained">Guardar Cambios</Button>
            </Box>

            <Grid container spacing={3}>
                {configSections.map((section, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    {section.icon}
                                    <Typography variant="h6" fontWeight={600}>{section.title}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {section.settings.map((setting, idx) => (
                                        <Box key={idx}>
                                            {setting.type === 'boolean' ? (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2">{setting.name}</Typography>
                                                    <Switch checked={setting.value as boolean} />
                                                </Box>
                                            ) : setting.type === 'select' ? (
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>{setting.name}</InputLabel>
                                                    <Select value={setting.value} label={setting.name}>
                                                        {((setting as any).options || []).map((opt: string, i: number) => (
                                                            <MenuItem key={i} value={opt}>{opt}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <TextField fullWidth size="small" label={setting.name} value={setting.value} />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

