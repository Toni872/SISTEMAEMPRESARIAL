import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  constructor(private securityService: SecurityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Validar tamaño del request
    const contentLength = parseInt(request.headers['content-length'] || '0', 10);
    if (!this.securityService.isRequestSizeValid(contentLength)) {
      this.securityService.logSecurityEvent(
        'Request size too large',
        {
          ip: request.ip,
          url: request.url,
          size: contentLength,
        },
        'high',
      );
      throw new BadRequestException('Request size too large');
    }

    // Validar origin
    const origin = request.headers.origin;
    if (origin && !this.securityService.isValidOrigin(origin)) {
      this.securityService.logSecurityEvent(
        'Invalid origin',
        {
          origin,
          ip: request.ip,
          url: request.url,
        },
        'high',
      );
    }

    // Sanitizar inputs en body
    if (request.body && typeof request.body === 'object') {
      this.sanitizeRequestBody(request.body);
    }

    return next.handle();
  }

  private sanitizeRequestBody(body: any) {
    for (const key in body) {
      if (typeof body[key] === 'string') {
        // Validar SQL injection
        if (!this.securityService.validateSqlInput(body[key])) {
          this.securityService.logSecurityEvent(
            'Possible SQL injection attempt',
            { field: key, value: body[key] },
            'critical',
          );
        }

        // Sanitizar XSS
        body[key] = this.securityService.sanitizeInput(body[key]);
      } else if (typeof body[key] === 'object' && body[key] !== null) {
        this.sanitizeRequestBody(body[key]);
      }
    }
  }
}
