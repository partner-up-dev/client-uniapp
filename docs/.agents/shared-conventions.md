# Shared Development Conventions

Common conventions that apply to all Vue components, pages, and UI code in this project.

## Code style

- **Promise handling**: Prefer `Promise.then().catch()` over `async/await` for TypeScript
- **Conditions**: Keep conditions readable; extract complex checks into named variables
- **Comments**: Avoid "WHAT" comments; only add "WHY" or high-level overview comments
- **UniApp tags only**: Use `<view>`, `<text>`, `<image>`, etc. Never use web-only tags like `<div>`, `<span>`, `<button>`

## Vue conventions (shared)

- **Component API**: Use `<script setup>` for Vue 3 Composition API

## i18n (internationalization)

- **Never hard-code text**: All user-facing text must use localization
- **Global keys**: use the app composer via `useI18n()` and call fully qualified keys (e.g., `common.button.confirm`).
- **Local scope**: for component/page text, provide `localMessages` and call `useI18n({ inheritLocale: true, messages: localMessages })`, then use the returned `t` (commonly aliased `lt`).
- **Placeholders**: use named placeholders (`{value}`) in JSONC; avoid function-style interpolation.

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
- `.github/instructions/style.instructions.md` — styling guidelines

**Core utilities**:

- `src/utils/vendor.ts` — `navigate()`, `errorReport()`, UniApp helpers
- `src/locale/index.ts` — i18n and global composer
- `src/utils/format.ts`, `src/utils/string.ts` — formatting helpers
- `src/utils/time.ts` — time/datetime utilities

**Business layer**:

- `src/business/` — domain models and API clients
- `src/business/AGENTS.md` — business layer development guide

**State management**:

- `src/store/` — Pinia stores with persistence via `pinia-plugin-unistorage`
- Store hooks follow pattern: `DomainModel.use()` returns reactive refs
