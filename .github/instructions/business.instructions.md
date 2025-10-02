---
applyTo: "**/business/**"
---

本指南指导如何实现、维护业务逻辑模块。

## 文件结构

- `src/business`
  - `api.ts`: APIClient base class
  - `index.ts`: ValibotClass
  - `base/`: 共享业务逻辑模块
  - `account/`: 账户业务逻辑模块
  - `partner_request/`: 搭子请求业务逻辑模块

## 使用 Valibot

- 导入: `import * as v from "valibot";`
- 文档: https://valibot.dev/llms.txt
- 使用 `index.ts` 的 `V.class` ，通过继承定义数据模型类，而不是 `v.object`
- 使用 `index.ts` 的 `nullable` 替代 `v.nullable` ，从而设置该字段的默认值为 `null`
- 当字段类型为另一个 ValibotClass 时，使用 `field: v.instance(TheClass)` 而不是 `field: TheClass`
- 通过变量保存复杂的验证器

  ```typescript
  export class PartnerApplication extends V.class(v.object({
    ...
    sub_applications: v.pipe(v.array(v.instance(PartnerSubApplication)), v.minLength(1)),
  })) {}
  export class PartnerApplicationForm extends V.class(v.object({
    partner_request: PRRefV,
    sub_applications: v.pipe(v.array(v.instance(PartnerSubApplication)), v.minLength(1)),
  })) {}

  // 那就可以添加
  const SubApplicationsV = v.pipe(v.array(v.instance(PartnerSubApplication)), v.minLength(1));
  ```

## 命名规范

- 使用 `Ref` 后缀表示 ID 的类型
- 添加 `V` 后缀表示 valibot 模式
- 添加 `Prop` 后缀表示用于 Vue 组件 Prop.type 字段的值
