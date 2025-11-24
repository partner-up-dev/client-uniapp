# 项目开发指南

## 项目背景

“搭一把”是一款社交驱动的生活电商服务平台。

分为下列模块：

- base: 基础
- partner_request: 搭子请求
- communication: 沟通
- account: 账户

## 文件结构

- `src/`: 源代码目录
  - `business/`: 业务逻辑模块，按模块划分子目录
  - `components/`: 组件，按模块划分子目录
  - `composables/`: 组合式函数
  - `pages/`: 页面，按模块划分子目录
    - `test/`: 测试用例页面
  - `store/`: 状态管理，按模块划分子目录
  - `types/`: 类型定义 （仅业务模块、组件专有以外的类型）
  - `utils/`: 工具函数
    - `vue.ts`: Vue 相关工具
    - `props.ts`: Vue 组件 Props 定义工具
    - `vendor.ts`: 进一步对 Uniapp API 进行封装，抹平不同小程序平台的差异
  - `styles/`: 样式文件
  - `static/`: 静态资源
  - `locale/`: 国际化文件，按`语言/模块`划分子目录
  - `data/`: 数据常量和枚举
    - `enum.ts`
    - `const.ts`
- `tests/`: 测试用例
- `docs/`: 文档

## 技术栈

- 包管理器: pnpm
- 开发框架: UniApp（仅小程序平台） + Vue 3 (Composition API)
  - UniApp 类型标注： [UniTyped](https://uni-helper.js.org/uni-typed/guide/getting-started)
- 状态管理: Pinia (+ `pinia-plugin-unistorage` 持久化)
- 样式管理: SCSS, UnoCSS
- 数据模型: Valibot
- 网络请求: uni-network
- 日期处理: day.js
- 自动化测试: Vitest

## 代码规范

- 参考 `.github/instructions/coding.instructions.md`
- 无需运行 type-check 或 build

### TypeScript

参考 `.github/instructions/typescript.instructions.md`

### 命名约定

- 组件: PascalCase (file), kebab-case (name)
- 常量：UPPER_SNAKE_CASE
- 函数/方法: camelCase
