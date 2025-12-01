## Rationale

PUMap 是一个通用的地图预览组件，用于在应用中显示和交互地图。该组件基于 UniApp 的 map 组件封装，提供了统一的地图功能接口，支持多路线渲染、路线选择、标记点、折线、用户位置等功能。

## Goals

1. 提供统一的地图显示和交互功能
2. 支持多路线显示，每条路线只渲染第一个规划方案（PlanRoute）
3. 支持路线点击选择功能，激活路线高亮显示，非激活路线半透明
4. 支持标记点和折线的显示与交互
5. 支持用户位置获取和地图重置功能
6. 提供可配置的地图操作按钮
7. 支持多个地图实例
8. 提供地图事件的统一处理

## Specification

### 界面设计

- 地图容器占满指定区域
- 右下角显示操作按钮（可选）
- 支持自定义地图高度
- 所有路线使用相同颜色，激活路线完全不透明，非激活路线30%透明度

### 交互设计

- 支持地图点击、标记点击、折线点击事件
- 点击折线可以选中对应路线，并通过 `element-click` 事件报告选中元素
- 支持地图缩放和拖动
- 支持重置按钮恢复初始状态
- 支持获取用户当前位置

### 功能特性

- 多地图实例支持
- 路线选择与视觉反馈
- 响应式中心点和缩放级别
- 地图区域变化监听
- 用户位置获取与错误处理

## Implementation

### Props

| 属性名          | 类型              | 默认值                                              | 必填 | 说明           |
| --------------- | ----------------- | --------------------------------------------------- | ---- | -------------- |
| center          | `Coord`           | `{ latitude: 39.908823, longitude: 116.397470 }`   | 否   | 地图中心点坐标 |
| scale           | `number`          | `14`                                                | 否   | 地图缩放级别   |
| routes          | `Route[]`         | `[defaultRoute]`                                    | 否   | 路线数据数组   |
| showLocation    | `boolean`         | `true`                                              | 否   | 是否显示用户位置 |
| enable3d        | `boolean`         | `false`                                             | 否   | 是否启用3D地图 |
| showCompass     | `boolean`         | `false`                                             | 否   | 是否显示指南针 |
| showScale       | `boolean`         | `false`                                             | 否   | 是否显示比例尺 |
| enableScroll    | `boolean`         | `true`                                              | 否   | 是否允许滚动   |
| enableZoom      | `boolean`         | `true`                                              | 否   | 是否允许缩放   |
| showResetButton | `boolean`         | `true`                                              | 否   | 是否显示重置按钮 |
| height          | `string`          | `"224px"`                                           | 否   | 地图容器高度   |
| mapId           | `string`          | `"pu-map"`                                          | 否   | 地图ID        |

> **路线选择功能**: 组件内部维护当前激活的路线，通过 `element-click` 事件将选中路线以 GeoElement 结构向外部同步。激活的路线完全不透明显示，非激活路线以30%透明度显示。

> **多路线支持**: `routes` 属性支持传入路线数组，组件会自动为每条路线进行路径规划，并只渲染每条路线的第一个规划方案。所有路线使用相同的颜色。

### Events

| 事件名        | 参数                                        | 说明           |
| ------------- | ------------------------------------------- | -------------- |
| element-click | `(element: GeoElement \| null)`             | 地图元素点击事件（路线、POI 等）   |
| marker-click  | `(marker: MapMarker, event: any)`           | 标记点击事件   |
| reset         | `()`                                        | 重置按钮点击事件 |
| update:center | `(center: Coord \| undefined)`              | 双向绑定更新中心点 |

### Methods

#### updateCenter

函数签名：

```ts
function updateCenter(center: MapCenter, scale?: number): void
```

用途：更新地图中心点到指定位置
公开：是

#### getUserLocationAndCenter

函数签名：

```ts
function getUserLocationAndCenter(): Promise<void>
```

用途：获取用户当前位置并居中地图
公开：是

#### getMapContext

函数签名：

```ts
function getMapContext(): MapContext
```

用途：获取地图上下文对象，用于调用地图API
公开：是

### Types

#### MapMarker

```ts
interface MapMarker {
  id: string | number;
  latitude: number;
  longitude: number;
  iconPath: string;
  width?: number;
  height?: number;
  anchor?: {
    x: number;
    y: number;
  };
  callout?: {
    content: string;
    display?: "BYCLICK" | "ALWAYS";
  };
}
```

#### MapPolyline

```ts
interface MapPolyline {
  points: Array<{
    latitude: number;
    longitude: number;
  }>;
  color?: string;
  width?: number;
  dottedLine?: boolean;
  arrowLine?: boolean;
  borderColor?: string;
  borderWidth?: number;
}
```

#### MapCenter

```ts
interface MapCenter {
  latitude: number;
  longitude: number;
}
```

### Utility Functions

#### colorWithAlpha

将颜色转换为8位十六进制格式（包含alpha通道）。

```ts
function colorWithAlpha(color: string, alpha: number): string
```

- `color`: 颜色值，如 "#96d945"
- `alpha`: 透明度，0-1之间的数值
- 返回: 8位十六进制颜色，如 "#96d945FF" 或 "#96d9454D"

#### calculateMapBounds

计算包含所有点的地图边界范围。

#### getCurrentLocation

获取用户当前位置，返回 Promise。

#### calculateDistance

计算两点之间的距离（米）。

### 路线选择功能说明

- **统一颜色**: 所有路线使用相同的颜色 (#96d945)
- **透明度实现**: 使用8位十六进制颜色格式控制透明度，激活路线100%不透明，非激活路线30%透明度
- **交互选择**: 点击任何路线的折线即可选中该路线
- **事件同步**: 通过 `element-click` 事件通知外部当前选中的路线
- **索引说明**: 路线索引从0开始，对应 `routes` 数组中的顺序

## 注意事项

1. 地图组件依赖 UniApp 的 map 组件，确保在支持的平台上使用
2. 获取用户位置需要相关权限，请在应用中正确配置位置权限
3. 地图ID应保持唯一，避免多个地图实例冲突
4. 标记点图标路径需要使用正确的资源路径
5. 在小程序平台，地图组件为原生组件，层级较高，注意z-index问题
6. **路线选择**: 点击折线可以选中对应路线，组件会通过 `element-click` 事件同步选中结果
7. **透明度实现**: 折线透明度通过8位十六进制颜色格式实现（如 #96d945FF），后两位表示alpha值
8. **性能考虑**: 渲染多条路线会增加地图性能负担，建议同时显示的路线数量不超过5条
