# Pages Agent Notes

Index and quick reference for the `src/pages` folder.

## Quick start

**When editing pages, read in this order:**

1. This file (AGENTS.md) — overview and quick reference
2. [ARCHITECTURE.md](ARCHITECTURE.md) — data flow, lifecycle, and patterns
3. [FILESYSTEM.md](FILESYSTEM.md) — directory structure and file organization
4. [Shared conventions](../../docs/.agents/shared-conventions.md) — common development rules
5. [Styling guide](../../docs/.agents/styling/index.md) — styling conventions

## Key conventions (must follow)

**Page-specific:**

- Parse route parameters with Valibot in `onLoad()`
- Import business models from `src/business/<domain>` (V.class instances)
- Use Pinia stores from `src/store/<domain>` via hooks
- Navigate via `navigate()` from `src/utils/vendor.ts`
- Handle safe areas with `SafeAreaInset` and `SafeArea` components
- Pages do not define props, emits, or models

**Shared conventions** (applies to all Vue code):

- Use `<script setup>` for Vue 3 Composition API
- Use `useTranslate()` for all user-facing text (never hard-code)
- Use UniApp tags only: `<view>`, `<text>`, `<image>`, etc.
- Prefer `Promise.then().catch()` over `async/await`
- Use SCSS design tokens: `sys-var('color-primary')`
- Report errors via `errorReport()` from `src/utils/vendor.ts`

See [shared conventions](../../docs/.agents/shared-conventions.md) for complete details.

## Essential references

**Core files:**

- `src/data/enum.ts` — PAGE_ID, TABBAR_PAGE_ID enums
- `src/data/mapper.ts` — page path mapping
- `src/pages.json` — page registry and tabbar config

**Utils:**

- `src/utils/vendor.ts` — `navigate()`, `errorReport()`
- `src/utils/tabbar.ts` — tabbar sync helpers
- `src/locale/use.ts` — `useTranslate()`

**Common components:**

- `src/components/common/safeAreaInset.vue` — safe areas
- `src/components/common/navBar/navBar.vue` — page header
- `src/components/common/layout/scaffoldLayout.vue` — page container

**Shared documentation:**

- [docs/.agents/shared-conventions.md](../../docs/.agents/shared-conventions.md) — common development rules
- [docs/.agents/styling/index.md](../../docs/.agents/styling/index.md) — styling conventions

**Instructions:**

- `.github/instructions/vue.instructions.md` — Vue 3 conventions
- `.github/instructions/style.instructions.md` — styling guidelines
