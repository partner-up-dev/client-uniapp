/**
 * Miniprogram-compatible Headers class for PostgREST
 */
export class PostgrestHeaders implements Iterable<[string, string]> {
  private _headers: Map<string, string> = new Map();

  constructor(init?: Record<string, string> | PostgrestHeaders | [string, string][]) {
    if (init) {
      if (init instanceof PostgrestHeaders) {
        init._headers.forEach((value, key) => this._headers.set(key, value));
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => this._headers.set(key.toLowerCase(), value));
      } else if (typeof init === 'object') {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value);
        });
      }
    }
  }

  append(name: string, value: string): void {
    const key = name.toLowerCase();
    const existing = this._headers.get(key);
    this._headers.set(key, existing ? `${existing}, ${value}` : value);
  }

  delete(name: string): void {
    this._headers.delete(name.toLowerCase());
  }

  get(name: string): string | null {
    return this._headers.get(name.toLowerCase()) ?? null;
  }

  has(name: string): boolean {
    return this._headers.has(name.toLowerCase());
  }

  set(name: string, value: string): void {
    this._headers.set(name.toLowerCase(), value);
  }

  forEach(callbackfn: (value: string, key: string, parent: PostgrestHeaders) => void, thisArg?: any): void {
    this._headers.forEach((value, key) => {
      callbackfn.call(thisArg, value, key, this);
    });
  }

  [Symbol.iterator](): Iterator<[string, string]> {
    return this._headers.entries();
  }

  entries(): IterableIterator<[string, string]> {
    return this._headers.entries();
  }

  keys(): IterableIterator<string> {
    return this._headers.keys();
  }

  values(): IterableIterator<string> {
    return this._headers.values();
  }

  /**
   * Convert to plain object for uni.request
   */
  toObject(): Record<string, string> {
    const obj: Record<string, string> = {};
    this._headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
}
