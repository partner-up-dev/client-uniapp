# PUNoticeBar 通知栏

## Rationale

通知栏组件，用于在页面中展示重要提示或消息，替代第三方 UI 库的 wd-notice-bar 组件。

## Goals

提供一个灵活的通知栏组件，支持：
- 水平和垂直滚动
- 自定义颜色和背景色
- 前缀图标
- 可关闭
- 文本数组轮播（垂直模式）

## Specification

组件支持水平滚动文本或垂直切换文本列表。可以自定义背景色、文字颜色、前缀图标，并支持关闭功能。

## Implementation

基于 Vue 3 Composition API 实现，使用设计代币进行样式管理。

### Props

- `text` (`string | string[]`)：通知文本，可以是字符串或字符串数组
- `prefix` (`string`、默认 `""`)：前缀图标名称（mdi 图标）
- `backgroundColor` (`string`、默认 `"#fef0f0"`)：背景色
- `color` (`string`、默认 `"#f56c6c"`)：文字颜色
- `direction` (`"horizontal" | "vertical"`、默认 `"horizontal"`)：滚动方向
- `scrollable` (`boolean`、默认 `true`)：是否启用滚动动画（水平模式）
- `closeable` (`boolean`、默认 `false`)：是否显示关闭按钮
- `wrapable` (`boolean`、默认 `false`)：是否允许文本换行

### Events

- `close()`: 关闭按钮点击时触发
- `click()`: 通知栏点击时触发

### Slots

无插槽。

### Methods

无公开方法。

### Watches

垂直模式下会自动轮播文本数组（每 3 秒切换一次）。
