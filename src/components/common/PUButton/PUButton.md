# PUButton 按钮

## Rationale

提供统一的按钮组件，支持多种样式主题、尺寸和状态。

## Goals

- 支持多种主题变体（Primary、Surface、Tertiary 等）
- 支持多种尺寸和类型（带文本、纯图标、Bar 形式）
- 支持加载态、禁用态、激活态、切换态
- 支持前缀/后缀图标和点标识符

## Specification

### 内容

- 按钮文本
- 前缀图标（可选）
- 后缀图标（可选）
- 加载指示器（loading 状态时显示，替换前缀图标）
- 点标识符（可选）

### UI/UX

- 加载状态时显示旋转的加载图标（替换前缀图标）
- 加载或禁用状态时不响应点击事件
- 支持圆角样式
- 支持多种主题配色

### 行为

- 点击时触发 `click` 事件
- 加载或禁用状态下阻止点击事件

## Implementation

### Props

- `text` (`string`, `"Button"`)：按钮文本
- `prefixIcon` (`string`, `""`)：前缀图标类名（UnoCSS 图标）
- `suffixIcon` (`string`, `""`)：后缀图标类名（UnoCSS 图标）
- `showDot` (`boolean`, `false`)：是否显示点标识符
- `toggled` (`boolean`, `false`)：是否处于切换态
- `active` (`boolean`, `false`)：是否处于激活态
- `theme` (`ButtonTheme`, `"PrimaryContainer"`)：按钮主题
- `type` (`ButtonType`, `"WithText"`)：按钮类型
- `size` (`ButtonSize`, `"Small"`)：按钮尺寸
- `rounded` (`boolean`, `false`)：是否圆角
- `disabled` (`boolean`, `false`)：是否禁用
- `loading` (`boolean`, `false`)：是否处于加载状态
- `customStyle` (`Record<string, any>`, `{}`)：自定义样式对象

#### theme

主题变体：

- `Primary`：主色调
- `PrimaryContainer`：主色调容器
- `Tertiary`：第三色调
- `Surface`：表面色
- `SurfaceOutlined`：带边框的表面色
- `Plain`：朴素样式

#### type

按钮类型：

- `WithText`：带文本的按钮
- `OnlyIcon`：仅图标按钮
- `Bar`：横条形式

#### size

尺寸选项：

- `xSmall`：超小尺寸
- `Small`：小尺寸
- `Medium`：中等尺寸
- `Large`：大尺寸

### Events

- `click(event: any)`：点击事件，仅在非禁用和非加载状态下触发

### Loading 状态

当 `loading` 为 `true` 时：

- 显示旋转的加载图标（`i-mdi-loading`）
- 隐藏 `prefixIcon` 和 `suffixIcon`
- 阻止点击事件
- 添加 `loading` CSS 类（cursor: not-allowed）
- 加载图标使用 CSS 动画无限旋转
