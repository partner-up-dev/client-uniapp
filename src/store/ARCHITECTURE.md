# Store Architecture

## Overview

The `src/store` folder contains Pinia stores for client-side state management and data persistence. Stores serve as a caching and session layer between the UI (pages/components) and the business layer (models and APIs). The architecture follows the Pinia composition pattern with automatic persistence via `pinia-plugin-unistorage`.

## Design principles

1. **Minimal and focused**: Stores cache data and session state only; business logic lives in `src/business/`.
2. **Entity-keyed dictionaries**: Store entities as `Record<EntityRef, Entity>` for O(1) access.
3. **Lazy parsing**: Getters parse stored data back into model instances (using Valibot schemas).
4. **Persistence by default**: Most stores enable `unistorage: true` for automatic local storage.
5. **Cross-layer integration**: Stores are imported in business models (not pages), keeping UI decoupled.

## Data flow

```
User Interaction (UI)
    ↓
Page Component (*.vue)
    ↓
Business Model (src/business/<domain>)
    ↓ (reads/writes)
Pinia Store (src/store/<domain>) ←→ Local Storage (pinia-plugin-unistorage)
    ↑
HTTP/DB Client (auth headers, caching)
```

## Store structure

All stores follow this pattern:

```typescript
import { defineStore } from "pinia";
import { type EntityRef, Entity } from "@/business/<domain>";

export interface XxxState {
  entities: Record<EntityRef, Entity>;
  // other state...
}

export const useXxxStore = defineStore('domain/module', {
  unistorage: true, // enable persistence
  
  state: (): XxxState => ({
    entities: {},
  }),
  
  getters: {
    // Typed entity access with optional refresh
    fetchById(state) {
      return (id: EntityRef, refresh: boolean = false): Entity | undefined => {
        const data = state.entities[id];
        if (!data && refresh) {
          // trigger backend fetch
          Entity.get(id);
          return undefined;
        }
        if (!data) return undefined;
        return Entity.parse(data); // parse to model instance
      };
    }
  },
  
  actions: {
    // CRUD operations only
    upsert(entity: Entity) {
      if (!entity.id) return;
      this.entities[entity.id] = entity;
    },
    
    remove(id: EntityRef) {
      delete this.entities[id];
    }
  }
});
```

## Store modules

### Core stores

