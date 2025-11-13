import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { IntegrationRegistry } from './integration-registry.service';
import { SyncType, SyncDirection } from './adapters/base/sync-result.interface';
import type {
  SyncOptions,
  IIntegrationAdapter,
} from './adapters/base/integration.adapter.interface';
import type { SyncResult } from './adapters/base/sync-result.interface';

/**
 * Servicio principal que orquesta todas las operaciones de integración
 * Actúa como fachada para simplificar el uso de adaptadores
 */
@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  constructor(private readonly registry: IntegrationRegistry) {}

  /**
   * Obtener adaptador y validar que existe
   */
  private getAdapter(name: string): IIntegrationAdapter {
    try {
      return this.registry.get(name);
    } catch (error) {
      throw new NotFoundException(
        `Integración '${name}' no encontrada. Integraciones disponibles: ${this.registry.getNames().join(', ')}`,
      );
    }
  }

  /**
   * Sincronizar datos de un tipo específico
   * @param integrationName Nombre de la integración
   * @param syncType Tipo de sincronización
   * @param direction Dirección de sincronización
   * @param options Opciones de sincronización
   */
  async sync(
    integrationName: string,
    syncType: SyncType,
    direction: SyncDirection = SyncDirection.FROM_EXTERNAL,
    options?: SyncOptions,
  ): Promise<SyncResult> {
    const adapter = this.getAdapter(integrationName);

    this.logger.log(`Iniciando sincronización: ${integrationName} - ${syncType} - ${direction}`);

    try {
      // Validar que el adaptador está conectado
      if (!adapter.isConnected()) {
        this.logger.warn(`Adaptador ${integrationName} no está conectado. Intentando conectar...`);
        await adapter.connect();
      }

      // Ejecutar sincronización según tipo y dirección
      let result: SyncResult;

      switch (syncType) {
        case SyncType.PRODUCTS:
          if (direction === SyncDirection.FROM_EXTERNAL) {
            result = await adapter.syncProducts(options);
          } else if (direction === SyncDirection.TO_EXTERNAL) {
            result = await adapter.syncProductsToExternal(options);
          } else {
            // Bidirectional: primero desde externo, luego hacia externo
            const fromExternal = await adapter.syncProducts(options);
            const toExternal = await adapter.syncProductsToExternal(options);
            result = this.mergeSyncResults(fromExternal, toExternal);
          }
          break;

        case SyncType.ORDERS:
          if (direction === SyncDirection.TO_EXTERNAL) {
            throw new BadRequestException(
              'La sincronización de órdenes solo está disponible desde sistemas externos',
            );
          }
          result = await adapter.syncOrders(options);
          break;

        case SyncType.CUSTOMERS:
          if (direction === SyncDirection.TO_EXTERNAL) {
            throw new BadRequestException(
              'La sincronización de clientes solo está disponible desde sistemas externos',
            );
          }
          result = await adapter.syncCustomers(options);
          break;

        default:
          throw new BadRequestException(`Tipo de sincronización no soportado: ${syncType}`);
      }

      this.logger.log(
        `Sincronización completada: ${integrationName} - ${syncType} - ${result.recordsProcessed} registros procesados`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error en sincronización ${integrationName} - ${syncType}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Validar credenciales de una integración
   * @param integrationName Nombre de la integración
   */
  async validateCredentials(integrationName: string): Promise<boolean> {
    const adapter = this.getAdapter(integrationName);

    try {
      return await adapter.validateCredentials();
    } catch (error) {
      this.logger.error(
        `Error validando credenciales de ${integrationName}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  /**
   * Conectar a una integración
   * @param integrationName Nombre de la integración
   */
  async connect(integrationName: string): Promise<void> {
    const adapter = this.getAdapter(integrationName);

    this.logger.log(`Conectando a integración: ${integrationName}`);
    await adapter.connect();
    this.logger.log(`Conectado exitosamente a: ${integrationName}`);
  }

  /**
   * Desconectar de una integración
   * @param integrationName Nombre de la integración
   */
  async disconnect(integrationName: string): Promise<void> {
    const adapter = this.getAdapter(integrationName);

    this.logger.log(`Desconectando de integración: ${integrationName}`);
    await adapter.disconnect();
    this.logger.log(`Desconectado de: ${integrationName}`);
  }

  /**
   * Obtener estado de una integración
   * @param integrationName Nombre de la integración
   */
  async getStatus(integrationName: string) {
    const adapter = this.getAdapter(integrationName);
    return await adapter.getStatus();
  }

  /**
   * Obtener estado de todas las integraciones
   */
  async getAllStatuses() {
    const adapters = this.registry.getAll();
    const statuses = await Promise.all(
      adapters.map(async adapter => ({
        name: adapter.getName(),
        type: adapter.getType(),
        version: adapter.getVersion(),
        status: await adapter.getStatus(),
      })),
    );
    return statuses;
  }

  /**
   * Registrar webhook para una integración
   * @param integrationName Nombre de la integración
   * @param url URL del webhook
   * @param events Eventos a suscribir
   */
  async registerWebhook(integrationName: string, url: string, events: string[]): Promise<string> {
    const adapter = this.getAdapter(integrationName);

    this.logger.log(
      `Registrando webhook para ${integrationName}: ${url} - eventos: ${events.join(', ')}`,
    );

    try {
      const webhookId = await adapter.registerWebhook(url, events);
      this.logger.log(`Webhook registrado exitosamente: ${webhookId}`);
      return webhookId;
    } catch (error) {
      this.logger.error(
        `Error registrando webhook: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Desregistrar webhook
   * @param integrationName Nombre de la integración
   * @param webhookId ID del webhook
   */
  async unregisterWebhook(integrationName: string, webhookId: string): Promise<void> {
    const adapter = this.getAdapter(integrationName);

    this.logger.log(`Desregistrando webhook ${webhookId} de ${integrationName}`);
    await adapter.unregisterWebhook(webhookId);
    this.logger.log(`Webhook ${webhookId} desregistrado exitosamente`);
  }

  /**
   * Procesar un webhook recibido
   * @param integrationName Nombre de la integración
   * @param payload Payload del webhook
   * @param signature Firma del webhook
   */
  async handleWebhook(integrationName: string, payload: any, signature?: string): Promise<void> {
    const adapter = this.getAdapter(integrationName);

    this.logger.log(`Procesando webhook de ${integrationName}`);

    try {
      await adapter.handleWebhook(payload, signature);
      this.logger.log(`Webhook de ${integrationName} procesado exitosamente`);
    } catch (error) {
      this.logger.error(
        `Error procesando webhook: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Obtener lista de integraciones disponibles
   */
  getAvailableIntegrations() {
    return this.registry.getAdaptersInfo();
  }

  /**
   * Combinar resultados de sincronizaciones bidireccionales
   */
  private mergeSyncResults(result1: SyncResult, result2: SyncResult): SyncResult {
    return {
      success: result1.success && result2.success,
      message: `Sincronización bidireccional completada`,
      recordsProcessed: result1.recordsProcessed + result2.recordsProcessed,
      recordsCreated: result1.recordsCreated + result2.recordsCreated,
      recordsUpdated: result1.recordsUpdated + result2.recordsUpdated,
      recordsFailed: result1.recordsFailed + result2.recordsFailed,
      errors: [...(result1.errors || []), ...(result2.errors || [])],
      duration: result1.duration + result2.duration,
      completedAt: new Date(),
      metadata: {
        fromExternal: result1,
        toExternal: result2,
      },
    };
  }
}
