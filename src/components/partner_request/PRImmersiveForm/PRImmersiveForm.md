# PRImmersiveForm 沉浸式搭子请求表单

## Rationale

创建搭子请求时，为了提升用户体验，采用沉浸式多步骤填写方式，让用户专注于每个步骤的内容，而不是一次性面对复杂的表单。

## Goals

- 提供沉浸式多步骤填写体验
- 支持垂直滑动切换步骤
- 允许用户跳过所有步骤直接填表
- 完成后跳转到表单编辑页面
- 支持未确定类型时弹出类型选择器

## Key Concepts

- **沉浸式填写**：每个步骤占据全屏，用户一次只关注一个步骤
- **步骤（Steps）**：每个步骤对应一个插槽，由父组件提供内容
- **表单缓存（Draft）**：填写的内容保存为草稿，跳转到编辑页面时恢复

## Specification

### 内容

- 展示由父组件提供的步骤内容（通过具名插槽）
- 底部显示操作按钮（下一步、直接填表、检查并发布）

### UI/UX

- 使用 `swiper` 组件实现垂直滑动切换
- 每个步骤内容垂直居中显示
- 操作按钮固定在底部右侧
- 支持手势滑动和按钮点击两种方式切换步骤

### 行为

- 用户滑动或点击"下一步"时，触发 `next` 事件
- 在最后一步点击"检查并发布"，保存草稿并跳转到表单编辑页面
- 点击"直接填表"，保存草稿并跳转到表单编辑页面
- 如果未指定 `l2Type`，在操作前弹出类型选择器

## Implementation

### Props

- `steps` (`string[]`, `[]`)：步骤名称列表，对应插槽名称
- `l1Type` (`PRL1Type`, `undefined`)：搭子请求一级类型
- `l2Type` (`PRType`, `undefined`)：搭子请求二级类型，未指定时需用户选择
- `prForm` (`PRFormContent`, `{}`)：搭子请求表单数据，用于保存草稿

### Events

- `update:l2Type(l2Type: PRType)`：二级类型更新时触发
- `next(source: 'user' | 'parent', current: string, next?: string)`：切换到下一步时触发
  - `source`：触发来源（用户操作或父组件调用）
  - `current`：当前步骤名称
  - `next`：下一步骤名称（最后一步时为 `undefined`）

### Slots

每个步骤对应一个具名插槽，插槽名称为 `steps` 数组中的元素。插槽作用域提供：

- `complete`：调用此方法进入下一步或完成

### Methods

- `nextStep()`：进入下一步或完成（最后一步时），由父组件通过 `ref` 调用

### 使用示例

```vue
<template>
  <PRImmersiveForm
    ref="formRef"
    :steps="['route', 'tripPurpose', 'transportation']"
    :l1-type="PRL1Type.Trip"
    :l2-type="l2Type"
    @update:l2-type="l2Type = $event"
    :pr-form="formData"
    @next="onNext"
  >
    <template #route="{ complete }">
      <RouteEditor @complete="complete" />
    </template>
    <template #tripPurpose="{ complete }">
      <TripPurposePicker @complete="complete" />
    </template>
    <template #transportation="{ complete }">
      <TransportationPicker @complete="complete" />
    </template>
  </PRImmersiveForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PRImmersiveForm from "@/components/partner_request/PRImmersiveForm/PRImmersiveForm.vue";
import { PRL1Type, PRType } from "@/business/partner_request";

const formRef = ref<InstanceType<typeof PRImmersiveForm> | null>(null);
const l2Type = ref<PRType | undefined>(undefined);
const formData = ref({});

function onNext(source: "user" | "parent", current: string, next?: string) {
  console.log("Next step:", { source, current, next });
}

// 父组件可以调用 nextStep 方法
function handleComplete() {
  formRef.value?.nextStep();
}
</script>
```

## 其它

- 组件内部使用 `usePartnerRequestStore().saveDraft()` 保存草稿
- 跳转路径为 `/pages/partner_request/create_end/create_end`
- 类型选择器使用 `PRTypePicker` 组件
- 操作按钮文案通过 `partner_request.immersive_create.operations.*` i18n 路径获取
