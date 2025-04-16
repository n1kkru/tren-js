import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import fs from 'fs/promises'
import path, { resolve } from 'node:path'
import url from 'node:url'

const timestamp = Date.now()

const outDir = resolve(path.dirname(url.fileURLToPath(import.meta.url)), 'dist')

const updateBuildScripts = () => ({
  name: 'timestamp-integration',
  hooks: {
    'astro:build:done': async ({ pages }) => {
      try {
        const scriptsToKeep = ['main.js']

        const scriptsDir = path.join(outDir, 'scripts')
        const files = await fs.readdir(scriptsDir)

        for (const file of files) {
          if (!scriptsToKeep.includes(file)) {
            await fs.rm(path.join(scriptsDir, file))
            console.log(`Удален: scripts/${file}`)
          }
        }

        for (const page of pages) {
          const relativePagePath = path.join(page.pathname, 'index.html')
          const filePath = path.join(outDir, relativePagePath)
          try {
            await fs.access(filePath)
          } catch {
            console.log(`Файл не найден: ${filePath}`)
            continue
          }

          let content = await fs.readFile(filePath, 'utf-8')

          content = content.replace(
            /<script[^>]*src="[^"]*main\d+\.js[^"]*"[^>]*><\/script>\n?/g,
            ''
          )

          const updatedContent = content.replace(
            /(<script\b[^>]*\bsrc=")([^"]*\.js)("[^>]*>)/g,
            `$1$2?${timestamp}$3`
          )

          if (updatedContent !== content) {
            await fs.writeFile(filePath, updatedContent)
            console.log(`Обновлен: ${filePath}`)
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
  experimental: {},

  devToolbar: {
    enabled: false
  },

  compressHTML: false,

  integrations: [tailwind(), updateBuildScripts()],

  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: () => 'main',
          entryFileNames: `scripts/main.js`,
          chunkFileNames: `scripts/[name].js`,
          assetFileNames: assetInfo => {
            if (!assetInfo || !assetInfo.name) return ''
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
