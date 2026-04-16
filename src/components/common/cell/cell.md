# 组件 Cell 文档

## Rationale

> 单元格组件，用于列表项的标准化展示。提供统一的列表项样式和交互功能，支持编辑器功能。

## Goals

> 提供一个标准化的单元格组件，支持：
>
> - 水平和垂直两种布局类型
> - 左侧图标/头像
> - 标题、副标题和值文本
> - 多种编辑器类型（选择器、位置选择器、输入框等）
> - 值格式化功能
> - 多种尺寸变体
> - 可选的右侧箭头指示器

## Specification

> 组件提供灵活的单元格布局，支持图标、文本、编辑器等多种内容形式。适用于设置列表、联系人列表等场景。
>
> **布局类型：**
>
> - `horizontal`（默认）：水平布局，左侧显示图标+标题+副标题，右侧显示值+箭头
> - `vertical`：垂直布局，第一行显示图标+标题+右侧图标，第二行显示值

## Implementation

> 基于Vue 3实现，使用插槽系统提供灵活的内容定制，支持点击事件和样式配置。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| type | `'horizontal' \| 'vertical'` | `'horizontal'` | 否 | 单元格布局类型 |
| title | `string` | `''` | 否 | 单元格标题 |
| subtitle | `string` | `''` | 否 | 单元格副标题（仅 horizontal 类型支持） |
| value | `string \| number \| undefined` | `undefined` | 否 | 单元格值 |
| prefixIcon | `string \| undefined` | `undefined` | 否 | 前缀图标类名 |
| suffixIcon | `string \| undefined` | `undefined` | 否 | 后缀图标类名 |
| size | `'small' \| 'medium'` | `'small'` | 否 | 单元格尺寸 |
| formProp | `string \| undefined` | `undefined` | 否 | 表单字段属性名，用于关联 PUForm 验证错误 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | `()` | 单元格点击事件 |

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| title | 自定义标题内容 | - |
| subtitle | 自定义副标题内容（仅 horizontal 类型） | - |
| value | 自定义值内容 | - |

### Methods

无公开方法。

### Watches

无监听器。

## 其它

- 支持无障碍性标准
- 提供点击反馈效果
- 兼容性：支持所有Uniapp目标平台
- 可在提供 `puFormErrors` / `puFormCellPadding` 注入上下文的表单中使用；设置 `formProp` 后会显示对应字段的验证错误。
