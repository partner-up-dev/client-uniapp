# Runtime Authority

## Environment Configuration

- Required variable source: `.env.example`
- Per-environment overrides: `.env.development`, `.env.staging`, `.env.production`
- Build/test command source: `package.json`

## Required Variables

| Variable | Runtime Consumer | Failure Mode |
| --- | --- | --- |
| `VITE_BACKEND_MAIN_URL` | `src/business/http-api.ts` | Backend API requests use an empty or invalid base URL. |
| `VITE_PGRST_URL` | `src/business/db-api.ts` | DB operations throw when a fresh builder is created. |
| `VITE_SUPABASE_SERVER_URL` | `src/business/oss/index.ts` | Object upload URLs cannot be built correctly. |
| `VITE_TENCENT_LBS_KEY` | `src/utils/lbs/` | Location service calls cannot authenticate correctly. |

## Declared But Not Required By Current Runtime Proof

These variables are declared in `.env.example` / `env.d.ts`, but this layer does not claim a current runtime requirement unless code paths use them:

- `VITE_BACKEND_MAIN_API_VERSION`
- `VITE_SUPABASE_ANYONYMOUS_KEY`

## Platform Authority

- Uni platform targets come from `package.json` scripts and Uni build tooling.
- Weixin custom tabbar runtime files live under `src/custom-tab-bar/`.
- Platform-specific conditional compilation is handled by source directives and `vite-plugins/vite-plugin-uni-conditional-compile.ts`.
