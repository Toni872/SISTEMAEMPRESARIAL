import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        // Handle GraphQL context
        if (!request || !request.method) {
            return next.handle();
        }

        const { method, url, body, query, params } = request;
        const userAgent = request.get('User-Agent') || '';
        const ip = request.ip || request.connection.remoteAddress;

        const now = Date.now();

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const { statusCode } = response;
                    const contentLength = response.get('content-length');
                    const responseTime = Date.now() - now;

                    this.logger.log(
                        `${method} ${url} ${statusCode} ${responseTime}ms - ${contentLength || 0}b - ${ip} - ${userAgent}`,
                        'HTTP',
                    );

                    // Log sensitive operations
                    if (this.isSensitiveOperation(method, url)) {
                        this.logger.warn(
                            `Sensitive operation: ${method} ${url} by IP: ${ip}`,
                            'SECURITY',
                        );
                    }
                },
                error: (error) => {
                    const { statusCode } = response;
                    const responseTime = Date.now() - now;

                    this.logger.error(
                        `${method} ${url} ${statusCode} ${responseTime}ms - ${ip} - ${userAgent} - Error: ${error.message}`,
                        error.stack,
                        'HTTP_ERROR',
                    );
                },
            }),
        );
    }

    private isSensitiveOperation(method: string, url: string): boolean {
        const sensitivePatterns = [
            /\/auth\/login/i,
            /\/auth\/change-password/i,
            /\/users\/create/i,
            /\/users\/delete/i,
            /\/admin/i,
        ];

        return sensitivePatterns.some(pattern => pattern.test(url)) || method === 'DELETE';
    }
}
