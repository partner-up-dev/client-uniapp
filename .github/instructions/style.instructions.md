---
applyTo: "**/*.scss, src/styles/**"
---

本指南指导样式代码的编写。

- 统一使用 px 单位

## 文件结构

全局样式文件：

```
styles/
├── presets/
    └── design.ts         # 设计代币 UnoCSS 预设
├── main.scss           # 入口文件
├── _ref.scss           # 样式原始值
├── _token.scss         # 设计代币 SCSS 变量与Mixins
└── _mixin.scss         # Mixins
```

组件样式文件：组件文件夹下的 `compName.scss`

## 图标

- 在`<text>`元素上配置类 `i-mdi-<icon-name>` 即可加载图标
- 如果类名是运行时计算的，你需要在 `uno.config.ts` 的 `safeListOfIcons` 中添加该图标类名。

## 小程序兼容性

### 选择器限制

- 不可以使用 `*` 选择器
- 仅支持类选择器
- `page` 相当于 `body` 节点
- `:root` 只能写在 `App.vue` 中

### 特殊元素选择器限制

小程序中的部分元素不可以直接使用其标签名作为选择器来修改其样式，比如 `<textarea>`, `<input>`, `<scroll-view>` 等，需要通过 `::afrer` 或 `::pseudo:after` 伪元素来实现样式覆盖。

## 最佳实践

- 使用 Design Tokens
  - 在 SCSS 中, 在头部添加 `@use "@/styles/main.scss" as *;` (`main.scss` 已经 forward 了 `_token.scss`)
    查看 `src/styles/_design.scss` 了解可用的设计代币
  - 在模板中, 使用 UnoCSS （查看`uno.config.ts`以了解可用的预设）
- 不必考虑响应式设计
- 使用 `utils/style` 提供的工具函数帮助处理样式
- 使用基于 SCSS 特性的 BEM 命名方法
- 使状态类型选择器 （如 `is-<state>`, `--state`） 放在最后，这样在相同特异性下可以覆盖前面的样式
