---
applyTo: "**/*.ts"
description: "TypeScript coding guidelines"
---

## 1. Type Safety & Type System

The primary goal is to leverage the type system to catch errors at compile-time, not runtime.

- 1.1 [MANDATORY] Never use any
  The any type defeats the purpose of TypeScript. It propagates lack of safety throughout the system.
  Use unknown if the type is truly not known yet, and narrow it down using type guards.
- 1.2 [MANDATORY] Explicit Return Types
  explicit return types prevent accidental API changes
- 1.3 [RECOMMENDED] Discriminated Unions for State Management
  Avoid optional flags (booleans) to manage state. Use discriminated unions to make invalid states unrepresentable.
  ```ts
  // ❌ Bad
  interface State {
    isLoading: boolean;
    data?: string;
    error?: string;
  }

  // ✅ Good
  type State =
    | { status: 'loading' }
    | { status: 'success'; data: string }
    | { status: 'error'; error: string };
  ```
- 1.4 [RECOMMENDED] Prefer String Literal Unions over Enums
  ```ts
  // ❌ Bad
  enum Direction {
    Up,
    Down
  }

  // ✅ Good
  type Direction = 'UP' | 'DOWN';
  ```
- 1.5 [RECOMMENDED] Non-null Assertion (!): Avoid using obj!.prop. This is a type-safety escape hatch. Use Optional Chaining (?.) or proper Type Guards instead.
- 1.6 [RECOMMENDED] Use satisfies to validate that an expression matches a type without changing the resulting type of that expression (preserving literal types).
  ```ts
    // ❌ Bad (Widening occurs, losing specific keys)
  const palette: Record<string, string | number[]> = {
      red: [255, 0, 0],
      green: "#00ff00",
  };
  // palette.green.toUpperCase() // Error: Property 'toUpperCase' does not exist on type 'string | number[]'

  // ✅ Good
  const palette = {
      red: [255, 0, 0],
      green: "#00ff00",
  } satisfies Record<string, string | number[]>;
  palette.green.toUpperCase(); // Valid! TS knows 'green' is a string.
  ```
- 1.7 [RECOMMENDED] Use as const for configuration objects or fixed collections to freeze values to their literal types.
- 1.8 [RECOMMENDED] Don't redefine shapes. Use Pick, Omit, Partial, and Readonly to derive types from a single source of truth.

## 2. Syntax Usage & Idioms

Focus on readability and modern ECMAScript features.

### 2.1 Optional Chaining and Nullish Coalescing

Avoid verbose null checks or logical OR (||) for default values (which fails on empty strings or 0).

```ts
// ❌ Bad
const width = config && config.layout && config.layout.width ? config.layout.width : 100;

// ✅ Good
const width = config?.layout?.width ?? 100;
```

## 3. Control Flow

### 3.1 Guard Clauses (Early Returns)

Avoid deep nesting of if/else blocks. Handle negative cases early and return.

```ts
// ❌ Bad
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      // heavy logic
    }
  }
}

// ✅ Good
function processUser(user: User | null): void {
  if (!user || !user.isActive) {
    return;
  }
  // heavy logic
}
```

### 3.2 Iteration

Prefer functional chaining (`.map`, `.filter`, `.reduce`) for data transformations. Use `for...of` for side effects.
- Avoid: `for (let i = 0; i < arr.length; i++)` (unless optimizing for critical performance hot-paths).
- Avoid: `for...in` (iterates over prototype chain properties).

## 4. Naming Conventions

- Types & Interfaces: PascalCase (e.g., `UserData`, `AuthResponse`).
  - Anti-pattern: Do not use Hungarian notation or prefixes like `IUser` or `TUser`.
- Variables & Functions: camelCase (e.g., `fetchData`, `isValid`).
- Booleans: Prefix with is, has, should, or can (e.g., `isVisible`, `hasAccess`).
- Generics:
  - Simple utilities: `T`, `U`, `K` are acceptable.
  - Domain logic: Use descriptive names like `TData`, `TResponse`, `TEntity` to clarify intent.
