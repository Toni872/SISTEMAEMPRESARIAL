import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { IntegrationService } from '../integration.service';
import { SyncTypeEnum, SyncDirectionEnum, SyncResult, IntegrationInfo, IntegrationStatus } from '../dto/integration.dto';
import { SyncType, SyncDirection } from '../adapters/base/sync-result.interface';

@Resolver()
@UseGuards(JwtAuthGuard)
export class IntegrationResolver {
  private readonly logger = new Logger(IntegrationResolver.name);

  constructor(private readonly integrationService: IntegrationService) {}

  @Query(() => [IntegrationInfo], {
    name: 'integrations',
    description: 'Obtener lista de todas las integraciones disponibles',
  })
  async getIntegrations(): Promise<IntegrationInfo[]> {
    try {
      const integrations = this.integrationService.getAvailableIntegrations();
      
      if (integrations.length === 0) {
        return [];
      }

      const statusPromises = integrations.map(async (integration) => {
        try {
          const status = await this.integrationService.getStatus(integration.name);
          return {
            name: integration.name,
            type: integration.type,
            version: integration.version,
            connected: integration.connected,
            status: {
              enabled: status.enabled,
              connected: status.connected,
              lastSyncAt: status.lastSyncAt,
              lastError: status.lastError,
              stats: status.stats ? {
                totalSyncs: status.stats.totalSyncs,
                successfulSyncs: status.stats.successfulSyncs,
                failedSyncs: status.stats.failedSyncs,
                lastSyncDuration: status.stats.lastSyncDuration,
              } : undefined,
            },
          };
        } catch (error) {
          // Si hay error obteniendo el status, devolver info básica
          return {
            name: integration.name,
            type: integration.type,
            version: integration.version,
            connected: false,
            status: {
              enabled: false,
              connected: false,
              lastError: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      });

      return Promise.all(statusPromises);
    } catch (error) {
      this.logger.error('Error getting integrations', error);
      return [];
    }
  }

  @Query(() => IntegrationStatus, {
    name: 'integrationStatus',
    description: 'Obtener estado de una integración específica',
  })
  async getIntegrationStatus(
    @Args('name', { type: () => String }) name: string,
  ): Promise<IntegrationStatus> {
    return await this.integrationService.getStatus(name);
  }

  @Mutation(() => SyncResult, {
    name: 'syncIntegration',
    description: 'Sincronizar datos de una integración',
  })
  async syncIntegration(
    @Args('integrationName', { type: () => String }) integrationName: string,
    @Args('syncType', { type: () => SyncTypeEnum }) syncType: SyncTypeEnum,
    @Args('direction', { type: () => SyncDirectionEnum, nullable: true, defaultValue: SyncDirectionEnum.FROM_EXTERNAL }) 
    direction: SyncDirectionEnum,
    @Args('fullSync', { type: () => Boolean, nullable: true, defaultValue: false }) 
    fullSync?: boolean,
  ): Promise<SyncResult> {
    const result = await this.integrationService.sync(
      integrationName,
      syncType as unknown as SyncType,
      direction as unknown as SyncDirection,
      { fullSync },
    );

    return {
      success: result.success,
      message: result.message,
      recordsProcessed: result.recordsProcessed,
      recordsCreated: result.recordsCreated,
      recordsUpdated: result.recordsUpdated,
      recordsFailed: result.recordsFailed,
      errors: result.errors?.map((e) => ({
        recordId: e.recordId,
        message: e.message,
        code: e.code,
      })),
      duration: result.duration,
      completedAt: result.completedAt,
    };
  }

  @Mutation(() => Boolean, {
    name: 'connectIntegration',
    description: 'Conectar a una integración',
  })
  async connectIntegration(
    @Args('name', { type: () => String }) name: string,
  ): Promise<boolean> {
    await this.integrationService.connect(name);
    return true;
  }

  @Mutation(() => Boolean, {
    name: 'disconnectIntegration',
    description: 'Desconectar de una integración',
  })
  async disconnectIntegration(
    @Args('name', { type: () => String }) name: string,
  ): Promise<boolean> {
    await this.integrationService.disconnect(name);
    return true;
  }

  @Mutation(() => Boolean, {
    name: 'validateIntegrationCredentials',
    description: 'Validar credenciales de una integración',
  })
  async validateCredentials(
    @Args('name', { type: () => String }) name: string,
  ): Promise<boolean> {
    return await this.integrationService.validateCredentials(name);
  }
}
