import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MonitoringService } from '../monitoring/monitoring.service';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: ServiceStatus;
    memory: ServiceStatus;
    uptime: ServiceStatus;
  };
  metrics: {
    uptime: number;
    memory: NodeJS.MemoryUsage;
    errors: Record<string, number>;
  };
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  message?: string;
  responseTime?: number;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private prisma: PrismaService,
    private monitoring: MonitoringService,
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    const services = {
      database: await this.checkDatabase(),
      memory: this.checkMemory(),
      uptime: this.checkUptime(),
    };

    const monitoringHealth = this.monitoring.getHealthStatus();

    // Determinar estado general
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (Object.values(services).some(s => s.status === 'down')) {
      overallStatus = 'unhealthy';
    } else if (Object.values(services).some(s => s.status === 'degraded')) {
      overallStatus = 'degraded';
    }

    // Considerar estado de monitoreo
    if (monitoringHealth.status === 'unhealthy') {
      overallStatus = 'unhealthy';
    } else if (monitoringHealth.status === 'degraded' && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date(),
      services,
      metrics: {
        uptime: monitoringHealth.uptime,
        memory: monitoringHealth.memory,
        errors: monitoringHealth.errors,
      },
    };
  }

  private async checkDatabase(): Promise<ServiceStatus> {
    const startTime = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      // Degraded si toma más de 100ms
      if (responseTime > 100) {
        return {
          status: 'degraded',
          message: 'Database responding slowly',
          responseTime,
        };
      }

      return {
        status: 'up',
        message: 'Database connection successful',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      this.monitoring.recordError(error as Error, { service: 'database' }, 'critical');

      return {
        status: 'down',
        message: 'Database connection failed',
        responseTime: Date.now() - startTime,
      };
    }
  }

  private checkMemory(): ServiceStatus {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    if (heapUsedPercent > 90) {
      return {
        status: 'degraded',
        message: `High memory usage: ${heapUsedPercent.toFixed(1)}%`,
      };
    }

    if (heapUsedPercent > 95) {
      return {
        status: 'down',
        message: `Critical memory usage: ${heapUsedPercent.toFixed(1)}%`,
      };
    }

    return {
      status: 'up',
      message: `Memory usage: ${heapUsedPercent.toFixed(1)}%`,
    };
  }

  private checkUptime(): ServiceStatus {
    const uptime = process.uptime();
    const uptimeHours = uptime / 3600;

    if (uptimeHours < 0.1) {
      // Menos de 6 minutos
      return {
        status: 'degraded',
        message: `Service recently started: ${uptime.toFixed(0)}s uptime`,
      };
    }

    return {
      status: 'up',
      message: `Uptime: ${(uptime / 3600).toFixed(2)} hours`,
    };
  }

  async getDetailedMetrics() {
    const health = await this.checkHealth();
    const recentMetrics = this.monitoring.getRecentMetrics(100);
    const recentErrors = this.monitoring.getRecentErrors(50);

    // Calcular métricas de request
    const requestMetrics = this.monitoring.getAggregatedMetrics('http_request_duration_ms');

    return {
      ...health,
      requests: requestMetrics,
      recentErrors: recentErrors.slice(0, 10), // Solo los 10 más recientes
      recentMetrics: recentMetrics.slice(-20), // Solo las 20 más recientes
    };
  }
}
