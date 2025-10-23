# 组件 PRForm 文档

## Rationale

> 搭子请求表单编辑器组件，用于创建和编辑搭子请求的基本信息（标题和简介）。

## Goals

> 提供一个简洁的搭子请求基本信息编辑组件，支持：
>
> - 标题输入（带字数限制）
> - 简介输入（带字数统计）
> - 表单数据双向绑定
> - 折叠面板展示

## Specification

> 组件使用折叠面板（Accordion）包裹输入区域，提供标题和简介两个字段的编辑功能。所有输入字段使用统一的通用组件（Cell、PUInput、PUTextarea）。

## Implementation

> 基于 Vue 3 Composition API 实现，使用 common 组件库替代第三方 UI 库组件。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| baseForm | `PartnerRequestForm` | `PartnerRequestForm.parse({})` | 否 | 基础表单数据 |
| showSaveToDraft | `boolean` | `true` | 否 | 是否显示保存草稿按钮（暂未实现） |
| showConfirm | `boolean` | `true` | 否 | 是否显示确认按钮（暂未实现） |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| confirm | `(partnerRequestId: number)` | 确认保存事件（当前为占位实现） |

### Slots

无插槽。

### Methods

无公开方法。

### Watches

- 监听 `baseForm` 变化，同步更新内部表单数据
