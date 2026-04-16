# Invariants

- messages is keyed by message id
- history_messages lists message ids per chat, newest first
- unreads stores per-chat unread counts and may be zero
- totalUnread equals the sum of unreads values
- read() must decrement unreads and report read status to the backend
- The `unread` getter currently returns `null` for missing state and also for stored zero because it uses a falsy fallback; changes around zero-vs-absence semantics need explicit verification.
