# 组件 RouteMap 文档

## Rationale

> 路线地图组件，用于在地图上显示路线信息。提供可视化的路线展示和交互功能。

## Goals

> 提供一个专业的路线地图显示组件，支持：
>
> - 路线可视化显示
> - 起点终点标记
> - 中途站点显示
> - 地图交互控制
> - 路线详情展示
> - 实时位置跟踪

## Specification

> 组件在地图上绘制完整的路线信息，包括路径、站点、时间等。支持地图缩放、平移和标记点击等交互操作。

## Implementation

> 基于Vue 3实现，集成第三方地图SDK，使用地图API绘制路线和标记，支持实时更新。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| route | `RouteInfo` | - | 是 | 路线信息 |
| interactive | `boolean` | `true` | 否 | 是否允许交互 |
| showTraffic | `boolean` | `false` | 否 | 是否显示交通状况 |
| autoFit | `boolean` | `true` | 否 | 是否自动适配视图 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| marker-click | `(marker: MarkerInfo)` | 标记点击事件 |
| map-ready | `(map: MapInstance)` | 地图初始化完成事件 |

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| controls | 自定义地图控件 | - |

### Methods

#### fitBounds

函数签名：

```ts
function fitBounds(): void {}
```

用途：调整地图视图以适配路线
公开：是

### Watches

- 监听路线数据变化，重新绘制地图

## 其它

- 依赖第三方地图SDK
- 支持多种地图样式
- 提供路线优化显示
- 需要网络连接
- 兼容性：支持所有Uniapp目标平台
