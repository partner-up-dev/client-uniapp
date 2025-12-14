import { Headers, URL, fetch } from '@/libs/fetch-polyfill';
import { PostgrestError } from './PostgrestError';
import * as v from 'valibot';
import { type TableSchemaT } from './PostgrestQueryBuilder';
import { type ParseTarget, Data } from './Data';

/**
 * Builder configuration
 */
export interface PostgrestBuilderConfig {
  method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE';
  url: URL;
  headers: Headers;
  schema?: string;
  body?: unknown;
  signal?: AbortSignal;
  isMaybeSingle?: boolean;
  tableSchema?: TableSchemaT;
}

/**
 * Base builder class for PostgREST queries
 * 
 * Miniprogram-compatible implementation
 */
export class PostgrestBuilder<Result> implements PromiseLike<{ data: { parsed: Result, raw: unknown } }> {
  protected method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE';
  protected url: URL;
  protected headers: Headers;
  protected schema?: string;
  protected body?: unknown;
  protected signal?: AbortSignal;
  protected isMaybeSingle: boolean = false;
  protected tableSchema?: ParseTarget;

  constructor(builder: PostgrestBuilderConfig) {
    this.method = builder.method;
    this.url = builder.url;
    this.headers = new Headers(builder.headers.toObject());
    this.schema = builder.schema;
    this.body = builder.body;
    this.signal = builder.signal;
    this.isMaybeSingle = builder.isMaybeSingle ?? false;
    this.tableSchema = builder.tableSchema;
  }

  /**
   * Set an HTTP header for the request.
   */
  setHeader(name: string, value: string): this {
    this.headers.set(name, value);
    return this;
  }

  then<TResult1 = { data: { parsed: Result, raw: unknown } }, TResult2 = never>(
    onfulfilled?: ((value: { data: { parsed: Result, raw: unknown } }) => TResult1 | PromiseLike<TResult1>) | null,
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
      let data: Data<ParseTarget | undefined> | null = null;
      let rawData: unknown = null;
      let count: number | null = null;
      let status = res.status;
      let statusText = res.statusText;

      if (res.ok) {
        if (this.method !== 'HEAD') {
          const body = await res.text();
          if (body === '') {
            // Prefer: return=minimal
          } else if (this.headers.get('Accept') === 'text/csv') {
            rawData = body;
          } else {
            rawData = JSON.parse(body);
          }
        }

        const countHeader = this.headers.get('Prefer')?.match(/count=(exact|planned|estimated)/);
        const contentRange = res.headers.get('content-range')?.split('/');
        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1]);
        }

        // Handle maybeSingle
        if (this.isMaybeSingle && this.method === 'GET' && Array.isArray(rawData)) {
          if (rawData.length > 1) {
            error = new PostgrestError({
              code: 'PGRST116',
              details: `Results contain ${rawData.length} rows, application/vnd.pgrst.object+json requires 1 row`,
              hint: '',
              message: 'JSON object requested, multiple (or no) rows returned',
            });
            rawData = null;
            count = null;
            status = 406;
            statusText = 'Not Acceptable';
          } else if (rawData.length === 1) {
            rawData = rawData[0];
          } else {
            rawData = null;
          }
        }

        // Wrap data with tableSchema for lazy validation
        if (!error && rawData !== null) {
          if (Array.isArray(rawData)) {
            data = new Data(rawData, v.array((this.tableSchema ?? v.any()) as v.BaseSchema<any, any, any>));
          }
          else {
            data = new Data(rawData, this.tableSchema);
          }
        } else if (!error && rawData === null) {
          // When no data is available, use empty array
          data = new Data([], v.array((this.tableSchema ?? v.any()) as v.BaseSchema<any, any, any>));
        }
      } else {
        const body = await res.text();
        try {
          error = new PostgrestError(JSON.parse(body));
          // Workaround for empty 404 responses
          if (Array.isArray(error) && res.status === 404) {
            data = new Data([], this.tableSchema);
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

        if (error) {
          throw error;
        }
      }

      if (error) {
        throw error;
      }

      // Ensure data is never null - default to empty array if no data
      if (data === null) {
        data = new Data([], v.array((this.tableSchema ?? v.any()) as v.BaseSchema<any, any, any>));
      }

      return { data: { parsed: data.parsed, raw: data.raw } };
    }).catch((fetchError) => {
      if (fetchError instanceof PostgrestError) {
        throw fetchError;
      }
      throw new PostgrestError({
        message: `${fetchError?.name ?? 'FetchError'}: ${fetchError?.message}`,
        details: fetchError?.stack ?? '',
        hint: '',
        code: '',
      });
    });

    return res.then(onfulfilled, onrejected);
  }
}

