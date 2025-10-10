# Partner 搭子组件

## Goals

- 展示 Partner

## Key Concepts

- Partner: 搭子
- PartnerRole: 搭子角色

## Specification

组件用于展示 Partner。

### 用户界面

- 双行 (Header + Rule)，可折叠/展开

### 渲染 Partner

- 展示 PartnerRole 元信息（id、name）
- 展示 Partner 扮演状态，分为下列三种：
  - 已被他人扮演 (played-by-others) ，并展示扮演用户
  - 由你扮演 (played-by-you)
  - 空闲 (free)

## Implementation

### Props

- `partner`: 搭子
  - 类型：Partner
  - 必填
- `partnerRole`: 搭子角色
  - 类型：PartnerRole
  - 可选；若不传则根据 partner.role 通过 PRV1GetRole 获取
- `expand`: 展开状态
  - 类型：boolean
  - 默认：false

### Emits

- `update:expand(value: boolean)`: 展开状态更新

### Models

- `expand`：boolean 双向绑定展开状态，默认 false。

## 其它
