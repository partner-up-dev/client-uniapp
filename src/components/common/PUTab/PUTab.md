# PUTab 标签页

## Rationale

`PUTab` 是标签/页签项，可以显示短文本标题及红点提示（未读/提醒）。

## Goals

- 渲染标签文本
- 支持显示红点（可隐藏）
- 支持三种尺寸（Large/Medium/Small）

## Specification

- 内容：短文本（标题）
- 可选：红点（showDot）
- 尺寸："large" | "medium" | "small"

### Visual spec

- Dot: color-red
  - size large: 12px / right: -3px, top: 3px
  - size medium: 10px / right: -2px, top: 1px
  - size small: 8px / right: -2px, top: 0px
- Text: color-surface-on / align center
  - size large: font-headline-large
  - size medium: font-title-large
  - size small: font-title-medium

## Implementation

### Props

- `text` (string, default: 'Tab')
- `showDot` (boolean, default: true)
- `size` ('Large' | 'Medium' | 'Small', default: 'large')
