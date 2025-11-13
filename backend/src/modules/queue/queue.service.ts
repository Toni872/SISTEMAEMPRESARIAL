import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface ReportJob {
  type: 'pdf' | 'excel';
  reportId: string;
  userId: number;
  data: any;
}

export interface NotificationJob {
  type: 'email' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  metadata?: any;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('reports') private reportsQueue: Queue,
    @InjectQueue('notifications') private notificationsQueue: Queue,
    @InjectQueue('exports') private exportsQueue: Queue,
  ) {}

  /**
   * Agregar job de generación de reporte
   */
  async addReportJob(job: ReportJob) {
    return this.reportsQueue.add('generate-report', job, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 10, // Mantener solo los 10 últimos completos
      removeOnFail: 50, // Mantener hasta 50 fallos
    });
  }

  /**
   * Agregar job de notificación
   */
  async addNotificationJob(job: NotificationJob) {
    return this.notificationsQueue.add('send-notification', job, {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 1000,
      },
    });
  }

  /**
   * Agregar job de exportación
   */
  async addExportJob(job: { type: 'excel' | 'csv'; filename: string; data: any; userId: number }) {
    return this.exportsQueue.add('export-data', job, {
      attempts: 2,
    });
  }

  /**
   * Obtener estado de todas las colas
   */
  async getQueueStatus() {
    const [reportsStatus, notificationsStatus, exportsStatus] = await Promise.all([
      this.reportsQueue.getJobCounts(),
      this.notificationsQueue.getJobCounts(),
      this.exportsQueue.getJobCounts(),
    ]);

    return {
      reports: reportsStatus,
      notifications: notificationsStatus,
      exports: exportsStatus,
      total: {
        waiting: reportsStatus.waiting + notificationsStatus.waiting + exportsStatus.waiting,
        active: reportsStatus.active + notificationsStatus.active + exportsStatus.active,
        completed:
          reportsStatus.completed + notificationsStatus.completed + exportsStatus.completed,
        failed: reportsStatus.failed + notificationsStatus.failed + exportsStatus.failed,
      },
    };
  }

  /**
   * Limpiar jobs completados/fallidos
   */
  async cleanQueue(queueName: 'reports' | 'notifications' | 'exports') {
    const queue = this.getQueue(queueName);

    await Promise.all([
      queue.clean(24 * 60 * 60 * 1000, 'completed'), // 24 horas
      queue.clean(7 * 24 * 60 * 60 * 1000, 'failed'), // 7 días
    ]);
  }

  private getQueue(queueName: 'reports' | 'notifications' | 'exports'): Queue {
    switch (queueName) {
      case 'reports':
        return this.reportsQueue;
      case 'notifications':
        return this.notificationsQueue;
      case 'exports':
        return this.exportsQueue;
    }
  }
}
