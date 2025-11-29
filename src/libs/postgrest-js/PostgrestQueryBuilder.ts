import { PostgrestFilterBuilder } from './PostgrestFilterBuilder';
import type { PostgrestBuilderConfig, PostgrestFetch } from './PostgrestBuilder';
import { PostgrestHeaders } from './PostgrestHeaders';
import { PostgrestURL } from './PostgrestURL';

/**
 * Query builder for PostgREST queries
 * 
 * Miniprogram-compatible implementation
 */
export class PostgrestQueryBuilder<Result = unknown> {
  protected url: PostgrestURL;
  protected headers: PostgrestHeaders;
  protected schema?: string;
  protected fetch?: PostgrestFetch;

  constructor(
    url: PostgrestURL,
    {
      headers = {},
      schema,
      fetch,
    }: {
      headers?: Record<string, string> | PostgrestHeaders;
      schema?: string;
      fetch?: PostgrestFetch;
    }
  ) {
    this.url = url;
    this.headers = headers instanceof PostgrestHeaders ? headers : new PostgrestHeaders(headers);
    this.schema = schema;
    this.fetch = fetch;
  }

  /**
   * Perform a SELECT query on the table or view.
   *
   * @param columns - The columns to retrieve, separated by commas
   * @param options - Named parameters
   */
  select<Columns extends string = '*'>(
    columns?: Columns,
    options?: { head?: boolean; count?: 'exact' | 'planned' | 'estimated' }
  ): PostgrestFilterBuilder<Result[]> {
    const { head = false, count } = options ?? {};
    const method = head ? 'HEAD' : 'GET';

    // Remove whitespaces except when quoted
    let quoted = false;
    const cleanedColumns = (columns ?? '*')
      .split('')
      .map((c) => {
        if (/\s/.test(c) && !quoted) {
          return '';
        }
        if (c === '"') {
          quoted = !quoted;
        }
        return c;
      })
      .join('');
    this.url.searchParams.set('select', cleanedColumns);

    if (count) {
      this.headers.append('Prefer', `count=${count}`);
    }

    return new PostgrestFilterBuilder<Result[]>({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
    });
  }

  /**
   * Perform an INSERT into the table or view.
   *
   * By default, inserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to insert
   * @param options - Named parameters
   */
  insert(
    values: Partial<Result> | Partial<Result>[],
    options?: { count?: 'exact' | 'planned' | 'estimated'; defaultToNull?: boolean }
  ): PostgrestFilterBuilder<null> {
    const { count, defaultToNull = true } = options ?? {};
    const method = 'POST';

    if (count) {
      this.headers.append('Prefer', `count=${count}`);
    }
    if (!defaultToNull) {
      this.headers.append('Prefer', 'missing=default');
    }

    if (Array.isArray(values)) {
      const columns = values.reduce<string[]>((acc, x) => acc.concat(Object.keys(x as object)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
        this.url.searchParams.set('columns', uniqueColumns.join(','));
      }
    }

    return new PostgrestFilterBuilder<null>({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
    });
  }

  /**
   * Perform an UPSERT on the table or view.
   *
   * By default, upserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to upsert with
   * @param options - Named parameters
   */
  upsert(
    values: Partial<Result> | Partial<Result>[],
    options?: {
      onConflict?: string;
      ignoreDuplicates?: boolean;
      count?: 'exact' | 'planned' | 'estimated';
      defaultToNull?: boolean;
    }
  ): PostgrestFilterBuilder<null> {
    const { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = options ?? {};
    const method = 'POST';

    this.headers.append('Prefer', `resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`);

    if (onConflict !== undefined) {
      this.url.searchParams.set('on_conflict', onConflict);
    }
    if (count) {
      this.headers.append('Prefer', `count=${count}`);
    }
    if (!defaultToNull) {
      this.headers.append('Prefer', 'missing=default');
    }

    if (Array.isArray(values)) {
      const columns = values.reduce<string[]>((acc, x) => acc.concat(Object.keys(x as object)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
        this.url.searchParams.set('columns', uniqueColumns.join(','));
      }
    }

    return new PostgrestFilterBuilder<null>({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
    });
  }

  /**
   * Perform an UPDATE on the table or view.
   *
   * By default, updated rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param values - The values to update with
   * @param options - Named parameters
   */
  update(
    values: Partial<Result>,
    options?: { count?: 'exact' | 'planned' | 'estimated' }
  ): PostgrestFilterBuilder<null> {
    const { count } = options ?? {};
    const method = 'PATCH';

    if (count) {
      this.headers.append('Prefer', `count=${count}`);
    }

    return new PostgrestFilterBuilder<null>({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
    });
  }

  /**
   * Perform a DELETE on the table or view.
   *
   * By default, deleted rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param options - Named parameters
   */
  delete(options?: { count?: 'exact' | 'planned' | 'estimated' }): PostgrestFilterBuilder<null> {
    const { count } = options ?? {};
    const method = 'DELETE';

    if (count) {
      this.headers.append('Prefer', `count=${count}`);
    }

    return new PostgrestFilterBuilder<null>({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
    });
  }
}
