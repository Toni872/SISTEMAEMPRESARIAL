import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                '**/__tests__',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/app/components'),
            '@/modules': path.resolve(__dirname, './src/app/modules'),
            '@/hooks': path.resolve(__dirname, './src/app/hooks'),
            '@/lib': path.resolve(__dirname, './src/lib'),
            '@/types': path.resolve(__dirname, './src/types'),
        },
    },
});

