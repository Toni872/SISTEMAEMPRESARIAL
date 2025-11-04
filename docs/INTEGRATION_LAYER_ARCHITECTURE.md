# 🏗️ Arquitectura de la Capa de Integración

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Datos](#flujo-de-datos)
5. [Estructura de Directorios](#estructura-de-directorios)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Configuración](#configuración)
8. [Seguridad](#seguridad)
9. [Monitoreo y Logging](#monitoreo-y-logging)
10. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 🎯 Visión General

La **Capa de Integración** es el componente centralizado que gestiona todas las comunicaciones entre el ERP y sistemas externos. Proporciona una arquitectura escalable, mantenible y robusta para manejar integraciones con múltiples servicios de terceros.

### Objetivos Principales

- ✅ **Abstracción**: Ocultar complejidad de APIs externas
- ✅ **Escalabilidad**: Agregar nuevas integraciones fácilmente
- ✅ **Confiabilidad**: Manejo robusto de errores y reintentos
- ✅ **Observabilidad**: Logging y monitoreo completo
- ✅ **Rendimiento**: Procesamiento asíncrono con colas
- ✅ **Seguridad**: Gestión segura de credenciales y tokens

---

## 🏛️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE INTEGRACIÓN                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         API Layer (Controllers/Resolvers)          │    │
│  │  - REST Controllers                                │    │
│  │  - GraphQL Resolvers                               │    │
│  │  - Webhook Handlers                                │    │
│  └───────────────────┬────────────────────────────────┘    │
│                      │                                       │
│  ┌───────────────────▼────────────────────────────────┐    │
│  │      Integration Service Layer                      │    │
│  │  - IntegrationService (Orquestador principal)       │    │
│  │  - IntegrationRegistry (Catálogo de integraciones) │    │
│  │  - DataTransformerService                          │    │
│  │  - WebhookService                                  │    │
│  └───────────────────┬────────────────────────────────┘    │
│                      │                                       │
│  ┌───────────────────▼────────────────────────────────┐    │
│  │         Adapter Layer (Interfaces)                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ Webflow  │  │  Stripe  │  │  Mailchimp│        │    │
│  │  │ Adapter  │  │  Adapter │  │  Adapter │         │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │    │
│  │       │             │              │                │    │
│  │       └─────────────┼──────────────┘                │    │
│  │                     │                                │    │
│  │       ┌─────────────▼──────────────┐                │    │
│  │       │   BaseIntegrationAdapter    │                │    │
│  │       │   (Interface/Abstract)      │                │    │
│  │       └─────────────────────────────┘                │    │
│  └───────────────────┬────────────────────────────────┘    │
│                      │                                       │
│  ┌───────────────────▼────────────────────────────────┐    │
│  │         Queue Layer (Bull/Redis)                    │    │
│  │  - Integration Jobs Queue                           │    │
│  │  - Webhook Processing Queue                         │    │
│  │  - Sync Jobs Queue                                  │    │
│  └───────────────────┬────────────────────────────────┘    │
│                      │                                       │
│  ┌───────────────────▼────────────────────────────────┐    │
│  │      Configuration & Metadata Layer                 │    │
│  │  - IntegrationConfigService                         │    │
│  │  - CredentialsManager (encriptado)                  │    │
│  │  - IntegrationMetadataRepository                    │    │
│  └───────────────────┬────────────────────────────────┘    │
│                      │                                       │
│  ┌───────────────────▼────────────────────────────────┐    │
│  │         Infrastructure Layer                        │    │
│  │  - HTTP Client (Axios con retry)                    │    │
│  │  - Event Emitter (Webhooks)                         │    │
│  │  - Logger Service                                   │    │
│  │  - Metrics Service                                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      ERP Core Modules               │
        │  - Sales, Inventory, Products, etc. │
        └─────────────────────────────────────┘
```

---

## 🧩 Componentes Principales

### 1. Integration Service Layer

#### `IntegrationService`
- **Responsabilidad**: Orquestar todas las operaciones de integración
- **Funciones**:
  - Ejecutar sincronizaciones
  - Gestionar webhooks
  - Coordinar transformaciones de datos
  - Manejar errores y reintentos

#### `IntegrationRegistry`
- **Responsabilidad**: Catálogo centralizado de todas las integraciones disponibles
- **Funciones**:
  - Registrar/desregistrar adaptadores
  - Obtener adaptador por nombre
  - Validar configuración de integraciones

#### `DataTransformerService`
- **Responsabilidad**: Transformar datos entre formatos
- **Funciones**:
  - Mapeo de campos entre sistemas
  - Validación de datos
  - Normalización de formatos

#### `WebhookService`
- **Responsabilidad**: Gestionar webhooks entrantes y salientes
- **Funciones**:
  - Validar firma de webhooks
  - Enrutar eventos a procesadores
  - Retry automático en fallos

### 2. Adapter Layer

#### `BaseIntegrationAdapter` (Abstract/Interface)
```typescript
interface IIntegrationAdapter {
  // Identificación
  getName(): string;
  getVersion(): string;
  
  // Operaciones básicas
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // Sincronización
  syncProducts(): Promise<SyncResult>;
  syncOrders(): Promise<SyncResult>;
  syncCustomers(): Promise<SyncResult>;
  
  // Webhooks
  registerWebhook(url: string): Promise<string>;
  unregisterWebhook(webhookId: string): Promise<void>;
  
  // Validación
  validateCredentials(): Promise<boolean>;
}
```

#### Adaptadores Específicos
- `WebflowAdapter`: Integración con Webflow
- `StripeAdapter`: Integración con Stripe (futuro)
- `ShopifyAdapter`: Integración con Shopify (futuro)
- `MailchimpAdapter`: Integración con Mailchimp (futuro)

### 3. Queue Layer

#### Colas de Trabajo
- `integration-jobs`: Trabajos generales de integración
- `webhook-jobs`: Procesamiento de webhooks
- `sync-jobs`: Sincronizaciones programadas

#### Procesadores
- `IntegrationProcessor`: Procesa trabajos de integración
- `WebhookProcessor`: Procesa webhooks entrantes
- `SyncProcessor`: Ejecuta sincronizaciones periódicas

### 4. Configuration Layer

#### `IntegrationConfigService`
- **Responsabilidad**: Gestionar configuración de integraciones
- **Funciones**:
  - Guardar/obtener configuración
  - Validar configuración
  - Gestionar credenciales (encriptadas)

#### `CredentialsManager`
- **Responsabilidad**: Gestión segura de credenciales
- **Funciones**:
  - Encriptar/desencriptar credenciales
  - Renovar tokens automáticamente
  - Validar expiración de tokens

### 5. Infrastructure Layer

#### `HttpClientService`
- Cliente HTTP con retry automático
- Rate limiting
- Timeout configurables

#### `EventEmitterService`
- Emitir eventos de integración
- Suscribirse a eventos del sistema

#### `IntegrationLogger`
- Logging específico para integraciones
- Contexto rico para debugging

---

## 🔄 Flujo de Datos

### Flujo de Sincronización

```
1. Usuario/Job → IntegrationService.sync()
2. IntegrationService → IntegrationRegistry.getAdapter()
3. IntegrationService → DataTransformer.transform()
4. IntegrationService → QueueService.addJob()
5. Queue → IntegrationProcessor.process()
6. Processor → Adapter.syncProducts()
7. Adapter → HTTP Client → External API
8. Response → DataTransformer.transform()
9. Transformed Data → ERP Core Modules
10. Result → IntegrationService → Log/Notify
```

### Flujo de Webhook

```
1. External Service → WebhookController.webhook()
2. WebhookController → WebhookService.validate()
3. WebhookService → QueueService.addWebhookJob()
4. Queue → WebhookProcessor.process()
5. Processor → IntegrationRegistry.getAdapter()
6. Adapter.handleWebhook() → Transform Data
7. Transform Data → ERP Core Modules
8. Result → EventEmitter.emit()
```

---

## 📁 Estructura de Directorios

```
backend/src/modules/integration/
├── integration.module.ts              # Módulo principal
├── integration.service.ts             # Servicio orquestador
├── integration-registry.service.ts    # Registro de adaptadores
├── data-transformer.service.ts        # Transformación de datos
├── webhook.service.ts                 # Gestión de webhooks
│
├── adapters/                          # Capa de adaptadores
│   ├── base/                          # Base e interfaces
│   │   ├── base-integration.adapter.ts
│   │   ├── integration.adapter.interface.ts
│   │   └── sync-result.interface.ts
│   │
│   ├── webflow/                       # Adaptador Webflow
│   │   ├── webflow.adapter.ts
│   │   ├── webflow.types.ts
│   │   └── webflow.mapper.ts
│   │
│   └── [future-adapters]/             # Otros adaptadores
│
├── processors/                        # Procesadores de cola
│   ├── integration.processor.ts
│   ├── webhook.processor.ts
│   └── sync.processor.ts
│
├── config/                            # Configuración
│   ├── integration-config.service.ts
│   ├── credentials-manager.service.ts
│   └── integration-config.entity.ts
│
├── infrastructure/                    # Infraestructura
│   ├── http-client.service.ts
│   ├── event-emitter.service.ts
│   └── integration-logger.service.ts
│
├── dto/                               # DTOs
│   ├── sync-request.dto.ts
│   ├── sync-result.dto.ts
│   ├── webhook-payload.dto.ts
│   └── integration-config.dto.ts
│
├── controllers/                       # Controllers REST
│   ├── integration.controller.ts
│   └── webhook.controller.ts
│
├── resolvers/                         # GraphQL Resolvers
│   ├── integration.resolver.ts
│   └── webhook.resolver.ts
│
└── entities/                          # Entidades Prisma
    ├── integration.entity.ts
    ├── integration-log.entity.ts
    └── webhook-event.entity.ts
```

---

## 🎨 Patrones de Diseño

### 1. Adapter Pattern
- **Propósito**: Convertir interfaces incompatibles
- **Implementación**: `BaseIntegrationAdapter` + adaptadores específicos

### 2. Strategy Pattern
- **Propósito**: Intercambiar algoritmos de transformación
- **Implementación**: Diferentes transformadores por tipo de dato

### 3. Factory Pattern
- **Propósito**: Crear adaptadores dinámicamente
- **Implementación**: `IntegrationRegistry`

### 4. Observer Pattern
- **Propósito**: Notificar eventos de integración
- **Implementación**: EventEmitter para webhooks y syncs

### 5. Queue Pattern
- **Propósito**: Procesamiento asíncrono
- **Implementación**: Bull queues con Redis

---

## ⚙️ Configuración

### Configuración de Integración

```typescript
interface IntegrationConfig {
  id: string;
  name: string;
  type: 'webflow' | 'stripe' | 'shopify' | 'custom';
  enabled: boolean;
  credentials: EncryptedCredentials;
  syncSettings: {
    products: SyncSettings;
    orders: SyncSettings;
    customers: SyncSettings;
  };
  webhookSettings: {
    enabled: boolean;
    url: string;
    secret: string;
  };
  retrySettings: {
    maxRetries: number;
    retryDelay: number;
  };
}
```

### Variables de Entorno

```env
# Integration Layer
INTEGRATION_ENCRYPTION_KEY=your-encryption-key
INTEGRATION_MAX_RETRIES=3
INTEGRATION_RETRY_DELAY=5000
INTEGRATION_QUEUE_CONCURRENCY=5

# Webhooks
WEBHOOK_SECRET=your-webhook-secret
WEBHOOK_TIMEOUT=30000

# Rate Limiting
INTEGRATION_RATE_LIMIT_PER_MINUTE=60
```

---

## 🔒 Seguridad

### Gestión de Credenciales

1. **Encriptación**: Todas las credenciales encriptadas en BD
2. **Rotación**: Soporte para renovación automática de tokens
3. **Scopes**: Permisos granulares por integración
4. **Auditoría**: Logging de acceso a credenciales

### Validación de Webhooks

1. **Firma**: Validación de HMAC/SHA256
2. **Timestamp**: Verificación de recency
3. **Nonce**: Prevención de replay attacks
4. **IP Whitelist**: Opcional, restringir IPs origen

---

## 📊 Monitoreo y Logging

### Métricas

- Tasa de éxito/fallo por integración
- Latencia de sincronizaciones
- Número de webhooks procesados
- Tamaño de colas de trabajo

### Logging

- **Nivel DEBUG**: Requests/responses HTTP completos
- **Nivel INFO**: Operaciones de sincronización
- **Nivel WARN**: Errores recuperables
- **Nivel ERROR**: Fallos críticos

### Dashboards

- Estado de integraciones en tiempo real
- Histórico de sincronizaciones
- Alertas de fallos

---

## 🗺️ Roadmap de Implementación

### Fase 1: Infraestructura Base (Actual)
- ✅ Queue Module
- ✅ Base Architecture Design
- ⏳ Integration Module Structure

### Fase 2: Core Services
- [ ] IntegrationService
- [ ] IntegrationRegistry
- [ ] DataTransformerService
- [ ] BaseIntegrationAdapter

### Fase 3: Webflow Integration
- [ ] Migrar WebflowModule a nueva arquitectura
- [ ] WebflowAdapter
- [ ] Webflow Webhook Handler
- [ ] Tests

### Fase 4: Configuration & Security
- [ ] IntegrationConfigService
- [ ] CredentialsManager
- [ ] Encryption Layer
- [ ] Config UI

### Fase 5: Monitoring & Observability
- [ ] IntegrationLogger
- [ ] Metrics Service
- [ ] Dashboard de integraciones

### Fase 6: Nuevas Integraciones
- [ ] Stripe Adapter
- [ ] Shopify Adapter
- [ ] Mailchimp Adapter

---

## 📚 Referencias

- [NestJS Modules Documentation](https://docs.nestjs.com/modules)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Webhook Best Practices](https://webhooks.fyi/)

---

**Última actualización**: 2025-11-04
**Versión**: 1.0.0


