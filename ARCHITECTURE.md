# Architecture

## Overview

PartnerUp is a UniApp (Vue 3) client targeting mini-program platforms. The architecture is layered:

1. **UI**: pages and components (`src/pages`, `src/components`).
2. **Business**: domain models + API logic (`src/business`).
3. **State**: Pinia stores with persistence (`src/store`).
4. **Infrastructure**: utilities, i18n, styling, libs (`src/utils`, `src/locale`, `src/styles`, `src/libs`).

## Runtime boot

- `src/main.ts` creates the SSR app, installs i18n and Pinia, and enables `pinia-plugin-unistorage`.
- `src/App.vue` registers lifecycle handlers and triggers `Account.login(false)` at launch.
- Pages and tabbar are declared in `src/pages.json`. A custom tabbar is implemented in `src/custom-tab-bar`.

## Data flow (typical)

```
Page / Component
  -> Business model (V.class / V.formClass)
      -> HTTPApiClient (uni-network) OR DBApiClient (PostgREST)
          -> Response Body (lazy Valibot parsing)
  -> Store (Pinia) for cached or shared state
```

### Business layer

- **Model system**: `src/business/index.ts` provides `V.class`, `V.formClass`, `nullable()`, `instance()`, `limit_string()` to create Valibot-backed classes.
- **HTTP**: `src/business/http-api.ts` wraps `@uni-helper/uni-network` with auth headers, custom success code handling, 401 retry, and error reporting.
- **DB**: `src/business/db-api.ts` wraps PostgREST (`src/libs/postgrest-js`) with per-call auth headers.
- Domain modules: `account`, `partner_request`, `communication`, `base`, `oss`.

### State layer

- Pinia stores live under `src/store`.
- Persistence is via `pinia-plugin-unistorage` (enabled in `src/main.ts`).

### Navigation

- `PAGE_ID` and `PAGE_PATH` are defined in `src/data/enum.ts` and `src/data/mapper.ts`.
- `navigate()` in `src/utils/vendor.ts` routes via `uni.navigateTo` or `uni.switchTab` (tabbar pages).
- `src/utils/tabbar.ts` syncs selection and avatar state with the custom tabbar.

### i18n

- `src/locale/index.ts` configures `vue-i18n` with JSONC aggregates from `src/locale/{locale}/*.jsonc`.
- Use `useTranslate()` from `src/locale` for domain/global keys. Prefer component/page-local messages with `useI18n({ inheritLocale: true, messages: localMessages })` (alias the returned `t` to `lt`). Shared/global keys can use the exported `t` from `src/locale`. Text should never be hard-coded.

### Styling

- UnoCSS is configured in `uno.config.ts` with a custom design preset (`src/styles/presets/design.ts`).
- SCSS design tokens and mixins (`sys-var()`, `pu-font`, `pu-elevation`, `pu-icon`) are injected via Vite for components/pages.

## Platform considerations

- UniApp templates use `<view>`, `<text>`, `<image>` (not HTML tags like `<div>`).
- Conditional compilation (`#ifdef`) is present and a custom Vite plugin processes it for tests (`vite-plugins/vite-plugin-uni-conditional-compile.ts`).
- Safe-area handling is done via components such as `src/components/common/safeAreaInset.vue`.

## Testing

- Tests run with Vitest (`vitest.config.ts`).
- Global Uni API mocks and DOM adapters are in `tests/setup.ts`.
- Component tests live under `tests/components/`.
