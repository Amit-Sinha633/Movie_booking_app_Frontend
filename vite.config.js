import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
