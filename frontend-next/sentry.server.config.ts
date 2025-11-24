/**
 * Sentry Server Configuration
 * 
 * Configuración de Sentry para el servidor (Next.js API routes y SSR)
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Ajustar el porcentaje de transacciones que se capturan
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Configuración de entorno
  environment: process.env.NODE_ENV || 'development',
  
  // Ignorar errores específicos
  ignoreErrors: [
    'ValidationError',
    'NotFoundError',
    // Errores de autenticación que son esperados
    'AuthenticationError',
  ],
  
  // Solo capturar errores en producción o si está explícitamente habilitado
  enabled: process.env.NODE_ENV === 'production' || !!process.env.SENTRY_DSN,
});

