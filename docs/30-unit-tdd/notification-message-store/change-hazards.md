# Change hazards

- Changing history list ordering breaks lastMessage and pagination
- Allowing unreads to drop below zero corrupts totalUnread
- Changing read() rollback logic can permanently skew unread state
- Changing `upsertHistoryMessages` insertion behavior can duplicate messages or corrupt pagination windows
- Thread recursion behavior belongs to deprecated `unreadHandler`; preserve or remove it deliberately instead of treating it as an active contract by accident
