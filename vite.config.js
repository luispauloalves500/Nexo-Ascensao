import { defineConfig } from 'vite';

// Paths relativos permitem Pages em https://usuario.github.io/repositorio/
export default defineConfig({
  base: './',
  build: { target: 'es2020', cssCodeSplit: true, assetsInlineLimit: 4096,
    rollupOptions: { output: { manualChunks: { 'three-core': ['three'] } } } },
  server: { host: true }
});
