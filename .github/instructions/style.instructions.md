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
```

设计代币由 `@partner-up-dev/design-uniapp` 包提供，通过 Vite 的 `css.preprocessorOptions.scss.additionalData` 自动注入：
- `@partner-up-dev/design-uniapp/styles` - 设计代币 CSS 变量和 SCSS 工具函数
- Mixins（包括 `pu-font`, `pu-elevation`, `pu-icon`）

组件样式文件：组件文件夹下的 `compName.scss`

## 设计代币使用

### `sys-var()` 函数

使用 `sys-var(category, type, ...)` 函数引用系统级设计代币，该函数返回 CSS 变量引用。

```scss
// 颜色代币
color: sys-var(color, primary);              // -> var(--sys-color-primary)
color: sys-var(color, on-surface);           // -> var(--sys-color-on-surface)
background-color: sys-var(color, surface-container);

// 间距代币
padding: sys-var(spacing, sm) sys-var(spacing, med);  // 8px 16px
gap: sys-var(spacing, xs);                            // 4px

// 圆角代币
border-radius: sys-var(radius, med);         // 8px
border-radius: sys-var(radius, full);        // 50%

// 尺寸代币
width: sys-var(size, large);                 // 44px

// 图标尺寸代币
width: sys-var(icon, size, medium);          // 24px

// 透明度代币
opacity: sys-var(opacity, disabled);         // 0.6
```

### Mixins

```scss
// 排版
@include pu-font("body-large");
@include pu-font("label-medium");

// 阴影
@include pu-elevation(2);

// 图标
@include pu-icon("medium", true);  // true 表示添加 flex 布局居中
```

### 可用代币

**颜色** (`sys-var(color, <name>)`):
- 主色: `primary`, `primary-container`, `on-primary`, `on-primary-container`
- 次色: `secondary`, `secondary-container`, `on-secondary`
- 三级色: `tertiary`, `tertiary-container`, `on-tertiary`
- 错误色: `error`, `error-container`, `on-error`
- 警告色: `warning`, `on-warning`
- 表面色: `surface`, `surface-container`, `surface-container-low`, `surface-container-highest`, `on-surface`, `on-surface-variant`
- 中性色: `neutral`, `neutral-container`, `on-neutral`
- 边框色: `outline`, `outline-variant`
- 便捷色: `green`, `red`, `yellow`, `blue`

**间距** (`sys-var(spacing, <size>)`): `xs` (4px), `sm` (8px), `med` (16px), `lg` (32px)

**圆角** (`sys-var(radius, <size>)`): `none`, `xs`, `sm`, `med` (8px), `lg` (16px), `full` (50%)

**尺寸** (`sys-var(size, <size>)`): `xSmall` (20px), `small` (24px), `medium` (32px), `large` (44px), `xLarge` (60px)

**图标** (`sys-var(icon, size, <size>)`): `small` (20px), `medium` (24px), `large` (40px)

**透明度** (`sys-var(opacity, <type>)`): `disabled` (0.6), `invalid` (0.6)

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
  - 在 SCSS 中，设计代币已通过 Vite 配置自动注入，无需手动导入，直接使用 `sys-var()` 函数和 `pu-font`, `pu-elevation`, `pu-icon` mixins
  - 在模板中, 使用 UnoCSS （查看`uno.config.ts`以了解可用的预设）
- 不要在 `sys-var()` 上进行 SCSS 算术运算（如 `sys-var(spacing, sm) + sys-var(spacing, xs)`），因为它返回的是 CSS 变量。如需计算，请直接使用具体数值
- 不必考虑响应式设计
- 使用 `utils/style` 提供的工具函数帮助处理样式
- 使用基于 SCSS 特性的 BEM 命名方法
- 使状态类型选择器 （如 `is-<state>`, `--state`） 放在最后，这样在相同特异性下可以覆盖前面的样式
