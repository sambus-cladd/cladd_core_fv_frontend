import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'; // Importa el plugin


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // Plugin de React
    commonjs(), // Soporte para CommonJS
  ],
  server: {
    host: '0.0.0.0',
    port: 5173, // O el puerto que prefieras
  }
})
