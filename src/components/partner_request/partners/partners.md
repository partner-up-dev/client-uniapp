# Partners Component

## Rationale

Partners 组件用于显示参与者头像列表。

## Goals

- 显示所有参与者的头像
- 使用 Avatar 组件显示头像，尺寸为 xSmall
- 通过 AccountBaseProfile.get 异步获取用户头像

## Specification

组件显示所有参与者头像的圆形列表。头像通过异步 API 获取并缓存。

### Props

| 属性名    | 类型            | 默认值 | 必填 | 说明             |
| --------- | --------------- | ------ | ---- | ---------------- |
| partners  | `AccountRef[]`  | `[]`   | 否   | 参与者 ID 列表   |
| joinable  | `boolean`       | `false`| 否   | 是否可加入       |

### Events

无

### Slots

无

### Methods

无

### Watches

无

## 其它

注意事项：显示所有参与者头像，无数量限制。头像异步加载，初始显示为空。
