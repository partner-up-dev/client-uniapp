# Authority and state

- Base URL is derived from VITE_BACKEND_MAIN_URL
- Account token is owned by src/store/account and read via authHeaders
- Operation identifiers are passed through request extras for error reporting
- Fallback schema is stored per client instance
