# Locale JSONC Migration Result (2026-01-21 global cleanup/docs)

## Completed Tasks

### 1. Removed Legacy TS Locale Files

Deleted all `.ts` domain files under:

- `src/locale/zh-Hans/*.ts`
- `src/locale/en-US/*.ts`

Retained only JSONC domain bundles (`.jsonc`) in both locale directories.

### 2. Updated Locale Loading

**Modified files:**

- [src/locale/index.ts](../../../src/locale/index.ts): cleaned up imports, added `satisfies` check on messages object
- [src/locale/schema.ts](../../../src/locale/schema.ts): unchanged, still derives `MessageSchema` from zh-Hans aggregate

Both aggregates ([src/locale/zh-Hans.ts](../../../src/locale/zh-Hans.ts), [src/locale/en-US.ts](../../../src/locale/en-US.ts)) now import only JSONC files and rely on Vite's JSONC plugin for parsing.

### 3. Refreshed Locale Documentation

Updated references to legacy `useTranslate` hook and documented the JSONC + local scope pattern:

**Core docs:**

- [src/locale/AGENTS.md](../../../src/locale/AGENTS.md): replaced TS workflow with JSONC + `useI18n` local scope guidance
- [AGENTS.md](../../../AGENTS.md): removed `useTranslate` mention, documented new i18n pattern
- [FILESYSTEM.md](../../../FILESYSTEM.md): updated locale/ section to reflect JSONC-only structure
- [ARCHITECTURE.md](../../../ARCHITECTURE.md): rewrote i18n section for `useI18n` + local messages

**Business layer:**

- [src/business/AGENTS.md](../../../src/business/AGENTS.md): replaced `useTranslate`/`dt()` mention with global composer `t` usage
- [src/business/ARCHITECTURE.md](../../../src/business/ARCHITECTURE.md): updated i18n section to reference global composer

**Pages/components:**

- [src/pages/AGENTS.md](../../../src/pages/AGENTS.md): removed `useTranslate` reference, updated util reference
- [src/pages/ARCHITECTURE.md](../../../src/pages/ARCHITECTURE.md): rewrote i18n integration section for `useI18n` with local messages
- [docs/.agents/shared-conventions.md](../../../docs/.agents/shared-conventions.md): replaced `useTranslate` example with `useI18n` local scope + named placeholders
- [docs/.agents/vue-patterns.md](../../../docs/.agents/vue-patterns.md): updated standard template to show `useI18n` with `localMessages` import

## Current State

- ✅ Global JSONC bundles live in `src/locale/{locale}/*.jsonc` and are imported by aggregates
- ✅ TypeScript schema derived from zh-Hans aggregate provides type safety
- ✅ All docs reference `useI18n` and local message pattern
- ⏳ Component/page migration deferred; listed in [COMPONENTS_TO_UPDATE.md](COMPONENTS_TO_UPDATE.md)

## Notes

- Legacy `useTranslate` composable is no longer documented, but still present in active component/page code (59 usages).
- Next phase: migrate listed components/pages to local `useI18n` with adjacent JSONC files (see COMPONENTS_TO_UPDATE.md).
