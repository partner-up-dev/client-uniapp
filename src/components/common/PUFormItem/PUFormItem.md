# PUFormItem 表单项

## Rationale

提供一个轻量级的表单项容器，用于显示验证错误信息，不包含布局功能。

## Goals

提供一个表单项组件，支持：
- 显示表单验证错误信息
- 与 PUForm 集成
- 不提供布局功能（如水平/垂直布局、间距）
- 不提供标签和必填标识功能

## Key Concepts

- 通过 PUForm 的 provide/inject 机制获取验证错误
- 仅作为错误信息显示容器，布局由用户自行控制

## Specification

组件是一个简单的容器，用于包裹表单控件并显示验证错误。不提供任何布局功能，用户需要自行处理标签、布局和样式。

## Implementation

基于 Vue 3 Composition API 实现，使用 inject 获取 PUForm 提供的错误状态。

### Props

- `prop` (`string | undefined`)：表单字段属性名，用于关联 PUForm 验证错误

### Events

无

### Slots

- `default`: 表单项内容（通常是输入控件和标签）

### Methods

无公开方法。

### Watches

无监听器。

## 使用示例

### 基本用法

```vue
<template>
  <PUForm ref="formRef" :schema="MySchema">
    <view class="form-row">
      <text class="label">用户名 *</text>
      <PUFormItem prop="username">
        <PUInput v-model="formData.username" placeholder="请输入用户名" />
      </PUFormItem>
    </view>
    
    <view class="form-row">
      <text class="label">邮箱</text>
      <PUFormItem prop="email">
        <PUInput v-model="formData.email" placeholder="请输入邮箱" />
      </PUFormItem>
    </view>
  </PUForm>
</template>

<style>
.form-row {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}
</style>
```

### 与 Cell 组合使用

```vue
<PUForm ref="formRef" :schema="MySchema">
  <Cell title="用户名" type="vertical">
    <template #value>
      <PUFormItem prop="username">
        <PUInput v-model="formData.username" placeholder="请输入用户名" />
      </PUFormItem>
    </template>
  </Cell>
</PUForm>
```

## 其它

- 必须在 PUForm 组件内部使用以获得完整功能
- `prop` 属性应与 PUForm 的 schema 字段对应
- 验证错误会自动显示在内容下方
- 布局、标签、必填标识等需要用户自行实现
