import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', () => {
            console.error(
              '[vite] Cannot reach backend on http://127.0.0.1:3000 - start it first: cd Backend && npm run dev'
            )
          })
        },
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', () => {
            console.error(
              '[vite] Cannot reach backend WebSocket on http://127.0.0.1:3000 - start it first: cd Backend && npm run dev'
            )
          })
        },
      },
    },
  },
})
