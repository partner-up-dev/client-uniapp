# 组件 Field 文档

## Rationale

垂直布局的表单字段组件，用于表单场景中展示标题和值的垂直排列。从 Cell 组件的 `vertical` 类型独立出来，专注于表单字段的编辑和展示。

## Goals

提供一个专门用于表单场景的字段组件，支持：

- 垂直布局（标题在上，值在下）
- 多种编辑器类型（选择器、位置选择器、输入框等）
- 值格式化功能
- 多种尺寸变体
- 编辑状态管理

## Specification

组件提供灵活的字段布局，支持编辑器等多种内容形式。适用于表单列表、表单输入等场景。

**布局：**

- 垂直布局：标题在上，值在下，适合表单场景

## Implementation

基于Vue 3实现，使用插槽系统提供灵活的内容定制，支持多种编辑器类型和样式配置。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| title | `string` | `''` | 否 | 字段标题 |
| value | `string \| number \| undefined` | `undefined` | 否 | 字段值 |
| valueFormmater | `(val: any) => string` | - | 否 | 值格式化函数 |
| valuePlaceholder | `string` | `''` | 否 | 值的占位符 |
| editorType | `'common_picker' \| 'location_picker' \| 'common_input' \| 'get_phone_number'` | `'common_picker'` | 否 | 编辑器类型 |
| editorData | `any` | - | 否 | 编辑器数据 |
| editable | `boolean` | `false` | 否 | 是否可编辑 |
| size | `'small' \| 'medium'` | `'small'` | 否 | 字段尺寸 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| confirm | `(value: FieldValueType)` | 编辑确认事件 |
| cancel | `()` | 编辑取消事件 |
| editing | `()` | 进入编辑状态事件 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| title | 自定义标题内容 |

### Methods

无公开方法。

## 其它

- 支持无障碍性标准
- 提供点击反馈效果
- 兼容性：支持所有Uniapp目标平台
