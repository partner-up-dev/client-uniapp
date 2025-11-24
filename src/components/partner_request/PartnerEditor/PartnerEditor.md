# PartnerEditor 搭子角色编辑器

## Rationale

在创建搭子请求时，需要定义有哪些搭子（如"乘客"、"司机"、"网约车下单"等）。

## Goals

提供一个搭子编辑界面，用于：

- 选择搭子角色
- 设置自己扮演
- 删除角色

## Key Concepts

- `Partner`: 搭子，包含角色和扮演者信息
- `PartnerRole`: 搭子角色

## Specification

### 用户界面

组件呈现为单行编辑器，包含：

- 左侧文本：
  - 未选择角色时：显示"需要一位" + "点击选择"（高亮色）
  - 已选择角色且我不扮演：显示"需要一位" + 角色名（高亮色）
  - 已选择角色且我扮演：显示"你将扮演" + 角色名（高亮色）
- 右侧按钮：
  - "我将扮演"按钮（hand icon）：
    - 仅在已选择角色时显示
    - icon 在未选中时为 outline 样式，选中时为 filled 样式
    - 点击时将 `player` 设置为当前用户 ID，再次点击则清空
  - 删除按钮（close icon）：移除此搭子角色

### 交互行为

1. 点击左侧文本区域：触发角色选择器（需要外部提供角色列表）
2. 点击"我将扮演"按钮：将 `player` 设置为当前用户账户 ID，如果已是当前用户则清空
3. 点击删除按钮：触发删除事件

### 视觉样式

- 背景色：`$pu-color-surface-container`
- 内边距：`$pu-spacing-med` (horizontal) × `$pu-spacing-sm` (vertical)
- 角色名文字：`$pu-color-tertiary`
- 其它文字：`$pu-color-on-surface-variant`
- 字体：`label-large`（14px/20px）

## Implementation

### Props

- `role` (`PartnerRoleRef | null`, `null`): 搭子角色 ID，null 表示未选择
- `player` (`AccountRef | null`, `null`): 扮演此角色的账户 ID，null 表示无人扮演

### Events

- `update:role(roleId: PartnerRoleRef | null)`: 角色更改
- `update:player(accountId: AccountRef | null)`: 扮演者更改
- `selectRole`: 点击左侧文本区域时（用于触发角色选择器）
- `remove`: 点击删除按钮

### Models

- `role`: `PartnerRoleRef | null` 双向绑定角色 ID
- `player`: `AccountRef | null` 双向绑定扮演者账户 ID

## 其它

- 使用 `PartnerRole.use()` 获取搭子角色
- 使用 `useAccountStore()` 获取当前用户 ID 和判断是否为当前用户
- 点击"我将扮演"按钮时，会自动设置 `player` 为当前用户的账户 ID，再次点击则清空
- 组件不自带角色选择器，需要父组件通过监听 `selectRole` 事件来显示选择器
- 删除操作仅触发事件，具体删除逻辑由父组件处理
