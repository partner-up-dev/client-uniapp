# DBApiClient

Location: src/business/db-api.ts

Purpose: provide a reusable PostgREST client that refreshes auth headers for every operation.

## Owner Boundary

- Owns PostgREST query-builder creation for reusable model-level DB access.
- Does not own account state; it reads auth headers from `src/store/account/index.ts`.
- Does not own main backend HTTP semantics; that belongs to `HTTPApiClient`.

## Product TDD Links

- [../../20-product-tdd/cross-unit-contracts.md](../../20-product-tdd/cross-unit-contracts.md)
- [../../20-product-tdd/system-state-and-authority.md](../../20-product-tdd/system-state-and-authority.md)
