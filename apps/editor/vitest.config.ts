import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['plugins/**/*.spec.ts', 'src/**/*.spec.ts'],
    passWithNoTests: true,
  },
});
