# PUCheckboxGroup

## Rationale

复选框分组容器，负责管理一组 PUCheckbox 的受控选中值与统一外观。

## Goals

- 提供 v-model 绑定的选中值数组
- 支持 shape、size、checkedColor、disabled、min、max、inline 等统一控制
- 通过 provide/inject 与 PUCheckbox 协作

## Specification

- 使用 provide 暴露 { props, changeSelectState }
- 子项调用 changeSelectState 切换选中态；父级根据 min/max 限制更新
- 触发事件：update:modelValue、change

## Implementation

### Props

| 属性名       | 类型                                 | 默认值 | 必填 | 说明                       |
| ------------ | ------------------------------------ | ------ | ---- | -------------------------- |
| modelValue   | `Array<string \| number \| boolean>` | `[]`   | 否   | 选中值数组                 |
| shape        | `'circle' \| 'square' \| 'button'`   | -      | 否   | 统一形状                   |
| checkedColor | `string`                              | -      | 否   | 选中时颜色                 |
| disabled     | `boolean`                             | `false`| 否   | 是否禁用                   |
| min          | `number`                              | `0`    | 否   | 最少选中数量               |
| max          | `number`                              | `0`    | 否   | 最多选中数量，0 表示无限制 |
| inline       | `boolean`                             | `false`| 否   | 是否同行显示               |
| size         | `string`                              | -      | 否   | 大小：'large'              |

### Events

| 事件名            | 参数                         | 说明             |
| ----------------- | ---------------------------- | ---------------- |
| update:modelValue | `(value: (string\|number\|boolean)[])` | v-model 更新事件 |
| change            | `({ value: (string\|number\|boolean)[] })` | 值变更事件 |

### Slots

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 默认插槽 | -    |

### Methods

#### changeSelectState

function changeSelectState(value: string | number | boolean): void

用途：由子项调用，切换某个值的选中态。
公开：否

## 其它

- 不负责渲染实际选项，仅作为容器与状态管理者。
