import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('swiper')) {
              return 'swiper';
            }
            return 'vendor';
          }
        },
      },
    },
    // Optional: slight bump to warning limit if vendor chunk naturally exceeds 500kb
    chunkSizeWarningLimit: 600,
  },
  server: {
    // Proxy all /mba/* requests from localhost:5173 → localhost:1000 (backend port from .env).
    // This bypasses CORS entirely — the browser sends the httpOnly JWT cookie automatically
    // since both origin and destination appear as the same origin (localhost:5173).
    proxy: {
      '/mba': {
        target: 'http://localhost:1000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
