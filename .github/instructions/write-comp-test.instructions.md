---
applyTo: "tests/components/, *.test.ts"
description: 编写组件单元测试指南
---

- 测试框架: Vitest
- 测试运行器:
  - Vue Test Utils: 用于数据、交互测试
  - Miniprogram Automator: 用于视觉回归测试
- 测试文件位置: 组件目录下的 `compName.test.ts`
- 在 `vitest.setup.ts` 中已经配置了对 UniApp API 的 Mock

## 测试内容

- 交互测试
- 输入/输出：验证 props、emits、v-model 的正确性

## 最佳实践

- 使用 describe 按功能或场景分组，it 测试具体行为
- 每个测试应可独立运行，不依赖上一个测试的副作用
- 避免测试实现细节（如内部变量），聚焦可见行为
- 保持测试简洁、可读、可维护
