# 组件 LocationPicker 文档

## Rationale

> 地理位置选择器组件，用于在应用中提供统一的位置选择交互体验。用户可以通过点击触发位置选择界面，选择具体的地理位置。

## Goals

> 提供一个标准化的位置选择组件，支持：
>
> - 显示当前选中的位置信息
> - 触发位置选择界面
> - 支持占位符文本
> - 支持v-model双向绑定
> - 提供选择确认事件

## Specification

> 组件采用插槽模式，默认显示友好的地址文本。点击组件时会触发位置选择流程，通过useSelectLocation组合式函数处理选择逻辑。支持自定义占位符文本，并通过事件系统通知父组件位置变更。

## Implementation

> 组件基于Vue 3 Composition API实现，使用Pinia store管理位置数据，通过组合式函数封装位置选择逻辑。样式采用BEM规范，支持国际化。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| show | `boolean` | `false` | 否 | 是否显示选择器界面 |
| modelValue | `LocationRef \| undefined` | - | 否 | 当前地理位置值 |
| placeholder | `string \| undefined` | - | 否 | 占位符文本，未传入时使用默认国际化文本 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: LocationRef)` | v-model更新事件，位置ID变更时触发 |
| confirm | `(value: LocationRef)` | 位置选择确认事件 |
| update:show | `(value: boolean)` | 选择器显示状态更新事件 |

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 默认插槽，自定义显示内容 | - |

### Methods

无公开方法。

### Watches

无监听器。

## 其它

- 依赖于 useSelectLocation 组合式函数
- 依赖于 useBaseLocationStore Pinia store
- 支持国际化，翻译域为 'base.location_picker'
- 使用注意事项：需要确保位置store已正确初始化
- 兼容性：支持所有Uniapp目标平台
