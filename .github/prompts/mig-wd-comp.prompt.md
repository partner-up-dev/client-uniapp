---
mode: agent
description: Migrate wot-design-uni component
---

- 本项目没有 `b`, `e`, `when` 等 mixins，使用 SCSS 嵌套语法、`&` 代替
- `index.scss` 即 `compName.scss`, `types.ts` 即 `compName.ts`
- 通过复用 `@partner-up-dev/design-uniapp` 包提供的 Design Tokens（自动注入）来迁移样式
