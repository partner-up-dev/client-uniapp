---
applyTo: "**/components/**/*.vue, **/components/**"
---

当创建或修改 Vue 组件时，遵循本规范。
如果你只是要使用该组件，只需要查看 `compName.ts`, `compName.md` 即可。

## 文件结构

每个组件存放在独立的文件夹（`compName/`）中，有下列文件：

- `compName.vue`: 组件主文件
- `compName.ts`: 组件类型、常量、工具函数定义文件
- `compName.scss`: 组件样式文件
- `compName.md`: 组件文档

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

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

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

// remember to use design tokens
// component styles here, see .github/instructions/style.instructions.md for details
```

### compName.md

转到 [组件文档编写指南](.github/instructions/comp-doc.instructions.md)

## 业务逻辑

转到:

- [业务逻辑使用指南](.github/instructions/use-business.instructions.md)
- [业务逻辑编写指南](.github/instructions/business.instructions.md)

## 最佳实践

### 组件设计

- 单一职责原则
- 高内聚低耦合
- 便于测试和维护
- 清晰的 API 设计

### 状态管理

- 避免 prop drilling
- 合理使用 provide/inject

### 错误处理

- 优雅降级处理
- 用户友好的错误提示
- 错误边界组件
- 日志记录
