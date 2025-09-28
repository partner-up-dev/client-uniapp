
# Uniapp 使用 UnoCSS

核心依赖:

- unocss
- [unocss-preset-uni](https://github.com/uni-helper/unocss-preset-uni): 专为 Uniapp 打造的 UnoCSS 预设
- [unocss-preset-weapp](https://github.com/MellowCo/unocss-preset-weapp/tree/main/examples/uniapp_vue3): UnoCSS 小程序预设 (疑似只要这个就行了)
- [unocss-applet](https://github.com/unocss-applet/unocss-applet)

核心配置:

```ts
// uno.config.ts
import { presetUni } from "@uni-helper/unocss-preset-uni";
import { presetWeapp } from "unocss-preset-weapp";
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

export default {
  presets: [
    presetUni(),
    presetWeapp(),
    presetWeappAttributify(),
    presetIcons(),
  ],
  transformers: [transformerAttributify(), transformerClass()],
  shortcuts: [],
};
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default async () => {
  const UnoCSS = (await import("unocss/vite")).default;  // 
  return defineConfig({
    plugins: [
      UnoCSS()
    ]
  })
}
```
