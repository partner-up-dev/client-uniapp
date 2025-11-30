import { PostgrestBuilder } from './PostgrestBuilder';
import type { PostgrestBuilderConfig, PostgrestFetch } from './PostgrestBuilder';

/**
 * Transform builder for PostgREST queries
 * 
 * Miniprogram-compatible implementation
 */
export class PostgrestTransformBuilder<Result> extends PostgrestBuilder<Result> {
  constructor(builder: PostgrestBuilderConfig) {
    super(builder);
  }

  /**
   * Perform a SELECT on the query result.
   *
   * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
   * return modified rows. By calling this method, modified rows are returned in
   * `data`.
   *
   * @param columns - The columns to retrieve, separated by commas
   */
  select(columns?: string): this {
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
    this.headers.append('Prefer', 'return=representation');
    return this;
  }

  /**
   * Order the query result by `column`.
   *
   * @param column - The column to order by
   * @param options - Named parameters
   */
  order(
    column: string,
    {
      ascending = true,
      nullsFirst,
      referencedTable,
    }: {
      ascending?: boolean;
      nullsFirst?: boolean;
      referencedTable?: string;
    } = {}
  ): this {
    const key = referencedTable ? `${referencedTable}.order` : 'order';
    const existingOrder = this.url.searchParams.get(key);
    this.url.searchParams.set(
      key,
      `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}${
        nullsFirst === undefined ? '' : nullsFirst ? '.nullsfirst' : '.nullslast'
      }`
    );
    return this;
  }

  /**
   * Limit the query result by `count`.
   *
   * @param count - The maximum number of rows to return
   * @param options - Named parameters
   */
  limit(
    count: number,
    { referencedTable }: { referencedTable?: string } = {}
  ): this {
    const key = typeof referencedTable === 'undefined' ? 'limit' : `${referencedTable}.limit`;
    this.url.searchParams.set(key, `${count}`);
    return this;
  }

  /**
   * Limit the query result by starting at an offset `from` and ending at the offset `to`.
   *
   * @param from - The starting index from which to limit the result
   * @param to - The last index to which to limit the result
   * @param options - Named parameters
   */
  range(
    from: number,
    to: number,
    { referencedTable }: { referencedTable?: string } = {}
  ): this {
    const keyOffset = typeof referencedTable === 'undefined' ? 'offset' : `${referencedTable}.offset`;
    const keyLimit = typeof referencedTable === 'undefined' ? 'limit' : `${referencedTable}.limit`;
    this.url.searchParams.set(keyOffset, `${from}`);
    this.url.searchParams.set(keyLimit, `${to - from + 1}`);
    return this;
  }

  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(signal: AbortSignal): this {
    this.signal = signal;
    return this;
  }

  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be one row (e.g. using `.limit(1)`), otherwise this
   * returns an error.
   */
  single<T = Result>(): PostgrestBuilder<T> {
    this.headers.set('Accept', 'application/vnd.pgrst.object+json');
    return this as unknown as PostgrestBuilder<T>;
  }

  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
   * this returns an error.
   */
  maybeSingle<T = Result>(): PostgrestBuilder<T | null> {
    if (this.method === 'GET') {
      this.headers.set('Accept', 'application/json');
    } else {
      this.headers.set('Accept', 'application/vnd.pgrst.object+json');
    }
    this.isMaybeSingle = true;
    return this as unknown as PostgrestBuilder<T | null>;
  }

  /**
   * Return `data` as a string in CSV format.
   */
  csv(): PostgrestBuilder<string> {
    this.headers.set('Accept', 'text/csv');
    return this as unknown as PostgrestBuilder<string>;
  }

  /**
   * Return `data` as an object in GeoJSON format.
   */
  geojson(): PostgrestBuilder<Record<string, unknown>> {
    this.headers.set('Accept', 'application/geo+json');
    return this as unknown as PostgrestBuilder<Record<string, unknown>>;
  }

  /**
   * Rollback the query.
   */
  rollback(): this {
    this.headers.append('Prefer', 'tx=rollback');
    return this;
  }
}
