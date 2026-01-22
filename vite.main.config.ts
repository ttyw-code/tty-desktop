import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'out/src/main'),
    emptyOutDir: false,
    sourcemap: true,
    target: 'node18',
    lib: {
      entry: path.resolve(__dirname, 'src/main/main.ts'),
      formats: ['es'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron', 'electron/main'],
    },
  },
});
