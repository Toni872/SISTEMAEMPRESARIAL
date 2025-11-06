import { useState, useRef } from 'react';
import { Box, Button, Alert, LinearProgress, Paper, Typography, Grid, Card, CardContent, Stack, Divider } from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon, Info as InfoIcon, GetApp, FileUpload } from '@mui/icons-material';
import { useAuthStore } from '../../store/auth.store';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function ProductImportExport() {
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);
    const { token } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Export products to CSV
     */
    const handleExport = async (format: 'csv' | 'excel') => {
        setExporting(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/products/export/${format}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `products_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Error al exportar productos');
        } finally {
            setExporting(false);
        }
    };

    /**
     * Import products from CSV
     */
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.csv')) {
            alert('Por favor selecciona un archivo CSV');
            return;
        }

        setImporting(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/api/products/import/csv`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Import failed');
            }

            const data = await response.json();
            setImportResult(data);
        } catch (error) {
            console.error('Import failed:', error);
            setImportResult({
                success: false,
                message: 'Error al importar productos',
            });
        } finally {
            setImporting(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Importar/Exportar Productos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Gestiona tus productos de forma masiva mediante archivos CSV o Excel
            </Typography>

            <Grid container spacing={3}>
                {/* Export Section */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <GetApp color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Exportar Productos
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Descarga todos tus productos en formato CSV o Excel para análisis externo o respaldo
                            </Typography>
                            <Stack spacing={2}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    startIcon={exporting ? null : <DownloadIcon />}
                                    onClick={() => handleExport('csv')}
                                    disabled={exporting || importing}
                                    size="large"
                                >
                                    {exporting ? 'Exportando...' : 'Exportar CSV'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    startIcon={exporting ? null : <DownloadIcon />}
                                    onClick={() => handleExport('excel')}
                                    disabled={exporting || importing}
                                    size="large"
                                >
                                    {exporting ? 'Exportando...' : 'Exportar Excel'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Import Section */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <FileUpload color="success" />
                                <Typography variant="h6" fontWeight={600}>
                                    Importar Productos
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Sube un archivo CSV con el formato correcto para crear o actualizar productos masivamente
                            </Typography>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleImport}
                                aria-label="Importar archivo CSV"
                                hidden
                            />
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                startIcon={<UploadIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={importing || exporting}
                                size="large"
                            >
                                Importar CSV
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Loading indicator */}
            {importing && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Importando productos...
                    </Typography>
                    <LinearProgress />
                </Box>
            )}

            {/* Import results */}
            {importResult && (
                <Alert
                    severity={importResult.success ? 'success' : 'error'}
                    onClose={() => setImportResult(null)}
                >
                    <Typography variant="body2" fontWeight="bold">
                        {importResult.message}
                    </Typography>
                    {importResult.results && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" display="block">
                                Total de registros: {importResult.results.total}
                            </Typography>
                            <Typography variant="caption" display="block" color="success.main">
                                Importados exitosamente: {importResult.results.success}
                            </Typography>
                            {importResult.results.failed > 0 && (
                                <Typography variant="caption" display="block" color="error.main">
                                    Fallidos: {importResult.results.failed}
                                </Typography>
                            )}
                            {importResult.results.errors?.length > 0 && (
                                <Box sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
                                    <Typography variant="caption" fontWeight="bold">
                                        Errores:
                                    </Typography>
                                    {importResult.results.errors.map((err: string, idx: number) => (
                                        <Typography key={idx} variant="caption" display="block">
                                            • {err}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}
                </Alert>
            )}

            {/* Instructions */}
            <Paper sx={{ mt: 3, p: 3, bgcolor: 'info.light' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <InfoIcon color="info" />
                    <Typography variant="h6" fontWeight={600}>
                        Instrucciones y Formato
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Formato CSV Requerido
                        </Typography>
                        <Typography
                            variant="caption"
                            component="pre"
                            sx={{
                                display: 'block',
                                mt: 0.5,
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            ID,SKU,Name,Description,Category,Price,Cost,Stock,Min Stock,Max Stock,Active
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Notas Importantes
                        </Typography>
                        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                            <li>El archivo debe estar en formato CSV (separado por comas)</li>
                            <li>La primera fila debe contener los encabezados de columna</li>
                            <li>ID es opcional (se genera automáticamente si falta)</li>
                            <li>SKU debe ser único por producto</li>
                            <li>Active debe ser "true" o "false" (sin comillas)</li>
                            <li>Los campos numéricos no deben tener símbolos de moneda</li>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
