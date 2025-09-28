# Card 组件

搭子类型卡片组件，用于展示不同类型的搭子请求选项。

## Goals

- 提供统一的卡片样式和交互
- 支持自定义标题和描述
- 支持点击事件传递类型信息

## Specification

卡片包含标题、描述文字和右箭头图标，点击时触发事件。

## Implementation

### Props

| 属性名     | 类型     | 默认值 | 必填 | 说明         |
| ---------- | -------- | ------ | ---- | ------------ |
| title      | `string` | -      | 是   | 卡片标题     |
| description| `string` | -      | 是   | 卡片描述     |

### Events

| 事件名 | 参数          | 说明             |
| ------ | ------------- | ---------------- |
| click  | `(type: string)` | 点击卡片时触发 |

### Slots

无

### Methods

无

### 示例

```vue
<template>
  <Card
    title="出行搭子"
    description="网约车、顺风车、通勤"
    type="travel"
    @click="onCardClick"
  />
</template>
```

## 其它

- 使用 UnoCSS 进行样式控制
- 遵循项目的设计系统规范
