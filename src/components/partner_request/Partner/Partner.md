# Partner 组件

## Rationale

表示搭子请求中的单个“角色/伙伴”行，支持折叠与展开、默认展示与编辑两种模式。

## Goals

- 展示角色元信息（编号、名称、扮演状态）
- 展开后显示规则文本
- 编辑模式支持输入/编辑规则文本

## Specification

- 折叠：单行布局；展开：纵向布局显示规则与编辑器
- 扮演状态包含：已被他人扮演、由你扮演、等待扮演
- 右侧在默认模式显示折叠箭头切换展开/折叠；编辑模式不显示箭头，改为仅图标的删除按钮

## Implementation

### Props

| 属性名     | 类型                                     | 默认值   | 必填 | 说明                   |
| ---------- | ---------------------------------------- | -------- | ---- | ---------------------- |
| id         | `string`                                 | `"#N"`  | 否   | 角色编号               |
| roleName   | `string`                                 | `"角色名称"` | 否   | 角色名称               |
| roleRule   | `string`                                 | `"角色的权利与义务明细"` | 否   | 规则说明首行           |
| played     | `'True' \| 'False' \| 'You'`           | `'False'`| 否   | 扮演状态               |
| state      | `'Fold' \| 'Expand'`                    | `'Fold'` | 否   | 展开/折叠              |
| type       | `'Default' \| 'Editor'`                 | `'Default'` | 否 | 展示或编辑模式         |
| modelValue | `string`                                 | `""`    | 否   | 编辑器内容（v-model）  |

### Events

| 事件名           | 参数                        | 说明            |
| ---------------- | --------------------------- | --------------- |
| toggle           | `(next: 'Fold'\|'Expand')`  | 切换展开状态    |
| update:state     | `(next: 'Fold'\|'Expand')`  | v-model:state   |
| update:modelValue| `(value: string)`           | v-model 内容    |
| input            | `(value: string)`           | 输入回调        |
| delete           | `(partner: Partner)`        | 编辑模式删除项  |

### Slots

无

### Methods

无

### Watches

无

## 其它

遵循组件与样式指南，使用设计代币与 UnoCSS 图标类。
