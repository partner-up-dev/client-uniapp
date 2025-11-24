# GeoElement 组件

## Rationale

GeoElement 组件用于在界面上展示地理元素（路线或兴趣点）的预览信息。该组件主要用于过滤器界面，让用户能够快速识别和选择地理元素。

## Goals

- 支持显示路线（Route）和兴趣点（POI）两种地理元素类型
- 提供清晰的视觉预览，包括起止点信息和类型指示器
- 支持紧凑和默认两种布局模式
- 提供点击交互功能

## Specification

### 界面设计

组件采用横向布局，包含两个主要区域：

1. **预览区域**（左侧）：
   - 路线类型：显示起点和终点的地址信息，配有对应的类型指示图标
   - POI类型：显示单个地址信息和位置图标

2. **类型图标**（右侧）：
   - 根据地理元素类型显示对应的图标（路线图标或位置图标）

### 交互行为

- 点击组件触发 `click` 事件，传递当前的地理元素对象
- 支持悬停和点击状态的视觉反馈

## Implementation

### Props

| 属性名       | 类型                          | 默认值      | 必填 | 说明                     |
| ------------ | ----------------------------- | ----------- | ---- | ------------------------ |
| geoElement   | `GeoElement`                  | -           | 是   | 地理元素对象             |
| showItemType | `boolean`                     | `true`      | 否   | 是否显示类型指示图标     |
| layout       | `'default' \| 'compact'`      | `'default'` | 否   | 布局模式                 |

### Events

| 事件名 | 参数                        | 说明           |
| ------ | --------------------------- | -------------- |
| click  | `(geoElement: GeoElement)`  | 点击组件时触发 |

### Methods

#### getGeoElementIcon

函数签名：

```ts
function getGeoElementIcon(type: GeoElementType): string
```

用途：根据地理元素类型获取对应的图标路径
公开：是

#### getRouteItemTypeIcon

函数签名：

```ts
function getRouteItemTypeIcon(isStart: boolean): string
```

用途：获取路线项类型指示图标（起点/终点）
公开：是

### Slots

无插槽支持。

### Watches

无特殊监听器。

## 其它

### 注意事项

- 组件依赖业务层的 Route 和 POI 类型定义
- 地址显示目前使用占位文本，需要根据实际业务逻辑获取 Location 的友好地址
- 图标资源需要确保在 `/static/icon/` 目录下存在对应文件
- 样式使用项目的 SCSS token 系统，确保与设计规范一致

### 待完善功能

- [ ] 实现真实的地址显示逻辑
- [ ] 添加加载状态处理
- [ ] 支持更多的地理元素类型
- [ ] 优化无障碍访问支持
