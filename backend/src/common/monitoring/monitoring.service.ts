import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: Date;
    tags?: Record<string, string>;
}

export interface ErrorMetric {
    error: string;
    stack?: string;
    context?: any;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

@Injectable()
export class MonitoringService {
    private readonly logger = new Logger(MonitoringService.name);
    private metrics: PerformanceMetric[] = [];
    private errors: ErrorMetric[] = [];
    private readonly maxMetricsSize = 1000;
    private readonly maxErrorsSize = 500;

    constructor(private configService: ConfigService) {}

    /**
     * Registra una métrica de rendimiento
     */
    recordMetric(name: string, value: number, tags?: Record<string, string>) {
        const metric: PerformanceMetric = {
            name,
            value,
            timestamp: new Date(),
            tags,
        };

        this.metrics.push(metric);

        // Mantener solo las últimas N métricas
        if (this.metrics.length > this.maxMetricsSize) {
            this.metrics = this.metrics.slice(-this.maxMetricsSize);
        }

        // Log en desarrollo
        if (this.configService.get('NODE_ENV') === 'development') {
            this.logger.debug(`Metric: ${name} = ${value}`, tags);
        }
    }

    /**
     * Registra un error para monitoreo
     */
    recordError(
        error: Error | string,
        context?: any,
        severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    ) {
        const errorMetric: ErrorMetric = {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            context,
            timestamp: new Date(),
            severity,
        };

        this.errors.push(errorMetric);

        // Mantener solo los últimos N errores
        if (this.errors.length > this.maxErrorsSize) {
            this.errors = this.errors.slice(-this.maxErrorsSize);
        }

        // Log según severidad
        switch (severity) {
            case 'critical':
            case 'high':
                this.logger.error(`Error: ${errorMetric.error}`, errorMetric.stack);
                break;
            case 'medium':
                this.logger.warn(`Warning: ${errorMetric.error}`);
                break;
            case 'low':
                this.logger.log(`Info: ${errorMetric.error}`);
                break;
        }
    }

    /**
     * Obtiene métricas recientes
     */
    getRecentMetrics(count: number = 100): PerformanceMetric[] {
        return this.metrics.slice(-count);
    }

    /**
     * Obtiene errores recientes
     */
    getRecentErrors(count: number = 50): ErrorMetric[] {
        return this.errors.slice(-count);
    }

    /**
     * Obtiene métricas agregadas por nombre
     */
    getAggregatedMetrics(name: string): {
        count: number;
        avg: number;
        min: number;
        max: number;
        latest: number;
    } | null {
        const filtered = this.metrics.filter(m => m.name === name);
        
        if (filtered.length === 0) return null;

        const values = filtered.map(m => m.value);
        const sum = values.reduce((a, b) => a + b, 0);
        
        return {
            count: filtered.length,
            avg: sum / filtered.length,
            min: Math.min(...values),
            max: Math.max(...values),
            latest: values[values.length - 1],
        };
    }

    /**
     * Obtiene conteo de errores por severidad
     */
    getErrorStats(): Record<string, number> {
        return {
            low: this.errors.filter(e => e.severity === 'low').length,
            medium: this.errors.filter(e => e.severity === 'medium').length,
            high: this.errors.filter(e => e.severity === 'high').length,
            critical: this.errors.filter(e => e.severity === 'critical').length,
            total: this.errors.length,
        };
    }

    /**
     * Obtiene health status del sistema
     */
    getHealthStatus(): {
        status: 'healthy' | 'degraded' | 'unhealthy';
        uptime: number;
        memory: NodeJS.MemoryUsage;
        errors: Record<string, number>;
        timestamp: Date;
    } {
        const errorStats = this.getErrorStats();
        const criticalErrors = errorStats.critical || 0;
        const highErrors = errorStats.high || 0;

        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
        
        if (criticalErrors > 0) {
            status = 'unhealthy';
        } else if (highErrors > 5) {
            status = 'degraded';
        }

        return {
            status,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            errors: errorStats,
            timestamp: new Date(),
        };
    }

    /**
     * Limpia métricas antiguas
     */
    clearOldMetrics(olderThanMinutes: number = 60) {
        const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);
        this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
        this.errors = this.errors.filter(e => e.timestamp > cutoff);
        
        this.logger.log(`Cleared metrics older than ${olderThanMinutes} minutes`);
    }
}

