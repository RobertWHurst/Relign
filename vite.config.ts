import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'relign',
      fileName: 'index',
    },
    outDir: '.',
  },
  plugins: [
    typescript({
      exclude: ['**/*.spec.*', './src/tests/**/*'],
    }),
  ],
})
