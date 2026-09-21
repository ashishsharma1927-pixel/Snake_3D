import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Snake_3D/',
  plugins: [react()],
  server: {
    host: true
  }
})
