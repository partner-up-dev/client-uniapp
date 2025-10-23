import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import { V } from '../../src/business';

describe('ValibotClass extend feature', () => {
  it('should extend a base class with additional fields', () => {
    // Define a base class
    class Person extends V.class(v.object({
      name: v.string(),
      age: v.number(),
    })) {
      getInfo() {
        return `${this.name} is ${this.age} years old`;
      }
    }

    // Extend the Person class with additional fields
    class Employee extends Person.extend(v.object({
      employeeId: v.string(),
      department: v.string(),
    })) {
      getEmployeeInfo() {
        return `${this.name} (ID: ${this.employeeId}) works in ${this.department}`;
      }
    }

    // Create an instance of Employee
    const employee = new Employee({
      name: 'John Doe',
      age: 30,
      employeeId: 'E001',
      department: 'Engineering',
    });

    // Test that all properties are present
    expect(employee.name).toBe('John Doe');
    expect(employee.age).toBe(30);
    expect(employee.employeeId).toBe('E001');
    expect(employee.department).toBe('Engineering');

    // Test that inherited methods work (runtime - TypeScript doesn't know about them)
    expect((employee as any).getInfo()).toBe('John Doe is 30 years old');

    // Test that new methods work
    expect(employee.getEmployeeInfo()).toBe('John Doe (ID: E001) works in Engineering');
  });

  it('should validate extended schema correctly', () => {
    class Person extends V.class(v.object({
      name: v.string(),
      age: v.number(),
    })) { }

    class Employee extends Person.extend(v.object({
      employeeId: v.string(),
      department: v.string(),
    })) { }

    // Valid data should pass
    const validEmployee = Employee.parse({
      name: 'Jane Smith',
      age: 25,
      employeeId: 'E002',
      department: 'Marketing',
    });

    expect(validEmployee).toBeInstanceOf(Employee);
    expect(validEmployee.name).toBe('Jane Smith');

    // Invalid data should throw
    expect(() => {
      Employee.parse({
        name: 'Jane Smith',
        age: 25,
        // Missing required fields: employeeId and department
      });
    }).toThrow();
  });

  it('should support multiple levels of extension', () => {
    class Person extends V.class(v.object({
      name: v.string(),
    })) { }

    class Employee extends Person.extend(v.object({
      employeeId: v.string(),
    })) { }

    class Manager extends Employee.extend(v.object({
      teamSize: v.number(),
    })) { }

    const manager = Manager.parse({
      name: 'Alice',
      employeeId: 'M001',
      teamSize: 5,
    });

    expect(manager.name).toBe('Alice');
    expect(manager.employeeId).toBe('M001');
    expect(manager.teamSize).toBe(5);
  });

  it('should work with async parsing', async () => {
    class Person extends V.class(v.object({
      name: v.string(),
    })) { }

    class Employee extends Person.extend(v.object({
      employeeId: v.string(),
    })) { }

    const employee = await Employee.parseAsync({
      name: 'Bob',
      employeeId: 'E003',
    });

    expect(employee).toBeInstanceOf(Employee);
    expect(employee.name).toBe('Bob');
    expect(employee.employeeId).toBe('E003');
  });

  it('should work with safeParse', () => {
    class Person extends V.class(v.object({
      name: v.string(),
    })) { }

    class Employee extends Person.extend(v.object({
      employeeId: v.string(),
    })) { }

    // Valid data
    const validResult = Employee.safeParse({
      name: 'Charlie',
      employeeId: 'E004',
    });

    expect(validResult.success).toBe(true);
    if (validResult.success) {
      expect(validResult.output.name).toBe('Charlie');
    }

    // Invalid data
    const invalidResult = Employee.safeParse({
      name: 'Charlie',
      // Missing employeeId
    });

    expect(invalidResult.success).toBe(false);
  });
});
