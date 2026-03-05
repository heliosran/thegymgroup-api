import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function gymProxyConfig() {
  return {
    target: 'https://thegymgroup.netpulse.com',
    changeOrigin: true,
    secure: true,
    configure(proxy) {
      proxy.on('proxyReq', (proxyReq, req) => {
        const jsessionId = req.headers['x-jsessionid'];
        proxyReq.removeHeader('x-jsessionid');
        proxyReq.removeHeader('cookie');

        if (jsessionId) {
          proxyReq.setHeader('Cookie', `JSESSIONID=${jsessionId}`);
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
