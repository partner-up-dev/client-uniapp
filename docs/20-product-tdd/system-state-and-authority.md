# System State and Authority

This file records cross-unit state ownership. It does not document every local reactive value.

| State | Authority | Derived Readers | Update Path | Hazard |
| --- | --- | --- | --- | --- |
| Account id | `src/store/account/index.ts` | pages, communication store, profile flows | account login/profile flows | Treating profile display state as account authority can break auth-dependent flows. |
| Access token | `src/store/account/index.ts` | `HTTPApiClient`, `DBApiClient` | `HTTPApiClient` response header parsing | Stale tokens can create repeated 401s or unauthorized PostgREST requests. |
| Backend API base URL | `import.meta.env.VITE_BACKEND_MAIN_URL` | `src/business/http-api.ts` | environment files | Missing or wrong URL breaks backend API requests. |
| PostgREST URL | `import.meta.env.VITE_PGRST_URL` | `src/business/db-api.ts` | environment files | Missing URL makes DB operations throw when used. |
| Supabase storage URL | `import.meta.env.VITE_SUPABASE_SERVER_URL` | `src/business/oss/index.ts` | environment files | Missing URL breaks object upload endpoints. |
| Locale messages | `src/locale/index.ts` and JSONC bundles | pages and components through `useTranslate()` or local `useI18n()` | locale bundle edits | Key drift causes missing or incorrect user-facing text. |
| Navigation registry | `src/pages.json` | UniApp runtime | route edits | A source page file is not navigable unless registered. |
| Navigation IDs | `src/data/enum.ts` | pages, utilities, stores | enum edits | `PAGE_ID` without `PAGE_PATH` creates broken typed navigation. |
| Navigation paths | `src/data/mapper.ts` | `navigate()` | mapper edits | `PAGE_PATH` without `pages.json` registration points to a dead route. |
| Tabbar runtime state | `src/custom-tab-bar/index.js`, `src/utils/tabbar.ts` | tab pages, notification/profile flows | tabbar helper calls | Tabbar route/index mismatch breaks switchTab behavior or selected state. |
| Message cache and unreads | `src/store/communication/message.ts` | chat, notifications, tabbar activity | message API calls and store actions | Incorrect rollback/order corrupts unread totals or latest-message display. |
| Storage keys | `LOCAL_STORAGE_KEY` in `src/data/enum.ts` | Pinia persistence, tabbar avatar, domain caches | enum edits | Renaming keys without migration can orphan persisted state. |

## Authority Rules

- A page may display state, but it does not own cross-unit state authority by default.
- A component may collect input, but business model and store boundaries decide durable state semantics.
- If the owning source changes, update this file and the relevant Unit TDD only when the change crosses unit boundaries.
