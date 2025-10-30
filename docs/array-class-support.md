# Array Class Support in V.class

## Overview

`V.class` now supports both object schemas (`v.object()`) and array schemas (`v.array()`). When an array schema is used, the resulting class extends `Array`, providing access to all native array methods while maintaining custom class methods and properties.

## Features

### Array Methods Support

Classes created from array schemas inherit all standard array methods:

- **Iteration**: `forEach`, `map`, `filter`, `reduce`, `find`, `findIndex`, etc.
- **Mutation**: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, etc.
- **Access**: Bracket notation (`route[0]`), `length` property
- **Other**: `slice`, `concat`, `includes`, `indexOf`, `every`, `some`, etc.

### Custom Methods and Properties

Array-based classes can still define custom getters, methods, and static functions alongside array functionality.

## Example: Route Class

```typescript
import { V, instance } from '@/business';
import * as v from 'valibot';

export class Route extends V.class(v.array(instance(RouteItem))) {
  // Custom getters work alongside array methods
  get startItem(): RouteItem {
    return this[0];
  }

  get waypoints(): RouteItem[] {
    return this.slice(1, this.length - 1);
  }

  get endItem(): RouteItem {
    return this[this.length - 1];
  }

  // Static methods work as before
  static use(route: Route) {
    // ... composable logic
  }
}
```

## Usage Examples

```typescript
// Create a Route instance
const route = Route.parse([
  { datetime: {...}, location: 'loc1' },
  { datetime: {...}, location: 'loc2' },
  { datetime: {...}, location: 'loc3' }
]);

// Use array methods
route.forEach(item => console.log(item.location));
const locations = route.map(item => item.location);
const filtered = route.filter(item => item.location.includes('1'));

// Access array properties
console.log(route.length); // 3
console.log(route[0]); // First item

// Use custom methods
console.log(route.startItem); // First item
console.log(route.endItem); // Last item
console.log(route.waypoints); // Middle items
```

## Implementation Details

### Array Detection

The implementation detects array schemas by checking the schema's `type` property:

```typescript
const isArraySchema = (schema as any).type === 'array';
```

### Prototype Setup

For array schemas:

- The class extends `Array` instead of `Object`
- Parsed arrays have their prototype set to the class prototype using `Object.setPrototypeOf()`
- This preserves both array methods and custom class methods

### Constructor Handling

```typescript
constructor(value: Input) {
  const parsed = v.parse(schema, value) as Output;
  
  if (isArraySchema && Array.isArray(parsed)) {
    super(...(parsed as any[])); // Extend Array with elements
    Object.assign(this, parsed);
  } else {
    super();
    Object.assign(this as object, parsed);
  }
}
```

## Compatibility

- Works with `V.class` and `V.formClass`
- Compatible with `extend()` method
- Works with Valibot's `instance()` helper
- Maintains proper typing through TypeScript

## Testing

See `tests/business/route-array-methods.test.ts` for comprehensive test cases covering:

- Array iteration methods (`forEach`, `map`, `filter`)
- Array properties (`length`, bracket access)
- Custom methods alongside array functionality
