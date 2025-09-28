## Rationale

提供统一的页面返回图标按钮，点击即执行 `uni.navigateBack`。

## Goals

- 极简：只有一个图标
- 支持尺寸：small / medium / large

## Specification

- 结构：容器 + 图标（`i-mdi-arrow-left`）
- 尺寸：small=32px, medium=40px, large=48px；圆形背景
- 交互：点击调用 `uni.navigateBack({ delta:1 })`

## Implementation

仅暴露 `size` prop 控制容器宽高 class；模板中直接触发回退。

### Props

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| ---- | ---- | ------ | ---- | ---- |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 否 | 控件尺寸 |

### Events

无自定义事件。

### Slots

无。

## 其它

若需更复杂的行为，在外层包裹自定义逻辑即可。
