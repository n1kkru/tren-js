// @ts-check
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import path, { resolve } from 'node:path'
import url from 'node:url'

const timestamp = Date.now()

// https://astro.build/config
export default defineConfig({
  base: '/main',
  experimental: {
    svg: true
  },

  devToolbar: {
    enabled: false
  },

  compressHTML: false,

  integrations: [tailwind()],

  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: () => 'main',
          entryFileNames: `scripts/main.js`,
          chunkFileNames: `scripts/[name].js`,
          assetFileNames: assetInfo => {
            let extType = assetInfo.name.split('.')[1]

            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images'
            } else if (extType === 'css') {
              extType = 'styles'
            } else if (extType === 'js') {
              extType = 'scripts'
            }

            return `${extType}/[name][extname]`
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import '@shared/styles/global/config';
            @import '@shared/styles/global/mixins';
          `
        }
      }
    }
  }
})
