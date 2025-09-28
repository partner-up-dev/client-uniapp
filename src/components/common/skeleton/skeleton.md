# Skeleton

## Rationale

为列表、卡片等数据加载阶段提供占位骨架，避免布局跳动并明确加载中状态。

## Goals

- 提供文本、头像、段落、图片等预设样式
- 支持行/列自定义（宽高、圆角、间距、颜色）
- 支持渐变与闪烁两种动画
- 与 loading 状态切换已加载内容

## Specification

- 组件名：`Skeleton`
- 主题：`text` | `avatar` | `paragraph` | `image`
- 动画：`gradient` | `flashed` | `''`（无动画）
- 行列配置：`rowCol` 支持数字、对象、对象数组
- 当 `loading` 为 `true` 显示骨架；为 `false` 展示插槽内容

## Implementation

- 使用 Composition API；虚拟宿主，shared 样式隔离
- 根据 `rowCol`/`theme` 生成内部 `rowCols` 数组；解析为 `parsedRowCols`
- 列 class：`skeleton__col` + `skeleton--type-*` + 可选 `skeleton--animation-*`
- 列 style：支持 size/width/height/margin/marginLeft/marginRight/borderRadius/background/backgroundColor

### Props

| 属性名      | 类型                                             | 默认值   | 必填 | 说明           |
| ----------- | ------------------------------------------------ | -------- | ---- | -------------- |
| theme       | `'text' \| 'avatar' \| 'paragraph' \| 'image'`  | `'text'` | 否   | 骨架图风格     |
| rowCol      | `Array<number \| RowColObj \| RowColObj[]>`     | `[]`     | 否   | 行列配置       |
| loading     | `boolean`                                       | `true`   | 否   | 加载状态       |
| animation   | `'' \| 'gradient' \| 'flashed'`                 | `''`     | 否   | 动画类型       |
| customClass | `string`                                        | `''`     | 否   | 自定义类名     |
| customStyle | `string`                                        | `''`     | 否   | 自定义样式     |

### Events

无

### Slots

| 插槽名  | 说明             | 参数 |
| ------- | ---------------- | ---- |
| default | 加载完成的内容区 | -    |

### Methods

无

### Watches

- 监听 `rowCol`/`theme` -> 同步内部渲染结构

## 其它

- 注意小程序节点：使用 view/text/image；避免 transition
