# CommuteDatetimeForm 组件

## 概述

通勤搭子请求日期时间表单组件，用于编辑通勤时间相关信息，包括上下班时间、工作日和交通方式。

## 功能特性

- ✅ 上下班时间选择（时间选择器）
- ✅ 工作日多选（至少选择一天）
- ✅ 交通方式选择
- ✅ 折叠面板展示
- ✅ 表单验证

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import CommuteDatetimeForm from "@/components/partner_request/commute/commuteDatetimeForm/commuteDatetimeForm.vue";
import type { CommutePRForm } from "@/business/partner_request/commute";

const formRef = ref();
const form = ref<CommutePRForm>({
  on_at: "09:00",
  off_at: "18:00",
  workdays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  transportation: "self_drive_automobile",
});

function handleChange(field: string) {
  console.log("Field changed:", field);
}

async function handleSubmit() {
  const result = await formRef.value?.validate();
  if (result.valid) {
    console.log("Form is valid");
  } else {
    console.error("Validation failed:", result.message);
  }
}
</script>

<template>
  <CommuteDatetimeForm
    ref="formRef"
    :form="form"
    @change="handleChange"
  />
</template>
```

## API

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| form | `CommutePRForm` | - | 表单数据对象 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | `(field_name: string)` | 表单字段变化时触发 |

### Expose Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| validate | - | `Promise<{ valid: boolean; message?: string }>` | 验证表单，返回验证结果 |

## 表单数据结构

```typescript
interface CommutePRForm {
  on_at: string | null;           // 上班时间 (HH:mm 格式)
  off_at: string | null;           // 下班时间 (HH:mm 格式)
  workdays: Weekday[];             // 工作日数组
  transportation?: Transportation; // 交通方式
}

type Weekday = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturaday' 
  | 'sunday';

type Transportation = 
  | 'self_drive_automobile' 
  | 'moped' 
  | 'ride_hailing';
```

## 验证规则

1. **工作日验证**：至少选择一天工作日
2. **时间验证**：上班时间和下班时间至少填写一个

## 注意事项

- 组件使用原生 `<picker>` 组件实现时间选择
- 交通方式选择器使用 `PUDrawer` + `TransportationPicker` 实现
- 工作日使用 `PUCheckboxGroup` 实现多选，最少选择 1 天
- 表单数据通过 props 传入，需在父组件中维护
- 修改表单数据会触发 `change` 事件，参数为变化的字段名

## 依赖组件

- `PUAccordion` / `PUAccordionItem` - 折叠面板
- `Cell` - 单元格布局
- `PUCheckbox` / `PUCheckboxGroup` - 复选框
- `PUDrawer` - 抽屉容器
- `TransportationPicker` - 交通方式选择器

## 国际化

组件使用 `partner_request.commute.specific_content_editor` 命名空间下的翻译键：

- `collapse_title.time` - 时间折叠面板标题
- `collapse_title.transportation` - 交通折叠面板标题
- `on_at.title` / `on_at.label` - 上班时间标签
- `off_at.title` / `off_at.label` - 下班时间标签
- `workdays.title` - 工作日标签
- `transportation.title` / `transportation.placeholder` - 交通方式标签
- `rules.workdays_required` - 工作日必填提示
- `rules.either_or_on_off_at` - 时间必填提示
