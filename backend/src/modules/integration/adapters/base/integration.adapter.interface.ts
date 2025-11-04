import { SyncResult } from './sync-result.interface';

/**
 * Interfaz base que deben implementar todos los adaptadores de integración
 * Define el contrato común para todas las integraciones con sistemas externos
 */
export interface IIntegrationAdapter {
  /**
   * Nombre único de la integración (ej: 'webflow', 'stripe')
   */
  getName(): string;

  /**
   * Versión del adaptador
   */
  getVersion(): string;

  /**
   * Tipo de integración
   */
  getType(): string;

  /**
   * Conectar con el servicio externo
   * @throws {Error} Si la conexión falla
   */
  connect(): Promise<void>;

  /**
   * Desconectar del servicio externo
   */
  disconnect(): Promise<void>;

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean;

  /**
   * Validar credenciales de la integración
   * @returns true si las credenciales son válidas
   */
  validateCredentials(): Promise<boolean>;

  /**
   * Sincronizar productos desde el sistema externo al ERP
   * @param options Opciones de sincronización
   */
  syncProducts(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Sincronizar productos desde el ERP al sistema externo
   * @param options Opciones de sincronización
   */
  syncProductsToExternal(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Sincronizar órdenes desde el sistema externo al ERP
   * @param options Opciones de sincronización
   */
  syncOrders(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Sincronizar clientes desde el sistema externo al ERP
   * @param options Opciones de sincronización
   */
  syncCustomers(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Registrar webhook en el servicio externo
   * @param url URL del webhook
   * @param events Eventos a suscribir
   * @returns ID del webhook registrado
   */
  registerWebhook(url: string, events: string[]): Promise<string>;

  /**
   * Desregistrar webhook
   * @param webhookId ID del webhook
   */
  unregisterWebhook(webhookId: string): Promise<void>;

  /**
   * Procesar un webhook recibido
   * @param payload Payload del webhook
   * @param signature Firma del webhook para validación
   */
  handleWebhook(payload: any, signature?: string): Promise<void>;

  /**
   * Obtener estado de la integración
   */
  getStatus(): Promise<IntegrationStatus>;
}

/**
 * Opciones para sincronización
 */
export interface SyncOptions {
  /**
   * Fecha de inicio para sincronización incremental
   */
  startDate?: Date;

  /**
   * Fecha de fin para sincronización incremental
   */
  endDate?: Date;

  /**
   * IDs específicos a sincronizar
   */
  ids?: string[];

  /**
   * Si es true, sincroniza todos los datos (full sync)
   */
  fullSync?: boolean;

  /**
   * Límite de registros a sincronizar
   */
  limit?: number;

  /**
   * Offset para paginación
   */
  offset?: number;
}

/**
 * Estado de la integración
 */
export interface IntegrationStatus {
  /**
   * Si la integración está habilitada
   */
  enabled: boolean;

  /**
   * Si está conectada al servicio externo
   */
  connected: boolean;

  /**
   * Última vez que se sincronizó
   */
  lastSyncAt?: Date;

  /**
   * Último error ocurrido
   */
  lastError?: string;

  /**
   * Estadísticas de sincronización
   */
  stats?: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    lastSyncDuration?: number;
  };
}


