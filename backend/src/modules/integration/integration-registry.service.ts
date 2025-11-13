import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IIntegrationAdapter } from './adapters/base/integration.adapter.interface';

/**
 * Servicio que mantiene un registro centralizado de todos los adaptadores de integración
 * Implementa el patrón Registry para gestionar adaptadores dinámicamente
 */
@Injectable()
export class IntegrationRegistry {
  private readonly logger = new Logger(IntegrationRegistry.name);
  private readonly adapters = new Map<string, IIntegrationAdapter>();

  /**
   * Registrar un adaptador en el registro
   * @param adapter Adaptador a registrar
   */
  register(adapter: IIntegrationAdapter): void {
    const name = adapter.getName();

    if (this.adapters.has(name)) {
      this.logger.warn(`Adaptador '${name}' ya está registrado. Se sobrescribirá.`);
    }

    this.adapters.set(name, adapter);
    this.logger.log(`Adaptador '${name}' (${adapter.getType()}) registrado exitosamente`);
  }

  /**
   * Desregistrar un adaptador
   * @param name Nombre del adaptador
   */
  unregister(name: string): void {
    if (!this.adapters.has(name)) {
      throw new NotFoundException(`Adaptador '${name}' no encontrado`);
    }

    this.adapters.delete(name);
    this.logger.log(`Adaptador '${name}' desregistrado`);
  }

  /**
   * Obtener un adaptador por nombre
   * @param name Nombre del adaptador
   * @returns Adaptador si existe
   * @throws NotFoundException si no existe
   */
  get(name: string): IIntegrationAdapter {
    const adapter = this.adapters.get(name);

    if (!adapter) {
      throw new NotFoundException(`Adaptador '${name}' no encontrado`);
    }

    return adapter;
  }

  /**
   * Obtener un adaptador por nombre sin lanzar excepción
   * @param name Nombre del adaptador
   * @returns Adaptador o undefined si no existe
   */
  tryGet(name: string): IIntegrationAdapter | undefined {
    return this.adapters.get(name);
  }

  /**
   * Verificar si un adaptador está registrado
   * @param name Nombre del adaptador
   * @returns true si está registrado
   */
  has(name: string): boolean {
    return this.adapters.has(name);
  }

  /**
   * Obtener todos los adaptadores registrados
   * @returns Array de adaptadores
   */
  getAll(): IIntegrationAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Obtener nombres de todos los adaptadores registrados
   * @returns Array de nombres
   */
  getNames(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Obtener adaptadores por tipo
   * @param type Tipo de integración
   * @returns Array de adaptadores del tipo especificado
   */
  getByType(type: string): IIntegrationAdapter[] {
    return this.getAll().filter(adapter => adapter.getType() === type);
  }

  /**
   * Contar adaptadores registrados
   * @returns Número de adaptadores
   */
  count(): number {
    return this.adapters.size;
  }

  /**
   * Limpiar todos los adaptadores (útil para tests)
   */
  clear(): void {
    this.adapters.clear();
    this.logger.log('Registro de adaptadores limpiado');
  }

  /**
   * Obtener información de todos los adaptadores
   * @returns Array con información de cada adaptador
   */
  getAdaptersInfo(): Array<{
    name: string;
    type: string;
    version: string;
    connected: boolean;
  }> {
    return this.getAll().map(adapter => ({
      name: adapter.getName(),
      type: adapter.getType(),
      version: adapter.getVersion(),
      connected: adapter.isConnected(),
    }));
  }
}
