import uni from '@dcloudio/vite-plugin-uni';
import json5 from 'vite-plugin-json5';
import { defineConfig, type Plugin, type UserConfigExport } from 'vite';

// https://vitejs.dev/config/
export default async (): Promise<UserConfigExport> => {
  const UnoCSS = (await import("unocss/vite")).default;
  return defineConfig({
    plugins: [
      uni(),
      json5(),
      UnoCSS()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (source: string, filePath: string) => {
            if (filePath.includes('/src/components/') || filePath.includes('/src/pages/')) {
              return `@use "@partner-up-dev/design-uniapp/styles/mixins" as *;@use "@partner-up-dev/design-uniapp/styles/functions" as *;\n${source}`
            }
            return source
          }
        }
      }
    }
  })
}