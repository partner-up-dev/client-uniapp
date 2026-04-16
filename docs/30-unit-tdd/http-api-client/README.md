# HTTPApiClient

Location: src/business/http-api.ts

Purpose: provide a reusable HTTP client with auth header injection, response parsing, and 401 retry logic for the main backend API.

## Owner Boundary

- Owns main backend request construction and response normalization.
- Does not own account state; it reads and updates token state through `src/store/account/index.ts`.
- Does not own PostgREST behavior; that belongs to `DBApiClient`.

## Product TDD Links

- [../../20-product-tdd/cross-unit-contracts.md](../../20-product-tdd/cross-unit-contracts.md)
- [../../20-product-tdd/system-state-and-authority.md](../../20-product-tdd/system-state-and-authority.md)
