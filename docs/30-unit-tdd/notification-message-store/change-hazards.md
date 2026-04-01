# Change hazards

- Changing history list ordering breaks lastMessage and pagination
- Allowing unreads to drop below zero corrupts totalUnread
- Removing thread recursion breaks unread counts for child threads
- Changing read() rollback logic can permanently skew unread state
