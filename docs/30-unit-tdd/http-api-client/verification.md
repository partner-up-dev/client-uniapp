# Verification

- Manual check: request includes Authorization and x-Client-Id headers
- Manual check: 401 with retry_left triggers login and a single retry
- Manual check: response Authorization header updates access_token
- Automated tests: none documented yet
