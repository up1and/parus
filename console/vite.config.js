import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const config = loadEnv('dev', './')

console.log(config)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
