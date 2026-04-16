# Invariants

- Each operation creates a fresh PostgrestQueryBuilder with updated auth headers
- DBApiClient does not throw during construction when VITE_PGRST_URL is missing; it throws when an operation needs a fresh builder
- The configured schema defaults to public unless explicitly set
- Table schema validation is passed through to the underlying builder when provided
