# PUFormItem 表单项

## Rationale

提供一个语义化的表单项组件，简化表单开发，提供更友好的 API。

## Goals

提供一个表单项组件，支持：
- 标签显示
- 必填标识（红色星号）
- 水平和垂直布局
- 表单验证错误显示
- 与 PUForm 集成

## Key Concepts

- 基于 Cell 组件实现
- 通过 PUForm 的 provide/inject 机制获取验证错误
- 提供更简洁的表单项 API

## Specification

组件是 Cell 组件的语义化封装，专门用于表单场景。提供 `label`、`required`、`prop` 等表单特定的属性，简化表单开发。

支持两种布局：
- `vertical`（默认）：垂直布局，标签在上，内容在下
- `horizontal`：水平布局，标签在左，内容在右

## Implementation

基于 Vue 3 Composition API 实现，内部使用 Cell 组件。

### Props

- `prop` (`string | undefined`)：表单字段属性名，用于关联 PUForm 验证错误
- `label` (`string`、默认 `""`)：标签文本
- `type` (`"vertical" | "horizontal"`、默认 `"vertical"`)：布局类型
- `required` (`boolean`、默认 `false`)：是否必填（显示红色星号）
- `prefixIcon` (`string | undefined`)：前缀图标
- `suffixIcon` (`string | undefined`)：后缀图标
- `size` (`Size`、默认 `"small"`)：尺寸

### Events

- `click()`: 表单项点击时触发

### Slots

- `default`: 表单项内容（通常是输入控件）

### Methods

无公开方法。

### Watches

无监听器。

## 使用示例

### 基本用法

```vue
<template>
  <PUForm ref="formRef" :schema="MySchema">
    <PUFormItem label="用户名" prop="username" required>
      <PUInput v-model="formData.username" placeholder="请输入用户名" />
    </PUFormItem>
    
    <PUFormItem label="邮箱" prop="email">
      <PUInput v-model="formData.email" placeholder="请输入邮箱" />
    </PUFormItem>
  </PUForm>
</template>
```

### 水平布局

```vue
<PUFormItem label="性别" prop="gender" type="horizontal">
  <PUPicker v-model="formData.gender" :options="genderOptions" />
</PUFormItem>
```

### 带图标

```vue
<PUFormItem label="电话" prop="phone" prefix-icon="i-mdi-phone">
  <PUInput v-model="formData.phone" type="tel" />
</PUFormItem>
```

## 其它

- 必须在 PUForm 组件内部使用以获得完整功能
- `prop` 属性应与 PUForm 的 schema 字段对应
- 验证错误会自动显示在表单项下方
