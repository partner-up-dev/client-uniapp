# Change hazards

- Reintroducing a message-cache store without changing Product TDD first creates competing message authority.
- Changing `Chat.get_messages()` ordering or pagination can invert latest-message previews or chat thread display.
- Mutating unread counts outside `useChatStore` can desynchronize notification badges.
- Making login wait on chat-list loading would change launch behavior and failure semantics.
- Sending without a follow-up refresh can leave the visible thread stale.
