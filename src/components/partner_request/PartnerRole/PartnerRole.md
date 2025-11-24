# PartnerRole 组件

## Rationale

PartnerRole 组件用于显示搭子请求中的角色信息，包括角色 ID、名称和描述。

## Goals

- 显示角色标识符
- 显示角色名称
- 显示角色权利和义务说明

## Specification

组件显示一个带有边框的容器，内部包含角色 ID 和名称在一行，描述在下一行。

## Implementation

组件使用 Vue 3 Composition API，接受三个字符串 Props。

### Props

| 属性名 | 类型       | 默认值 | 必填 | 说明     |
| ------ | ---------- | ------ | ---- | -------- |
| role   | PartnerRole | -      | 是   | 角色对象 |

### Events

无

### Slots

无

### Methods

无

### Watches

无

## 其它

无
