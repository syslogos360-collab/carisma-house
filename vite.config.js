import { defineConfig } from 'vite';

// Single-page static site: index.html is the entry, output goes to dist/
export default defineConfig({
  build: { outDir: 'dist' },
});
