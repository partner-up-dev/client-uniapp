# PUImg

## Rationale

替代已不可用的 wd-img 组件，提供统一的图片加载、错误占位与尺寸控制能力，兼容现有用法。

## Goals

- 支持基础图片展示与裁剪模式（mode）
- 显示加载与错误占位（可自定义插槽）
- 兼容 wd-img 的常用 Props/Slots/Events（customClass、customImage 等）
- 体积小、零依赖、易于维护

## Specification

- Props
  - src: string — 图片地址
  - mode: ImageMode — 显示模式，默认 aspectFill
  - showLoading: boolean — 是否显示加载占位，默认 true
  - showError: boolean — 是否显示错误占位，默认 true
  - size: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge' — 使用设计代币控制方形尺寸，优先于 width/height
  - width, height: number | string — 容器尺寸，可传 px/百分比等
  - customClass: string — 外层容器自定义类名
  - customImage: string — 图片元素自定义类名
  - lazyLoad: boolean — 是否懒加载，默认 true
  - radius: 'none' | 'xs' | 'sm' | 'med' | 'lg' | 'full' — 圆角半径，默认 none
- Emits
  - load(evt)
  - error(evt)
- Slots
  - loading — 自定义加载状态内容
  - error — 自定义错误状态内容

## Implementation

- 使用 uniapp 的 image 组件作为渲染节点；通过内部状态控制加载/错误占位显示
- 提供 rootStyle 组合宽高；自定义类名透传给容器与 image
- 监听 onLoad/onError 触发对应事件

### Props

详见 PUImg.ts

### Events

详见 PUImg.ts

### Slots

loading, error
