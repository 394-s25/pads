import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/send-email': { target: 'http://localhost:8888', changeOrigin: true }
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
});
