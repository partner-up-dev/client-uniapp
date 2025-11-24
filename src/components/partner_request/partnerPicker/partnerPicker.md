# partnerPicker 搭子选择器

## Rationale

用于选择搭子角色角色（PartnerRole）。通常用于搭子编辑器选择角色。

## Goals

- 提供统一的搭子角色选择界面
- 列出指定搭子请求类型可用的的所有搭子角色（PartnerRole）
- 支持单选和多选模式
- 使用 PUDrawer 作为底层容器

## Key Concepts

- PartnerRole: 搭子角色，定义角色的权利与义务

## Specification

组件通过 PUDrawer 从底部弹出，列出指定搭子请求类型的所有搭子角色。
每个搭子角色使用 PartnerRole 组件渲染，显示角色名称、角色描述。

### UI/UX

- 使用 PUDrawer 作为容器，从底部弹出
- 标题显示"选择搭子角色"
- 内容区域使用 flex-col 列出有搭子角色
- 单选模式：点击搭子后立即选中并关闭抽屉
- 多选模式：点击搭子切换选中状态，需要点击确认按钮提交选择

### 行为

- 单选模式：点击任一 PartnerRole 后触发 `select` 事件并自动关闭
- 多选模式：点击 PartnerRole 切换选中状态，底部显示确认按钮，点击确认后触发 `confirm` 事件
- 支持 `v-model:visible` 控制显示隐藏

## Implementation

### Props

- `visible` (`boolean`, `false`): 是否显示抽屉
- `prType` (`PRType`, required): 搭子请求类型
- `mode` (`'single' | 'multiple'`, `'single'`): 选择模式
- `modelValue` : 已选中的搭子角色ID
- `height` (`string`, `'60vh'`): 抽屉高度

### Events

- `select(partnerRole: PartnerRole)`: 单选模式下选中搭子时触发
- `confirm(partnerRoles: PartnerRole[])`: 多选模式下点击确认按钮时触发

### Models

- `visible`(`boolean`): 抽屉显示状态
- `modelValue`(`PartnerRoleRef | PartnerRoleRef[]`): 选中的搭子角色ID

### Slots

无

### Methods

无

### Watches

- `props.prId`: 当 PR ID 变化时，重新获取搭子列表

## 其它

- 使用 `PartnerRequest.getAvailablePartnerRoles` 获取搭子列表 （暂未实现后端接口，使用本地 MOCK 数据）
- 在单选模式下，`modelValue` 类型为 `PartnerRoleRef`
- 在多选模式下，`modelValue` 类型为 `PartnerRoleRef[]`
