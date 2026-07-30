import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: true, // Listen on all network addresses (needed for access from other devices)
    proxy: {
      '/api': {
        target: 'http://192.168.10.105:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://192.168.10.105:5000',
        ws: true,
      },
      '/uploads': {
        target: 'http://192.168.10.105:5000',
        changeOrigin: true,
      }
    }
  }
})
