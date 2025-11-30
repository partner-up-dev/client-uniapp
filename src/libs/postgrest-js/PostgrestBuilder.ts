import { Headers, URL, fetch } from '@/libs/fetch-polyfill';
import { PostgrestError } from './PostgrestError';

/**
 * PostgREST response type
 */
export interface PostgrestResponse<T> {
  data: T | null;
  error: PostgrestError | null;
  count: number | null;
  status: number;
  statusText: string;
}

export interface PostgrestSingleResponse<T> extends PostgrestResponse<T> {
  data: T | null;
}

export interface PostgrestMaybeSingleResponse<T> extends PostgrestResponse<T> {
  data: T | null;
}

/**
 * Builder configuration
 */
export interface PostgrestBuilderConfig {
  method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE';
  url: URL;
  headers: Headers;
  schema?: string;
  body?: unknown;
  shouldThrowOnError?: boolean;
  signal?: AbortSignal;
  isMaybeSingle?: boolean;
}

/**
 * Base builder class for PostgREST queries
 * 
 * Miniprogram-compatible implementation
 */
export class PostgrestBuilder<Result> implements PromiseLike<PostgrestResponse<Result>> {
  protected method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE';
  protected url: URL;
  protected headers: Headers;
  protected schema?: string;
  protected body?: unknown;
  protected shouldThrowOnError: boolean = false;
  protected signal?: AbortSignal;
  protected isMaybeSingle: boolean = false;

  constructor(builder: PostgrestBuilderConfig) {
    this.method = builder.method;
    this.url = builder.url;
    this.headers = new Headers(builder.headers.toObject());
    this.schema = builder.schema;
    this.body = builder.body;
    this.shouldThrowOnError = builder.shouldThrowOnError ?? false;
    this.signal = builder.signal;
    this.isMaybeSingle = builder.isMaybeSingle ?? false;
  }

  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   */
  throwOnError(): this {
    this.shouldThrowOnError = true;
    return this;
  }

  /**
   * Set an HTTP header for the request.
   */
  setHeader(name: string, value: string): this {
    this.headers.set(name, value);
    return this;
  }

  then<TResult1 = PostgrestResponse<Result>, TResult2 = never>(
    onfulfilled?: ((value: PostgrestResponse<Result>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    // Set schema headers
    if (this.schema !== undefined) {
      if (['GET', 'HEAD'].includes(this.method)) {
        this.headers.set('Accept-Profile', this.schema);
      } else {
        this.headers.set('Content-Profile', this.schema);
      }
    }

    if (this.method !== 'GET' && this.method !== 'HEAD') {
      this.headers.set('Content-Type', 'application/json');
    }

    let res = fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers.toObject(),
      body: this.body !== undefined ? JSON.stringify(this.body) : undefined,
      signal: this.signal,
    }).then(async (res) => {
      let error: PostgrestError | null = null;
      let data: Result | null = null;
      let count: number | null = null;
      let status = res.status;
      let statusText = res.statusText;

      if (res.ok) {
        if (this.method !== 'HEAD') {
          const body = await res.text();
          if (body === '') {
            // Prefer: return=minimal
          } else if (this.headers.get('Accept') === 'text/csv') {
            data = body as unknown as Result;
          } else {
            data = JSON.parse(body);
          }
        }

        const countHeader = this.headers.get('Prefer')?.match(/count=(exact|planned|estimated)/);
        const contentRange = res.headers.get('content-range')?.split('/');
        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1]);
        }

        // Handle maybeSingle
        if (this.isMaybeSingle && this.method === 'GET' && Array.isArray(data)) {
          if (data.length > 1) {
            error = new PostgrestError({
              code: 'PGRST116',
              details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
              hint: '',
              message: 'JSON object requested, multiple (or no) rows returned',
            });
            data = null;
            count = null;
            status = 406;
            statusText = 'Not Acceptable';
          } else if (data.length === 1) {
            data = data[0];
          } else {
            data = null;
          }
        }
      } else {
        const body = await res.text();
        try {
          error = new PostgrestError(JSON.parse(body));
          // Workaround for empty 404 responses
          if (Array.isArray(error) && res.status === 404) {
            data = [] as unknown as Result;
            error = null;
            status = 200;
            statusText = 'OK';
          }
        } catch {
          if (res.status === 404 && body === '') {
            status = 204;
            statusText = 'No Content';
          } else {
            error = new PostgrestError({ message: body });
          }
        }

        if (error && this.isMaybeSingle && error.details?.includes('0 rows')) {
          error = null;
          status = 200;
          statusText = 'OK';
        }

        if (error && this.shouldThrowOnError) {
          throw error;
        }
      }

      const postgrestResponse: PostgrestResponse<Result> = {
        error,
        data,
        count,
        status,
        statusText,
      };

      return postgrestResponse;
    });

    if (!this.shouldThrowOnError) {
      res = res.catch((fetchError) => {
        return {
          error: new PostgrestError({
            message: `${fetchError?.name ?? 'FetchError'}: ${fetchError?.message}`,
            details: fetchError?.stack ?? '',
            hint: '',
            code: '',
          }),
          data: null,
          count: null,
          status: 0,
          statusText: '',
        };
      });
    }

    return res.then(onfulfilled, onrejected);
  }
}
