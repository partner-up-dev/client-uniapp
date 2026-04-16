# Change hazards

- Reusing a single builder can send stale auth headers
- Moving or removing the missing-env guard changes whether failures happen at construction time or operation time
- Altering schema defaults can break queries across modules
