# Pages Architecture

## Overview

The `src/pages` folder contains all page components for the PartnerUp client, organized into TabBar pages and domain-specific pages. Pages serve as the presentation layer, connecting user interactions to the business layer (models and API) and state management (Pinia stores).

## Data flow

```
User Interaction (UI)
    ↓
Page Component (*.vue)
    ↓
Business Model (src/business/<domain>)
    ↓
HTTP Client or DB Client
    ↓
Response Body (lazy parsing via Valibot)
    ↓
Pinia Store (src/store/<domain>) — optional, for caching/shared state
    ↓
Template Binding (reactive refs)
```

## Page lifecycle

Every page follows the UniApp lifecycle:

```
onLoad() → onReady() → onShow() → [user interaction] → onHide() → onUnload()
```

Key hooks:

1. **onLoad(query)**: Page is created, route parameters are available (as strings).
   - Parse parameters using Valibot schemas.
   - Fetch initial data from business models.
   - Initialize reactive state.

2. **onReady()**: Initial render complete, DOM is available.
   - Setup refs that need DOM access (e.g., scroll-view refs).

3. **onShow()**: Triggered on every page appearance (including navigation back).
   - Refresh UI-dependent state (e.g., re-sync with store).
   - Used for polling or periodic updates.

4. **onHide()/onUnload()**: Cleanup timers, listeners, etc.

## Component composition

Pages are composed of:

1. **Layout components** from `src/components/common/`:
   - `scaffoldLayout` — standard page container
   - `navBar` — page header/navigation
   - `safeAreaInset` — device safe area handling
   - `safeArea` — WeChat menu button safe area

2. **Domain components** from `src/components/<domain>/`:
   - Reusable business-specific UI pieces (e.g., `PRForm`, `ChatContent`)

3. **UniApp tags only**: Never use web tags like `<div>`, `<span>`, `<button>`.

## Navigation

Pages are navigated via the `navigate()` helper:

```typescript
navigate(PAGE_ID.HOME);                        // switch to TabBar page
navigate(PAGE_ID.PR_DETAIL, { id: 42 });     // navigate with parameters
navigate("/pages/custom/path", { data: ... }); // or use path directly
```

- **TabBar pages**: Internally uses `uni.switchTab()`.
- **Regular pages**: Uses `uni.navigateTo()` with parameters serialized as query strings.

Route parameters are always received as strings in `onLoad()` and must be parsed.

## State management

Pages interact with Pinia stores for:

- **Caching** expensive data (e.g., user profile, chat history).
- **Sharing state** across multiple pages (e.g., selected partner request).
- **Persistence** via `pinia-plugin-unistorage` (enabled globally in `src/main.ts`).

Example:

```typescript
const { baseProfile } = AccountBaseProfile.use(); // Pinia store hook
// baseProfile is a ref, reactive updates appear in template
```

Stores live in `src/store/<domain>/` and follow the Pinia pattern.

## i18n integration

All text is localized via `useTranslate()`:

```typescript
const { dt, t } = useTranslate("home");

// Domain-scoped: looks up "home.welcome.greeting"
dt("welcome.greeting")

// Global scope: looks up "common.yes"
t("common.yes")
```

Language bundles are in `src/locale/<lang>/` and configured in `src/locale/index.ts`.

## Page types

See [FILESYSTEM.md](FILESYSTEM.md) for page inventory and structure.

## Error handling

Business model calls may fail (network, validation, etc.):

```typescript
BusinessModel.method()
  .then((result) => {
    // Update UI
  })
  .catch((err) => {
    errorReport(err); // user-facing error dialog + logging
  });
```

`errorReport()` from `src/utils/vendor.ts` handles the error lifecycle.

## Styling and theming

Pages use SCSS design tokens and UnoCSS utilities. See `.github/instructions/style.instructions.md` and `src/styles/presets/design.ts` for details.

## Testing

Pages are integration-tested via `tests/pages/`. See test setup in `tests/setup.ts` for mocks.

## References

### Core files

- `src/pages.json` — page registry and tabbar configuration
- `src/data/enum.ts` — page IDs, tabbar indices, storage keys
- `src/data/mapper.ts` — page path mapping

### Utilities

- `src/utils/vendor.ts` — `navigate()`, `errorReport()`, `uni` helpers
- `src/utils/tabbar.ts` — tabbar sync and avatar state
- `src/utils/format.ts`, `src/utils/string.ts` — formatting helpers
- `src/utils/time.ts` — time/datetime utilities

### Common components

- `src/components/common/safeAreaInset.vue` — safe area handling
- `src/components/common/navBar/navBar.vue` — page header
- `src/components/common/layout/scaffoldLayout.vue` — page container

### Business and stores

- `src/business/` — domain models and API clients
- `src/store/` — Pinia stores with persistence
- `src/locale/use.ts` — `useTranslate()` hook

### Instructions

- `src/pages/AGENTS.md` — page development index and conventions
- `src/pages/ARCHITECTURE.md` — page architecture and data flow
- `src/pages/FILESYSTEM.md` — page directory structure
- `.github/instructions/vue.instructions.md` — Vue 3 component conventions
- `.github/instructions/style.instructions.md` — styling guidelines
