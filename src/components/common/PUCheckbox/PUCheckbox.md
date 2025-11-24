# PUCheckbox

## Rationale

提供跨小程序平台可用的复选组件，满足圆形、方形与按钮形态，支持受控 v-model 与自定义选中值。

## Goals

- 单独使用（非分组）下的复选交互
- 三种形态：circle/square/button
- 支持禁用、尺寸、行内布局、最大宽度与选中颜色

## Specification

- 根元素支持 `customClass`/`customStyle`
- 形态通过 `shape` 指定；`button` 模式隐藏 shape，仅使用 label 外观
- 点击根容器触发切换，禁用时无效
- v-model 受控：等于 `trueValue` 时视为选中，否则未选中
- 变更时触发 `update:modelValue` 与 `change`

## Implementation

组件为无状态 UI，状态由外部 v-model 控制。按钮模式下在 label 左侧显示勾选图标。

### Props

| 属性名        | 类型                          | 默认值   | 必填 | 说明                                   |
| ------------- | ----------------------------- | -------- | ---- | -------------------------------------- |
| modelValue    | `string \| number \| boolean` | `false`  | 否   | 受控值，等于 trueValue 时视为选中      |
| trueValue     | `string \| number \| boolean` | `true`   | 否   | 选中值                                 |
| falseValue    | `string \| number \| boolean` | `false`  | 否   | 未选中值                               |
| shape         | `'circle' \| 'square' \| 'button'` | `circle` | 否   | 形态                                   |
| type          | `'Default' \| 'Bar'`           | `Default` | 否   | 样式类型：Default 为原样式，Bar 为整行条形样式 |
| checkedColor  | `string`                      | -        | 否   | 选中时颜色（currentColor）             |
| disabled      | `boolean`                     | `false`  | 否   | 禁用                                   |
| size          | `string`                      | -        | 否   | 尺寸，可传 `large`                     |
| inline        | `boolean`                     | `false`  | 否   | 行内显示                               |
| maxWidth      | `string`                      | -        | 否   | 文案最大宽度，如 `120px`               |
| customClass   | `string`                      | `''`     | 否   | 根节点类名                             |
| customStyle   | `string`                      | `''`     | 否   | 根节点内联样式                         |
| customLabelClass | `string`                   | `''`     | 否   | 文案区额外类名                         |
| customShapeClass | `string`                   | `''`     | 否   | 形状区额外类名                         |

### Events

| 事件名            | 参数                               | 说明                   |
| ----------------- | ---------------------------------- | ---------------------- |
| update:modelValue | `(value: string \| number \| boolean)` | v-model 更新事件       |
| change            | `({ value: string \| number \| boolean })` | 变更事件（语义化包装） |

### Slots

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 文案内容 | -    |

### Methods

#### toggle

函数签名：

function toggle(): void

用途：切换当前选中状态（受控地发出更新事件） 公开：是

### Watches

无

## 其它

- 当前组件不包含分组（Group）逻辑，后续如需支持可通过 provide/inject 扩展。

## 用法示例

默认样式：

<pu-checkbox v-model="checked">默认样式</pu-checkbox>

Bar 样式：

<pu-checkbox v-model="checked" type="Bar">标签文本</pu-checkbox>
