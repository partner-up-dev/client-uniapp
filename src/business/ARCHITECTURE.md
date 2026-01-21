# Business Architecture

## Overview

The business layer encapsulates domain models and API access. It follows an Active Record pattern where models contain both data and persistence methods. It sits between UI (pages/components) and infrastructure (HTTP, DB, stores).

## Core building blocks

- `index.ts`: `V.class` / `V.formClass`, `nullable()`, `instance()`, `limit_string()`.
- `http-api.ts`: `HTTPApiClient` with auth headers, success-code handling, 401 retry, and lazy `Body.parsed` parsing.
- `db-api.ts`: `DBApiClient` wrapping PostgREST with per-request auth headers.

## Model and form patterns

- Models extend `V.class` with Valibot schemas.
- Forms extend `V.formClass` and expose `validate()` plus `_subclassValidate()` hooks.
- Array-backed models are supported (see `docs/array-class-support.md`).
- Extended classes use `extend()` (see `docs/valibot-extend.md`).

## Typical data flow

```
Page/Component
  -> Business Model (V.class / V.formClass)
     -> HTTPApiClient or DBApiClient
        -> Body.parsed (Valibot parsing)
  -> Store (Pinia) for cache/state when needed
```

## i18n & errors

- Use the global composer (`t` from `src/locale`) for API messages and user-facing strings; keep them in the global JSONC bundles.
- Error reporting flows through `errorReport()`.

## Modules

- `account/`: login, profile, and account-level APIs.
- `partner_request/`: partner request forms and domain models.
- `communication/`: chats and messages.
- `base/`: shared models (e.g., `DatetimeV`, route/location).
- `oss/`: object storage-related logic (if used).
