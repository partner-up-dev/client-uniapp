# PRTypeFilter

## Rationale

搭子请求类型筛选器，提供多选能力，供探索页或筛选面板复用。

## Goals

- 多选 PRType 值
- 与 PUCheckbox/PUCheckboxGroup 统一交互风格（Bar 样式）
- 简洁 API：v-model 与 change 通知

## Specification

- 使用 Bar 风格的 PUCheckbox 逐行展示类型项
- 通过 PUCheckboxGroup 管理多选与约束

## Implementation

### Props

| 属性名       | 类型        | 默认值 | 必填 | 说明           |
| ------------ | ----------- | ------ | ---- | -------------- |
| modelValue   | `PRType[]`  | `[]`   | 否   | 已选中的类型集 |

### Events

| 事件名            | 参数            | 说明                   |
| ----------------- | --------------- | ---------------------- |
| update:modelValue | `(value: PRType[])` | v-model 更新事件      |
| change            | `()`            | 任一项变更时的通知，无载荷 |

### Slots

| 插槽名  | 说明 |
| ------- | ---- |
| default | -    |

### Methods

无

### Watches

无

## 其它

类型顺序：Commute, RideHailing, Hitchhiking, Moped, Travel。
