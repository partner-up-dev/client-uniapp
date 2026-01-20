# I18n lint + schema refactor (2026-01-20)

## Observations

- Global i18n is created in src/locale/index.ts with fallback zh-Hans; messages come from TS aggregates zh-Hans.ts and en-US.ts; legacy defaults are still in place and no type schema is wired.
- Locale resources live under src/locale/<locale>/*.ts with snake-cased domain prefixes used by use.ts; no dynamic loading and no type-aware helpers.
- Tooling is Biome-only; there is no ESLint stack, no vue-i18n linting, and no key extraction automation. reorg-locales.py is the only locale utility.

## Plan

1) ESLint foundation with vue-i18n rules (Vue-only)

- Add ESLint toolchain (eslint, eslint-plugin-vue, vue-eslint-parser, eslint-plugin-vue-i18n). Configure ESLint to lint only .vue files and let Biome handle JS/TS/JSON and other common lint/format. Add an npm script to run ESLint over src/**/*.vue and tests/**/*.vue if present.

1) Type Schema for vue-i18n (non-legacy)

- Derive a MessageSchema from zh-Hans aggregate and declare module augmentation so DefineLocaleMessage matches it. Switch to `legacy: false` and update createI18n generics/locales; keep the existing snakeCase-prefixed helpers but align them with the typed instance.

1) vue-i18n-extract automation

- Add vue-i18n-extract as a dev dependency plus a config (or script) that scans src/**/*.vue and the TS locale files to report missing/unused keys. Provide an npm script (e.g., i18n:extract) to run it.

1) Docs for locale contributors

- Add src/locale/AGENTS.md with a brief guide on where locale files live, how the type schema works, and how to run the extract tool when adding keys.
