// ==================== Fetch API Compatible Wrapper ====================

// Type definitions for Fetch API
type HeadersInit = FetchHeaders | Record<string, string> | [string, string][];
type BodyInit = string | ArrayBuffer | ArrayBufferView | URLSearchParams | FormData | Blob | object;

export interface FetchRequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  signal?: AbortSignal;
}

/**
 * Headers class compatible with Web Fetch API
 */
export class FetchHeaders implements Iterable<[string, string]> {
  private _headers: Map<string, string> = new Map();

  constructor(init?: HeadersInit) {
    if (init) {
      if (init instanceof FetchHeaders) {
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

  forEach(callbackfn: (value: string, key: string, parent: FetchHeaders) => void, thisArg?: any): void {
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
}

/**
 * Response class compatible with Web Fetch API
 */
export class FetchResponse {
  private _body: any;
  private _bodyUsed: boolean = false;
  readonly headers: FetchHeaders;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;

  constructor(body: any, init: {
    status?: number;
    statusText?: string;
    headers?: HeadersInit;
    url?: string;
  } = {}) {
    this._body = body;
    this.status = init.status ?? 200;
    this.statusText = init.statusText ?? '';
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new FetchHeaders(init.headers);
    this.url = init.url ?? '';
  }

  get bodyUsed(): boolean {
    return this._bodyUsed;
  }

  async json<T = any>(): Promise<T> {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed');
    }
    this._bodyUsed = true;
    
    if (typeof this._body === 'string') {
      try {
        return JSON.parse(this._body);
      } catch (e) {
        throw new TypeError('Failed to parse body as JSON');
      }
    }
    return this._body;
  }

  async text(): Promise<string> {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed');
    }
    this._bodyUsed = true;
    
    if (typeof this._body === 'string') {
      return this._body;
    }
    return JSON.stringify(this._body);
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed');
    }
    this._bodyUsed = true;
    
    const text = typeof this._body === 'string' ? this._body : JSON.stringify(this._body);
    const encoder = new TextEncoder();
    return encoder.encode(text).buffer;
  }

  async blob(): Promise<Blob> {
    throw new Error('Blob is not supported in UniApp environment');
  }

  async formData(): Promise<FormData> {
    throw new Error('FormData is not supported in UniApp environment');
  }

  clone(): FetchResponse {
    if (this._bodyUsed) {
      throw new TypeError('Cannot clone a response that has already been consumed');
    }
    return new FetchResponse(this._body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      url: this.url,
    });
  }
}

const DEFAULT_TIMEOUT = 5000;

/**
 * Fetch function compatible with Web Fetch API, wrapping uni.request
 * This function is designed to work with @supabase/postgrest-js
 * 
 * @param input - URL string or Request object
 * @param init - Request initialization options
 * @returns Promise resolving to FetchResponse
 */
export async function fetch(
  input: string | URL,
  init?: FetchRequestInit
): Promise<FetchResponse> {
  const url = typeof input === 'string' ? input : input.toString();
  const method = (init?.method ?? 'GET').toUpperCase();
  
  // Prepare headers
  const headers: Record<string, string> = {};
  if (init?.headers) {
    const headerObj = init.headers instanceof FetchHeaders 
      ? init.headers 
      : new FetchHeaders(init.headers);
    headerObj.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Prepare body
  let data: any = undefined;
  if (init?.body != null) {
    if (typeof init.body === 'string') {
      data = init.body;
    } else if (init.body instanceof ArrayBuffer || ArrayBuffer.isView(init.body)) {
      throw new Error('ArrayBuffer body is not fully supported in UniApp environment');
    } else if (init.body instanceof URLSearchParams) {
      data = init.body.toString();
    } else if (typeof init.body === 'object') {
      // Assume it's a JSON-serializable object
      data = init.body;
    }
  }

  return new Promise<FetchResponse>((resolve, reject) => {
    const requestTask = uni.request({
      url,
      method: method as any,
      data,
      header: headers,
      timeout: DEFAULT_TIMEOUT,
      success: (res) => {
        const responseHeaders: Record<string, string> = {};
        if (res.header) {
          Object.entries(res.header).forEach(([key, value]) => {
            responseHeaders[key] = String(value);
          });
        }

        const response = new FetchResponse(res.data, {
          status: res.statusCode,
          statusText: '',
          headers: responseHeaders,
          url,
        });

        resolve(response);
      },
      fail: (err) => {
        // Create an error response
        const errorResponse = new FetchResponse(
          { error: err.errMsg || 'Network request failed' },
          {
            status: 0,
            statusText: err.errMsg || 'Network Error',
            url,
          }
        );
        reject(errorResponse);
      },
    });

    // Handle abort signal
    if (init?.signal) {
      init.signal.addEventListener('abort', () => {
        requestTask.abort();
        reject(new Error('Request aborted'));
      });
    }
  });
}