/**
 * Builder for single-row PostgREST queries
 * 
 * Guarantees non-null data on success (PostgREST returns exactly one row or errors)
 */
export class PostgrestSingleBuilder<Result> extends PostgrestBuilder<Result> implements PromiseLike<{ data: { parsed: Result, raw: unknown } }> {
  then<TResult1 = { data: { parsed: Result, raw: unknown } }, TResult2 = never>(
    onfulfilled?: ((value: { data: { parsed: Result, raw: unknown } }) => TResult1 | PromiseLike<TResult1>) | null,
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
      let data: Data<ParseTarget | undefined> | null = null;
      let rawData: unknown = null;
      let count: number | null = null;
      let status = res.status;
      let statusText = res.statusText;

      if (res.ok) {
        if (this.method !== 'HEAD') {
          const body = await res.text();
          if (body === '') {
            // For single queries, empty body should be an error
            error = new PostgrestError({
              code: 'PGRST116',
              details: 'Single query returned empty body',
              hint: '',
              message: 'JSON object requested, no rows returned',
            });
            status = 406;
            statusText = 'Not Acceptable';
          } else if (this.headers.get('Accept') === 'text/csv') {
            rawData = body;
          } else {
            rawData = JSON.parse(body);
          }
        }

        const countHeader = this.headers.get('Prefer')?.match(/count=(exact|planned|estimated)/);
        const contentRange = res.headers.get('content-range')?.split('/');
        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1]);
        }

        // Wrap data with tableSchema for lazy validation
        if (!error && rawData !== null) {
          if (Array.isArray(rawData)) {
            // Single query should not return array
            error = new PostgrestError({
              code: 'PGRST116',
              details: `Single query returned array with ${rawData.length} rows`,
              hint: '',
              message: 'JSON object requested, array returned',
            });
            status = 406;
            statusText = 'Not Acceptable';
          }
          else {
            data = new Data(rawData, this.tableSchema);
          }
        }
      } else {
        const body = await res.text();
        try {
          error = new PostgrestError(JSON.parse(body));
        } catch {
          if (res.status === 404 && body === '') {
            status = 204;
            statusText = 'No Content';
            error = new PostgrestError({
              code: 'PGRST116',
              details: 'Single query returned 404',
              hint: '',
              message: 'JSON object requested, no rows returned',
            });
          } else {
            error = new PostgrestError({ message: body });
          }
        }

        if (error) {
          throw error;
        }
      }

      if (error) {
        throw error;
      }

      // Assert data is non-null for single queries
      if (data === null) {
        throw new PostgrestError({
          code: 'PGRST116',
          details: 'Single query resulted in null data',
          hint: '',
          message: 'JSON object requested, no rows returned',
        });
      }

      return { data: { parsed: data.parsed, raw: data.raw } };
    }).catch((fetchError) => {
      if (fetchError instanceof PostgrestError) {
        throw fetchError;
      }
      throw new PostgrestError({
        message: `${fetchError?.name ?? 'FetchError'}: ${fetchError?.message}`,
        details: fetchError?.stack ?? '',
        hint: '',
        code: '',
      });
    });

    return res.then(onfulfilled, onrejected);
  }
}
