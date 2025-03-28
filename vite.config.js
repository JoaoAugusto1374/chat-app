import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/chat-app/',
  build: {
    outDir: 'dist', // Direciona para a pasta 'dist'
    assetsDir: 'assets', // Pasta para os assets
  }
})
