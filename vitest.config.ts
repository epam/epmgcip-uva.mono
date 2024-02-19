import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      src: resolve('packages/frontend/src/'),
    },
  },
});
