# Static Analysis Setup Result

## Scope

Restore static analysis tooling so failures represent project code drift instead of broken tool configuration.

## Changes

- Upgraded the local TypeScript toolchain from TypeScript 4.9 / vue-tsc 1.x to TypeScript 5.4 / vue-tsc 2.x.
- Fixed `tsconfig.json` type-library entries:
  - removed invalid `types/node`
  - removed invalid `@partner-up-dev/design-uniapp/types`
  - kept real type libraries only
- Added `tsconfig.typecheck.json` for type-check-only path mapping.
- Added a local design component shim so linked `@partner-up-dev/design-uniapp` source files are not checked as this repo's code.
- Fixed `pnpm lint:vue` so missing `tests/**/*.vue` does not make ESLint 9 fail before linting.
- Added `pnpm quality` as the aggregate static gate: type-check first, then Vue lint.
- Added `.eslintcache` to `.gitignore`.

## Verification

- `pnpm lint:vue` passes.
- `pnpm type-check` now reaches real project TypeScript/Vue findings.
- `pnpm quality` is configured, but currently fails because `pnpm type-check` has a real backlog.

## Current Type-Check Backlog Summary

Latest run summarized below. Raw command output is intentionally not promoted as durable evidence because it is reproducible from `pnpm type-check`.

Top files by current error count:

- `src/components/common/routeMap/routeMap.vue`: route map typing, missing legacy imports, map marker type mismatch.
- `tests/components/tripPreferenceForm.test.ts`: test fixture/model type mismatch.
- `src/components/base/routeEditor/routeEditor.ts`: route model drift around missing `items`.
- `tests/components/PRForm.test.ts`: outdated component prop usage.
- `src/components/base/routeItemDatetimeEditor/routeItemDatetimeEditor.vue`: event payload and form instance typing drift.
- `src/store/base/requirement.ts`: missing legacy modules and invalid index signature.
- `src/store/partner_request/split_the_bill/split_bill.ts`: missing legacy modules and invalid index signature.
- `src/utils/log.ts`: missing API type module and Weixin global typing gap.

Recommended cleanup order:

1. Decide whether stale legacy modules under `src/store/base/requirement.ts`, `src/store/partner_request/split_the_bill/`, and `src/components/common/routeMap/` should be deleted, repaired, or excluded with explicit ownership.
2. Fix active route model drift (`Route.items` callers versus current `Route` API).
3. Fix shared utility/library type errors (`DBApiClient`, fetch polyfill, PostgREST builder, locale rest args, timer return types).
4. Fix active component prop/event typing.
5. Fix test fixtures after source contracts are stable.
