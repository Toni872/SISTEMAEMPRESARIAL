/**
 * Sentry Edge Configuration
 * 
 * Configuración de Sentry para Edge Runtime (middleware, edge functions)
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  environment: process.env.NODE_ENV || 'development',
  
  enabled: process.env.NODE_ENV === 'production' || !!process.env.SENTRY_DSN,
});

