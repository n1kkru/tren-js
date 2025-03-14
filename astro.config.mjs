// @ts-check
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

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
