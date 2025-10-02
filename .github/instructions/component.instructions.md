---
applyTo: "**/components/**/*.vue, **/components/**"
---

当创建或修改 Vue 组件时，请遵循本规范。

## 文件结构

每个组件存放在独立的文件夹（`compName/`）中，有下列文件：

- `compName.vue`: 主组件文件，包含组件的模板、脚本和样式引用
- `compName.ts`: 组件类型定义文件，包含：
  - 组件 Props 类型定义
  - 组件 Emits 事件定义
  - 组件内部使用的类型定义
  - 组件相关的工具函数
  - 组件相关的常量定义
- `compName.scss`: 组件样式文件，包含组件的所有样式定义
- `compName.md`: 组件文档，包含组件的使用说明、API 文档、示例等

组件的名称如果和内置的元素名称冲突，请加上前缀 `PU`

### compName.vue

```vue
<script lang="ts">
export default {
  name: "CompName",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { compNameProps, compNameEmits } from "./<compName>";

const props = defineProps(compNameProps);
// const model = defineModel({ type: String }); use defineModel for v-model
const emit = defineEmits(compNameEmits);
</script>

<style lang="scss" scoped src="./compName.scss"></style>
```

当你修改 `compName.vue` 时，遵循[该规则](.github/instructions/vue.instructions.md)

### compName.ts

```typescript
import type { PropType } from "vue";
import { makeStringProp } from "@/utils/props";  // use utils for defining props

// ==================== 组件 Props 定义 ====================
export const compNameProps = {
  propName: makeStringProp<"option1" | "option2">("option1"),
  requiredProp: {
    type: Object as PropType<SomeInterface>,
    required: true,
  },
};

// ==================== 组件 Emits 定义 ====================
export const compNameEmits = {
  eventName: (param: ParamType) => boolean;
  "update:modelValue": (value: ValueType) => true;
};

// ==================== 组件工具函数 ====================
export function helperFunction() {
  // ...
}
```

### compName.scss

```scss
@use "@/styles/main.scss" as *;

// component styles here, see style.instructions.md for details
// remember to use design tokens
```

### compName.md

````markdown
# compName 组件中文名

## Rationale

这个组件存在的原由。

## Goals

组件的目标（如功能）。

## Specification

对组件目标的进一步细化，包括界面、交互、功能细节等。

## Implementation

组件的实现细节。

### Props

| 属性名       | 类型                     | 默认值      | 必填 | 说明         |
| ------------ | ------------------------ | ----------- | ---- | ------------ |
| propName     | `'option1' \| 'option2'` | `'option1'` | 否   | 属性说明     |
| requiredProp | `SomeInterface`          | -           | 是   | 必需属性说明 |

### Events

| 事件名            | 参数                 | 说明             |
| ----------------- | -------------------- | ---------------- |
| eventName         | `(param: ParamType)` | 事件说明         |
| update:modelValue | `(value: ValueType)` | v-model 更新事件 |

### Slots

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 默认插槽 | -    |
| header  | 头部插槽 | -    |

### Methods

#### methodName

函数签名：

```ts
function methodName(param: ParamType): ReturnType {}
```

用途：
公开：是/否

### Watches

## 其它

注意事项
````

编写文档时注意：

- 不应该包含使用示例和任何实际代码
- 文档的读者是 Coding Agent ，确保 Token Efficiency

## 最佳实践

### 组件设计

- 单一职责原则
- 高内聚低耦合
- 便于测试和维护
- 清晰的 API 设计

### 业务逻辑

- API 请求实现在对应数据模型类的方法上 [参考](.github/instructions/business.instructions.md)

### 状态管理

- 避免 prop drilling
- 合理使用 provide/inject

### 错误处理

- 优雅降级处理
- 用户友好的错误提示
- 错误边界组件
- 日志记录
