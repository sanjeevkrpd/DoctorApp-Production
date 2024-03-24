import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1/user": "http://localhost:8080",
      "/api/v1/admin": "http://localhost:8080",
      '/api/v1/doctor': 'http://localhost:8080'
    }
  },
  plugins: [react()]
})
