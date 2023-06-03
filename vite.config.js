import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig((opt) => {
  return {
    root: 'src',
    build: {
      outDir: '../dist',
      rollupOptions: {
        input: {
          content: resolve(__dirname, 'src/content.ts'),
          popup: resolve(__dirname, 'src/static/popup.html'),
          service_worker: resolve(__dirname, 'src/service_worker.ts'),
        },
        output: {
          entryFileNames: '[name].js',
        },
      },
    },
  };
});
