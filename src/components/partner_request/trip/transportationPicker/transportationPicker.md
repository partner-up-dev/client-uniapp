# 组件 TransportationPicker 文档

## Rationale

> 交通方式选择器组件，用于在创建出行搭子请求时选择交通工具类型。提供统一的交通方式选择界面和数据处理。

## Goals

> 提供一个专用的交通方式选择组件，支持：
>
> - 多种交通方式类型选择（私家车、网约车、电瓶车）
> - 图标化显示，直观易用
> - v-model 双向绑定
> - 国际化支持
> - 背景融合效果

## Specification

> 组件提供水平滚动的交通方式选择界面，每个选项以卡片形式展示，包含图标和文字。选中的选项会有边框高亮显示。支持右侧渐变效果与背景融合。

## Implementation

> 基于 Vue 3 Composition API 实现，使用 `Transportation` 类型枚举定义交通方式，支持国际化文本显示。内部使用 `PUScrollView` 组件实现横向滚动和边缘渐变效果。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| modelValue | `Transportation \| null` | `null` | 否 | 当前选中的交通方式 |
| blendToBackground | `'right' \| undefined` | `undefined` | 否 | 是否与背景融合，`'right'` 表示右侧渐变 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: Transportation)` | v-model 更新事件 |
| select | `(value: Transportation)` | 选择改变事件 |
| complete | `()` | 完成选择事件 |

### Slots

无插槽。

### Methods

无公开方法。

### Watches

无监听器。

## 用法示例

```vue
<template>
  <TransportationPicker
    v-model="selectedTransportation"
    blend-to-background="right"
    @complete="handleComplete"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import TransportationPicker from "@/components/partner_request/trip/transportationPicker/transportationPicker.vue";
import type { Transportation } from "@/business/partner_request/trip";

const selectedTransportation = ref<Transportation | null>(null);

function handleComplete() {
  console.log("选择完成:", selectedTransportation.value);
}
</script>
```

## 其它

- 支持国际化，翻译域为 `base.transportation_picker`
- 使用 Material Design Icons (MDI) 图标系统
- 使用 `PUScrollView` 组件实现横向滚动和边缘渐变
- 兼容性：支持所有 Uniapp 目标平台（小程序）
- 使用注意事项：需要确保交通方式类型枚举已正确定义
- 图标映射：
  - `self_drive_automobile` → `i-mdi-car`
  - `ride_hailing` → `i-mdi-taxi`
  - `moped` → `i-mdi-moped`
