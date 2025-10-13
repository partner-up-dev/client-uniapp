# PUTabs 标签页组

## Rationale

在多个 `PUTab` 组件基础上，提供一组可切换的标签页，用于在不同视图之间进行导航或展示不同分类内容的入口。

## Goals

- 传入标签数据数组动态渲染标签项
- 支持点击切换，并高亮当前活动项
- 多尺寸（Large / Medium / Small）
- 支持 v-model 双向绑定活动索引

## Specification

### 视觉

- 非活动标签项，应用 opacity: invalid

## Implementation

### Types

```typescript
interface Tab {
  text: string; 
  showDot?: boolean;
}
```

### Props

- `tabs` (Tab[], required): 标签项数据列表
- `modelValue` (number, default: 0): 当前活动标签的索引
- `size` ('Large' | 'Medium' | 'Small', default: 'Medium')

### Events

- `update:modelValue` (newIndex: number)
- `change` (newIndex: number)

### 依赖组件

- PUTab: 渲染单个标签页
