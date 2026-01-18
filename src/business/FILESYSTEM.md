# src/business Filesystem

## Root

- `index.ts` — Valibot-backed class helpers: `V.class`, `V.formClass`, `nullable()`, `instance()`, `limit_string()`.
- `http-api.ts` — HTTP API client wrapper using `@uni-helper/uni-network`.
- `db-api.ts` — PostgREST client wrapper with per-request auth headers.

## Modules

- `account/` — account models, login, and profile APIs.
  - `base.ts` — base profile model and login flow.
  - `index.ts` — exports and shared types.
- `base/` — shared domain types.
  - `index.ts` — enums and shared Valibot schemas (e.g., `DatetimeV`).
  - `route.ts` — routes, locations, planning, and related forms.
- `communication/` — chat and message models.
  - `chat.ts` — chat domain model and API access.
  - `message.ts` — message model and API access.
  - `index.ts` — exports and shared types.
- `partner_request/` — partner request domain.
  - `form.ts` — request form validation.
  - `partner.ts` / `trip.ts` / `commute.ts` / `ride_hailing.ts` — request-related models.
  - `application.ts` — application models.
  - `index.ts` — exports and shared types.
- `oss/` — storage-related logic.
  - `index.ts` — module entry/exports.
