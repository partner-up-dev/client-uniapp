# Vue-i18n v11 Migration Plan

## Current State Analysis

**Current Version:** v9.14.5
**Current Setup:**

- Uses Composition API (not Legacy API)
- `globalInjection: true` is set (required in v11)
- Custom `useTranslate` wrapper in `src/locale/use.ts`
- Uses `i18n.global.t()` in utility functions (`src/utils/time.ts`)
- No `v-t` directives found in codebase (good)
- Uses `createI18n<{ message: MessageSchema }, Locale>()` with generic types

## Breaking Changes in v11

1. **Deprecate Legacy API mode** - We're NOT using Legacy API, so this is not relevant
2. **Deprecate `v-t` directive** - We don't use `v-t`, so this is not relevant
3. **Drop `tc` and `$tc`** - We don't use these, need to verify

## Migration Steps

### Step 1: Update package.json

- Change `vue-i18n` from `^9.14.5` to `^11.x.x`

### Step 2: Update i18n initialization (src/locale/index.ts)

- Add missing `globalInjection: true` explicitly (it's already there but let's verify it's still needed)
- Ensure the configuration matches v11 schema
- Verify `createI18n` generic types work with v11

### Step 3: Verify utility functions

- Check `src/utils/time.ts` and other files using `i18n.global.t()`
- These should continue working as-is

### Step 4: Run tests

- Execute type checking: `pnpm type-check`
- Run unit tests: `pnpm test:h5` and `pnpm test:mp-weixin`
- Test the app in dev mode

### Step 5: Validate locale messages

- Ensure locale messages still load and work correctly
- Test different locale switching

## Expected Impact

**Minimal impact** because:

- We're already using Composition API (not Legacy API)
- We don't use `v-t` directive
- We don't use deprecated `tc`/`$tc` APIs
- The codebase follows modern patterns

## Risk Areas

- Type compatibility: The generic types passed to `createI18n` might need adjustment
- Global `i18n.global` access in utility functions might have subtle changes
- Any undocumented usage of deprecated features

## Files to Modify

1. `package.json` - Update version
2. `src/locale/index.ts` - Verify/update i18n config if needed
3. `src/locale/use.ts` - Verify compatibility
4. `src/utils/time.ts` - Verify i18n.global.t() still works
5. Any other files using `i18n.global` - verify after update

## Success Criteria

- ✅ Package updates without conflicts
- ✅ Type checking passes (`pnpm type-check`)
- ✅ App runs in dev mode for both mp-weixin and h5
- ✅ Translations display correctly
- ✅ Locale switching works
- ✅ All tests pass
