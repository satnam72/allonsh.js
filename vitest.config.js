// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  environmentOptions: {
    jsdom: { url: 'http://localhost/' },
  },
  restoreMocks: true,
  clearMocks: true,
  mockReset: true,
  coverage: {
    reporter: ['text', 'html'],
    include: ['src/**/*.js'],
  },
});
