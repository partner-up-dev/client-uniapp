# Runtime Topology

## Client Targets

- UniApp client targeting mini-program platforms.
- Primary targets currently exposed by scripts: Weixin and Alipay mini-programs.
- H5 is also available for development and tests through package scripts.

## Runtime Services

| Service | Env Authority | Primary Code Anchors | Notes |
| --- | --- | --- | --- |
| Main backend API | `VITE_BACKEND_MAIN_URL` | `src/business/http-api.ts` | Used by `HTTPApiClient` for backend API requests. |
| PostgREST API | `VITE_PGRST_URL` | `src/business/db-api.ts`, `src/libs/postgrest-js/` | Used by `DBApiClient`; operations throw if URL is missing. |
| Supabase Storage / OSS | `VITE_SUPABASE_SERVER_URL` | `src/business/oss/index.ts`, `src/components/common/avatar/` | Used for object upload flows such as profile avatar upload. |
| Tencent LBS | `VITE_TENCENT_LBS_KEY` | `src/utils/lbs/` | Used for location/map related utilities. |

## Local Runtime Entrypoints

- App boot: `src/main.ts`
- App lifecycle: `src/App.vue`
- Page registry and tabbar config: `src/pages.json`
- Weixin custom tabbar: `src/custom-tab-bar/index.*`
- Vite/Uni config: `vite.config.ts`
