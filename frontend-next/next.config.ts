import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de rendimiento
  reactStrictMode: true,
  
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
