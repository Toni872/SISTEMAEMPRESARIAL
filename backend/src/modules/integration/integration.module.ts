import { Module, OnModuleInit } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationRegistry } from './integration-registry.service';
import { IntegrationResolver } from './resolvers/integration.resolver';
import { PrismaModule } from '../../common/prisma.module';
import { DemoAdapter } from './adapters/demo/demo.adapter';

/**
 * Módulo principal de integraciones
 * Gestiona todas las integraciones con sistemas externos
 * 
 * Para agregar una nueva integración:
 * 1. Crear el adaptador en adapters/[nombre]/
 * 2. Importar el adaptador aquí como provider
 * 3. Registrar el adaptador en onModuleInit()
 */
@Module({
  imports: [PrismaModule],
  providers: [
    IntegrationRegistry,
    IntegrationService,
    IntegrationResolver,
    DemoAdapter, // Adaptador de demostración
    // Agregar más adaptadores aquí cuando se implementen
  ],
  exports: [
    IntegrationService,
    IntegrationRegistry,
  ],
})
export class IntegrationModule implements OnModuleInit {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly demoAdapter: DemoAdapter,
  ) { }

  /**
   * Inicializar módulo y registrar todos los adaptadores disponibles
   * Este método se ejecuta automáticamente cuando el módulo se carga
   */
  async onModuleInit() {
    // Registrar adaptador de demostración
    this.registry.register(this.demoAdapter);

    // Cuando se implementen más adaptadores, registrarlos aquí:
    // this.registry.register(this.webflowAdapter);
    // this.registry.register(this.stripeAdapter);
    // etc.
  }
}
