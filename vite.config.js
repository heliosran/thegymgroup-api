import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/np': {
        target: 'https://thegymgroup.netpulse.com',
        changeOrigin: true,
        secure: true
      },
      '/analysis': {
        target: 'https://thegymgroup.netpulse.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
});
