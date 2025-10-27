# 组件 PRMetadataForm 文档

## 组件名称

PRMetadataForm - 搭子请求元数据表单

## 功能描述

提供标题（title）和简介（introduction）的编辑功能，用于搭子请求的基本信息编辑。

## 使用场景

- 在 PRForm 组件中作为元数据编辑部分
- 编辑搭子请求的基础信息（标题和简介）

## Implementation

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| form | `PartnerRequestForm` | - | 是 | 搭子请求表单数据对象 |

### Emits

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | `field_name: string` | 表单字段变化时触发，传递变化的字段名 |

## 使用示例

```vue
<template>
  <PRMetadataForm
    :form="partnerRequestForm"
    @change="handleFormChange"
  />
</template>

<script setup lang="ts">
import PRMetadataForm from "@/components/partner_request/PRMetadataForm/PRMetadataForm.vue";
import { PartnerRequestForm } from "@/business/partner_request/form";

const partnerRequestForm = new PartnerRequestForm({
  title: null,
  introduction: null,
});

function handleFormChange(fieldName: string) {
  console.log('Field changed:', fieldName);
}
</script>
```

## 注意事项

1. 组件直接修改传入的 form 对象（双向绑定）
2. 表单验证由父组件的 PUForm 处理
3. 标题最大长度为 12 个字符
4. 简介最大长度为 60 个字符
