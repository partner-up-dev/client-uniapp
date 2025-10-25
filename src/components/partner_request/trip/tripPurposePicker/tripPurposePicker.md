# 组件 TripPurposePicker 文档

## Rationale

> 出行目的选择器组件，用于在创建出行搭子请求时选择具体的出行目的。帮助用户快速分类和标记不同类型的出行需求，如赶火车、下飞机、通勤等场景。

## Goals

> 提供一个专用的出行目的选择组件，支持：
>
> - 横向滚动选择多种出行目的类型
> - 清晰的图标和文字展示
> - v-model 双向绑定
> - 边缘渐变效果
> - 国际化支持
> - 与 PUScrollView 组件集成

## Specification

> 组件以横向滚动卡片的形式展示所有出行目的选项。每个选项包含图标和文字标签，用户点击即可选中。选中的选项会高亮显示（边框+背景色变化）。支持右侧边缘渐变效果，提供更好的视觉体验。

## Implementation

> 基于 Vue 3 Composition API 实现，使用 `PUScrollView` 组件处理横向滚动和边缘渐变。使用类型化的 `TripPurpose` 枚举定义出行目的，支持国际化文本显示。

### Props

| 属性名      | 类型                                          | 默认值  | 必填 | 说明                                                                 |
| ----------- | --------------------------------------------- | ------- | ---- | -------------------------------------------------------------------- |
| modelValue  | `TripPurpose \| null`                         | `null`  | 否   | 当前选中的出行目的                                                   |
| edgeFade    | `"start" \| "end" \| "both" \| undefined`     | `"end"` | 否   | 边缘渐变位置：start-左侧，end-右侧，both-两侧，undefined-不渐变      |
| customClass | `string`                                      | `""`    | 否   | 自定义样式类名                                                       |
| customStyle | `string`                                      | `""`    | 否   | 自定义样式                                                           |

### Events

| 事件名            | 参数                       | 说明                 |
| ----------------- | -------------------------- | -------------------- |
| update:modelValue | `(purpose: TripPurpose)`   | v-model 更新事件     |
| select            | `(purpose: TripPurpose)`   | 选择事件             |
| complete          | `()`                       | 完成选择事件         |

### Slots

无插槽。

### Methods

无公开方法。

### Watches

无监听器。

## 其它

### 使用示例

```vue
<template>
  <TripPurposePicker
    v-model="purpose"
    edge-fade="end"
    @complete="handleComplete"
  />
</template>

<script setup>
import { ref } from 'vue';
import TripPurposePicker from '@/components/partner_request/trip/tripPurposePicker/tripPurposePicker.vue';

const purpose = ref(null);

function handleComplete() {
  console.log('Selected purpose:', purpose.value);
}
</script>
```

### 国际化

- 翻译域：`base.trip_purpose_picker`
- 键值格式：`purpose_text.{purpose}`
- 支持的出行目的：
  - `airport_dropoff` - 赶飞机
  - `airport_pickup` - 下飞机
  - `railway_dropoff` - 赶火车
  - `railway_pickup` - 下火车
  - `common` - 无特殊目的
  - `commute` - 通勤

### 设计代币

组件使用以下设计代币：

- `$pu-color-surface-container` - 卡片背景色
- `$pu-color-surface-container-highest` - 选中卡片背景色
- `$pu-color-primary` - 选中边框色
- `$pu-color-on-surface` - 文字和图标颜色
- `$pu-spacing-sm/med/xs` - 间距
- `$pu-radius-sm` - 卡片圆角

### 兼容性

- 支持所有 Uniapp 目标平台（小程序）
- 依赖 `PUScrollView` 组件
- 需要确保 `TripPurpose` 类型和图标资源已正确定义

### 注意事项

- 图标使用 UnoCSS 的 MDI 图标集，需要在 `uno.config.ts` 中配置 `safeListOfIcons`
- 组件高度由父容器控制，建议设置明确的高度
- 使用 `v-model` 进行双向绑定，选中值为 `TripPurpose` 类型
