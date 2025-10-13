# Card 组件

搭子类型卡片组件，用于展示不同类型的搭子请求选项。

## Goals

- 提供统一的卡片样式和交互
- 支持自定义标题和描述

## Specification

卡片包含标题、描述文字和右箭头图标。

## Implementation

### Props

| 属性名     | 类型     | 默认值 | 必填 | 说明         |
| ---------- | -------- | ------ | ---- | ------------ |
| title      | `string` | ""     | 否   | 卡片标题     |
| description| `string` | ""     | 否   | 卡片描述     |
| type       | `string` | "default" | 否 | 卡片类型     |
| expand     | `boolean`| false  | 否   | 展开状态     |

### Slots

| 插槽名     | 说明         |
| ---------- | ------------ |
| title      | 自定义标题内容，默认显示 `title` prop |
| content    | 自定义内容，默认显示 `description` prop |
| header-right| 自定义头部右侧内容，默认显示图标容器 |

### Methods

无

### 示例

```vue
<template>
  <Card
    title="出行搭子"
    description="网约车、顺风车、通勤"
    type="expandable"
  >
    <template #title>
      <text>自定义标题</text>
    </template>
    <template #content>
      <text>自定义内容</text>
    </template>
    <template #header-right>
      <view class="custom-right-content">
        <text>自定义右侧内容</text>
      </view>
    </template>
  </Card>
</template>
```

## 其它

- 使用 UnoCSS 进行样式控制
- 遵循项目的设计系统规范
