# PRTypePicker 搭子请求类型选择器

## Rationale

在创建搭子请求时，用户需要选择搭子请求的类型。类型分为一级类型（L1Type：如出行、旅游）和二级类型（L2Type/PRType：如网约车、通勤等）。该组件提供统一的类型选择交互。

## Goals

- 以卡片形式展示搭子请求类型选项
- 支持横向和纵向滚动布局
- 支持一级类型（L1）和二级类型（L2）的展示
- 复用 Card 和 PUScrollView 组件实现一致的视觉风格

## Specification

### 内容

- 显示类型标题和描述（从 i18n 获取）
- 根据 `optionMode` 显示不同层级的类型

### UI/UX

- 两种布局模式：
  - `horizontal-card`：横向滚动卡片列表（默认）
  - `vertical-card`：纵向滚动卡片列表
- 支持边缘渐变效果（通过 `fade` prop 启用）
- 点击卡片时缩放动画

### 行为

- 点击卡片触发 `select` 事件，传递选中的类型

## Implementation

### 泛型组件

组件使用 Vue 3 泛型组件特性，根据 `option-mode` prop 自动推断 `select` 事件的类型：

- 当 `option-mode="l1"` 时，`select` 事件参数类型为 `PRL1Type`
- 当 `option-mode="l2"` 时，`select` 事件参数类型为 `PRType`

### Props

- `mode` (`DisplayMode`, `horizontal-card`)：显示模式，控制滚动方向
- `optionMode` (`OptionMode`, `l1`)：选项模式，控制显示一级或二级类型
- `l1Type` (`PRL1Type | undefined`, `undefined`)：一级类型，当 `optionMode` 为 `l2` 时必填
- `fade` (`boolean`, `false`)：是否启用边缘渐变效果
- `customStyle` (`string`, `""`)：自定义根节点样式
- `customClass` (`string`, `""`)：自定义根节点样式类

### Events

- `select(type: SelectType<T>)`：选中类型时触发，类型根据 `optionMode` 自动推断

### 使用示例

```vue
<!-- 使用 l1 模式，select 事件参数自动推断为 PRL1Type -->
<PRTypePicker
  option-mode="l1"
  @select="(type: PRL1Type) => handleL1Select(type)"
/>

<!-- 使用 l2 模式，select 事件参数自动推断为 PRType -->
<PRTypePicker
  option-mode="l2"
  :l1-type="PRL1Type.Trip"
  @select="(type: PRType) => handleL2Select(type)"
/>
```

## 其它

- 类型的标题和描述通过 `partner_request.type_display.title.*` 和 `partner_request.type_display.description.*` i18n 路径获取
- L1 到 L2 的类型映射定义在 `business/partner_request/index.ts` 的 `PRL1Type2PRType` 常量中
- 边缘渐变效果由 PUScrollView 组件实现
