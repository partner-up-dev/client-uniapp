---
applyTo: "**/business/**"
---

本指南指导如何实现、维护业务逻辑模块。

## 文件结构

- `api.ts`: 基础 API 类，提供 HTTP 请求处理、错误报告等功能
- `index.ts`: 基础 Business 类，包含使用 valibot 的数据解析功能，以及 BusinessWithAPI 类（结合 Business 和 API）
- `account/`: 账户相关业务逻辑模块，包含登录等方法
- `base/`: 共享业务逻辑模块，如路线/位置处理
- `partner_request/`: 搭子请求业务逻辑模块，包含枚举、类型定义和 Partner 类

## 使用 Valibot

- 导入: `import * as v from "valibot";`
- 文档: https://valibot.dev/llms.txt
- 使用 `index.ts` 的 `V.class` ，通过继承定义数据模型类，而不是 `v.object`
- 使用 `index.ts` 的 `nullable` 替代 `v.nullable` ，从而设置该字段的默认值为 `null`
- 当字段类型为另一个 ValibotClass 时，使用 `field: v.instance(TheClass)` 而不是 `field: TheClass`

## 命名规范

- 使用 `Ref` 后缀表示 ID 的类型
- 添加 `V` 后缀表示 valibot 模式
