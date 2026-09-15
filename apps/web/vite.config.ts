import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/gp-online/',
  server: {
    watch: {
      // Ignora pastas de assets estáticos pesados para o Windows não travar com EBUSY
      ignored: ['**/public/font/**', '**/public/soundfont/**']
    }
  },
  optimizeDeps: {
    exclude: ['@coderline/alphatab']
  }
});