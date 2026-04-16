# Interaction and failure modes

- loadNewMessages fetches new message ids, then updates history list
- read() reports to the backend and rolls back on failure
- uni.$emit(EVENT.NEW_MESSAGE) is triggered for updated chats
- unreadHandler still exists in code but is marked `@deprecated`; do not extend it as the active durable flow without re-solidifying its contract first
