import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitoringService } from '../monitoring/monitoring.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  constructor(private monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;

          // Registrar métrica de rendimiento
          this.monitoringService.recordMetric('http_request_duration_ms', responseTime, {
            method,
            url,
            status: '200',
          });

          // Log si es lento (>1000ms)
          if (responseTime > 1000) {
            this.logger.warn(`Slow request: ${method} ${url} took ${responseTime}ms`);
          }
        },
        error: error => {
          const responseTime = Date.now() - startTime;

          // Registrar métrica de error
          this.monitoringService.recordMetric('http_request_duration_ms', responseTime, {
            method,
            url,
            status: 'error',
          });

          // Registrar error
          this.monitoringService.recordError(error, { method, url, responseTime }, 'high');
        },
      }),
    );
  }
}
