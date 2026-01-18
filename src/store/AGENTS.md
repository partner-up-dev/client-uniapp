# Store Agent Notes

This folder contains Pinia stores for state management and data persistence.

## When editing this folder

- Read this file, plus the repo-level AGENTS/ARCHITECTURE/FILESYSTEM docs first.
- Follow Pinia conventions for `defineStore()`.
- Enable persistence via `unistorage: true` for stores that need local caching.
- Keep state shape flat and entity-keyed (prefer dictionaries over arrays).
- Use TypeScript interfaces for state typing.
- Provide getters for typed entity access; add optional `refresh` parameters for lazy loading.
- Keep actions minimal: CRUD and state updates only.
- Never put business logic in stores; delegate to business models.
- Import stores in business models, not in pages/components (except special cases).

## Store access patterns

**In business models:**

```typescript
import { useAccountStore } from "@/store/account";
import store from "@/store";

// Access within static methods
const accountStore = useAccountStore(store);
const authHeaders = accountStore.authHeaders;
```

**In pages/components (rare):**

```typescript
import { useAccountStore } from "@/store/account";

const accountStore = useAccountStore(); // no store arg needed in composition API context
const isLoggedIn = accountStore.isLoggedIn;
```

## Persistence (pinia-plugin-unistorage)

- Enabled globally in `src/main.ts` via `createUnistorage()`.
- Stores with `unistorage: true` are automatically persisted to UniApp storage.
- Use for caching expensive data (profiles, entities) and session state (tokens, drafts).
- Avoid for transient UI state (loading flags, temporary selections).

## Common patterns

### Entity caching

```typescript
state: () => ({
  entities: {} as Record<EntityRef, Entity>
}),
getters: {
  fetchById(state) {
    return (id: EntityRef): Entity | undefined => {
      const data = state.entities[id];
      if (!data) return undefined;
      return Entity.parse(data); // parse to model instance
    };
  }
},
actions: {
  upsert(entity: Entity) {
    if (!entity.id) return;
    this.entities[entity.id] = entity;
  }
}
```

## Cross-store dependencies

Stores can import and use other stores:

```typescript
import { useAccountStore } from "../account";

// In action:
const accountStore = useAccountStore();
const myId = accountStore.myId;
```

Keep dependencies minimal and avoid circular imports.

## Module organization

Stores are grouped by domain:

- `account/` — user session and auth
- `api/` — external API caching (Aliyun STS, account API tokens)
- `base/` — base entity caching (locations, requirements)
- `communication/` — chat and message state
- `migration/` — data migration between app versions
- `partner_request/` — request drafts and role caching
- `setting/` — app-level preferences

See [FILESYSTEM.md](FILESYSTEM.md) for the full inventory.

## Testing

Stores are tested indirectly via business model tests. Direct store tests are rare.

## References

- [ARCHITECTURE.md](ARCHITECTURE.md) — patterns, data flow, design decisions
- [FILESYSTEM.md](FILESYSTEM.md) — file structure and module inventory
- `src/main.ts` — store initialization and plugin setup
- Pinia docs: <https://pinia.vuejs.org/>
- pinia-plugin-unistorage: <https://github.com/Allen-1998/pinia-plugin-unistorage>
