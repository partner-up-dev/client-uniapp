# PUTextarea 文本域组件

## Rationale

提供跨小程序平台一致的文本域输入体验，封装常用交互与样式，复用设计代币。

## Goals

- 封装 uni-app 原生 textarea，统一样式与状态
- 支持 v-model、占位提示、自动高度、字符计数
- 聚焦时可按设计规范扩展高度

## Specification

- 容器采用 surface container 背景与 outline 边框
- 输入内容使用 on-surface 文本色，Label 与计数使用 on-surface-variant
- 聚焦态支持设置聚焦高度
- 小程序限制：不使用通配选择器，不直接以标签名作为样式选择器

## Implementation

封装一层容器，内部绑定原生 textarea 属性与事件，提供插槽扩展。

### Props

| 属性名                 | 类型                                   | 默认值   | 必填 | 说明                                   |
| ---------------------- | -------------------------------------- | -------- | ---- | -------------------------------------- |
| modelValue             | `string`                               | `''`     | 否   | 双向绑定值                              |
| placeholder            | `string`                               | `'请输入...'` | 否   | 占位提示                               |
| maxlength              | `number \| string`                     | `-1`     | 否   | 最大长度，`-1` 表示不限制               |
| showCount              | `boolean`                              | `false`  | 否   | 是否展示字符计数                        |
| autoHeight             | `boolean`                              | `false`  | 否   | 自动高度                                |
| disabled               | `boolean`                              | `false`  | 否   | 禁用                                    |
| readonly               | `boolean`                              | `false`  | 否   | 只读                                    |
| focus                  | `boolean`                              | `false`  | 否   | 自动聚焦                                |
| confirmType            | `'send'\|'search'\|'next'\|'go'\|'done'` | `'done'` | 否   | 键盘确认按钮类型                        |
| showConfirmBar         | `boolean`                              | `true`   | 否   | 显示键盘上方的完成栏                    |
| holdKeyboard           | `boolean`                              | `false`  | 否   | 失焦后是否保持键盘不收起                |
| cursorSpacing          | `number`                               | `16`     | 否   | 光标与键盘的距离                        |
| adjustPosition         | `boolean`                              | `true`   | 否   | 键盘遮挡时自动上推页面                  |
| fixed                  | `boolean`                              | `false`  | 否   | 如果 position:fixed 时，fixed 需为 true |
| disableDefaultPadding  | `boolean`                              | `false`  | 否   | 是否去除默认内边距                      |
| height                 | `number`                               | `80`     | 否   | 容器最小高度（px）                      |
| focusHeight            | `number \| undefined`                  | `undefined` | 否   | 聚焦时最小高度，未设置则使用 height     |
| customStyle            | `string`                               | `''`     | 否   | 自定义根节点样式                        |

### Events

| 事件名            | 参数             | 说明               |
| ----------------- | ---------------- | ------------------ |
| update:modelValue | `(value: string)`| v-model 更新事件   |
| input             | `(value: string)`| 输入事件           |
| focus             | `(e: any)`       | 聚焦               |
| blur              | `(e: any)`       | 失焦               |
| confirm           | `(e: any)`       | 点击确认           |
| linechange        | `(e: any)`       | 行数变化           |

### Slots

| 插槽名  | 说明           | 参数 |
| ------- | -------------- | ---- |
| label   | 文本域上方标签 | -    |

### Methods

无对外公开方法。

### Watches

- 监听 `modelValue` 同步内部值

## 其它

遵循组件/样式开发规范；如需运行时动态图标，请在 `uno.config.ts` 的 safelist 中声明。
