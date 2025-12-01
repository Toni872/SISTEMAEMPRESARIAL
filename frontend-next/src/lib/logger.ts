/**
 * Logger utility para el frontend
 * Reemplaza console.log/error con un sistema más estructurado
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    data?: unknown;
    timestamp: string;
}

class Logger {
    private isDevelopment: boolean;

    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    private log(level: LogLevel, message: string, data?: unknown): void {
        if (!this.isDevelopment && level === 'debug') {
            return; // No mostrar debug en producción
        }

        const entry: LogEntry = {
            level,
            message,
            data,
            timestamp: new Date().toISOString(),
        };

        const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
        const logMessage = data ? `${prefix} ${message}` : `${prefix} ${message}`;

        switch (level) {
            case 'debug':
                console.debug(logMessage, data || '');
                break;
            case 'info':
                console.info(logMessage, data || '');
                break;
            case 'warn':
                console.warn(logMessage, data || '');
                break;
            case 'error':
                console.error(logMessage, data || '');
                // En producción, los errores se envían automáticamente a Sentry
                // si está configurado (ver sentry.client.config.ts)
                break;
        }
    }

    debug(message: string, data?: unknown): void {
        this.log('debug', message, data);
    }

    info(message: string, data?: unknown): void {
        this.log('info', message, data);
    }

    warn(message: string, data?: unknown): void {
        this.log('warn', message, data);
    }

    error(message: string, error?: unknown): void {
        this.log('error', message, error);
    }
}

// Exportar instancia singleton
export const logger = new Logger();

// Exportar clase para testing
export { Logger };

