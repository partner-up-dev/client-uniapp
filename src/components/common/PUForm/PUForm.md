# PUForm 组件文档

## 概述

`PUForm` 是一个表单容器组件，为表单项（Cell）提供统一的 padding 配置和验证功能。它通过 Valibot schema 实现表单验证，并自动将错误信息渲染到对应的表单项中。

## Specification

> PUForm 组件提供表单验证和错误处理功能。它接受一个 Valibot schema 实例，并提供 `validate()` 方法来验证表单数据。
>
> **核心功能：**
>
> - 统一配置表单项（Cell）的 padding
> - 提供 `validate(formData)` 方法进行表单验证
> - 自动将验证错误信息渲染到对应的表单项中
> - 通过 provide/inject 机制向子组件传递错误状态

## Implementation

> 基于 Vue 3 Composition API 和 Valibot 实现，使用 provide/inject 实现父子组件通信。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| schema | `ValibotClass` | - | 是 | Valibot schema 类实例，用于表单验证 |
| cellPadding | `string` | `'var(--pu-form-cell-padding, 12px 16px)'` | 否 | 表单项的统一 padding |

### Events

无

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 表单内容，通常包含 Cell 组件 |

### Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| validate | `formData: any` | `Promise<FormValidationResult>` | 验证表单数据，返回验证结果 |

#### FormValidationResult

```typescript
interface FormValidationResult<T = any> {
  success: boolean;           // 验证是否成功
  validatedForm?: T;          // 验证成功后的表单数据
  errors?: Record<string, string>;  // 验证错误信息（字段名 -> 错误消息）
}
```

## Usage

### 基本用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import PUForm from "@/components/common/PUForm/PUForm.vue";
import Cell from "@/components/common/cell/cell.vue";
import PUInput from "@/components/common/PUInput/PUInput.vue";
import { V } from "@/business";
import * as v from "valibot";

// 定义表单数据模型
class UserForm extends V.class(v.object({
  username: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.minValue(18)),
})) {}

const formRef = ref<InstanceType<typeof PUForm>>();
const formData = ref({
  username: "",
  email: "",
  age: 0,
});

async function handleSubmit() {
  if (!formRef.value) return;
  
  const result = await formRef.value.validate(formData.value);
  
  if (result.success) {
    console.log("Form is valid:", result.validatedForm);
    // 提交表单
  } else {
    console.log("Form has errors:", result.errors);
    // 错误已自动显示在对应的 Cell 中
  }
}
</script>

<template>
  <PUForm ref="formRef" :schema="UserForm">
    <Cell title="用户名" type="vertical" formProp="username">
      <template #value>
        <PUInput v-model="formData.username" placeholder="请输入用户名" />
      </template>
    </Cell>
    
    <Cell title="邮箱" type="vertical" formProp="email">
      <template #value>
        <PUInput v-model="formData.email" placeholder="请输入邮箱" />
      </template>
    </Cell>
    
    <Cell title="年龄" type="vertical" formProp="age">
      <template #value>
        <PUInput v-model="formData.age" type="number" placeholder="请输入年龄" />
      </template>
    </Cell>
    
    <PUButton @click="handleSubmit">提交</PUButton>
  </PUForm>
</template>
```

### 自定义 padding

```vue
<PUForm :schema="MySchema" cellPadding="16px 20px">
  <Cell title="字段" type="vertical" formProp="field">
    <template #value>
      <PUInput v-model="formData.field" />
    </template>
  </Cell>
</PUForm>
```

### 嵌套字段验证

对于嵌套对象，使用点号分隔的字段路径：

```vue
<script setup lang="ts">
import { V } from "@/business";
import * as v from "valibot";

class AddressForm extends V.class(v.object({
  street: v.string(),
  city: v.string(),
})) {}

class PersonForm extends V.class(v.object({
  name: v.string(),
  address: v.instance(AddressForm),
})) {}

const formData = ref({
  name: "",
  address: {
    street: "",
    city: "",
  },
});
</script>

<template>
  <PUForm ref="formRef" :schema="PersonForm">
    <Cell title="姓名" type="vertical" formProp="name">
      <template #value>
        <PUInput v-model="formData.name" />
      </template>
    </Cell>
    
    <Cell title="街道" type="vertical" formProp="address.street">
      <template #value>
        <PUInput v-model="formData.address.street" />
      </template>
    </Cell>
    
    <Cell title="城市" type="vertical" formProp="address.city">
      <template #value>
        <PUInput v-model="formData.address.city" />
      </template>
    </Cell>
  </PUForm>
</template>
```

## Cell 组件更新

为了配合 PUForm 使用，Cell 组件新增了 `formProp` 属性：

### 新增 Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| formProp | `string` | `undefined` | 否 | 表单字段属性名，用于关联验证错误 |

### 行为变化

- 当 Cell 在 PUForm 内部且设置了 `formProp` 时，会自动应用 PUForm 的 cellPadding
- 当该字段有验证错误时，会在 Cell 底部显示错误消息
- 错误状态下，Cell 标题会显示为错误颜色

## 设计说明

### Provide/Inject 机制

PUForm 使用 Vue 的 provide/inject 向子组件提供：

1. `puFormErrors` - 表单错误状态（响应式）
2. `puFormCellPadding` - 统一的 cell padding

Cell 组件通过 inject 获取这些值，实现自动错误显示和样式统一。

### 验证流程

1. 调用 `formRef.value.validate(formData)` 触发验证
2. PUForm 使用 schema.safeParse() 验证数据
3. 将 Valibot issues 解析为字段路径到错误消息的映射
4. 更新响应式的 formErrors
5. Cell 组件通过 inject 自动获取并显示错误

## 注意事项

1. **Schema 必须是 ValibotClass 实例**：必须使用 `V.class()` 创建的类
2. **formProp 必须与 schema 字段对应**：确保 formProp 的值与 schema 中的字段路径一致
3. **表单数据由父组件管理**：PUForm 不管理表单数据本身，只负责验证和错误显示
4. **需要手动调用 validate**：验证不会自动触发，需要在适当时机（如提交时）手动调用

## 相关组件

- [Cell](../cell/cell.md) - 表单项容器
- [PUInput](../PUInput/PUInput.md) - 输入框组件
- [PUTextarea](../PUTextarea/PUTextarea.md) - 文本域组件

## 示例项目

参考项目中的其他表单使用 PUForm 的例子：

- `src/components/partner_request/PRForm/` - 搭子请求表单
