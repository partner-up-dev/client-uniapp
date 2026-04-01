# UI surface map

Medium-native address map for high-frequency surfaces.

## Primary surfaces

- surface.tab.home
  - Page ID: `PAGE_ID.HOME`
  - Route: `/pages/home/home`
  - Primary anchors: `src/pages/home/home.vue`, `src/custom-tab-bar/index.vue`
- surface.tab.explore
  - Page ID: `PAGE_ID.EXPLORE`
  - Route: `/pages/explore/explore`
  - Primary anchors: `src/pages/explore/explore.vue`, `src/components/partner_request/**/*`
- surface.tab.notification
  - Page ID: `PAGE_ID.NOTIFICATION`
  - Route: `/pages/notification/notification`
  - Primary anchors: `src/pages/notification/notification.vue`, `src/store/communication/message.ts`
- surface.tab.me
  - Page ID: `PAGE_ID.ME`
  - Route: `/pages/me/me`
  - Primary anchors: `src/pages/me/me.vue`, `src/store/account/**/*`

## Partner request and chat surfaces

- surface.pr.detail
  - Page ID: `PAGE_ID.PR_DETAIL`
  - Route: `/pages/partner_request/detail/detail`
  - Primary anchors: `src/pages/partner_request/detail/detail.vue`, `src/components/partner_request/**/*`
- surface.pr.create.trip
  - Page ID: `PAGE_ID.PR_CREATE_TRIP`
  - Route: `/pages/partner_request/create_trip/create_trip`
  - Primary anchors: `src/pages/partner_request/create_trip/create_trip.vue`, `src/components/partner_request/trip/**/*`
- surface.pr.create.end
  - Page ID: `PAGE_ID.PR_CREATE_END`
  - Route: `/pages/partner_request/create_end/create_end`
  - Primary anchors: `src/pages/partner_request/create_end/create_end.vue`, `src/components/partner_request/**/*`
- surface.chat.thread
  - Page ID: `PAGE_ID.CHAT`
  - Route: `/pages/communication/chat`
  - Primary anchors: `src/pages/communication/chat.vue`, `src/store/communication/message.ts`, `src/business/communication/**/*`

## Account surfaces

- surface.account.profile
  - Page ID: `PAGE_ID.PROFILE`
  - Route: `/pages/account/profile/profile`
  - Primary anchors: `src/pages/account/profile/profile.vue`, `src/business/account/**/*`

## Navigation authority anchors

- `src/data/enum.ts` owns `PAGE_ID` and `TABBAR_PAGE_ID`
- `src/data/mapper.ts` owns `PAGE_PATH`
- `src/utils/vendor.ts` owns `navigate()` behavior (`switchTab` vs `navigateTo`)

## Usage notes

- Use surface IDs in change requests before listing files.
- If a new user-visible surface is added, update this file in the same task.
- Do not place product semantics here; keep this map address-focused.
