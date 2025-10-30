import { describe, it, expect } from 'vitest';
import { V } from '@/business';
import * as v from 'valibot';

// Create simple test classes to avoid import issues
class TestItem extends V.class(v.object({
  id: v.string(),
  value: v.number(),
})) { }

class TestArrayClass extends V.class(v.array(v.object({
  id: v.string(),
  value: v.number(),
}))) {
  get firstItem() {
    return this[0];
  }

  get lastItem() {
    return this[this.length - 1];
  }

  get middleItems() {
    return this.slice(1, this.length - 1);
  }
}

class TestArrayFormClass extends V.formClass(v.array(v.object({
  id: v.string(),
  value: v.number(),
}))) {
  addItem() {
    this.push({ id: 'new', value: 0 });
  }
}

describe('V.class Array Support', () => {
  it('should support array methods like forEach', () => {
    const arr = new TestArrayClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 }
    ]);

    const ids: string[] = [];
    arr.forEach((item: any) => {
      ids.push(item.id);
    });

    expect(ids).toEqual(['a', 'b']);
  });

  it('should support array methods like map', () => {
    const arr = new TestArrayClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 }
    ]);

    const ids = arr.map((item: any) => item.id);

    expect(ids).toEqual(['a', 'b']);
  });

  it('should support array methods like filter', () => {
    const arr = new TestArrayClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
      { id: 'c', value: 1 }
    ]);

    const filtered = arr.filter((item: any) => item.value === 1);

    expect(filtered.length).toBe(2);
    expect(filtered.every((item: any) => item.value === 1)).toBe(true);
  });

  it('should support array length property', () => {
    const arr = new TestArrayClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 }
    ]);

    expect(arr.length).toBe(2);
  });

  it('should support array bracket access', () => {
    const arr = new TestArrayClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 }
    ]);

    expect(arr[0].id).toBe('a');
    expect(arr[1].id).toBe('b');
  });

  it('should preserve custom methods alongside array methods', () => {
    const arr = new TestArrayClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
      { id: 'c', value: 3 }
    ]);

    // Custom getter methods should still work
    expect(arr.firstItem.id).toBe('a');
    expect(arr.lastItem.id).toBe('c');
    expect(arr.middleItems.length).toBe(1);
    expect(arr.middleItems[0].id).toBe('b');
  });

  it('should work with parse method', () => {
    const arr = TestArrayClass.parse([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 }
    ]);

    expect(arr.length).toBe(2);
    expect(arr[0].id).toBe('a');
    expect(arr.map((item: any) => item.id)).toEqual(['a', 'b']);
    expect(arr.firstItem.id).toBe('a');
  });

  it('should have array-like behavior', () => {
    const arr = new TestArrayClass([
      { id: 'a', value: 1 }
    ]);

    // Has array methods
    expect(typeof arr.forEach).toBe('function');
    expect(typeof arr.map).toBe('function');
    expect(typeof arr.filter).toBe('function');

    // Has length property
    expect(arr.length).toBe(1);

    // Is instance of the custom class
    expect(arr instanceof TestArrayClass).toBe(true);
  });
});

describe('V.formClass Array Support', () => {
  it('should support array methods on formClass', () => {
    const arr = new TestArrayFormClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 }
    ]);

    expect(arr.length).toBe(2);
    expect(arr[0].id).toBe('a');
  });

  it('should support custom methods that use array methods', () => {
    const arr = new TestArrayFormClass([
      { id: 'a', value: 1 }
    ]);

    expect(arr.length).toBe(1);

    arr.addItem();

    expect(arr.length).toBe(2);
    expect(arr[1].id).toBe('new');
  });

  it('should support splice directly', () => {
    const arr = new TestArrayFormClass([
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
      { id: 'c', value: 3 }
    ]);

    arr.splice(1, 1); // Remove middle item

    expect(arr.length).toBe(2);
    expect(arr[0].id).toBe('a');
    expect(arr[1].id).toBe('c');
  });

  it('should support push and pop', () => {
    const arr = new TestArrayFormClass([
      { id: 'a', value: 1 }
    ]);

    arr.push({ id: 'b', value: 2 });
    expect(arr.length).toBe(2);

    const popped = arr.pop();
    expect(popped?.id).toBe('b');
    expect(arr.length).toBe(1);
  });
});
