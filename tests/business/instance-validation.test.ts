import { describe, expect, it } from 'vitest';
import * as v from 'valibot';
import { V, instance } from '@/business';

describe('instance() helper', () => {
  describe('with array-based classes', () => {
    // Create a simple array-based class

    class TestRouteItem extends V.class(v.object({
      name: v.string(),
      lat: v.number(),
      lng: v.number(),
    })) { }
    class TestRoute extends V.class(v.array(instance(TestRouteItem))) { }

    it('should validate array-based class instances', () => {
      const route = new TestRoute([
        { name: 'Start', lat: 0, lng: 0 },
        { name: 'End', lat: 1, lng: 1 },
      ]);

      // Create a schema that uses instance()
      const schema = v.object({
        route: instance(TestRoute),
      });

      // Should successfully validate
      const result = v.parse(schema, { route });
      expect(result.route).toStrictEqual(route);
      expect(result.route).toBeInstanceOf(Array);
      expect(result.route.length).toBe(2);
      // Verify prototype chain
      expect(Object.getPrototypeOf(result.route)).toBe(TestRoute.prototype);
    });

    it('should transform raw data to array-based class instance', () => {
      const schema = v.object({
        route: instance(TestRoute),
      });

      const rawData = {
        route: [
          { name: 'Start', lat: 0, lng: 0 },
          { name: 'End', lat: 1, lng: 1 },
        ],
      };

      const result = v.parse(schema, rawData);
      expect(result.route).toBeInstanceOf(Array);
      expect(result.route.length).toBe(2);
      // Check that prototype chain is correct
      expect(Object.getPrototypeOf(result.route)).toBe(TestRoute.prototype);
    });

    it('should reject non-array-based class instances', () => {
      const schema = instance(TestRoute);

      expect(() => v.parse(schema, { not: 'an array' })).toThrow();
      expect(() => v.parse(schema, 'string')).toThrow();
      expect(() => v.parse(schema, 123)).toThrow();
    });
  });

  describe('with object-based classes', () => {
    // Create a simple object-based class
    const UserSchema = v.object({
      name: v.string(),
      email: v.string(),
    });

    class TestUser extends V.class(UserSchema) { }

    it('should validate object-based class instances', () => {
      const user = new TestUser({ name: 'John', email: 'john@example.com' });

      const schema = v.object({
        user: instance(TestUser),
      });

      const result = v.parse(schema, { user });
      expect(result.user).toStrictEqual(user);
      expect(result.user).toBeInstanceOf(TestUser);
    });

    it('should transform raw data to object-based class instance', () => {
      const schema = v.object({
        user: instance(TestUser),
      });

      const rawData = {
        user: { name: 'John', email: 'john@example.com' },
      };

      const result = v.parse(schema, rawData);
      expect(result.user).toBeInstanceOf(TestUser);
      expect(result.user.name).toBe('John');
      expect(result.user.email).toBe('john@example.com');
    });

    it('should reject non-object-based class instances', () => {
      const schema = instance(TestUser);

      expect(() => v.parse(schema, [])).toThrow();
      expect(() => v.parse(schema, 'string')).toThrow();
      expect(() => v.parse(schema, 123)).toThrow();
    });
  });

  describe('with nested array-based classes', () => {
    const RouteItemSchema = v.object({
      name: v.string(),
      lat: v.number(),
      lng: v.number(),
    });

    class TestRouteItem extends V.class(RouteItemSchema) { }
    class TestRouteForm extends V.formClass(
      v.optional(
        v.array(instance(TestRouteItem)),
        () => [
          new TestRouteItem({ name: 'Start', lat: 0, lng: 0 }),
          new TestRouteItem({ name: 'End', lat: 0, lng: 1 }),
        ]
      )) { }

    class TestForm extends V.formClass(v.object({
      title: v.string(),
      route: v.optional(instance(TestRouteForm), () => new TestRouteForm(undefined)),
    })) { }

    it('should validate nested array-based classes', async () => {
      const form = new TestForm({
        title: 'My Trip',
      });

      expect(form.title).toBe('My Trip');
      expect(form.route).toBeInstanceOf(Array);
      expect(form.route.length).toBe(2);
      const result = await form.validate();
      if (!result.success) {
        console.log(result.errors);
      }
      expect(result.success).toBe(true);
    });
  });
});
