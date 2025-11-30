/**
 * Miniprogram-compatible URL and URLSearchParams classes
 * 
 * Simplified URL implementations that don't rely on browser APIs and work in
 * UniApp miniprogram environment.
 */

/**
 * URLSearchParams class compatible with Web API
 */
export class URLSearchParams {
  private _params: Map<string, string[]> = new Map();

  constructor(init?: string | Record<string, string>) {
    if (typeof init === 'string') {
      this._parseQueryString(init);
    } else if (init && typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  private _parseQueryString(queryString: string): void {
    if (!queryString) return;
    
    queryString.split('&').forEach((pair) => {
      try {
        const eqIndex = pair.indexOf('=');
        if (eqIndex === -1) {
          const key = decodeURIComponent(pair);
          if (key) {
            this.append(key, '');
          }
        } else {
          const key = decodeURIComponent(pair.substring(0, eqIndex));
          const value = decodeURIComponent(pair.substring(eqIndex + 1));
          if (key) {
            this.append(key, value);
          }
        }
      } catch {
        // Skip malformed percent-encoding
      }
    });
  }

  append(name: string, value: string): void {
    const existing = this._params.get(name);
    if (existing) {
      existing.push(value);
    } else {
      this._params.set(name, [value]);
    }
  }

  delete(name: string): void {
    this._params.delete(name);
  }

  get(name: string): string | null {
    const values = this._params.get(name);
    return values ? values[0] : null;
  }

  getAll(name: string): string[] {
    return this._params.get(name) ?? [];
  }

  has(name: string): boolean {
    return this._params.has(name);
  }

  set(name: string, value: string): void {
    this._params.set(name, [value]);
  }

  toString(): string {
    const pairs: string[] = [];
    this._params.forEach((values, key) => {
      values.forEach((value) => {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
    });
    return pairs.join('&');
  }

  forEach(callback: (value: string, key: string) => void): void {
    this._params.forEach((values, key) => {
      values.forEach((value) => {
        callback(value, key);
      });
    });
  }

  entries(): IterableIterator<[string, string]> {
    const entries: [string, string][] = [];
    this._params.forEach((values, key) => {
      values.forEach((value) => {
        entries.push([key, value]);
      });
    });
    return entries[Symbol.iterator]();
  }

  keys(): IterableIterator<string> {
    return this._params.keys();
  }

  values(): IterableIterator<string> {
    const values: string[] = [];
    this._params.forEach((vals) => {
      values.push(...vals);
    });
    return values[Symbol.iterator]();
  }
}

/**
 * URL class compatible with Web API
 */
export class URL {
  private _baseUrl: string;
  private _searchParams: URLSearchParams;

  constructor(url: string) {
    const questionIndex = url.indexOf('?');
    if (questionIndex !== -1) {
      this._baseUrl = url.substring(0, questionIndex);
      this._searchParams = new URLSearchParams(url.substring(questionIndex + 1));
    } else {
      this._baseUrl = url;
      this._searchParams = new URLSearchParams();
    }
  }

  get searchParams(): URLSearchParams {
    return this._searchParams;
  }

  toString(): string {
    const queryString = this._searchParams.toString();
    if (queryString) {
      return `${this._baseUrl}?${queryString}`;
    }
    return this._baseUrl;
  }
}
