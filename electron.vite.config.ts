/* eslint-disable prettier/prettier */
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist'
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      outDir: 'dist/renderer',
      rollupOptions: {
        output: {
          assetFileNames: '[name].[ext]',
          chunkFileNames: '[name].js',
          entryFileNames: '[name].js'
        }
      }
    }
  }
})
