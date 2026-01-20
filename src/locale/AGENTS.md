# Locale module

Keep locale keys and structures consistent across locales. The base schema is derived from zh-Hans and used for TypeScript typing, so changes to zh-Hans define the expected shape for all other locales.

## Message key pattern

- Keys use a domain-based structure: top-level key (e.g., profile, editor, field) containing nested objects for related messages.
- Namespace prefixes (com, pg, acc, pr, etc.) in aggregates map to domain folders; use these prefixes when accessing messages via i18n.
- Messages support both static strings and functions for interpolation (e.g., parameter substitution).

## Where files live

- Domain files: src/locale/zh-Hans/*.ts and src/locale/en-US/*.ts (one per domain or feature).
- Aggregates: src/locale/zh-Hans.ts and src/locale/en-US.ts (re-export domain files with namespace prefixes).
- Schema: src/locale/schema.ts (derives MessageSchema from zh-Hans aggregate for TypeScript typing).

## Workflow

- Add or rename keys in zh-Hans first; zh-Hans defines the required message shape used for type checking.
- Mirror the same key structure in en-US (namespace prefixes and nested keys must match).
- Prefer clear, stable key paths and avoid duplicating near-identical keys across domains.
- After updating locale keys, run pnpm i18n:extract to report missing or unused keys.
