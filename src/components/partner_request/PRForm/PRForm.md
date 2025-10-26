# 组件 PRForm 文档

## Rationale

> 搭子请求表单编辑器组件，用于创建和编辑搭子请求的信息（标题、简介、路线、出行偏好等）。

## Goals

> 提供一个灵活的搭子请求信息编辑组件，支持：
>
> - 标题输入（带字数限制）
> - 简介输入（带字数统计）
> - 根据搭子请求类型显示相应的表单项（路线、出行偏好等）
> - 表单数据双向绑定
> - 折叠面板展示
> - 集成业务逻辑验证

## Specification

> 组件使用折叠面板（Accordion）包裹不同的表单区域。根据 `type` prop，显示对应的表单项：
>
> - 所有类型：标题和简介（基本信息）
> - `ride_hailing` 和 `commute` 类型：路线信息、出行偏好

## Implementation

> 基于 Vue 3 Composition API 实现，使用 common 组件库和业务逻辑模块。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| baseForm | `PartnerRequestForm` | `PartnerRequestForm.parse({})` | 否 | 基础表单数据 |
| type | `PRType` | `undefined` | 否 | 搭子请求类型，决定显示哪些表单项 |
| route | `Route` | `undefined` | 否 | 路线数据（用于 ride_hailing 和 commute 类型） |
| tripPreference | `TripPreference` | `undefined` | 否 | 出行偏好数据（用于 ride_hailing 和 commute 类型） |
| showSaveToDraft | `boolean` | `true` | 否 | 是否显示保存草稿按钮（暂未实现） |
| showConfirm | `boolean` | `true` | 否 | 是否显示确认按钮（暂未实现） |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| confirm | `(partnerRequestId: number)` | 确认保存事件（当前为占位实现） |
| update:route | `(value: Route)` | 路线数据更新事件 |
| update:tripPreference | `(value: TripPreference)` | 出行偏好数据更新事件 |

### Slots

无插槽。

### Methods

- `validate(): Promise<void>`: 验证表单数据，使用 PartnerRequestForm 的业务逻辑验证

### Watches

- 监听 `baseForm` 变化，同步更新内部表单数据
