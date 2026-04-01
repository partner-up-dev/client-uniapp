# Interaction and failure modes

- createFreshBuilder builds a new URL and headers for each operation
- Missing VITE_PGRST_URL causes an immediate runtime error
- Queries use miniprogram-compatible postgrest-js classes
