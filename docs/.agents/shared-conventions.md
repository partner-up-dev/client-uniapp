# Shared Development Conventions

Common conventions that apply to all Vue components, pages, and UI code in this project.

## Code style

- **Promise handling**: Prefer `Promise.then().catch()` over `async/await` for TypeScript
- **Conditions**: Keep conditions readable; extract complex checks into named variables
- **Comments**: Avoid "WHAT" comments; only add "WHY" or high-level overview comments
- **UniApp tags only**: Use `<view>`, `<text>`, `<image>`, etc. Never use web-only tags like `<div>`, `<span>`, `<button>`

## Vue 3 patterns

- **Component API**: Use `<script setup>` for Vue 3 Composition API
- **Props/Emits**: Define via `defineProps()` and `defineEmits()` from the component's `.ts` module
- **v-model**: Use `defineModel()` for v-model bindings when needed
- **Lifecycle**: Use UniApp lifecycle hooks (`onLoad`, `onReady`, `onShow`, `onHide`, `onUnload`)

## i18n (internationalization)

- **Never hard-code text**: All user-facing text must use localization
- **Use `useTranslate()`**: Import from `src/locale` (module entry)
- **Domain-scoped translations**: Use `dt()` for domain-specific keys
- **Global translations**: Use `t()` for common/shared keys
- **Local messages**: When a component/page defines local messages, use `useI18n({ inheritLocale: true, messages: localMessages })`

Example:

```typescript
const { dt, t } = useTranslate("domain_name");

dt("welcome.greeting")  // looks up "domain_name.welcome.greeting"
t("common.yes")         // looks up "common.yes"
```

## Error handling

- **Report errors**: Use `errorReport()` from `src/utils/vendor.ts`
- **User-facing errors**: `errorReport()` handles error dialog + logging automatically
- **Promise pattern**:

  ```typescript
  BusinessModel.method()
    .then((result) => {
      // Update UI
    })
    .catch((err) => {
      errorReport(err);
    });
  ```

## Essential references

**Instruction files** (read before making changes):

- `.github/instructions/coding.instructions.md` — general coding conventions
- `.github/instructions/typescript.instructions.md` — TypeScript-specific rules
- `.github/instructions/vue.instructions.md` — Vue 3 component conventions
- `docs/.agents/styling/index.md` — styling conventions index
- `docs/style.md` — style patterns and examples

**Core utilities**:

- `src/utils/vendor.ts` — `navigate()`, `errorReport()`, UniApp helpers
- `src/locale/index.ts` — `useTranslate()` hook
- `src/utils/format.ts`, `src/utils/string.ts` — formatting helpers
- `src/utils/time.ts` — time/datetime utilities

**Business layer**:

- `src/business/` — domain models and API clients
- `src/business/AGENTS.md` — business layer development guide

**State management**:

- `src/store/` — Pinia stores with persistence via `pinia-plugin-unistorage`
- Store hooks follow pattern: `DomainModel.use()` returns reactive refs
