'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient, VerifactuRegistry } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Shield,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  QrCode,
  Hash,
  Send,
  Key,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function VerifactuPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [registries, setRegistries] = useState<VerifactuRegistry[]>([]);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    registry: true,
    integrity: false,
    aeat: false,
    certificates: false,
  });

  const fetchRegistries = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getVerifactuRegistry();
      setRegistries(data || []);
    } catch (err: any) {
      logger.error('Error cargando registros Verifactu', err);
      toast({
        title: 'Error',
        description: err.message || 'No se pudieron cargar los registros',
        variant: 'destructive',
      });
      setRegistries([]); // Asegurar que siempre hay un array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistries();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRegisterSale = async (saleId: number) => {
    try {
      await apiClient.registerInvoiceInVerifactu(saleId);
      toast({
        title: 'Registrado',
        description: 'Factura registrada exitosamente en Verifactu',
        variant: 'success',
      });
      fetchRegistries();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo registrar la factura',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadXML = async (saleId: number) => {
    try {
      const blob = await apiClient.getVerifactuXML(saleId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura_${saleId}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'XML descargado',
        description: 'El XML se ha descargado exitosamente',
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo descargar el XML',
        variant: 'destructive',
      });
    }
  };

  const handleValidateIntegrity = async () => {
    try {
      const result = await apiClient.validateVerifactuIntegrity();
      if (result.is_valid) {
        toast({
          title: 'Integridad verificada',
          description: 'Todos los registros están íntegros',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Problema detectado',
          description: result.errors?.join(', ') || 'Se detectaron problemas en la cadena',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo validar la integridad',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            Verifactu
          </h1>
          <p className="text-muted-foreground mt-1">
            Sistema de facturación conforme a normativa AEAT
          </p>
        </div>
        <Button onClick={fetchRegistries} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados AEAT</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {registries.filter((r) => r.sent_to_aeat).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {registries.filter((r) => !r.sent_to_aeat).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Activo
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Secciones con Menús Desplegables */}
      <div className="space-y-4">
        {/* SECCIÓN 1: Registro de Facturas */}
        <Card>
          <CardHeader>
            <button
              onClick={() => toggleSection('registry')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <CardTitle>Registro de Facturas</CardTitle>
                <Badge variant="secondary">{registries.length}</Badge>
              </div>
              {expandedSections.registry ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <CardDescription>
              Gestiona el registro de facturas con hash SHA-256 y trazabilidad
            </CardDescription>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.registry && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button asChild>
                        <Link href="/sales">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Facturas
                        </Link>
                      </Button>
                      <Button onClick={handleValidateIntegrity} variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        Validar Integridad
                      </Button>
                    </div>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : registries.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay facturas registradas aún
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {registries.map((registry) => (
                          <div
                            key={registry.id}
                            className="p-4 border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold">
                                    Factura #{registry.invoice_id}
                                  </span>
                                  {registry.sent_to_aeat ? (
                                    <Badge className="bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Enviado
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Pendiente
                                    </Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Hash</p>
                                    <p className="font-mono text-xs truncate">{registry.invoice_hash}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Fecha</p>
                                    <p>{formatDate(registry.created_at)}</p>
                                  </div>
                                  {registry.sent_at && (
                                    <div>
                                      <p className="text-muted-foreground">Enviado</p>
                                      <p>{formatDate(registry.sent_at)}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadXML(registry.invoice_id)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                {registry.qr_code && (
                                  <Button variant="outline" size="sm" title="Ver QR">
                                    <QrCode className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* SECCIÓN 2: Validación de Integridad */}
        <Card>
          <CardHeader>
            <button
              onClick={() => toggleSection('integrity')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <CardTitle>Validación de Integridad</CardTitle>
              </div>
              {expandedSections.integrity ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <CardDescription>
              Verifica la integridad de la cadena de registros y detecta alteraciones
            </CardDescription>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.integrity && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0">
                  <IntegrityValidationSection registries={registries} />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* SECCIÓN 3: Integración AEAT */}
        <Card>
          <CardHeader>
            <button
              onClick={() => toggleSection('aeat')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-green-600" />
                <CardTitle>Integración con AEAT</CardTitle>
              </div>
              {expandedSections.aeat ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <CardDescription>
              Configuración y envío automático de registros a la AEAT
            </CardDescription>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.aeat && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0">
                  <AEATIntegrationSection registries={registries} onRefresh={fetchRegistries} />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* SECCIÓN 4: Certificados Electrónicos */}
        <Card>
          <CardHeader>
            <button
              onClick={() => toggleSection('certificates')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-600" />
                <CardTitle>Certificados Electrónicos</CardTitle>
              </div>
              {expandedSections.certificates ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <CardDescription>
              Gestiona certificados electrónicos para autenticación con AEAT
            </CardDescription>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.certificates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0">
                  <CertificatesSection />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

// Componente para Validación de Integridad
function IntegrityValidationSection({ registries }: { registries: VerifactuRegistry[] }) {
  const { toast } = useToast();
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidate = async () => {
    setValidating(true);
    try {
      const result = await apiClient.validateVerifactuIntegrity();
      setValidationResult(result);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo validar',
        variant: 'destructive',
      });
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Cadena de Integridad</h3>
          <p className="text-sm text-muted-foreground">
            Verifica que todos los registros estén correctamente enlazados
          </p>
        </div>
        <Button onClick={handleValidate} disabled={validating || registries.length === 0}>
          {validating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Validar Cadena
            </>
          )}
        </Button>
      </div>

      {validationResult && (
        <div
          className={`p-4 rounded-lg ${
            validationResult.is_valid
              ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {validationResult.is_valid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <h4 className="font-semibold">
              {validationResult.is_valid ? 'Cadena Íntegra' : 'Problemas Detectados'}
            </h4>
          </div>
          {validationResult.errors && validationResult.errors.length > 0 && (
            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
              {validationResult.errors.map((error: string, idx: number) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Visualización de la Cadena</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {registries.map((registry, idx) => (
            <div key={registry.id} className="flex items-center gap-2 p-2 border rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs">{registry.invoice_hash.substring(0, 16)}...</span>
                </div>
              </div>
              <Badge variant="outline">#{idx + 1}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para Integración AEAT
function AEATIntegrationSection({
  registries,
  onRefresh,
}: {
  registries: VerifactuRegistry[];
  onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);

  const handleSendToAEAT = async (registryId: number) => {
    setSending(true);
    try {
      await apiClient.markVerifactuRegistryAsSent(registryId);
      toast({
        title: 'Enviado',
        description: 'Registro marcado como enviado a AEAT',
        variant: 'success',
      });
      onRefresh();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'No se pudo enviar',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendAllPending = async () => {
    const pending = registries.filter((r) => !r.sent_to_aeat);
    if (pending.length === 0) {
      toast({
        title: 'Info',
        description: 'No hay registros pendientes',
        variant: 'default',
      });
      return;
    }

    setSending(true);
    try {
      const result = await apiClient.sendAllPendingToAEAT();
      const message = result.message && typeof result.message === 'string' 
        ? result.message 
        : `${pending.length} registros enviados a AEAT`;
      toast({
        title: 'Enviados',
        description: message,
        variant: 'success',
      });
      onRefresh();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error al enviar',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Configuración de Envío</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona el envío automático de registros a la AEAT
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="auto-send"
            checked={autoSendEnabled}
            onChange={(e) => setAutoSendEnabled(e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="auto-send">Envío Automático</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSendAllPending} disabled={sending}>
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Pendientes ({registries.filter((r) => !r.sent_to_aeat).length})
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Registros Pendientes</h4>
        {registries.filter((r) => !r.sent_to_aeat).length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay registros pendientes</p>
        ) : (
          <div className="space-y-2">
            {registries
              .filter((r) => !r.sent_to_aeat)
              .map((registry) => (
                <div key={registry.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-medium">Factura #{registry.invoice_id}</span>
                    <p className="text-xs text-muted-foreground">{formatDate(registry.created_at)}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSendToAEAT(registry.id)}
                    disabled={sending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para Certificados
function CertificatesSection() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getElectronicCertificates();
        setCertificates(data || []);
      } catch (err: any) {
        logger.error('Error cargando certificados', err);
        // No mostrar toast para certificados, es opcional
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Certificados Instalados</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona los certificados electrónicos para autenticación con AEAT
          </p>
        </div>
        <Button variant="outline" onClick={() => {
          toast({
            title: 'Info',
            description: 'Funcionalidad de subida de certificados en desarrollo',
            variant: 'default',
          });
        }}>
          <Key className="w-4 h-4 mr-2" />
          Agregar Certificado
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="w-16 h-16 text-muted-foreground mb-4" />
            <h4 className="font-semibold mb-2">No hay certificados</h4>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Instala un certificado electrónico para autenticarte con la AEAT
            </p>
            <Button onClick={() => {
              toast({
                title: 'Info',
                description: 'Funcionalidad de instalación de certificados en desarrollo',
                variant: 'default',
              });
            }}>
              <Key className="w-4 h-4 mr-2" />
              Instalar Certificado
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Válido hasta: {formatDate(cert.expires_at)}
                  </p>
                </div>
                <Badge variant={cert.valid ? 'default' : 'destructive'}>
                  {cert.valid ? 'Válido' : 'Expirado'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

