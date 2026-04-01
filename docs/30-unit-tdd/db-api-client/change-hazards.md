# Change hazards

- Reusing a single builder can send stale auth headers
- Removing the missing-env guard causes silent failures later
- Altering schema defaults can break queries across modules
