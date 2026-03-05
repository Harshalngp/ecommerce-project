import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // more specific path first
      '/api': {
        target: 'https://localhost:44327',   // your IIS‑Express port
        changeOrigin: true,
        secure: false                           // ignore self‑signed cert
      },
      '/images': {
        target: 'http://localhost:3000'
      }
    }
  }
})