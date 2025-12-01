/**
 * Sentry Client Configuration
 * 
 * Configuración de Sentry para el cliente (browser)
 * 
 * Para usar Sentry:
 * 1. Crea una cuenta en https://sentry.io
 * 2. Crea un proyecto para Next.js
 * 3. Copia el DSN y configúralo en NEXT_PUBLIC_SENTRY_DSN
 * 4. O configura las variables en Vercel/plataforma de despliegue
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Ajustar el porcentaje de transacciones que se capturan
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Ajustar el porcentaje de sesiones que se capturan
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Si el porcentaje de sesiones de replay es menor que 1.0, ajustar esto
  replaysOnErrorSampleRate: 1.0,
  
  // Configuración de entorno
  environment: process.env.NODE_ENV || 'development',
  
  // Ignorar errores específicos
  ignoreErrors: [
    // Errores de red que no son críticos
    'NetworkError',
    'Failed to fetch',
    'Network request failed',
    // Errores de extensiones del navegador
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
  
  // Filtros de URLs
  denyUrls: [
    // Extensiones del navegador
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
  ],
  
  // Integraciones adicionales
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Solo capturar errores en producción o si está explícitamente habilitado
  enabled: process.env.NODE_ENV === 'production' || !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});













