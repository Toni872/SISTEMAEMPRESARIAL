import type { NextConfig } from "next";
import path from "path";

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
};

export default nextConfig;
