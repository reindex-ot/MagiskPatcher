import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          material: ['@material/web/all.js'],
          xterm: ['@xterm/xterm'],
        },
      },
    },
  },
});