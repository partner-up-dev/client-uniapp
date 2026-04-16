# Cross-Unit Contracts

## CONTRACT-AUTH-HEADERS

- Owner state: `src/store/account/index.ts`
- Producers: `HTTPApiClient` updates `access_token` from `Authorization` or `authorization` response headers.
- Consumers: `HTTPApiClient` and `DBApiClient` read account auth headers before requests.
- Contract: request-time auth headers must be fresh enough for both backend API and PostgREST calls.
- Verification: check a token-bearing response updates `access_token`, then a later HTTP or DB request includes `Authorization: Bearer <token>`.

## CONTRACT-HTTP-DB-API

- Owner files: `src/business/http-api.ts`, `src/business/db-api.ts`
- Contract: main backend API and PostgREST clients share auth state but do not share request builders or response semantics.
- HTTP boundary: `HTTPApiClient` owns status handling, lazy body parsing, client id headers, and 401 retry behavior.
- DB boundary: `DBApiClient` owns fresh PostgREST builders and per-operation auth headers.
- Verification: API client changes must check auth header behavior, error path, and schema parsing or table schema behavior as applicable.

## CONTRACT-NAVIGATION

- Owner files: `src/pages.json`, `src/data/enum.ts`, `src/data/mapper.ts`, `src/utils/vendor.ts`
- Contract: each navigable `PAGE_ID` must have a `PAGE_PATH` entry and a registered `src/pages.json` route.
- Tabbar contract: tabbar pages must also stay consistent with `TABBAR_PAGE_ID`, `TABBAR_INDEX`, `src/pages.json` tabBar list, and `src/custom-tab-bar/index.js`.
- Verification: route additions or changes must check all owner files together.

## CONTRACT-I18N

- Owner files: `src/locale/index.ts`, `src/locale/zh-Hans/*.jsonc`, `src/locale/en-US/*.jsonc`
- Contract: user-facing copy should be expressed through global/domain bundles or local component/page messages.
- Domain contract: `useTranslate(domain)` provides domain-scoped `dt()` and shared `t()`.
- Verification: copy changes should check both supported locale aggregates when the key is global/domain-level.

## CONTRACT-PARTNER-APPLICATION

- Product rule source: [../10-prd/behavior/rules-and-invariants.md](../10-prd/behavior/rules-and-invariants.md)
- Owner anchors: `src/business/partner_request/`, `src/components/partner_request/PRApplyForm/`, `src/components/partner_request/SubApplication/`
- Contract: one `PartnerApplication` may contain multiple role-specific `PartnerSubApplications`.
- Contract: approval of any sub-application approves the whole application unless PRD changes first.
- Verification: role application changes must preserve sub-application identity and approval semantics.

## CONTRACT-COMMUNICATION-CHAT-FLOW

- Owner anchors: `src/store/communication/chat.ts`, `src/business/communication/chat.ts`, `src/business/communication/message.ts`, `src/components/communication/ChatEntry/`, `src/components/communication/ChatContent/`
- Contract: `useChatStore` owns the active local chat list and unread counts; there is no active persisted message-cache store authority.
- Contract: message history and latest-message previews are fetched through `Chat.get_messages()`, with caller-owned pagination and ordering.
- Contract: plain-text send flow uses `Message.send()` and refreshes the visible chat content after a successful send.
- Verification: communication changes must check notification chat filtering, unread badges, latest-message preview ordering, chat thread load/refresh, and send-then-refresh behavior.

## CONTRACT-OSS-UPLOAD

- Owner anchors: `src/business/oss/index.ts`, `src/components/common/avatar/`, `src/pages/me/me.vue`
- Runtime authority: `VITE_SUPABASE_SERVER_URL`
- Contract: upload URLs are built from the Supabase storage endpoint and account auth headers are included in upload requests.
- Verification: upload flow changes must check bucket/key construction, inferred content type, account auth headers, and returned object URL behavior.
