# RouteItem 组件

## Rationale

展示单个路线项，包括类型指示、地址与可选时间信息。

## Goals

- 支持 start/waypoint/end 三种类型
- 支持 default 与 2rows 两种布局
- 可选虚线连接与时间展示

## Specification

### Props

| 属性名        | 类型             | 默认值     | 必填 | 说明                         |
| ------------- | ---------------- | ---------- | ---- | ---------------------------- |
| item          | `RouteItem`      | -          | 是   | 路线项数据模型               |
| type          | `'start'\|'waypoint'\|'end'` | `'start'` | 否   | 展示样式用的类型标识         |
| layout        | `'default'\|'2rows'` | `'default'` | 否   | 布局                          |
| showDash      | `boolean`        | `true`     | 否   | 是否显示上下虚线（2rows）    |
| showDatetime  | `boolean`        | `false`    | 否   | 是否显示时间（2rows）        |

### Events

无

### Slots

无

### Methods

无

### Watches

无

## 其它

默认布局实现参考 `common/routePreview`，2rows 为可选扩展布局。
