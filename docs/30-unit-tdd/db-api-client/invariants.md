# Invariants

- Each operation creates a fresh PostgrestQueryBuilder with updated auth headers
- DBApiClient throws when VITE_PGRST_URL is not configured
- The configured schema defaults to public unless explicitly set
- Table schema validation is passed through to the underlying builder when provided
