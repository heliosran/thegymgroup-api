import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { extractJSessionCookie } from './src/proxyCookie';

function gymProxyConfig() {
  return {
    target: 'https://thegymgroup.netpulse.com',
    changeOrigin: true,
    secure: true,
    configure(proxy) {
      proxy.on('proxyReq', (proxyReq, req) => {
        const sessionCookie = extractJSessionCookie(req.headers.cookie || '');
        proxyReq.removeHeader('cookie');
        if (sessionCookie) {
          proxyReq.setHeader('Cookie', sessionCookie);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/np': gymProxyConfig(),
      '/analysis': gymProxyConfig()
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
});
