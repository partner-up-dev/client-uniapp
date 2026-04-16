# PartnerUp Uniapp

This repository is a UniApp (Vue 3) client for PartnerUp, primarily targeting mini-program platforms such as Weixin and Alipay.

## What boots the app

- Entry: `src/main.ts` creates the app, registers Pinia with `pinia-plugin-unistorage`, installs i18n, and loads global styles.
- App lifecycle: `src/App.vue` calls `Account.login(false)` during `onLaunch()`.
- Pages and tabbar: `src/pages.json` declares pages; Weixin custom tabbar files live in `src/custom-tab-bar/`.

## Durable owners

- `docs/00-meta/`: SVC route protocols, mode SOPs, impact handshake rules, and framework concepts.
- `docs/10-prd/`: product intent, observable behavior, and business glossary.
- `docs/15-alignment/`: optional coordination substrate for reference-sensitive work.
- `docs/20-product-tdd/`: cross-unit technical contracts and authority.
- `docs/30-unit-tdd/`: durable design memory for complex logical units.
- `docs/40-deployment/`: runtime and operational truths.
- `tasks/`: volatile planning, investigation, diagnostics, and temporary artifacts.
- Local `AGENTS.md`: tactical constraints and tripwires near the code they govern.

Old SVC task folders under `tasks/` are archive context, not current operating authority.

## Operating loop

1. Classify the request as `Intent`, `Constraint`, `Reality`, or `Artifact`.
2. Identify the durable owner and blast radius before editing.
3. For non-trivial work, keep volatile reasoning in `tasks/`.
4. Select the active mode for the current slice: `Explore`, `Solidify`, `Execute`, or `Diagnose`.
5. Load only the needed route doc, mode SOP, local `AGENTS.md`, and governing PRD/TDD/deployment docs.
6. Expand into alignment substrate fields only when references, boundaries, state, evidence, or blast radius are ambiguous.
7. Execute the smallest safe change and verify it.
8. Promote stable knowledge only after it passes the promotion test.

Input type decides ownership. Mode decides the current working posture. Mode never overrides durable ownership.

## Input routes

- `Intent`: business wants new behavior, scope, policy, or strategy. Update PRD first.
- `Constraint`: product behavior stays stable, but technical, dependency, performance, or environment boundaries change. Update Product TDD or Unit TDD where durable memory is justified.
- `Reality`: observed behavior diverges from expectation. Diagnose with evidence first; no evidence, no modification.
- `Artifact`: produce a bounded deliverable. Keep it tactical unless reuse and stability are proven.

## Mode guide

- `Explore`: map unknowns, alternatives, temporary assumptions, and next decision points.
- `Solidify`: restate findings into stable claims, contracts, decisions, or promotion candidates.
- `Execute`: make a clear and verified edit.
- `Diagnose`: collect evidence for bugs, anomalies, corrupt state, or unexplained behavior.

Mode transitions are non-linear. A single task can move between modes as evidence changes.

## Impact handshake

Before mutating durable truth or making a non-local change, restate:

- Address and object
- State diff: from -> to
- Blast radius forecast
- Invariants that must remain true
- Verification that will bound side effects

If evidence is missing or ownership is unclear, return to `Explore` or `Diagnose`.

## Project structure

- Business logic: `src/business/`
- Pages: `src/pages/`
- Components: `src/components/`
- State: `src/store/`
- Locale: `src/locale/`
- Navigation: `src/data/enum.ts`, `src/data/mapper.ts`, `src/utils/vendor.ts`
- Custom tabbar: `src/custom-tab-bar/`

Read folder-level `AGENTS.md`, `ARCHITECTURE.md`, and `FILESYSTEM.md` before editing that folder when they exist.

## Domain and API conventions

- Use `V.class` / `V.formClass` for business models and forms.
- Use `nullable()` for nullable fields and `instance()` for nested model types.
- Use `DatetimeV` for date-like fields.
- Prefer `HTTPApiClient` and `DBApiClient` attached to model classes for API calls.
- Keep business logic in `src/business/`; stores should cache state and expose minimal mutations.

## UI and i18n conventions

- Use UniApp tags such as `<view>`, `<text>`, and `<image>`, not web-only tags.
- Use `<script setup>` for Vue 3 components.
- Avoid hard-coded user-facing text.
- Use `useTranslate()` for domain/global keys.
- Use `useI18n({ inheritLocale: true, messages: localMessages })` for component/page-local messages.

## Code conventions

- Prefer `Promise.then().catch()` over `async/await` for TypeScript in this repo.
- Keep conditions readable; extract complex checks into named variables.
- Avoid "WHAT" comments; only add "WHY" or high-level overview comments.
- Use SCSS design tokens via `sys-var()` and project mixins when styling.

## Useful commands

- Dev Weixin: `pnpm dev:mp-weixin`
- Dev H5: `pnpm dev:h5`
- Tests H5: `pnpm test:h5`
- Tests Weixin: `pnpm test:mp-weixin`
- Type check: `pnpm type-check`
- Vue lint: `pnpm lint:vue`
- i18n extraction: `pnpm i18n:extract`

Do not add a permanent docs-integrity script by default. If a migration needs temporary documentation audits, keep them task-local.
