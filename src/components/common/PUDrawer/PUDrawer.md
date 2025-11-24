# PUDrawer 抽屉组件

## Rationale

抽屉组件用于在页面底部显示临时内容，如选择器、表单等，提供良好的用户体验。

## Goals

- 提供通用的底部抽屉 UI
- 支持自定义标题和内容
- 易于集成和使用

## Specification

组件在 visible 为 true 时显示，从底部滑出，具有过渡动画。包含标题栏和关闭按钮，内容通过 slot 提供。同时显示一个铺满页面的半透明遮罩（scrim），点击遮罩可以关闭抽屉。

组件支持防止滚动穿透功能，在抽屉显示时默认锁定背景页面滚动（可通过 `lockScroll` 属性控制）。

## Implementation

使用固定定位，z-index 为 10，确保在页面顶部。

防止滚动穿透的实现：

- 在 H5 平台：通过 `useLockScroll` composable 动态设置 body 的 overflow 样式
- 在小程序平台：通过 `@touchmove` 事件阻止遮罩层的触摸移动事件传播

### Props

| 属性名 | 类型     | 默认值 | 必填 | 说明     |
| ------ | -------- | ------ | ---- | -------- |
| title  | `string` | `""`   | 否   | 抽屉标题 |
| visible| `boolean`| `false`| 否   | 是否显示 |
| height | `string` | `"60vh"`| 否   | 抽屉高度 |
| fullCustom | `boolean` | `false` | 否 | 是否完全自定义（使用 full slot） |
| lockScroll | `boolean` | `true` | 否 | 是否锁定背景滚动，防止滚动穿透 |

### Events

| 事件名 | 参数 | 说明         |
| ------ | ---- | ------------ |
| close  | -    | 关闭抽屉事件 |

### Slots

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 抽屉内容 | -    |

### Methods

无

### Watches

无

## 其它

注意事项：内容样式需由使用者提供。
