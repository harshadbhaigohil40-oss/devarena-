import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (command === 'build' && mode === 'production' && !env.VITE_API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL is required in production builds. Please set VITE_API_BASE_URL in your environment or client/.env file.'
    );
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
  server: {
    port: 5173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', '@react-oauth/google'],
          ui: ['framer-motion', 'react-hot-toast', 'react-icons', 'canvas-confetti'],
          charts: ['recharts', 'react-calendar-heatmap'],
          utils: ['axios', 'date-fns', 'zustand', '@tanstack/react-query', 'socket.io-client'],
          editor: ['@monaco-editor/react'],
          markdown: ['react-markdown']
        }
      }
    }
  }
  };
});
