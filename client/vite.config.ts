import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sharedEntry = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../packages/shared/src/index.ts',
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hollow-ether/shared': sharedEntry,
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
