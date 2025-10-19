// vite.config.ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      protocolImports: true,
    }),
    VitePWA({
      registerType: 'autoUpdate', // Atualização automática
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'NoHere',
        short_name: 'NoHere',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      workbox: {
        skipWaiting: true,         // Faz o novo SW tomar controle imediatamente
        clientsClaim: true,        // Força os clients a usarem o novo SW
        cleanupOutdatedCaches: true, // Limpa caches antigos
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: ['simple-peer'],
  },
  build: {
    commonjsOptions: {
      include: [/simple-peer/, /node_modules/],
    },
  },
  server: {
    proxy: {
      '/api': 'https://api.cirimoveis.com/api/v1',
    },
  },
});
