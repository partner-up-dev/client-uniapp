# src/pages Filesystem

This document maps the pages directory structure and explains the organization.

## TabBar pages (root-level)

Pages at the top level of `src/pages/` are registered in `src/pages.json` as TabBar pages. They are always visible (except when navigated away from) and have a tab at the bottom.

- **home/** — Home/feed page (tab index 0)
  - `home.vue` — main component
  - `home.scss` — page styles
  - `home.md` — documentation

- **explore/** — Exploration/discovery page (tab index 1)
  - `explore.vue` — main component
  - `explore.scss` — page styles

- **notification/** — Notifications page (tab index 2)
  - `notification.vue` — main component
  - `notification.scss` — page styles
  - `notification.md` — documentation

- **me/** — Profile/account page (tab index 3)
  - `me.vue` — main component
  - `me.scss` — page styles
  - `me.md` — documentation

## Domain pages

Pages are grouped by domain in subfolders. Each page can receive route parameters and is navigated via `navigate()` or `uni.navigateTo()`.

### account/

Account and profile-related pages.

- **profile/** — User profile view/edit page
  - `profile.vue` — main component
  - `profile.scss` — page styles
  - `profile.md` — documentation

### communication/

Chat and messaging pages.

- **chat.vue** — Chat conversation page
  - Receives route parameter: `id` (chat/conversation ID)
  - Displays message history and send interface
  - Associated files:
    - `chat.scss` — page styles
    - `chat.ts` — types, constants, and helpers (e.g., `ChatPageParams`, `MAX_MESSAGE_LENGTH`)
    - `chat.md` — documentation

### partner_request/

Partner request creation, detail, and management pages.

- **detail/** — Partner request detail page
  - `detail.vue` — main component (shows request info, roles, apply form)
  - `detail.scss` — page styles
  - `detail.md` — documentation
  - Receives route parameter: `id` (partner request ID)

- **create_start/** — Create partner request flow, step 1
  - `create_start.vue` — main component (select request type)
  - `create_start.scss` — page styles
  - First step in creating a new partner request

- **create_trip/** — Create partner request flow, step 2
  - `create_trip.vue` — main component (configure trip/route preferences)
  - `create_trip.scss` — page styles
  - Handles route input and trip preferences

- **create_end/** — Create partner request flow, step 3
  - `create_end.vue` — main component (finalize and submit)
  - `create_end.scss` — page styles
  - Final step before submission

### test/

Test and development pages (not for production use).

- **message.vue** — Message component test page
- **scaffoldLayout.vue** — Layout component test page
- **SubApplication.vue** — Application model test page

## File structure conventions

See [ARCHITECTURE.md](ARCHITECTURE.md) for pattern details and examples.

## Page registry (src/pages.json)

All pages must be registered in `src/pages.json`:

```json
{
  "pages": [
    {
      "path": "pages/home/home",
      "style": { /* ... */ }
    },
    {
      "path": "pages/communication/chat",
      "style": { /* ... */ }
    },
    // ... more pages
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/home/home", /* ... */ },
      { "pagePath": "pages/explore/explore", /* ... */ },
      // ... more tabs
    ]
  }
}
```

## Page enumeration (src/data/enum.ts)

Page IDs are defined in a TypeScript enum for type-safe navigation:

```typescript
export enum PAGE_ID {
  // TabBar pages
  HOME = 'home',
  EXPLORE = 'explore',
  NOTIFICATION = 'notification',
  ME = 'me',
  
  // Regular pages
  PR_DETAIL = 'pr_detail',
  PR_CREATE_TRIP = 'pr_create_trip',
  CHAT = 'chat',
  PROFILE = 'profile',
}

export enum TABBAR_PAGE_ID {
  HOME = 'home',
  EXPLORE = 'explore',
  NOTIFICATION = 'notification',
  ME = 'me',
}
```

## Page path mapping (src/data/mapper.ts)

Page IDs map to file paths:

```typescript
export const PAGE_PATH: Record<PAGE_ID, string> = {
  [PAGE_ID.HOME]: '/pages/home/home',
  [PAGE_ID.PR_DETAIL]: '/pages/partner_request/detail/detail',
  [PAGE_ID.CHAT]: '/pages/communication/chat',
  // ...
};

export const TABBAR_INDEX: Record<TABBAR_PAGE_ID, number> = {
  [PAGE_ID.HOME]: 0,
  [PAGE_ID.EXPLORE]: 1,
  [PAGE_ID.NOTIFICATION]: 2,
  [PAGE_ID.ME]: 3,
};
```

Use these for type-safe navigation:

```typescript
import { navigate } from '@/utils/vendor';
import { PAGE_ID } from '@/data/enum';

navigate(PAGE_ID.PR_DETAIL, { id: 42 });
```

## Related directories

- `src/business/` — Domain models and API clients
- `src/components/` — Reusable UI components (grouped by domain)
- `src/store/` — Pinia stores with persistence
- `src/locale/` — i18n language bundles
- `src/utils/` — Utility functions
- `src/styles/` — Design tokens and global styles
- `src/custom-tab-bar/` — TabBar implementation
- `tests/pages/` — Page tests

## Naming conventions

- **Page folder names**: lowercase, underscore-separated (e.g., `partner_request`, `create_trip`)
- **Page names in enum**: UPPERCASE, underscore-separated (e.g., `PR_DETAIL`, `CREATE_TRIP`)
- **Page file names**: lowercase, match folder name (e.g., `detail.vue`, `create_trip.vue`)
- **Route paths**: slash-separated, all lowercase (e.g., `/pages/partner_request/detail/detail`)
