import { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Avatar,
    LinearProgress,
} from '@mui/material';
import {
    Description,
    Folder,
    PictureAsPdf,
    InsertDriveFile,
    Image,
    VideoLibrary,
    CloudDownload,
    Share,
    Delete,
    Edit,
    MoreVert,
    Add,
    Upload,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function DocumentManagementPage() {
    const metrics = [
        { label: 'Total Documentos', value: '8,547', change: '+234', color: '#1976d2' },
        { label: 'Almacenamiento', value: '2.4 TB', change: '+156 GB', color: '#2e7d32' },
        { label: 'Compartidos', value: '1,245', change: '+89', color: '#ed6c02' },
        { label: 'Pendientes', value: '42', change: '-12', color: '#9c27b0' },
    ];

    const storageByType = [
        { name: 'PDF', value: 35, size: '840 GB', color: '#d32f2f' },
        { name: 'Imágenes', value: 28, size: '672 GB', color: '#1976d2' },
        { name: 'Videos', value: 20, size: '480 GB', color: '#2e7d32' },
        { name: 'Documentos', value: 12, size: '288 GB', color: '#ed6c02' },
        { name: 'Otros', value: 5, size: '120 GB', color: '#757575' },
    ];

    const recentDocuments = [
        { name: 'Informe_Ventas_Q2_2024.pdf', type: 'PDF', size: '2.4 MB', owner: 'María González', date: '2024-06-15', status: 'Aprobado', category: 'Finanzas' },
        { name: 'Contrato_Proveedor_GlobalTech.docx', type: 'Word', size: '856 KB', owner: 'Carlos Ruiz', date: '2024-06-14', status: 'Pendiente', category: 'Legal' },
        { name: 'Presentacion_Estrategia_2025.pptx', type: 'PowerPoint', size: '15.2 MB', owner: 'Ana Martínez', date: '2024-06-13', status: 'En Revisión', category: 'Estrategia' },
        { name: 'Manual_Usuario_Sistema_ERP.pdf', type: 'PDF', size: '4.8 MB', owner: 'Luis Fernández', date: '2024-06-12', status: 'Aprobado', category: 'Documentación' },
        { name: 'Factura_2024-06-001.pdf', type: 'PDF', size: '124 KB', owner: 'Isabel Torres', date: '2024-06-11', status: 'Procesado', category: 'Contabilidad' },
        { name: 'Catalogo_Productos_2024.xlsx', type: 'Excel', size: '3.2 MB', owner: 'José García', date: '2024-06-10', status: 'Aprobado', category: 'Ventas' },
    ];

    const folders = [
        { name: 'Finanzas', documents: 1247, size: '456 GB', icon: 'folder' },
        { name: 'Legal', documents: 892, size: '234 GB', icon: 'folder' },
        { name: 'RRHH', documents: 1567, size: '289 GB', icon: 'folder' },
        { name: 'Ventas', documents: 2341, size: '678 GB', icon: 'folder' },
        { name: 'Marketing', documents: 984, size: '512 GB', icon: 'folder' },
        { name: 'IT', documents: 1516, size: '789 GB', icon: 'folder' },
    ];

    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'pdf': return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
            case 'word': case 'docx': return <Description sx={{ color: '#1976d2' }} />;
            case 'excel': case 'xlsx': return <InsertDriveFile sx={{ color: '#2e7d32' }} />;
            case 'powerpoint': case 'pptx': return <InsertDriveFile sx={{ color: '#ed6c02' }} />;
            case 'image': return <Image sx={{ color: '#9c27b0' }} />;
            case 'video': return <VideoLibrary sx={{ color: '#f57c00' }} />;
            default: return <InsertDriveFile />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aprobado': case 'Procesado': return 'success';
            case 'Pendiente': return 'warning';
            case 'En Revisión': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        📁 Gestión Documental
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Administración centralizada de documentos y archivos
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<Upload />} variant="outlined" size="small">
                        Subir
                    </Button>
                    <Button startIcon={<Add />} variant="contained" size="small">
                        Nueva Carpeta
                    </Button>
                </Box>
            </Box>

            {/* Métricas */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {metrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {metric.label}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                                    <Typography variant="h4" fontWeight={700}>{metric.value}</Typography>
                                    <Chip label={metric.change} size="small" color="success" />
                                </Box>
                                <LinearProgress variant="determinate" value={75} sx={{ bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: metric.color } }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Carpetas */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                                Carpetas Principales
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {folders.map((folder, index) => (
                                    <Card key={index} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                                        <CardContent sx={{ py: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Folder sx={{ fontSize: 32, color: '#fbc02d' }} />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" fontWeight={600}>{folder.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {folder.documents} docs • {folder.size}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Almacenamiento */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Almacenamiento por Tipo
                            </Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={storageByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={(entry) => `${entry.value}%`}>
                                        {storageByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                {storageByType.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: 1 }} />
                                            <Typography variant="body2">{item.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">{item.size}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Documentos Recientes */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                                Documentos Recientes
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {recentDocuments.slice(0, 6).map((doc, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                                        {getFileIcon(doc.type)}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight={600} noWrap>{doc.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{doc.size} • {doc.date}</Typography>
                                        </Box>
                                        <IconButton size="small">
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tabla de Documentos */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                                Todos los Documentos
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Documento</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Tamaño</TableCell>
                                            <TableCell>Propietario</TableCell>
                                            <TableCell>Categoría</TableCell>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell align="center">Estado</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentDocuments.map((doc, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {getFileIcon(doc.type)}
                                                        <Typography variant="body2">{doc.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><Chip label={doc.type} size="small" variant="outlined" /></TableCell>
                                                <TableCell>{doc.size}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{doc.owner.charAt(0)}</Avatar>
                                                        <Typography variant="body2">{doc.owner}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><Chip label={doc.category} size="small" /></TableCell>
                                                <TableCell>{doc.date}</TableCell>
                                                <TableCell align="center">
                                                    <Chip label={doc.status} color={getStatusColor(doc.status)} size="small" />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small"><CloudDownload fontSize="small" /></IconButton>
                                                    <IconButton size="small"><Share fontSize="small" /></IconButton>
                                                    <IconButton size="small"><Edit fontSize="small" /></IconButton>
                                                    <IconButton size="small"><Delete fontSize="small" /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

