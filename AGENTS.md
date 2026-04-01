# PartnerUp Uniapp

This repository is a UniApp (Vue 3) client for PartnerUp, primarily targeting mini-program platforms (Weixin, Alipay).

## What boots the app

- Entry: `src/main.ts` creates the app, registers Pinia + `pinia-plugin-unistorage`, and installs i18n.
- App lifecycle: `src/App.vue` calls `Account.login(false)` during `onLaunch()` and sets global background styles.
- Pages and tabbar: `src/pages.json` declares pages; tabbar is custom via `src/custom-tab-bar`.

## Domain structure (business logic)

The primary domain logic lives in `src/business/`:

- Shared model helpers: `src/business/index.ts` provides `V.class`, `V.formClass`, `nullable()`, `instance()`, `limit_string()`.
- HTTP API: `src/business/http-api.ts` wraps `@uni-helper/uni-network` with interceptors, auth header injection, 401 retry, and lazy parsing via `Body`.
- DB API: `src/business/db-api.ts` wraps PostgREST (`src/libs/postgrest-js`) with per-request auth headers.
- Domains: `account/`, `partner_request/`, `communication/`, `base/`, `oss/`.

Use `V.class` / `V.formClass` when declaring models and form validators. For API calls, prefer `HTTPApiClient` and `DBApiClient` attached to model classes.

See [src/business/AGENTS.md](src/business/AGENTS.md) for business layer development guide.

## UI structure

- Pages: `src/pages/<domain>/<pageName>/` with `<pageName>.vue`, `.scss`, `.md` (tabbar pages are at top-level under `pages/`). See [src/pages/AGENTS.md](src/pages/AGENTS.md) for page development guide.
- Components: see the per-folder agent notes at `src/components/AGENTS.md`.
- Common UI helpers: `src/components/common/`, `src/composables/`.

## State management

- Store: Pinia (`src/store/index.ts`).
- Persistence: `pinia-plugin-unistorage` is enabled globally.
- Key stores: `src/store/account`, `src/store/communication`.

## Navigation

- Page IDs and paths: `src/data/enum.ts`, `src/data/mapper.ts`.
- Navigation helper: `src/utils/vendor.ts` (`navigate`).
- Custom tabbar: `src/custom-tab-bar` + helpers in `src/utils/tabbar.ts`.

## i18n

- i18n setup: `src/locale/index.ts` loads JSONC aggregates (`src/locale/zh-Hans/*.jsonc`, `src/locale/en-US/*.jsonc`) and derives types from zh-Hans.
- Avoid hard-coded text; use `useTranslate()` for domain/global keys and `t` for shared keys.
- For component/page-local messages, use `useI18n({ inheritLocale: true, messages: localMessages })` and alias the local `t` if needed.

## Styling

- UnoCSS: `uno.config.ts` + `src/styles/presets/design.ts`.
- SCSS design tokens: injected via Vite config, use `sys-var()` and mixins (`pu-font`, `pu-elevation`, `pu-icon`).

## Tooling & tests

- Vite + Uni plugin (`vite.config.ts`).
- Conditional compile plugin for tests: `vite-plugins/vite-plugin-uni-conditional-compile.ts`.
- Vitest: `vitest.config.ts`, global Uni API mocks in `tests/setup.ts`.

## Environment variables

See `.env.example` for required variables: `VITE_BACKEND_MAIN_URL`, `VITE_PGRST_URL`, `VITE_TENCENT_LBS_KEY`, etc.

## SVC v9.1 Execution Protocol

Use this protocol to prevent scope drift and protect durable docs.

- Repository mapping: root `tasks/` is the canonical SVC task layer in this repo.

- Mode A (Exploration): work only in `tasks/`; do not edit PRD/TDD/production code. Capture uncertainty and open questions.
- Mode B (Solidification): restate scope and invariants, await confirmation, then promote stable truths into PRD or Product TDD.
- Mode C (Execution): restate scope and invariants, await confirmation, then implement tests and code changes.

Pre-execution restatement (required for reference-sensitive or logic-altering changes):

- target
- target path or anchor
- state or context
- operation
- scope (in and out)
- invariants
- likely affected files
- uncertainty

Mode A note: if a durable doc looks outdated during exploration, record it in the task doc and defer updates to Mode B.

## Conventions (must follow)

- Read and follow documentation at each folder level: `AGENTS.md`, `ARCHITECTURE.md`, `FILESYSTEM.md`.
  - Root level provides project overview
  - `src/business/`: domain models and API patterns
  - `src/pages/`: page development and structure
  - `src/components/`: component patterns
  - `.github/instructions/`: detailed implementation guidelines
- Prefer `Promise.then().catch()` over `async/await` for TS.
- Keep conditions readable; extract complex checks into named variables.
- Avoid "WHAT" comments; only add "WHY" or high-level overview comments.
- Use UniApp tags (`<view>`, `<text>`, `<image>`), not web-only tags.

## Useful commands

- Dev (Weixin): `pnpm dev:mp-weixin`
- Tests: `pnpm test:h5` or `pnpm test:mp-weixin`
- Type check: `pnpm type-check`

## Development Guidelines

- Before starting any work in a directory, check whether the following documents exist in that directory.
  If any of them exist, you MUST read only those that are relevant to the current task.
  If the relevant documents are outdated or inconsistent with the current state, you MUST update them immediately.
  The documents are:
  - `AGENTS.md`
  - `ARCHITECTURE.md`
  - `FILESYSTEM.md`: Lists the files in the current directory and its subdirectories (unless a subdirectory has its own `FILESYSTEM.md`) and briefly explains their purposes.
  - `compName.md`
  - `moduleName.md`
