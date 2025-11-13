import { Injectable } from '@nestjs/common';
import { BaseIntegrationAdapter } from '../base/base-integration.adapter';
import { SyncOptions, IntegrationStatus } from '../base/integration.adapter.interface';
import { SyncResult, SyncType, SyncDirection } from '../base/sync-result.interface';

/**
 * Adaptador de demostración
 * Muestra cómo funciona la capa de integración con datos simulados
 * Este adaptador puede usarse como template para crear adaptadores reales
 */
@Injectable()
export class DemoAdapter extends BaseIntegrationAdapter {
  constructor() {
    super('Demo Integration', '1.0.0');
  }

  getType(): string {
    return 'demo';
  }

  async connect(): Promise<void> {
    this.logger.log('Conectando a Demo Integration...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular conexión
    this.connected = true;
    this.logger.log('Demo Integration conectada exitosamente');
  }

  async validateCredentials(): Promise<boolean> {
    this.logger.log('Validando credenciales de Demo Integration...');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular validación
    return true; // Siempre válido para demo
  }

  async syncProducts(options?: SyncOptions): Promise<SyncResult> {
    return this.executeSync(async () => {
      this.logger.log('Sincronizando productos desde Demo Integration...');

      const recordsToProcess = options?.fullSync ? 150 : 25;
      const created = Math.floor(recordsToProcess * 0.3);
      const updated = recordsToProcess - created;

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular sincronización

      return this.createSuccessResult(
        recordsToProcess,
        created,
        updated,
        `Sincronizados ${recordsToProcess} productos desde Demo Integration`,
      );
    }, 'products');
  }

  async syncProductsToExternal(options?: SyncOptions): Promise<SyncResult> {
    return this.executeSync(async () => {
      this.logger.log('Enviando productos a Demo Integration...');

      const recordsToProcess = options?.fullSync ? 100 : 15;
      const created = Math.floor(recordsToProcess * 0.4);
      const updated = recordsToProcess - created;

      await new Promise(resolve => setTimeout(resolve, 800)); // Simular sincronización

      return this.createSuccessResult(
        recordsToProcess,
        created,
        updated,
        `Enviados ${recordsToProcess} productos a Demo Integration`,
      );
    }, 'products_to_external');
  }

  async syncOrders(options?: SyncOptions): Promise<SyncResult> {
    return this.executeSync(async () => {
      this.logger.log('Sincronizando órdenes desde Demo Integration...');

      const recordsToProcess = options?.fullSync ? 80 : 12;
      const created = Math.floor(recordsToProcess * 0.5);
      const updated = recordsToProcess - created;

      await new Promise(resolve => setTimeout(resolve, 900)); // Simular sincronización

      return this.createSuccessResult(
        recordsToProcess,
        created,
        updated,
        `Sincronizadas ${recordsToProcess} órdenes desde Demo Integration`,
      );
    }, 'orders');
  }

  async syncCustomers(options?: SyncOptions): Promise<SyncResult> {
    return this.executeSync(async () => {
      this.logger.log('Sincronizando clientes desde Demo Integration...');

      const recordsToProcess = options?.fullSync ? 60 : 10;
      const created = Math.floor(recordsToProcess * 0.6);
      const updated = recordsToProcess - created;

      await new Promise(resolve => setTimeout(resolve, 700)); // Simular sincronización

      return this.createSuccessResult(
        recordsToProcess,
        created,
        updated,
        `Sincronizados ${recordsToProcess} clientes desde Demo Integration`,
      );
    }, 'customers');
  }

  async registerWebhook(url: string, events: string[]): Promise<string> {
    this.logger.log(`Registrando webhook para eventos: ${events.join(', ')}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    const webhookId = `demo_webhook_${Date.now()}`;
    this.logger.log(`Webhook registrado con ID: ${webhookId}`);
    return webhookId;
  }

  async unregisterWebhook(webhookId: string): Promise<void> {
    this.logger.log(`Eliminando webhook: ${webhookId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    this.logger.log(`Webhook ${webhookId} eliminado`);
  }

  async handleWebhook(payload: any, signature?: string): Promise<void> {
    this.logger.log('Procesando webhook de Demo Integration');
    await new Promise(resolve => setTimeout(resolve, 200));
    this.logger.log('Webhook procesado exitosamente');
  }

  async getStatus(): Promise<IntegrationStatus> {
    return {
      enabled: true,
      connected: this.connected,
      lastSyncAt: this.lastSyncAt,
      lastError: this.lastError,
      stats: {
        totalSyncs: this.syncStats.totalSyncs,
        successfulSyncs: this.syncStats.successfulSyncs,
        failedSyncs: this.syncStats.failedSyncs,
        lastSyncDuration: this.lastSyncAt ? 1500 : undefined,
      },
    };
  }
}
