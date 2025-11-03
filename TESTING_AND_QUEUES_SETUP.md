# 🧪 Testing & Bull Queues - Implementación Completa

## ✅ Implementación Completada

### 1. Testing Setup ✅

#### Backend Testing (Jest)

**Archivos creados:**
- ✅ `backend/src/modules/auth/auth.service.spec.ts` - Unit tests para AuthService
- ✅ `backend/test/auth.e2e-spec.ts` - E2E tests para autenticación
- ✅ `backend/test/jest-e2e.json` - Configuración Jest E2E

#### Ejecutar tests:

```bash
# Unit tests
cd backend
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

#### Frontend Testing (Vitest) - Ya configurado

```bash
cd frontend
npm test
npm run test:ui
npm run test:coverage
```

---

### 2. Bull Queues Setup ✅

#### Instalación completada:
```bash
cd backend
npm install @nestjs/bull bull
```

#### Arquitectura de colas:

```
QueueModule
├── QueueService (gestión de colas)
├── QueueController (REST API)
├── ReportProcessor (procesa reportes PDF/Excel)
└── NotificationProcessor (envía emails/notificaciones)
```

#### Colas configuradas:

1. **`reports`** - Generación de reportes pesados
   - PDF generation
   - Excel exports
   - Analytics reports

2. **`notifications`** - Sistema de notificaciones
   - Emails
   - Push notifications
   - In-app notifications

3. **`exports`** - Exportación de datos
   - CSV exports
   - Excel exports
   - Bulk data exports

---

## 🚀 Uso de las Colas

### Ejemplo 1: Generar reporte PDF

```typescript
import { QueueService } from './modules/queue/queue.service';

@Injectable()
export class ReportsService {
  constructor(private queueService: QueueService) {}

  async generateSalesReport(userId: number, dateRange: any) {
    const job = await this.queueService.addReportJob({
      type: 'pdf',
      reportId: `sales-${Date.now()}`,
      userId,
      data: {
        dateRange,
        template: 'sales-report',
      },
    });

    return {
      jobId: job.id,
      message: 'Report generation queued',
    };
  }
}
```

### Ejemplo 2: Enviar notificación

```typescript
async sendWelcomeEmail(userEmail: string) {
  const job = await this.queueService.addNotificationJob({
    type: 'email',
    recipient: userEmail,
    subject: 'Bienvenido al ERP',
    message: 'Tu cuenta ha sido creada exitosamente',
  });

  return job;
}
```

### Ejemplo 3: Exportar datos

```typescript
async exportProductsToExcel(userId: number, filters: any) {
  const job = await this.queueService.addExportJob({
    type: 'excel',
    filename: `products-export-${Date.now()}.xlsx`,
    data: filters,
    userId,
  });

  return job;
}
```

---

## 📊 Monitoreo de Colas

### API REST Endpoints:

#### 1. Estado de las colas
```bash
GET /api/queue/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "reports": {
    "waiting": 5,
    "active": 2,
    "completed": 150,
    "failed": 3
  },
  "notifications": {
    "waiting": 0,
    "active": 1,
    "completed": 2500,
    "failed": 5
  },
  "exports": {
    "waiting": 0,
    "active": 0,
    "completed": 100,
    "failed": 0
  },
  "total": {
    "waiting": 5,
    "active": 3,
    "completed": 2750,
    "failed": 8
  }
}
```

#### 2. Agregar job de reporte
```bash
POST /api/queue/reports
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "pdf",
  "reportId": "sales-report-123",
  "userId": 1,
  "data": { "dateRange": "2024-01" }
}
```

#### 3. Agregar job de notificación
```bash
POST /api/queue/notifications
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "email",
  "recipient": "user@example.com",
  "subject": "Welcome!",
  "message": "Thank you for joining"
}
```

#### 4. Limpiar cola
```bash
POST /api/queue/clean/:queueName
Authorization: Bearer <token>
```

---

## 🔍 Ver Jobs en el Dashboard de Bull

Bull provee un dashboard visual para ver el estado de las colas.

### Instalación del dashboard:

```bash
npm install @nestjs/bullmq bull-board
```

### Configuración (opcional):

```typescript
// backend/src/main.ts
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [/* tus queues */],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

Accede a: `http://localhost:3001/admin/queues`

---

## 🧪 Testing de las Colas

### Ejemplo de test para queue service:

```typescript
describe('QueueService', () => {
  let service: QueueService;
  let reportsQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: getQueueToken('reports'),
          useValue: {
            add: jest.fn(),
            getJobCounts: jest.fn(),
            clean: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    reportsQueue = module.get(getQueueToken('reports'));
  });

  it('should add a report job', async () => {
    const mockJob = { id: '123', data: {} };
    jest.spyOn(reportsQueue, 'add').mockResolvedValue(mockJob as any);

    const result = await service.addReportJob({
      type: 'pdf',
      reportId: 'test-123',
      userId: 1,
      data: {},
    });

    expect(result).toBe(mockJob);
    expect(reportsQueue.add).toHaveBeenCalledWith(
      'generate-report',
      expect.any(Object),
      expect.any(Object),
    );
  });
});
```

---

## 📈 Configuración Avanzada

### Configurar workers separados:

Puedes correr procesadores en workers separados:

```typescript
// worker.ts
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
}

bootstrap();
```

```bash
# Ejecutar worker separado
node dist/worker.js
```

### Configurar prioridades de jobs:

```typescript
await queue.add('high-priority-job', data, {
  priority: 1, // Mayor prioridad
  delay: 0,
});
```

### Configurar job scheduling:

```typescript
import * as Bull from 'bull';

const queue = new Bull('reports', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

// Agendar job
await queue.add('daily-report', data, {
  repeat: {
    cron: '0 9 * * *', // Cada día a las 9 AM
  },
});
```

---

## 🛠️ Troubleshooting

### Error: Redis connection failed

```bash
# Verificar que Redis esté corriendo
docker ps | grep redis

# Reiniciar Redis
docker-compose restart redis
```

### Error: Job stuck in "waiting"

```bash
# Ver logs del processor
docker logs erp-backend

# Verificar workers activos
GET /api/queue/status
```

### Job falla repetidamente

```typescript
// Los jobs con `attempts: 3` se reintentan automáticamente
// Si fallan 3 veces, se marcan como failed

// Ver jobs fallidos:
const failedJobs = await queue.getFailed();
console.log(failedJobs);
```

---

## 📚 Recursos

- [Bull Documentation](https://github.com/OptimalBits/bull)
- [NestJS Bull Module](https://docs.nestjs.com/techniques/queues)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing NestJS Applications](https://docs.nestjs.com/fundamentals/testing)

---

## ✅ Próximos Pasos

1. ✅ Testing implementado
2. ✅ Bull queues implementadas
3. ⚠️ Agregar librerías reales para PDF/Excel
4. ⚠️ Implementar dashboard de Bull
5. ⚠️ Agregar más tests
6. ⚠️ Integrar con servicios de email

---

## 🎯 Beneficios Obtenidos

✅ **Performance**: Tareas pesadas no bloquean la API
✅ **Reliability**: Reintentos automáticos en fallos
✅ **Scalability**: Procesamiento paralelo de jobs
✅ **Monitoring**: Visibilidad del estado de colas
✅ **Testing**: Cobertura de código con tests

---

**¡Sistema de testing y queues completamente implementado!** 🚀

