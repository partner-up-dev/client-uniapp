# RouteItemDatetime 组件

## Rationale

展示路线项的时间范围信息，支持占位符以适配缺省时间。

## Goals

- 以小等宽字展示时间范围
- 可选占位符

## Specification

### Props

| 属性名      | 类型                 | 默认值   | 必填 | 说明                         |
| ----------- | -------------------- | -------- | ---- | ---------------------------- |
| datetime    | `RouteItemDatetime`  | -        | 是   | 路线项时间数据模型           |
| placeholder | `boolean`            | `false`  | 否   | 无时间数据时是否显示占位文本 |

### Events

无

### Slots

无

### Methods

无

### Watches

无

## 其它

时间字符串优先使用 `datetime.time`，其次使用 `datetime.datetime` 格式化为 `HH:MM`。
