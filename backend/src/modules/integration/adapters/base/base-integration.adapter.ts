import { Injectable, Logger } from '@nestjs/common';
import {
  IIntegrationAdapter,
  SyncOptions,
  IntegrationStatus,
} from './integration.adapter.interface';
import { SyncResult } from './sync-result.interface';

/**
 * Clase base abstracta para adaptadores de integración
 * Proporciona implementación común y deja métodos específicos para las subclases
 */
@Injectable()
export abstract class BaseIntegrationAdapter implements IIntegrationAdapter {
  protected readonly logger: Logger;
  protected connected: boolean = false;
  protected lastSyncAt?: Date;
  protected lastError?: string;
  protected syncStats = {
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
  };

  constructor(protected readonly name: string, protected readonly version: string) {
    this.logger = new Logger(`${name}Adapter`);
  }

  /**
   * Nombre de la integración
   */
  getName(): string {
    return this.name;
  }

  /**
   * Versión del adaptador
   */
  getVersion(): string {
    return this.version;
  }

  /**
   * Tipo de integración (debe ser implementado por subclases)
   */
  abstract getType(): string;

  /**
   * Conectar con el servicio externo (debe ser implementado por subclases)
   */
  abstract connect(): Promise<void>;

  /**
   * Desconectar del servicio externo
   */
  async disconnect(): Promise<void> {
    this.connected = false;
    this.logger.log('Desconectado del servicio externo');
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Validar credenciales (debe ser implementado por subclases)
   */
  abstract validateCredentials(): Promise<boolean>;

  /**
   * Sincronizar productos desde externo (debe ser implementado por subclases)
   */
  abstract syncProducts(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Sincronizar productos hacia externo (debe ser implementado por subclases)
   */
  abstract syncProductsToExternal(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Sincronizar órdenes (debe ser implementado por subclases)
   */
  abstract syncOrders(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Sincronizar clientes (debe ser implementado por subclases)
   */
  abstract syncCustomers(options?: SyncOptions): Promise<SyncResult>;

  /**
   * Registrar webhook (debe ser implementado por subclases)
   */
  abstract registerWebhook(url: string, events: string[]): Promise<string>;

  /**
   * Desregistrar webhook (debe ser implementado por subclases)
   */
  abstract unregisterWebhook(webhookId: string): Promise<void>;

  /**
   * Procesar webhook (debe ser implementado por subclases)
   */
  abstract handleWebhook(payload: any, signature?: string): Promise<void>;

  /**
   * Obtener estado de la integración
   */
  async getStatus(): Promise<IntegrationStatus> {
    return {
      enabled: true,
      connected: this.isConnected(),
      lastSyncAt: this.lastSyncAt,
      lastError: this.lastError,
      stats: {
        ...this.syncStats,
      },
    };
  }

  /**
   * Método helper para ejecutar sincronizaciones con manejo de errores
   */
  protected async executeSync<T>(
    syncFn: () => Promise<T>,
    syncType: string,
  ): Promise<T> {
    const startTime = Date.now();
    this.syncStats.totalSyncs++;

    try {
      this.logger.log(`Iniciando sincronización: ${syncType}`);
      const result = await syncFn();
      const duration = Date.now() - startTime;

      this.syncStats.successfulSyncs++;
      this.lastSyncAt = new Date();
      this.lastError = undefined;

      this.logger.log(
        `Sincronización completada: ${syncType} en ${duration}ms`,
      );
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.syncStats.failedSyncs++;
      this.lastError = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Error en sincronización ${syncType}: ${this.lastError}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Crear resultado de sincronización exitosa
   */
  protected createSuccessResult(
    recordsProcessed: number,
    recordsCreated: number = 0,
    recordsUpdated: number = 0,
    message?: string,
    metadata?: Record<string, any>,
  ): SyncResult {
    return {
      success: true,
      message: message || 'Sincronización completada exitosamente',
      recordsProcessed,
      recordsCreated,
      recordsUpdated,
      recordsFailed: 0,
      duration: 0, // Se calculará en executeSync
      completedAt: new Date(),
      metadata,
    };
  }

  /**
   * Crear resultado de sincronización con errores
   */
  protected createErrorResult(
    message: string,
    errors?: Array<{ recordId?: string; message: string }>,
    metadata?: Record<string, any>,
  ): SyncResult {
    return {
      success: false,
      message,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsFailed: errors?.length || 0,
      errors: errors?.map((e) => ({
        recordId: e.recordId,
        message: e.message,
      })),
      duration: 0,
      completedAt: new Date(),
      metadata,
    };
  }
}


