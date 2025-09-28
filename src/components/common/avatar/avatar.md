# 组件 Avatar 文档

## Rationale

统一的头像展示组件，封装加载、失败回退、角标与可编辑上传能力，避免在页面中重复实现。

## Goals

- 标准化的头像尺寸与圆角
- 角标数值展示
- 可编辑：选择、裁剪并交由上传回调处理
- 加载与错误状态占位

## Specification

基于 wot-design-uni 的 wd-img、wd-badge、wd-img-cropper 实现。样式使用项目设计代币（SCSS Token）。

## Implementation

使用 Vue 3 `<script setup>` 与 Composition API。对外暴露 Props，不定义自定义事件。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| src | `string \| null` | `DEFAULT_ACCOUNT_AVATAR` | 否 | 头像图片源地址 |
| badge | `number` | `0` | 否 | 右下角角标数字，0时不显示 |
| badgeMax | `number` | `99` | 否 | 角标最大值，超过显示为99+ |
| size | `'xSmall' \| 'Small' \| 'Medium' \| 'Large'` | `'Small'` | 否 | 头像尺寸 |
| radius | `'None' \| 'Xs' \| 'Sm' \| 'Med' \| 'Lg' \| 'Full'` | `'Full'` | 否 | 头像圆角大小 |
| editable | `boolean` | `false` | 否 | 是否可编辑 |
| upload | `(fp: string) => Promise<string>` | - | 否 | 上传函数，用于处理裁剪后的图片上传 |

### Events

无自定义事件。

### Slots

无插槽。

### Methods

#### onImgClick

函数签名：

```ts
function onImgClick(): void {}
```

用途：处理头像点击事件，可编辑模式下触发图片选择
公开：否

#### onCropperConfirm

函数签名：

```ts
function onCropperConfirm({tempFilePath}: {tempFilePath: string}): void {}
```

用途：处理图片裁剪确认事件，调用上传函数
公开：否

### Watches

无监听器。

## 其它

- 依赖组件：wd-img、wd-badge、wd-img-cropper、wd-icon、wd-loading
- 可编辑模式下显示相机图标与半透明遮罩
- 为避免缓存，内部以时间戳参数刷新图片
- 编辑功能依赖 `uni.chooseImage`
- 建议提供有效 `src` 默认值
