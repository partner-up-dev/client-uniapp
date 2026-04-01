# Change hazards

- Removing token updates breaks downstream auth and DBApiClient headers
- Changing success code defaults can silently convert errors into success or vice versa
- Removing retry metadata breaks 401 recovery behavior
- Skipping error reporting hides server failures from users
