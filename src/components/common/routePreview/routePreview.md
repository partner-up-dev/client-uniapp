# RoutePreview

## Rationale

RoutePreview 组件用于显示路线类型的地理元素的预览，包括起点和终点的地址信息。

## Goals

- 显示路线的起点和终点地址
- 提供清晰的视觉指示器

## Specification

组件接收一个 Route 对象作为 prop，显示其起点和终点的友好地址。

### Props

| 属性名 | 类型   | 默认值 | 必填 | 说明     |
| ------ | ------ | ------ | ---- | -------- |
| element | `Route` | -      | 是   | 路线对象 |

### Events

无

### Slots

无

### Methods

无

### Watches

无

## 其它

注意事项：地址信息通过 Route.use 获取，可能需要异步加载。
