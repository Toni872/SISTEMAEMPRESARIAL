import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
    private readonly logger = new Logger(SecurityService.name);

    constructor(private configService: ConfigService) {}

    /**
     * Sanitiza input del usuario para prevenir XSS
     */
    sanitizeInput(input: string): string {
        if (!input) return input;
        
        return input
            .replace(/[<>]/g, '') // Remover < y >
            .replace(/javascript:/gi, '') // Remover javascript:
            .replace(/on\w+=/gi, '') // Remover event handlers
            .trim();
    }

    /**
     * Valida que el input no contenga SQL injection patterns
     */
    validateSqlInput(input: string): boolean {
        const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi;
        return !sqlInjectionPattern.test(input);
    }

    /**
     * Genera un token seguro aleatorio
     */
    generateSecureToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Hash seguro de datos sensibles (no contraseñas, usar bcrypt para eso)
     */
    hashData(data: string): string {
        return crypto
            .createHash('sha256')
            .update(data)
            .digest('hex');
    }

    /**
     * Verifica que el origin sea válido
     */
    isValidOrigin(origin: string): boolean {
        const allowedOrigins = this.configService
            .get<string>('CORS_ORIGIN', 'http://localhost:5173')
            .split(',');
        
        return allowedOrigins.includes(origin) || origin.includes('vercel.app');
    }

    /**
     * Limita el tamaño del request para prevenir DoS
     */
    isRequestSizeValid(size: number, maxSize: number = 10485760): boolean { // 10MB default
        return size <= maxSize;
    }

    /**
     * Valida formato de email
     */
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Verifica fortaleza de contraseña
     */
    isStrongPassword(password: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una mayúscula');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una minúscula');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('La contraseña debe contener al menos un número');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('La contraseña debe contener al menos un carácter especial');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * Rate limiting check
     */
    async checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): Promise<boolean> {
        // Implementar con Redis para producción
        // Por ahora, siempre retorna true
        return true;
    }

    /**
     * Log de eventos de seguridad
     */
    logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
        const logData = {
            timestamp: new Date().toISOString(),
            event,
            severity,
            details,
        };

        switch (severity) {
            case 'critical':
            case 'high':
                this.logger.error(`SECURITY: ${event}`, JSON.stringify(logData));
                break;
            case 'medium':
                this.logger.warn(`SECURITY: ${event}`, JSON.stringify(logData));
                break;
            case 'low':
                this.logger.log(`SECURITY: ${event}`, JSON.stringify(logData));
                break;
        }
    }
}

