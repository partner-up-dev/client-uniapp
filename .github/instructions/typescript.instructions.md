---
applyTo: "**/*.ts, **/*.vue"
---

本指南规范类型注释。

## 基本原则

- 避免使用 `any`, `as` 和 `// @ts-ignore`。

## 组件类型

### UniApp API 与内置组件类型

```ts
// 严格遵循该格式来使用 uni-app-types
import type { <typesYouWant>} from "@uni-helper/uni-app-types";
```
