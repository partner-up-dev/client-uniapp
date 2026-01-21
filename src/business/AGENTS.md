# Business Agent Notes

This folder contains the domain models and API clients used by pages/components.

## When editing this folder

- Read this file, plus the repo-level AGENTS/ARCHITECTURE/FILESYSTEM docs first.
- Prefer `V.class` / `V.formClass` for models and forms.
- Use `nullable()` for nullable fields and `instance()` for nested model types.
- Use `DatetimeV` for date-like fields.
- Provide `Ref`/`V`/`Prop` aliases when adding new domain entities.
- Prefer `Promise.then().catch()` to `async/await`.

## API usage patterns

- HTTP: use `HTTPApiClient` and return `body.parsed` with an explicit schema.
- DB: use `DBApiClient` for PostgREST queries; keep auth headers in sync.
- Use the app composer (`t` from `src/locale`) for API/user-facing messages; keep text in the global JSONC bundles.

## Forms and validation

- Use `V.formClass` for forms; keep validation logic inside `_subclassValidate()`.
- Add per-field validation with Valibot schemas; use composables for loading states.

## References

- `docs/array-class-support.md` for array-backed `V.class` models.
- `docs/valibot-extend.md` for class extension semantics.
