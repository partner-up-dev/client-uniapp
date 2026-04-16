# Interaction and failure modes

- createFreshBuilder builds a new URL and headers for each operation
- Missing VITE_PGRST_URL lets client construction complete with a warning, then DB operations throw when they create a fresh builder
- Queries use miniprogram-compatible postgrest-js classes
