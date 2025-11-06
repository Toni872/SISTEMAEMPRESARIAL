import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
            '@/components': '/src/app/components',
            '@/modules': '/src/app/modules',
            '@/hooks': '/src/app/hooks',
            '@/lib': '/src/lib',
            '@/types': '/src/types',
        },
    },
    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
            '/graphql': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    mui: ['@mui/material', '@mui/icons-material'],
                    apollo: ['@apollo/client'],
                    reduxToolkit: ['@reduxjs/toolkit', 'react-redux'],
                },
            },
        },
    },
})