# scaffoldLayout 脚手架布局

## Rationale

页面通常遵循 Header-Content-Footer 的三段式布局，高度为窗口高度。需要一个可复用的布局组件来统一管理这种常见布局模式。

## Goals

- 提供 Header-Content-Footer 三段式布局
- Header 默认为 navBar
- Content 自动填充剩余空间
- Footer 可选
- 整体高度为 windowHeight

## Specification

### 布局结构

1. **Header**
   - 默认使用 navBar 组件
   - 通过 `header` 插槽自定义
   
2. **Content**
   - 自动填充剩余高度（flex: 1）
   - 通过 `default` 插槽提供内容
   
3. **Footer**
   - 可选（通过 `showFooter` props 控制）
   - 通过 `footer` 插槽提供内容

### 高度控制

- 组件整体高度设置为 `windowHeight`
- 使用 flexbox 布局，Content 自动占据剩余空间

## Implementation

### Props

- `showFooter` (`boolean`, `true`): 是否显示 Footer 区域

### Slots

- `header`: Header 区域内容，默认使用 navBar
- `default`: Content 区域内容（必需）
- `footer`: Footer 区域内容（当 showFooter 为 true 时显示）
