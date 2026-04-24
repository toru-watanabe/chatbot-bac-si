import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // '/' for local Docker, GitHub Actions passes VITE_BASE_URL=/chatbot-bac-si/ for GH Pages
  base: process.env.VITE_BASE_URL || '/',
  server: {
    // Proxy API calls to local backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:7860',
        changeOrigin: true,
      },
    },
  },
})
