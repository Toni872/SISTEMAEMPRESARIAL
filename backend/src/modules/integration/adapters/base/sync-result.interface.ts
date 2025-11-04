/**
 * Resultado de una operación de sincronización
 */
export interface SyncResult {
  /**
   * Si la sincronización fue exitosa
   */
  success: boolean;

  /**
   * Mensaje descriptivo del resultado
   */
  message: string;

  /**
   * Número de registros procesados
   */
  recordsProcessed: number;

  /**
   * Número de registros creados
   */
  recordsCreated: number;

  /**
   * Número de registros actualizados
   */
  recordsUpdated: number;

  /**
   * Número de registros con errores
   */
  recordsFailed: number;

  /**
   * Errores encontrados durante la sincronización
   */
  errors?: SyncError[];

  /**
   * Tiempo que tomó la sincronización en milisegundos
   */
  duration: number;

  /**
   * Timestamp de cuando se completó
   */
  completedAt: Date;

  /**
   * Metadatos adicionales específicos de la integración
   */
  metadata?: Record<string, any>;
}

/**
 * Error durante la sincronización
 */
export interface SyncError {
  /**
   * ID del registro que falló
   */
  recordId?: string;

  /**
   * Mensaje de error
   */
  message: string;

  /**
   * Código de error si está disponible
   */
  code?: string;

  /**
   * Stack trace si está disponible
   */
  stack?: string;

  /**
   * Datos del registro que causó el error
   */
  data?: any;
}

/**
 * Tipo de sincronización
 */
export enum SyncType {
  PRODUCTS = 'products',
  ORDERS = 'orders',
  CUSTOMERS = 'customers',
  INVENTORY = 'inventory',
  PRICING = 'pricing',
}

/**
 * Dirección de sincronización
 */
export enum SyncDirection {
  /**
   * Del sistema externo al ERP
   */
  FROM_EXTERNAL = 'from_external',

  /**
   * Del ERP al sistema externo
   */
  TO_EXTERNAL = 'to_external',

  /**
   * Bidireccional
   */
  BIDIRECTIONAL = 'bidirectional',
}


