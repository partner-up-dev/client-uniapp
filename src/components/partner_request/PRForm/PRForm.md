# 组件 PRForm 文档

## Rationale

> 搭子请求表单编辑器组件，用于创建和编辑搭子请求的信息（标题、简介、路线、出行偏好等）。

## Goals

> 提供一个类型安全的搭子请求信息编辑组件，支持：
>
> - 标题输入（带字数限制）
> - 简介输入（带字数统计）
> - 根据搭子请求类型显示相应的表单项（路线、出行偏好等）
> - 表单数据双向绑定
> - 折叠面板展示
> - 集成业务逻辑验证
> - **Vue 3 泛型组件**：根据 `type` prop 自动推导 `modelValue` 的类型

## Specification

> 组件使用折叠面板（Accordion）包裹不同的表单区域。根据 `type` prop，显示对应的表单项：
>
> - 所有类型：标题和简介（基本信息）
> - `PRType.RideHailing` 类型：网约车搭子表单
> - `PRType.Commute` 类型：通勤搭子表单（包含时间和工作日信息）

## Implementation

> 基于 Vue 3 Composition API 和泛型组件实现，使用 common 组件库和业务逻辑模块。
>
> 组件使用 Vue 3 的泛型功能，`modelValue` 的类型会根据 `type` prop 自动推导：
>
> - `type="ride_hailing"` → `modelValue: RideHailingPRForm`
> - `type="commute"` → `modelValue: CommutePRForm`
> - 其他 → `modelValue: PartnerRequestForm`

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| modelValue | `GetFormTypeByPRType<T>` | - | 是 | 表单数据，类型根据 `type` 自动推导 |
| type | `T extends PRType` | - | 是 | 搭子请求类型，决定显示哪些表单项和 modelValue 的类型 |
| showSaveToDraft | `boolean` | `true` | 否 | 是否显示保存草稿按钮（暂未实现） |
| showConfirm | `boolean` | `true` | 否 | 是否显示确认按钮（暂未实现） |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| confirm | `(partnerRequestId: number)` | 确认保存事件（当前为占位实现） |
| update:modelValue | `(value: PartnerRequestForm)` | modelValue 更新事件 |

### Slots

无插槽。

### Methods

- `validate(): Promise<void>`: 验证表单数据，使用 PartnerRequestForm 的业务逻辑验证

### Usage Example

```vue
<script setup lang="ts">
import PRForm from "@/components/partner_request/PRForm/PRForm.vue";
import { PRType } from "@/business/partner_request";
import { RideHailingPRForm } from "@/business/partner_request/ride_hailing";

// 网约车搭子表单
const rideHailingForm = ref<RideHailingPRForm>(RideHailingPRForm.parse({}));
</script>

<template>
  <!-- type 为 ride_hailing 时，modelValue 自动推导为 RideHailingPRForm 类型 -->
  <PRForm 
    v-model="rideHailingForm" 
    :type="PRType.RideHailing" 
  />
</template>
```

### Type Mappings

组件内部使用 `PRTypeToFormMap` 映射不同的搭子请求类型到对应的表单类型：

```typescript
type PRTypeToFormMap = {
  [PRType.Commute]: CommutePRForm;
  [PRType.RideHailing]: RideHailingPRForm;
  [PRType.Undefined]: PartnerRequestForm;
};
```

### Initialization

组件在 `onMounted` 时会检查 `modelValue` 是否为空，如果为空则根据 `type` 自动初始化对应的表单类型：

```typescript
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    const initialForm = createFormByType(props.type);
    emit("update:modelValue", initialForm);
  }
});
```
