# partnersEditor 搭子列表编辑器

## Rationale

在创建或编辑搭子请求时，需要管理搭子列表（PartnerRequestForm 的 partners 字段）。
用户需要能够添加、编辑、删除多个搭子角色。

## Goals

提供一个统一的搭子列表管理界面，支持：

- 显示已添加的搭子列表
- 添加新的搭子角色
- 编辑已有搭子的角色和扮演者
- 删除搭子

## Key Concepts

- `PartnerForm`: 搭子表单数据，包含 role (角色 ID) 和 player (扮演者账户 ID)
- `PartnerRequestForm.partners`: 搭子列表，至少需要 2 个搭子

## Specification

### 用户界面

组件呈现为垂直列表：

- 每个已添加的搭子使用 `partnerEditor` 组件显示
- 底部有"添加搭子"按钮（使用 PUButton）
- 所有搭子使用 flex-col 布局，间距为 `$pu-spacing-sm`

### 交互行为

1. 点击某个 partnerEditor 的左侧文本：弹出 partnerPicker 选择新角色（单选模式）
2. 点击 partnerEditor 的"我将扮演"按钮：切换该搭子的扮演者
3. 点击 partnerEditor 的删除按钮：从列表中移除该搭子（需满足最少 2 个搭子的约束）
4. 点击"添加搭子"按钮：弹出 partnerPicker 选择角色，选中后添加新的 PartnerForm 到列表

### 验证规则

- 至少需要 2 个搭子（删除时如果只剩 2 个则禁用删除按钮或提示）

## Implementation

### Props

- `prType` (`PRType`, required): 搭子请求类型，用于获取可用角色列表

### Models

- `modelValue` (`PartnerForm[]`, required): 搭子列表数据

## 其它

- 使用 `partnerEditor` 组件渲染每个搭子并提供删除、"我来扮演"、选择搭子角色的功能
- 使用 `partnerPicker` 组件选择角色（单选模式）
- 使用 `PUButton` 实现"添加搭子"按钮
- 删除操作需检查至少保留 2 个搭子
- 组件内部维护 partnerPicker 的显示状态
