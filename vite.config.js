import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path" 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://api.navimumbaipropertydeals.com',
        changeOrigin: true,
        secure: true,
        headers: {
          origin: 'https://navimumbaipropertydeals.com',
          referer: 'https://navimumbaipropertydeals.com/',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://navimumbaipropertydeals.com')
            proxyReq.setHeader('Referer', 'https://navimumbaipropertydeals.com/')
          })
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
