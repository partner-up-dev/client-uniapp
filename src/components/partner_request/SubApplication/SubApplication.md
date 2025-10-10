# SubApplication 子申请

## Rationale

全称 PartnerSubApplication ，即搭子申请 (PartnerApplication) 的子申请。
每个子申请申请一个角色，并附上申请理由。

## Goals

- 显示搭子角色的信息（唯一标识、名称和规则）
- 在编辑模式下允许用户编辑申请理由
- 在编辑模式下提供删除按钮以将该表单项从 PartnerApplication 表单中删除
- 在只读模式下提供展开查看更多详情的功能
- 提供表单数据获取接口，便于父组件收集所有子申请数据

## Key Concepts

- 搭子请求（Partner Request）
- 搭子申请子申请（Sub Application）
- 搭子角色（Partner Role）

## Specification

### UI 结构

- Header：
  - 左侧：显示搭子角色 ID（格式：`#<role.id>`）和角色名称
  - 右侧：根据是否可编辑显示删除按钮（可编辑）或展开按钮（不可编辑）

- Content：
  - 显示角色规则描述
  - 可编辑时显示 textarea 用于编辑申请理由
  - 不可编辑时显示用户提交的申请理由

### 行为

- 编辑模式：用户可以编辑申请理由；点击删除按钮触发删除事件
- 只读模式：组件显示为卡片样式，点击展开按钮弹出底部抽屉，抽屉中即 Content

## Implementation

### Props

- `partner`: 类型 `Partner`；必须的
- `partnerRole`: 类型`PartnerRole`；可选的，不传则用 `partner.role` 通过API获取
- `editable`: 是否可编辑；类型布尔；默认真

### Events

- `delete(subApplication: PartnerSubApplication)`: 点击删除按钮时触发

### Methods

- `getForm(): PartnerSubApplication`: 获取当前表单数据
