import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const AUTHENTICATION_SERVICE_ROUTE = process.env.AUTHENTICATION_SERVICE_ROUTE || 'http://localhost:3000';
const API_SERVICE_ROUTE = process.env.API_SERVICE_ROUTE || 'http://localhost:3001';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/auth': {
                target: AUTHENTICATION_SERVICE_ROUTE,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/auth/, ''),
            },
            '/api': {
                target: API_SERVICE_ROUTE,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
