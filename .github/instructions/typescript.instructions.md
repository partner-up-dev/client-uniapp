---
applyTo: "**/*.ts, **/*.vue"
---

本指南规范 TypeScript 代码的编写

## 类型注释

- 避免使用 `any`, `as` 和 `// @ts-ignore`。
- 对于 UniApp API 与内置组件类型：
  ```ts
  // 严格遵循该格式来使用 uni-app-types
  import type { <typesYouWant> } from "@uni-helper/uni-app-types";
  ```

## 异步

尽可能使用 `Promise.then().catch()` ，而不要使用 `await/async`
