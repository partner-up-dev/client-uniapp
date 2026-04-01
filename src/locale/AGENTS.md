# Locale module

Keep locale keys and structures consistent across locales. The base schema comes from the zh-Hans JSONC aggregate and drives TypeScript typing.

## Message key pattern

- Domain-based keys: top-level namespace (common, page, account, partner_request, etc.) with nested objects for related text.
- Use named placeholders (`{value}`) for interpolation; avoid function-based patterns.
- Keep shared copy in global JSONC; component/page-specific text should live in local message files next to the Vue file.

## Where files live

- Global bundles: JSONC under src/locale/zh-Hans/ and src/locale/en-US/ (one file per domain).
- Aggregates: src/locale/zh-Hans.ts and src/locale/en-US.ts import JSONC and expose objects consumed by `src/locale/index.ts`.
- Local messages (when needed): `<compName>.<locale>.jsonc` + `localMessages` module adjacent to the component/page.
- Schema: src/locale/schema.ts infers `MessageSchema` from the zh-Hans aggregate.

## Workflow

- Add or rename keys in zh-Hans JSONC first, then mirror in en-US.
- Prefer short, stable key paths; deduplicate by linking or reusing shared global keys.
- Use `useTranslate()` from `src/locale/index.ts` for domain/global keys and the exported `t` for shared keys.
- Use `useI18n({ inheritLocale: true, messages: localMessages })` for component/page-local messages.
- Run pnpm i18n:extract after changes to check missing/unused keys.
