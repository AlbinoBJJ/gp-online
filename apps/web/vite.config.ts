import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { alphaTab } from '@coderline/alphatab-vite';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    alphaTab()
  ],
  base: command === 'build' ? '/gp-online/' : '/',

  define: {
    'import.meta.url': 'import.meta.url'
  },
  server: {
    watch: {
      ignored: ['**/public/font/**', '**/public/soundfont/**']
    }
  },
  optimizeDeps: {
    exclude: ['@coderline/alphatab']
  }
}));