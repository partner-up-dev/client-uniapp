# ValibotClass `extend` Feature

The `extend` feature for `ValibotClass` allows you to create a new class that extends an existing `ValibotClass` with additional fields, similar to how [zod-class](https://github.com/sam-goodwin/zod-class) implements it.

## Basic Usage

### 1. Define a Base Class

```typescript
import * as v from 'valibot';
import { V } from '@/business';

class Person extends V.class(v.object({
  name: v.string(),
  age: v.number(),
})) {
  getInfo() {
    return `${this.name} is ${this.age} years old`;
  }
}
```

### 2. Extend the Base Class

```typescript
class Employee extends Person.extend(v.object({
  employeeId: v.string(),
  department: v.string(),
})) {
  getEmployeeInfo() {
    return `${this.name} (ID: ${this.employeeId}) works in ${this.department}`;
  }
}
```

### 3. Use the Extended Class

```typescript
// Create an instance
const employee = new Employee({
  name: 'John Doe',
  age: 30,
  employeeId: 'E001',
  department: 'Engineering',
});

console.log(employee.name);              // 'John Doe'
console.log(employee.employeeId);        // 'E001'
console.log(employee.getEmployeeInfo()); // 'John Doe (ID: E001) works in Engineering'
```

## Parsing

All the standard parsing methods work with extended classes:

```typescript
// parse - throws on invalid data
const employee1 = Employee.parse({
  name: 'Jane Smith',
  age: 25,
  employeeId: 'E002',
  department: 'Marketing',
});

// parseAsync - async parsing
const employee2 = await Employee.parseAsync({
  name: 'Bob',
  age: 28,
  employeeId: 'E003',
  department: 'Sales',
});

// safeParse - returns result object
const result = Employee.safeParse({
  name: 'Charlie',
  age: 32,
  employeeId: 'E004',
  department: 'HR',
});

if (result.success) {
  console.log(result.output.name);
}
```

## Multiple Levels of Extension

You can extend an already extended class multiple times:

```typescript
class Person extends V.class(v.object({
  name: v.string(),
})) {}

class Employee extends Person.extend(v.object({
  employeeId: v.string(),
})) {}

class Manager extends Employee.extend(v.object({
  teamSize: v.number(),
  budget: v.number(),
})) {}

const manager = Manager.parse({
  name: 'Alice',
  employeeId: 'M001',
  teamSize: 5,
  budget: 100000,
});
```

## Schema Merging

The `extend` method uses Valibot's `intersect` to merge schemas. This means:

- All fields from the parent schema are required
- All fields from the extension schema are required
- The resulting schema validates both

```typescript
class Base extends V.class(v.object({
  id: v.string(),
})) {}

class Extended extends Base.extend(v.object({
  name: v.string(),
})) {}

// This will fail - missing 'id' from Base
Extended.parse({ name: 'Test' }); // ❌ Throws

// This will fail - missing 'name' from Extended
Extended.parse({ id: '123' }); // ❌ Throws

// This will succeed - has both fields
Extended.parse({ id: '123', name: 'Test' }); // ✅ Works
```

## Type Safety

Extended classes are fully type-safe:

```typescript
class Person extends V.class(v.object({
  name: v.string(),
  age: v.number(),
})) {}

class Employee extends Person.extend(v.object({
  employeeId: v.string(),
})) {}

const employee = Employee.parse({
  name: 'John',
  age: 30,
  employeeId: 'E001',
});

// TypeScript knows about all fields
employee.name;       // ✅ string
employee.age;        // ✅ number
employee.employeeId; // ✅ string
employee.invalid;    // ❌ Type error
```

## Comparison with zod-class

The implementation is inspired by [zod-class's extend feature](https://github.com/sam-goodwin/zod-class#3-extend-a-class), but adapted for Valibot:

**zod-class (Zod):**

```typescript
class World extends Hello.extend({
  world: z.string()
}) {}
```

**ValibotClass (Valibot):**

```typescript
class World extends Hello.extend(v.object({
  world: v.string()
})) {}
```

The main difference is that with Valibot, you need to pass a full object schema to `extend`, not just the shape.

## Implementation Details

- Uses Valibot's `intersect` to merge parent and child schemas
- Preserves prototype chain for proper inheritance
- All parsing methods (`parse`, `parseAsync`, `safeParse`) work correctly
- The extended class can be further extended
- Parent class methods are inherited at runtime (though TypeScript may not infer them)
