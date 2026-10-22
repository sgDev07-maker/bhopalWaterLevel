import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const authProxy: ProxyOptions = {
  target: 'https://userauth.revolutioninfosystems.com',
  changeOrigin: true,
  secure: true,
};

const analogProxy: ProxyOptions = {
  target: 'https://117.247.49.204',
  changeOrigin: true,
  // The analog host uses a certificate browsers/Node may not trust.
  // This setting is for the Vite dev proxy only, not the browser.
  secure: false,
};

const proxy: Record<string, ProxyOptions> = {
  '/api/auth/login': {
    ...authProxy,
    rewrite: () => '/api/UserAuthAPI/valuser',
  },
  '/api/auth/change-password': {
    ...authProxy,
    rewrite: () => '/api/UserAuthAPI/changepass',
  },
  '/api/analog': {
    ...analogProxy,
    rewrite: (path) => path.replace(/^\/api\/analog/, '/AppAnalogTagSVR'),
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy,
  },
  preview: {
    port: 5173,
    proxy,
  },
});
