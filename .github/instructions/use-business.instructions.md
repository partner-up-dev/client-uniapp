本指南指导如何使用业务模块提供的各项业务逻辑能力。

所有的业务逻辑能力都在 `src/business/` 中实现，按照模块拆分。

需要请求后端时，请使用 `src/business/api.ts` 提供的 API 能力。

## 定义数据模型

使用类来声明数据模型和组合业务逻辑，示例：

```typescript
export type UserRef = string;

export class User {
  constructor(public id: UserRef, public name: string, public email: string) {}

  // 业务逻辑方法
  get displayName() {
    return `${this.name} <${this.email}>`;
  }
}
```
