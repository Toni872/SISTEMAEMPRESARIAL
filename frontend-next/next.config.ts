import type { NextConfig } from "next";
import path from "path";

// Validar que NEXT_PUBLIC_API_URL esté configurada en producción
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn('⚠️ ADVERTENCIA: NEXT_PUBLIC_API_URL no está configurada en producción!');
  console.warn('⚠️ El frontend usará localhost:8000 como fallback (NO funcionará)');
  console.warn('⚠️ Configura NEXT_PUBLIC_API_URL en Vercel → Settings → Environment Variables');
}

// Log de la variable para debugging
console.log('🔍 NEXT_PUBLIC_API_URL en build:', process.env.NEXT_PUBLIC_API_URL || 'NO CONFIGURADA (usará localhost:8000)');

const nextConfig: NextConfig = {
  // Optimizaciones de rendimiento
  reactStrictMode: true,
  
  // Configurar raíz del workspace para evitar warnings de múltiples lockfiles
  outputFileTracingRoot: path.join(__dirname),
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental: Optimización de imports
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  
  // Asegurar que las variables de entorno estén disponibles
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
