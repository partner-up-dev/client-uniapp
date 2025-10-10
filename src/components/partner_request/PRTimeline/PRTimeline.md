# PRTimeline 时间线组件

## Rationale

PRTimeline 是搭子请求的时间线组件，用于显示搭子请求从创建到完成的整个状态流程。

## Goals

- 展示搭子请求的进展
- 提供适合的快捷操作
- 清晰区分过去、当前和未来的状态

## Key Concepts

- PRStatus: 搭子请求状态

## Specification

### 信息架构

- 按状态顺序显示时间线项

### 界面设计

垂直时间线布局，每个状态占一个时间线项。

## Implementation

### Props

- currentStatus (`PRStatus`, required): 当前状态

### 依赖组件

- PRTimelineItem: 时间线项组件

## TODO

- [ ] 缺陷: 状态之间的流转不是线性的
- [ ] 缺陷: 没有记录状态切换
