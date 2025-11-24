# PUTag

## Rationale

为标签型信息提供统一外观，复用设计代币（背景 Surface Container、边框 Outline Variant、文字 On Surface），用于轻量状态或分类标识。

## Goals

- 语义清晰的标签外观
- 统一的尺寸与圆角风格
- 简洁 API，便于在列表、卡片内复用

## Specification

- 背景：surface-container
- 边框：outline-variant 1px（可开关）
- 文本：Label/Large（14/20，字重 400）
- 圆角：rounded=true 时 50px；否则直角
- 内边距：x=16, y=4；Small 为 x=12, y=2

## Implementation

- 组件入口：`PUTag.vue`
- Props 定义：`PUTag.ts`
- 样式：`PUTag.scss` 使用 `@use "@/styles/main.scss" as *;`

### Props

| 名称     | 类型                         | 默认值          | 必填 | 说明                     |
| -------- | ---------------------------- | --------------- | ---- | ------------------------ |
| text     | `string`                     | `''`            | 否   | 标签文本（建议用 i18n）  |
| rounded  | `boolean`                    | `true`          | 否   | 是否使用 50px 圆角       |
| outlined | `boolean`                    | `true`          | 否   | 是否显示 1px 描边        |
| theme    | `'SurfaceContainer'`         | `'SurfaceContainer'` | 否   | 预留主题扩展            |
| size     | `'Small' \| 'Medium'`        | `'Medium'`      | 否   | 尺寸变体                 |
| customClass | `string`                  | `''`            | 否   | 根节点附加类名           |
| customStyle | `string`                  | `''`            | 否   | 根节点附加内联样式       |

### Events

无

### Slots

无

### Methods

无

### Watches

无

## 其它

- 避免硬编码文本，请接入 i18n 并从业务处传入文案。
