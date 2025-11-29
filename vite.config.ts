import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default async () => {
  const UnoCSS = (await import("unocss/vite")).default;
  return defineConfig({
    plugins: [
      uni(),
      UnoCSS()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (source: string, filePath: string) => {
            if (filePath.includes('/src/components/') || filePath.includes('/src/pages/')) {
              return '@use "@partner-up-dev/design-uniapp/styles" as *; @use "@partner-up-dev/design-uniapp/styles/mixins" as *;\n' + source
            }
            return source
          }
        }
      }
    }
  })
}