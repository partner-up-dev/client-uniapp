---
applyTo: "**/components/**/*.md"
---

本指南指导组件文档的编写、阅读。

## 编写文档

文档的读者是 Coding Agent ，注意 Token Efficiency

## 文档模板

```markdown
# compName 组件中文名

## Rationale

为什么需要这个组件。

## Goals

组件的目标（核心功能）。

## Key Concepts

组件的关键概念，主要是专有名词如业务逻辑。（仅罗列即可，查阅详情到 `docs/` 目录）

## Specification

对组件目标的细化，包括内容、UI/UX、行为等。

## Implementation

组件的实现细节。

### Props

- 参数名:类型、默认值、是否必填、注释等

#### 参数名

> 仅当参数比较复杂时。

### Events

- `eventName(param: ParamType)`: 说明

#### 事件名

> 仅当事件比较复杂时。

### Models

- `modelValue`：类型、默认值、说明

#### 双向绑定模型名

> 仅当双向绑定模型比较复杂时。

### Slots

- `default`：说明
- `header`：说明

#### 插槽名

> 仅当插槽比较复杂时。

### Methods

- `methodName(param: ParamType): ReturnType {}`：说明

#### 方法名

> 仅当方法比较复杂时。

### Watches

- `props.propName`：说明 callback 行为
- `refValue`：说明 callback 行为

#### 监听项

> 仅当监听项比较复杂时。

## 其它

注意事项
```
