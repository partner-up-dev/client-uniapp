# Account

## Rationale

在界面中统一展示用户基本身份信息（头像 + 昵称），提供默认样式与带背景的标签样式，便于在卡片、列表与标签场景复用。

## Goals

- 显示用户头像与昵称
- 支持默认与标签两种展示风格
- 与现有 Avatar 组件无缝协作
- 遵循设计代币与小程序选择器限制

## Specification

- 布局：水平排列，左侧头像，右侧昵称，间距为设计代币 xsmall
- 字体：使用 Label/Small（10/16）
- 头像：支持尺寸与圆角，默认 small + full
- 类型 Default：透明背景，无内边距
- 类型 Tag：使用 surface-container-highest 背景，内边距为 4px 8px

## Implementation

基于 Vue3 + UniApp。复用通用 Avatar 组件；通过 type 切换容器背景与 padding；样式使用 SCSS 设计代币。

### Props

| 属性名       | 类型                                 | 默认值        | 必填 | 说明                 |
| ------------ | ------------------------------------ | ------------- | ---- | -------------------- |
| nickname     | `string`                             | `"用户昵称"` | 否   | 昵称文案             |
| avatarSrc    | `string \| null`                     | `null`        | 否   | 头像图片链接         |
| type         | `'Default' \| 'Tag'`                 | `'Default'`   | 否   | 展示风格             |
| size         | `'xSmall'\| 'small'\| 'medium'\| 'large'\| 'xLarge'` | `'small'`    | 否   | 头像尺寸（代币）     |
| avatarRadius | `'none'\| 'xs'\| 'sm'\| 'med'\| 'lg'\| 'full'`    | `'full'`     | 否   | 头像圆角（代币）     |
| customStyle  | `string`                             | `''`          | 否   | 根容器内联样式       |
| customClass  | `string`                             | `''`          | 否   | 根容器样式类         |

### Events

| 事件名 | 参数 | 说明         |
| ------ | ---- | ------------ |
| click  | `-`  | 点击根容器触发 |

### Slots

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 默认插槽 | -    |

### Methods

无公开方法。

### Watches

无特殊监听。

## 其它

- 字体与颜色严格使用设计代币
- 仅使用类选择器，避免小程序限制问题
