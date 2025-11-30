/**
 * Miniprogram-compatible fetch function
 * 
 * A fetch implementation that wraps uni.request and works in UniApp miniprogram environment.
 */

import { Headers } from './Headers';
import { Response } from './Response';

type HeadersInit = Headers | Record<string, string> | [string, string][];
type BodyInit = string | ArrayBuffer | ArrayBufferView | URLSearchParams | FormData | Blob | object;

export interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  signal?: AbortSignal;
}

/**
 * Fetch type for postgrest-js compatibility
 * This is a simplified fetch signature that postgrest-js uses internally
 */
export type FetchFn = (url: string, init?: {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}) => Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  text: () => Promise<string>;
  headers: {
    get: (name: string) => string | null;
  };
}>;

const DEFAULT_TIMEOUT = 5000;
const POSTGREST_TIMEOUT = 30000;

/**
 * Fetch function compatible with Web Fetch API, wrapping uni.request
 * 
 * @param input - URL string or URL object
 * @param init - Request initialization options
 * @returns Promise resolving to Response
 */
export function fetch(
  input: string | URL,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === 'string' ? input : input.toString();
  const method = (init?.method ?? 'GET').toUpperCase();
  
  // Prepare headers
  const headers: Record<string, string> = {};
  if (init?.headers) {
    const headerObj = init.headers instanceof Headers 
      ? init.headers 
      : new Headers(init.headers);
    headerObj.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Prepare body
  let data: unknown = undefined;
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

  return new Promise<Response>((resolve, reject) => {
    const requestTask = uni.request({
      url,
      method: method as UniApp.RequestOptions['method'],
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

        const response = new Response(res.data, {
          status: res.statusCode,
          statusText: '',
          headers: responseHeaders,
          url,
        });

        resolve(response);
      },
      fail: (err) => {
        // Create an error response
        const errorResponse = new Response(
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

/**
 * Create a fetch function for postgrest-js compatibility
 * 
 * This creates a fetch function that returns the simplified response type
 * that postgrest-js expects internally. Uses a longer timeout (30s) for
 * database operations.
 */
export function createPostgrestFetch(): FetchFn {
  return (url: string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  }) => {
    return new Promise((resolve, reject) => {
      const requestTask = uni.request({
        url,
        method: (init?.method ?? 'GET') as UniApp.RequestOptions['method'],
        data: init?.body,
        header: init?.headers,
        timeout: POSTGREST_TIMEOUT,
        success: (res) => {
          const responseHeaders: Record<string, string> = {};
          if (res.header) {
            Object.entries(res.header).forEach(([key, value]) => {
              responseHeaders[key.toLowerCase()] = String(value);
            });
          }

          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: '',
            text: async () => {
              if (typeof res.data === 'string') {
                return res.data;
              }
              return JSON.stringify(res.data);
            },
            headers: {
              get: (name: string) => responseHeaders[name.toLowerCase()] ?? null,
            },
          });
        },
        fail: (err) => {
          reject(new Error(err.errMsg || 'Network request failed'));
        },
      });

      if (init?.signal) {
        init.signal.addEventListener('abort', () => {
          requestTask.abort();
          reject(new Error('Request aborted'));
        });
      }
    });
  };
}
