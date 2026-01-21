# Locale Files Migration to JSONC with Local Scoping (2026-01-21)

## Observations

### Current State

1. **Format**: TypeScript files (zh-Hans/*.ts, en-US/*.ts) with nested objects and functions
2. **Interpolation Pattern**: Uses vue-i18n function-based formatting: `({ named }: msgArgs) =>`text ${named('param')}`
3. **File Structure**: Domain-based (account.ts, partner_request.ts, etc.) with namespace prefixes in aggregates
4. **Scoping Issues**: Component and page messages live in global locale files instead of co-located with their sources
5. **Tooling Incompatibility**: TypeScript format doesn't integrate well with i18nAlly (VSCode extension)
6. **Maintenance**: Message structure is "a mess" per user - function callbacks make it hard to reason about

### Pain Points

1. i18nAlly can't properly parse TypeScript message files
2. Duplicate translations scattered across files
3. No clear separation between global and component/page-local translations
4. Function-based interpolation is verbose and hard to maintain
5. No support for linked messages (message references)

## Goals

1. ✅ Convert all TS locale files to JSONC format
2. ✅ Replace function-based `named()` patterns with vue-i18n named formatting (e.g., `"text {param}"`)
3. ✅ Co-locate component/page-local translations next to sources (compName.ts/pageName.ts) — deferred; see components update list
4. ✅ Implement linked messages to avoid duplications
5. ✅ Ensure i18nAlly compatibility
6. ✅ Document the new pattern in src/locale/AGENTS.md
7. ✅ Remove backward compatibility and adopt `useI18n` local scope usage

## Implementation Strategy

### Phase 1: Analysis & Script Preparation

- Analyze all TS files to identify:
  - Function-based named patterns and their parameters
  - Component-specific translations
  - Duplicate messages across files
  - Message references/links opportunities
- Create Python scripts for automated conversion:
   1. `convert_ts_to_jsonc.py`: Converts TS to JSONC, transforms function patterns
   2. `extract_component_locals.py`: Identifies and extracts component/page messages and writes adjacent local message modules
   3. `find_duplicates.py`: Finds duplicate translations for linking

### Phase 2: Setup Infrastructure

1. Create new directory structure:
   - Keep `src/locale/{locale}/` for global messages (JSONC)
   - Create local message modules next to each component/page source (compName.ts/pageName.ts)
   - Add local messages type definitions (global.d.ts or per-module) as needed

2. Update locale loading mechanism:
   - Modify `src/locale/index.ts` to load only global JSONC messages
   - No global registration for component/page-local messages

3. Update TypeScript schema:
   - Generate schema from JSONC files (global messages only)
   - Keep local messages typed per module or via local message helpers

### Phase 3: Migration Execution

1. Convert each domain TS file to JSONC:
   - Global messages → `{locale}/{domain}.jsonc`
   - Component/page messages → co-located `compName.ts` / `pageName.ts` with `localMessages` (deferred)

2. Pattern transformations:
   - `({ named }: msgArgs) => \`text ${named('param')}\`` → `"text {param}"`
   - Multi-parameter: `${named('a')}...${named('b')}` → `"{a}...{b}"`

3. Setup linked messages:
   - Common messages like "确定", "取消", "保存成功" → reference from common/base

4. Update component imports/usage (deferred):
   - Replace `useTranslate()` usage with `useI18n({ inheritLocale: true, messages: localMessages })`
   - Use `const { t: lt } = useI18n(...)` and `lt('key')`
   - See the per-file checklist in docs/plan/locale-jsonc-migration-2026-01-21/COMPONENTS_TO_UPDATE.md

### Phase 4: Validation & Documentation

1. Verify all keys are converted and accessible
2. Run existing i18n extraction tools
3. Test component/page-level translations
4. Update AGENTS.md with new patterns
5. Create migration guide
6. Track deferred component/page localization updates

## Detailed File Changes

### New/Modified Files

- `src/locale/zh-Hans/*.jsonc` (converted from .ts)
- `src/locale/en-US/*.jsonc` (converted from .ts)
- `src/**/compName.ts` and `src/**/pageName.ts` (localMessages exported next to component/page sources)
- `src/locale/index.ts` (modified to load JSONC)
- `src/locale/schema.ts` (may need updates if using dynamic imports)
- `src/locale/AGENTS.md` (new patterns documented)
- `vite.config.ts` (JSONC import support)

### Deleted Files

- `src/locale/zh-Hans/*.ts` (except index/types/schema files)
- `src/locale/en-US/*.ts` (except index/types/schema files)

### Python Scripts

- `scripts/convert_ts_to_jsonc.py`
- `scripts/extract_component_locals.py`
- `scripts/find_duplicates.py`

## Key Decisions

1. **JSONC vs JSON**: Use JSONC to allow comments for context/documentation
2. **Component Scope**: Co-locate local messages with each component/page source (compName.ts/pageName.ts)
3. **Named Formatting**: Use vue-i18n's native `{name}` syntax instead of custom functions
4. **No Backward Compatibility**: Remove `useTranslate()` usage in components/pages
5. **Linked Messages**: Use `@:key.reference` syntax where supported or manual deduplication

## Success Criteria

- [ ] All .ts locale files converted to .jsonc
- [ ] All function-based patterns replaced with named formatting
- [ ] Component/page-specific translations co-located with sources (deferred)
- [ ] i18nAlly recognizes and highlights all messages
- [ ] No legacy `useTranslate()` usage remains (deferred)
- [ ] All translations remain accessible
- [ ] New pattern documented in AGENTS.md

## Risk Mitigation

- Keep .ts backup before conversion
- Verify each converted file matches original message count
- Test component rendering with new message sources
- Ensure JSON syntax validity with schema validation

## Current Execution Plan (2026-01-21 global cleanup/docs)

1. Remove remaining legacy TS locale domain files under `src/locale/{locale}/` and ensure aggregators only rely on JSONC.
2. Update `src/locale/index.ts` and `src/locale/schema.ts` to source types/messages from JSONC aggregates only.
3. Refresh locale docs to the JSONC + local scope pattern (`src/locale/AGENTS.md`, references in pages/business docs if they mention `useTranslate`).
4. Record outcomes in `docs/plan/locale-jsonc-migration-2026-01-21/RESULT.md` after changes.
