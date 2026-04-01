# Interaction and failure modes

- Request pipeline merges auth headers and per-request headers
- Response pipeline updates tokens, then evaluates success codes
- 401 responses call Account.login(false) and retry based on retry_left
- Errors trigger errorReport with api-name derived from i18n keys
- Failures resolve as rejected HttpApiResponse when status codes are not successful
