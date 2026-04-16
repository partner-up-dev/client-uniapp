# UI Surface Map

This is a calculable address map for high-frequency UI targets. It should match `src/pages.json`, `src/data/enum.ts`, `src/data/mapper.ts`, and existing source files.

Do not put product semantics here. Use `docs/10-prd/` for product truth and `docs/20-product-tdd/` for cross-unit contracts.

## Authority Anchors

- Page registry: `src/pages.json`
- Page IDs and tabbar IDs: `src/data/enum.ts`
- Page path mapper and tabbar index mapper: `src/data/mapper.ts`
- Navigation helper: `src/utils/vendor.ts`
- Tabbar helpers: `src/utils/tabbar.ts`
- Weixin custom tabbar implementation: `src/custom-tab-bar/index.js`, `src/custom-tab-bar/index.wxml`, `src/custom-tab-bar/index.wxss`, `src/custom-tab-bar/index.json`

## Tab Surfaces

### surface.tab.home

- Page ID: `PAGE_ID.HOME`
- Tabbar ID: `TABBAR_PAGE_ID.HOME`
- Route: `/pages/home/home`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/home/home.vue`, `src/custom-tab-bar/index.js`, `src/custom-tab-bar/index.wxml`, `src/utils/tabbar.ts`

### surface.tab.explore

- Page ID: `PAGE_ID.EXPLORE`
- Tabbar ID: `TABBAR_PAGE_ID.EXPLORE`
- Route: `/pages/explore/explore`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/explore/explore.vue`, `src/components/partner_request/`, `src/custom-tab-bar/index.js`, `src/custom-tab-bar/index.wxml`

### surface.tab.notification

- Page ID: `PAGE_ID.NOTIFICATION`
- Tabbar ID: `TABBAR_PAGE_ID.NOTIFICATION`
- Route: `/pages/notification/notification`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/notification/notification.vue`, `src/store/communication/message.ts`, `src/custom-tab-bar/index.js`, `src/custom-tab-bar/index.wxml`

### surface.tab.me

- Page ID: `PAGE_ID.ME`
- Tabbar ID: `TABBAR_PAGE_ID.ME`
- Route: `/pages/me/me`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/me/me.vue`, `src/store/account/`, `src/custom-tab-bar/index.js`, `src/custom-tab-bar/index.wxml`

## Partner Request Surfaces

### surface.pr.detail

- Page ID: `PAGE_ID.PR_DETAIL`
- Route: `/pages/partner_request/detail/detail`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/partner_request/detail/detail.vue`, `src/components/partner_request/`

### surface.pr.create.trip

- Page ID: `PAGE_ID.PR_CREATE_TRIP`
- Route: `/pages/partner_request/create_trip/create_trip`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/partner_request/create_trip/create_trip.vue`, `src/components/partner_request/trip/`, `src/components/partner_request/PRImmersiveForm/`

### surface.pr.create.end

- Page ID: `PAGE_ID.PR_CREATE_END`
- Route: `/pages/partner_request/create_end/create_end`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/partner_request/create_end/create_end.vue`, `src/components/partner_request/`

## Communication Surfaces

### surface.chat.thread

- Page ID: `PAGE_ID.CHAT`
- Route: `/pages/communication/chat`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/communication/chat.vue`, `src/store/communication/message.ts`, `src/store/communication/chat.ts`, `src/business/communication/`

## Account Surfaces

### surface.account.profile

- Page ID: `PAGE_ID.PROFILE`
- Route: `/pages/account/profile/profile`
- Registered in `pages.json`: yes
- Primary anchors: `src/pages/account/profile/profile.vue`, `src/business/account/`, `src/store/account/`

## Non-Routable Source Anchors

### source.pr.create_start

- Route status: not registered in `src/pages.json`
- Page ID status: no `PAGE_ID` member in `src/data/enum.ts`
- Source files: `src/pages/partner_request/create_start/create_start.vue`, `src/pages/partner_request/create_start/create_start.scss`
- Usage rule: do not target this as a navigable page surface unless a later task explicitly adds route and page ID authority.

## Known Invalid Anchor Pattern

- The custom tabbar has no Vue single-file component entry in this repo. Use the Weixin native files under `src/custom-tab-bar/index.*`.

## Update Rules

- If a page path changes, update `src/pages.json`, `src/data/enum.ts`, `src/data/mapper.ts`, and this map in the same task.
- If a tabbar route changes, update `src/pages.json`, `src/custom-tab-bar/index.js`, `src/data/mapper.ts`, and this map in the same task.
- If a source folder exists but is not registered in `pages.json`, list it only under non-routable source anchors.
