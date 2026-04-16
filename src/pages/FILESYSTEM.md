# src/pages Filesystem

This document maps page files from source inspection. The runtime page registry authority is `src/pages.json`.

## Tabbar Pages

These pages are registered in `src/pages.json` and listed in `tabBar.list`.

- `home/`
  - `home.vue` — Home/feed tab page
  - `home.scss` — page styles
  - `home.md` — page documentation
- `explore/`
  - `explore.vue` — Explore/discovery tab page
  - `explore.scss` — page styles
- `notification/`
  - `notification.vue` — Notification tab page
  - `notification.scss` — page styles
  - `notification.md` — page documentation
- `me/`
  - `me.vue` — Me/account tab page
  - `me.scss` — page styles
  - `me.md` — page documentation

## Domain Pages

### account/

- `profile/`
  - `profile.vue` — user profile view/edit page
  - `profile.scss` — page styles
  - `profile.md` — page documentation

### communication/

- `chat.vue` — chat conversation page
- `chat.ts` — chat page types and constants
- `chat.scss` — page styles
- `chat.md` — page documentation

### partner_request/

- `detail/`
  - `detail.vue` — partner request detail page
  - `detail.scss` — page styles
  - `detail.md` — page documentation
- `create_trip/`
  - `create_trip.vue` — registered creation page for trip request details
  - `create_trip.scss` — page styles
- `create_end/`
  - `create_end.vue` — registered creation finalization page
  - `create_end.scss` — page styles
- `create_start/`
  - `create_start.vue` — source file exists but is not registered in `src/pages.json`
  - `create_start.scss` — page styles
  - status: non-routable source; do not treat as an active page unless route authority is restored

### test/

Development/test pages are source files only unless registered in `src/pages.json`.

- `message.vue` — message component test page
- `scaffoldLayout.vue` — layout component test page
- `SubApplication.vue` — application model test page

## Route Authority

Route/address contracts are owned by `../../docs/15-alignment/ui-surface-map.md` and `../../docs/20-product-tdd/cross-unit-contracts.md`.

- Page registry: `src/pages.json`
- Page ids: `src/data/enum.ts`
- Page path mapping: `src/data/mapper.ts`
- Navigation wrapper: `src/utils/vendor.ts`
- Tabbar helpers: `src/utils/tabbar.ts`

## Related Directories

- `../business/` — domain models and API clients
- `../components/` — reusable UI components grouped by domain
- `../store/` — Pinia stores with persistence
- `../locale/` — i18n language bundles
- `../utils/` — utility and platform wrapper functions
- `../custom-tab-bar/` — Weixin custom tabbar implementation

## Naming Conventions

- Page folder names: lowercase, underscore-separated
- Page enum names: uppercase, underscore-separated
- Page file names: lowercase and usually matching the folder name
- Route paths: slash-separated and lowercase
