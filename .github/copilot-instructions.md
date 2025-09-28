# 项目开发指南

## 项目背景

“搭一把”是一款社交驱动的生活电商服务平台。

## 文件结构

- `src/`: 源代码目录
  - `business/`: 业务逻辑模块
    - `api.ts`: API 基础
    - `index.ts`：业务逻辑模块基础
    - `base/`: 各业务的基础 (shared business)
    - `account/`: 账户模块的业务逻辑
    - `partner_request/`: 搭子请求模块的业务逻辑
  - `components/`: 组件目录
    - `common/`: 通用组件
    - `partner_request/`: 搭子请求模块的组件
  - `pages/`: 页面目录
    - `explore/`: 探索页面
    - `home/`: 首页
    - `partner_request/`：搭子请求模块的页面
  - `store/`: 状态管理
  - `types/`: 类型定义 （仅业务模块、组件专有以外的类型）
  - `utils/`: 工具函数
    - `index.ts`: 很多实用的工具函数
    - `vue.ts`: Vue 相关工具
    - `props.ts`: Vue 组件 Props 定义工具
    - `vendor.ts`: 进一步对 Uniapp API 进行封装，抹平不同小程序平台的差异
  - `styles/`: 样式文件
  - `static/`: 静态资源
  - `locale/`: 国际化文件
  - `data/`: 数据常量和枚举
    - `enum.ts`
    - `const.ts`
- `docs/`: 文档目录
- 根目录配置文件: `package.json`, `tsconfig.json`, `vite.config.ts`, `uno.config.ts`, etc.

## 架构总览

### 技术栈

- 包管理器: pnpm
- 开发框架: UniApp（仅小程序平台） + Vue 3 (Composition API)
  - UniApp 类型标注： [UniTyped](https://uni-helper.js.org/uni-typed/guide/getting-started)
- 状态管理: Pinia (+ `pinia-plugin-unistorage` 持久化)
- 样式管理: SCSS, UnoCSS
- 数据模型: [Valibot](https://valibot.dev/llms.txt)

## 代码质量

> 参考 `.github/instructions/coding.instructions.md`

### TypeScript

- No `any` types allowed
- Complete type definitions for all components

### 命名约定

- 组件: PascalCase (file), kebab-case (name)
- 常量：UPPER_SNAKE_CASE
- 函数/方法: camelCase

## MCP

### Available MCPs

- context7, exa：用于检索技术文档；对于 Uniapp 、Vue 相关问题，使用中文检索
- APIDoc
