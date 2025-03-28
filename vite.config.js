// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5005, // Разработка на порту 5005
    proxy: {
      // Настройка прокси для API запросов
      '/api': {
        target: 'http://localhost:5000', // Перенаправление на порт 5000
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  preview: {
    port: 5005 // Preview тоже на порту 5005
  },
  // Указываем базовый путь, если приложение будет размещено в подкаталоге
  base: '/',
  build: {
    outDir: 'dist',
    // Настройка для лучшей оптимизации
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['axios', 'tailwindcss', 'daisyui']
        }
      }
    }
  },
  // Указываем переменные окружения для сборки
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '/api')
  }
})