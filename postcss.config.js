import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // En dev, redirige llamadas /api al backend en puerto 5000
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    outDir: '../public', // El build va a la carpeta public del backend
    emptyOutDir: true,
  }
})
