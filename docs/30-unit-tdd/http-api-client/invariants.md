# Invariants

- Every request injects auth headers from the account store and adds x-Client-Id
- Response interceptors update the account token from Authorization or authorization headers
- 401 responses trigger login retry only when retry_left is greater than zero
- Custom status code handlers can override success or failure decisions
- Body parsing is lazy and respects an optional Valibot schema or class parse method
