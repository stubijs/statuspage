import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [...configDefaults.include, 'packages/status-page/docs/.vitepress/**/**/*.spec.ts'],
    environment: 'jsdom',
  },
})
