import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Deux pages : le parcours et la page des sources
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        sources: resolve(import.meta.dirname, 'sources.html')
      }
    }
  }
});