**account/** — User session and authentication  
Stores `account_id`, `access_token`, and provides `authHeaders` getter used by HTTP/DB clients.

```typescript
state: {
  account_id?: string;
  access_token?: string;
}
getters: {
  isLoggedIn, myId, authHeaders, isMe(account_id)
}
actions: {
  upsertToken(headers)
}
```

**setting/** — App-level preferences  
Stores locale and other user settings.

```typescript
state: {
  locale: 'zh-Hans' | 'en' | 'zh-Hant' | string;
}
getters: {
  locale
}
actions: {
  setLocale(locale)
}
```

### API caching stores

**api/account** — Account API tokens  
Caches tokens for the main account API (distinct from PostgREST tokens).

**api/aliyun** — Aliyun STS credentials  
Caches temporary STS credentials for OSS access.

### Domain entity stores

**base/location** — Location entities  
Caches `Location` instances keyed by `location_id`.

**base/requirement** — Requirement entities  
Caches `Requirement` instances keyed by `requirement_id`.

**partner_request/** — Partner request drafts  
Stores draft content for the partner request editor (auto-save).

```typescript
state: {
  draft?: {
    type: PRType;
    content: PartnerRequestForm;
  };
}
getters: {
  draftContent, draftType
}
actions: {
  saveDraft(type, content), clearDraft()
}
```

**partner_request/partner** — Partner role entities  
Caches `PartnerRole` instances keyed by `role_id`.

**partner_request/split_the_bill/split_bill** — Split bill entities  
Caches `SplitBill` instances keyed by `split_bill_id`.

### Communication stores

**communication/chat** — Chat state  
Stores user's chat list and unread counts.

```typescript
state: {
  my_chats: Chat[];
  chat_unreads: Record<ChatRef, number>;
}
getters: {
  getChatUnread(chatId)
}
actions: {
  setMyChats(chats), addChat(chat),
  setChatUnreads(chatId, count), incrementUnread(chatId), resetUnread(chatId)
}
```

### Special-purpose stores

**migration/** — Data migration between app versions  
Tracks migration history and runs upgrade functions on app start.

```typescript
state: {
  history: APP_VERSION[]; // versions already migrated
}
actions: {
  async migrate() // runs pending migrations
}
```

Migration functions are defined in `migration/funcs.ts`:

```typescript
export const migration_func_list = [
  {
    version: APP_VERSION.V0_1_3,
    up: () => { uni.clearStorageSync(); }
  },
  // ...
] as MigrationFunc[];
```

## Store access patterns

### In business models (preferred)

Stores are imported with explicit `store` parameter:

```typescript
import { useAccountStore } from "@/store/account";
import store from "@/store";

export class Account {
  static login(): Promise<void> {
    const accountStore = useAccountStore(store);
    // ...
  }
}
```

HTTP/DB clients inject auth headers from the account store:

```typescript
// In http-api.ts
const authHeaders = useAccountStore(store).authHeaders as Record<string, unknown>;
```

### In pages/components (rare)

Direct store access in pages is discouraged; prefer business model methods. When necessary:

```typescript
import { useAccountStore } from "@/store/account";

const accountStore = useAccountStore(); // composition API context
const isLoggedIn = accountStore.isLoggedIn;
```

### Cross-store dependencies

Stores can import other stores:

```typescript
import { useAccountStore } from "../account";

actions: {
  someAction() {
    const accountStore = useAccountStore();
    const myId = accountStore.myId;
    // ...
  }
}
```

Keep cross-store imports minimal and avoid circular dependencies.

## Persistence strategy

Persistence is enabled globally via `pinia-plugin-unistorage` (configured in `src/main.ts`):

```typescript
import { createUnistorage } from "pinia-plugin-unistorage";
const store_persistence = createUnistorage();
store.use(store_persistence);
```

Stores opt-in to persistence by setting `unistorage: true`:

```typescript
export const useXxxStore = defineStore('xxx', {
  unistorage: true, // automatically persists to uni.storage
  // ...
});
```

**When to persist:**

- Session state (tokens, user IDs)
- Entity caches (profiles, locations, requirements)
- User preferences (locale, settings)
- Drafts and temporary data

**When NOT to persist:**

- Transient UI state (loading flags, modal visibility)
- Computed/derived state (can be recalculated)
- Large or frequently-changing data (may exceed storage limits)

## Store lifecycle

1. **Initialization** (`src/main.ts`):
   - Pinia store created with `createPinia()`
   - `createUnistorage()` plugin registered
   - Store instance provided to Vue app

2. **First access**:
   - Store is instantiated via `useXxxStore()`
   - If `unistorage: true`, state is restored from local storage
   - State shape is initialized if no persisted data exists

3. **Runtime**:
   - Getters compute derived state
   - Actions mutate state
   - Mutations automatically sync to local storage (if `unistorage: true`)

4. **Migration** (`App.vue` → `onLaunch`):
   - `useMigrationStore().migrate()` runs pending migrations
   - May clear storage or transform persisted state

## Error handling

Stores do not handle errors directly; error handling is delegated to business models:

```typescript
// In business model
Account.login()
  .then((profile) => {
    // success: store is updated via action
  })
  .catch((err) => {
    errorReport(err); // user-facing error dialog
  });
```

## Testing

Stores are tested indirectly via business model tests. Direct Pinia store tests are rare due to the minimal logic in stores.

## References

- [AGENTS.md](AGENTS.md) — quick reference and conventions
- [FILESYSTEM.md](FILESYSTEM.md) — file structure and module inventory
- `src/main.ts` — store initialization
- `src/business/http-api.ts` — HTTP client with store integration
- `src/business/db-api.ts` — DB client with store integration
- Pinia docs: <https://pinia.vuejs.org/>
- pinia-plugin-unistorage: <https://github.com/Allen-1998/pinia-plugin-unistorage>
