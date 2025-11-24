# PRTimelineItem 时间线项组件

## Rationale

PRTimelineItem 是 PRTimeline 组件的元素组件。
作为时间线的一部分，每个组件实例对应一个特定的搭子请求状态（PRStatus）。

## Goals

- 描述给定的搭子请求状态
- 说明该搭子请求状态的状态：过去、当前、未来
- 处于当前状态时，为用户提供快捷操作

## Key Concepts

- PRStatus: 搭子请求状态

## Specification

### 信息架构

- 状态标题：名称、标识作用；收起时也显示；重要程度1
- 状态描述：解释、说明该搭子请求状态；收起时隐藏；重要程度1
- 状态开始、结束时间：收起时隐藏；过去状态才有开始和结束，当前状态只有开始，未来状态都没有；重要程度0
- 快捷操作
  - 多个，不超过三个
  - 推荐操作放在第一个

### 界面设计

基于卡片，可以展开/收起。

通过透明度、边框的不同，表现出搭子请求状态的状态：

- 对于过去状态，收起时Header用 invalid opactity, 操作套用 disabled opacity
- 对于当前状态，添加主题色边框
  - 例外：当当前状态为终止状态（已取消、已合并、已关闭）时，不添加边框
- 对于未来状态，操作套用 disabled opacity

快捷操作：

- 推荐操作有 suffixIcon ，是 `i-mdi-chevron-right`
- 条目状态为当前时，推荐操作有 PrimaryContainer background ，用于高亮操作

## Implementation

### Props

- type (`PRStatus`, required): 类型，即搭子请求状态
- state (`'future' | 'current' | 'past'`, required): 时间线项的状态

### Models

- expand (`boolean`, default `false`): 控制展开
  - set to `true` when state is `current` when setting up component

### Emits

- `update:expand`: 当展开状态改变时触发
- `action`: 当用户点击操作按钮时触发，传递操作的key

### 国际化

```typescript
// PRTimelineItemTypes.ts 
interface PRTimelineItemContent {
  title: string;      // 状态标题
  description: string; // 状态说明
  actions: {[key: string]: string};  // 操作
}
```

```typescript
// src/locale/zh-Hans/partner_request/index.ts
pr_timeline_item: {
  // 从 `PRStatus` 映射到 `PRTimelineItemContent`
  [PRStatus.Draft]: {
    title: "草稿",
    description: "搭子请求处于草稿状态，需要完善信息后发布",
    actions: { ... }
  },
  // ... 其他状态
}
```
