---
applyTo: "**/*.vue"
---

本指南指导如何在 Vue 组件中进行国际化。

基础使用：

```typescript
import { useTranslate } from "@/locale";

const { dt } = useTranslate("namespace");
```

创建条目：

- 与模板结构对齐
