# Unit TDD Index

This layer preserves unit-local design memory that is costly to rediscover but too narrow for Product TDD.

It does not own PRD claims, cross-unit contracts, runtime topology, or task evidence.

## Unit Pilots

- [http-api-client/](http-api-client/): main backend HTTP client, auth header injection, lazy response parsing, and 401 retry behavior
- [db-api-client/](db-api-client/): reusable PostgREST client with fresh per-operation auth headers
- [communication-chat-flow/](communication-chat-flow/): active chat list, unread state, latest-message preview, message retrieval, and send refresh behavior

## Admission Rule

Add or keep a Unit TDD folder only when all are true:

- the unit has non-obvious authority, invariants, or failure modes
- the knowledge is more specific than Product TDD
- code or tests alone do not communicate the risk cheaply

## Update Rules

- If a change crosses units, update [../20-product-tdd/](../20-product-tdd/) first.
- If a change affects runtime configuration, build commands, or deployment hazards, update [../40-deployment/](../40-deployment/) instead.
- If a unit's design is fully obvious from code and tests, prefer deleting prose over keeping stale docs.
