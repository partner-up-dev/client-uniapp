# Filesystem Guide

This document maps the current layout (based on source inspection, not legacy docs).

## Root

- `.env.*` — environment configs (see `.env.example` for required keys).
- `AGENTS.md` — agent guidance for working in this repo.
- `ARCHITECTURE.md` — architecture overview and data flow.
- `FILESYSTEM.md` — this file.
- `package.json` — scripts and dependencies.
- `vite.config.ts` — Vite + Uni + UnoCSS configuration.
- `uno.config.ts` — UnoCSS presets, transformers, safelist.
- `vitest.config.ts` — test setup and coverage rules.
- `vite-plugins/` — custom build/test plugins.
- `docs/` — project documentation and exploration plans.
- `tests/` — Vitest tests and mocks.
- `src/` — application source.

## src/

### App boot

- `main.ts` — app creation, plugin wiring.
- `App.vue` — lifecycle hooks and global styles.
- `pages.json` — page registry + tabbar.
- `manifest.json` — UniApp platform configuration.

### business/

Domain models and API access.

- `index.ts` — Valibot class helpers: `V.class`, `V.formClass`, `nullable()`, `instance()`, `limit_string()`.
- `http-api.ts` — HTTP client wrapper with auth + retry handling.
- `db-api.ts` — PostgREST wrapper with auth headers per request.
- `base/` — shared domain types (e.g., `DatetimeV`, `Transportation`).
- `account/` — authentication and profile models.
- `communication/` — chat and message models.
- `partner_request/` — partner request models/forms/types.
- `oss/` — object storage logic (if used).

### components/

UI components, grouped by domain. Each component folder typically includes:

- `<compName>.vue`
- `<compName>.ts`
- `<compName>.scss`
- `<compName>.md`

Notable subtrees:

- `common/` — shared UI elements (navBar, safeAreaInset, snackbar, etc.).
- `base/`, `account/`, `communication/`, `partner_request/` — domain-specific components.

### pages/

Pages are grouped by domain. Each page folder typically contains:

- `<pageName>.vue`
- `<pageName>.scss`
- `<pageName>.md`

Tabbar pages live directly under `pages/` (see `pages.json`).

### store/

Pinia stores by domain.

- `index.ts` — Pinia instance.
- `account/` — account state + auth headers.
- `communication/` — chat/message state.
- `setting/`, `migration/`, `partner_request/`, `base/`, `api/` — additional modules.

### utils/

Shared helpers:

- `vendor.ts` — UniApp wrapper functions (navigation, toasts, window info).
- `props.ts` — component prop builders.
- `tabbar.ts` — custom tabbar utilities.
- `style.ts` — shared types for size/radius.
- `time.ts`, `string.ts`, `object.ts`, `retry.ts`, etc.

### locale/

- `index.ts` — i18n creation using JSONC aggregates.
- `schema.ts`, `types.ts`, `vue-i18n.d.ts` — typings derived from zh-Hans aggregate.
- `en-US/`, `zh-Hans/` — global domain bundles in JSONC.

### styles/

- `presets/design.ts` — UnoCSS design tokens and utilities.

### libs/

- `fetch-polyfill/` — fetch/Headers/URL polyfills for mini-programs.
- `postgrest-js/` — PostgREST client adapted for mini-programs.

### composables/

Reusable Composition API helpers (`useScrollToBottom`, `useLockScroll`, `useOptionalVModel`).

### custom-tab-bar/

Weixin custom tabbar implementation and styling.

### data/

Enums, constants, and mapping tables (e.g., `PAGE_ID`, `PAGE_PATH`).
