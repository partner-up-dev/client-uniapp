# Operational Hazards

## Environment

- Missing or invalid `VITE_BACKEND_MAIN_URL` breaks `HTTPApiClient` requests.
- Missing `VITE_PGRST_URL` lets `DBApiClient` construct but throws when DB operations create a fresh builder.
- Missing or invalid `VITE_SUPABASE_SERVER_URL` breaks OSS upload URLs such as avatar upload.
- Missing or invalid `VITE_TENCENT_LBS_KEY` can break map/location features.

## Auth and API

- Auth header mismatches can lead to repeated 401 handling and logout events.
- Response header casing matters; token updates must support both `Authorization` and `authorization`.
- HTTP and DB clients share auth state but have different request semantics.
- OSS upload uses account auth headers; token drift can also break object upload.

## Navigation and Tabbar

- `PAGE_ID`, `PAGE_PATH`, and `src/pages.json` mismatches break typed navigation.
- Tabbar route/index mismatches can break `switchTab`, selected state, badge state, or avatar display.
- A source page file is not a runtime route unless `src/pages.json` registers it.

## Localization

- Locale bundle drift can cause missing text or runtime fallback behavior.
- Hard-coded user-facing text bypasses locale authority and makes mini-program surfaces inconsistent.

## Verification Gaps

- Several deployment checks are manual today.
- Do not claim automated coverage unless a package script, test, or CI check actually enforces it.
