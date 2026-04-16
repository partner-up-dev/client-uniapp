# Release and Migration

## Development Commands

- Weixin mini-program: `pnpm dev:mp-weixin`
- Alipay mini-program: `pnpm dev:mp-alipay`
- H5 development: `pnpm dev:h5`

## Build Commands

- Weixin mini-program: `pnpm build:mp-weixin`
- Alipay mini-program: `pnpm build:mp-alipay`

## Verification Commands

- Aggregate static quality gate: `pnpm quality`
- Type check: `pnpm type-check`
- H5 tests: `pnpm test:h5`
- Weixin-platform tests: `pnpm test:mp-weixin`
- Vue lint: `pnpm lint:vue`
- i18n extraction audit: `pnpm i18n:extract`

## Migration Checks

- Page additions or route changes must update `src/pages.json`, `src/data/enum.ts`, `src/data/mapper.ts`, and `docs/15-alignment/ui-surface-map.md` together.
- Tabbar changes must update `src/pages.json`, `src/custom-tab-bar/index.js`, `src/data/mapper.ts`, and `src/utils/tabbar.ts` together.
- Locale bundle changes should keep `src/locale/zh-Hans/*.jsonc` and `src/locale/en-US/*.jsonc` structurally compatible.
- Environment changes must update `.env.example` and [runtime-authority.md](runtime-authority.md).

## Non-Claims

- There is no durable repo-level docs integrity command.
- Temporary task-local scripts may be used during migrations but must not be documented here as permanent release checks.
