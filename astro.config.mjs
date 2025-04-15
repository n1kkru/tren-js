// @ts-check
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import fs from 'fs/promises'
import path from 'path'

const timestamp = Date.now()

const timestampIntegration = () => ({
  name: 'timestamp-integration',
  hooks: {
    'astro:build:done': async ({ dir, pages }) => {
      try {
        for (const page of pages) {
          const filePath = path
            .join(dir.pathname, page.pathname, 'index.html')
            .replace(/([^:])\/\//g, '$1/')
            .slice(1)

          try {
            await fs.access(filePath)
          } catch {
            console.log(`Файл не найден: ${filePath}`)
            continue
          }

          let content = await fs.readFile(filePath, 'utf-8')
          const updatedContent = content.replace(
            /(<script\b[^>]*\bsrc=")([^"]*\.js)("[^>]*>)/g,
            `$1$2?${timestamp}$3`
          )

          if (updatedContent !== content) {
            await fs.writeFile(filePath, updatedContent)
            console.log(`Обновлен: ${path.join(page.pathname, 'index.html')}`)
          }
        }
      } catch (error) {
        console.error('Ошибка:', error)
      }
    }
  }
})

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

  integrations: [tailwind(), timestampIntegration()],

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
