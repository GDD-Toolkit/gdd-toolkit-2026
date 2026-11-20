/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import path from 'path'

const __dirname = path.resolve();

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Types shared with the grant-automation worker live one level up.
      '@shared': path.resolve(__dirname, '../shared'),
      // ../shared imports zod too; resolve it to this app's copy so there is one zod (v4)
      // and the Docker build, which has no repo-root node_modules, can still find it.
      'zod': path.resolve(__dirname, 'node_modules/zod'),
    }
  },
  server: {
    // Let the dev server read ../shared (outside the Vite root).
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
