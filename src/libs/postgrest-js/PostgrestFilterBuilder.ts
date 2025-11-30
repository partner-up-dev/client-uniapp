import { PostgrestTransformBuilder } from './PostgrestTransformBuilder';
import type { PostgrestBuilderConfig } from './PostgrestBuilder';

// RegExp for PostgREST reserved characters
const PostgrestReservedCharsRegexp = new RegExp('[,()]');

/**
 * Filter builder for PostgREST queries
 * 
 * Miniprogram-compatible implementation
 */
export class PostgrestFilterBuilder<Result> extends PostgrestTransformBuilder<Result> {
  constructor(builder: PostgrestBuilderConfig) {
    super(builder);
  }

  /**
   * Match only rows where `column` is equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  eq(column: string, value: unknown): this {
    this.url.searchParams.append(column, `eq.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` is not equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  neq(column: string, value: unknown): this {
    this.url.searchParams.append(column, `neq.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` is greater than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gt(column: string, value: unknown): this {
    this.url.searchParams.append(column, `gt.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` is greater than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gte(column: string, value: unknown): this {
    this.url.searchParams.append(column, `gte.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` is less than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lt(column: string, value: unknown): this {
    this.url.searchParams.append(column, `lt.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` is less than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lte(column: string, value: unknown): this {
    this.url.searchParams.append(column, `lte.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` matches `pattern` case-sensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  like(column: string, pattern: string): this {
    this.url.searchParams.append(column, `like.${pattern}`);
    return this;
  }

  /**
   * Match only rows where `column` matches all of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAllOf(column: string, patterns: string[]): this {
    this.url.searchParams.append(column, `like(all).{${patterns.join(',')}}`);
    return this;
  }

  /**
   * Match only rows where `column` matches any of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAnyOf(column: string, patterns: string[]): this {
    this.url.searchParams.append(column, `like(any).{${patterns.join(',')}}`);
    return this;
  }

  /**
   * Match only rows where `column` matches `pattern` case-insensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  ilike(column: string, pattern: string): this {
    this.url.searchParams.append(column, `ilike.${pattern}`);
    return this;
  }

  /**
   * Match only rows where `column` matches all of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAllOf(column: string, patterns: string[]): this {
    this.url.searchParams.append(column, `ilike(all).{${patterns.join(',')}}`);
    return this;
  }

  /**
   * Match only rows where `column` matches any of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAnyOf(column: string, patterns: string[]): this {
    this.url.searchParams.append(column, `ilike(any).{${patterns.join(',')}}`);
    return this;
  }

  /**
   * Match only rows where `column` IS `value`.
   *
   * For non-boolean columns, this is only relevant for checking if the value of
   * `column` is NULL by setting `value` to `null`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  is(column: string, value: boolean | null): this {
    this.url.searchParams.append(column, `is.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` IS DISTINCT FROM `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  isDistinct(column: string, value: unknown): this {
    this.url.searchParams.append(column, `isdistinct.${value}`);
    return this;
  }

  /**
   * Match only rows where `column` is included in the `values` array.
   *
   * @param column - The column to filter on
   * @param values - The values array to filter with
   */
  in(column: string, values: unknown[]): this {
    const cleanedValues = Array.from(new Set(values))
      .map((s) => {
        if (typeof s === 'string' && PostgrestReservedCharsRegexp.test(s)) {
          return `"${s}"`;
        } else {
          return `${s}`;
        }
      })
      .join(',');
    this.url.searchParams.append(column, `in.(${cleanedValues})`);
    return this;
  }

  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * `column` contains every element appearing in `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  contains(column: string, value: string | unknown[] | Record<string, unknown>): this {
    if (typeof value === 'string') {
      this.url.searchParams.append(column, `cs.${value}`);
    } else if (Array.isArray(value)) {
      this.url.searchParams.append(column, `cs.{${value.join(',')}}`);
    } else {
      this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
    }
    return this;
  }

  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * every element appearing in `column` is contained by `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  containedBy(column: string, value: string | unknown[] | Record<string, unknown>): this {
    if (typeof value === 'string') {
      this.url.searchParams.append(column, `cd.${value}`);
    } else if (Array.isArray(value)) {
      this.url.searchParams.append(column, `cd.{${value.join(',')}}`);
    } else {
      this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
    }
    return this;
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is greater than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGt(column: string, range: string): this {
    this.url.searchParams.append(column, `sr.${range}`);
    return this;
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or greater than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGte(column: string, range: string): this {
    this.url.searchParams.append(column, `nxl.${range}`);
    return this;
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is less than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLt(column: string, range: string): this {
    this.url.searchParams.append(column, `sl.${range}`);
    return this;
  }

  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or less than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLte(column: string, range: string): this {
    this.url.searchParams.append(column, `nxr.${range}`);
    return this;
  }

  /**
   * Only relevant for range columns. Match only rows where `column` is
   * mutually exclusive to `range` and there can be no element between the two
   * ranges.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeAdjacent(column: string, range: string): this {
    this.url.searchParams.append(column, `adj.${range}`);
    return this;
  }

  /**
   * Only relevant for array and range columns. Match only rows where
   * `column` and `value` have an element in common.
   *
   * @param column - The array or range column to filter on
   * @param value - The array or range value to filter with
   */
  overlaps(column: string, value: string | unknown[]): this {
    if (typeof value === 'string') {
      this.url.searchParams.append(column, `ov.${value}`);
    } else {
      this.url.searchParams.append(column, `ov.{${value.join(',')}}`);
    }
    return this;
  }

  /**
   * Only relevant for text and tsvector columns. Match only rows where
   * `column` matches the query string in `query`.
   *
   * @param column - The text or tsvector column to filter on
   * @param query - The query text to match with
   * @param options - Named parameters
   */
  textSearch(
    column: string,
    query: string,
    { config, type }: { config?: string; type?: 'plain' | 'phrase' | 'websearch' } = {}
  ): this {
    let typePart = '';
    if (type === 'plain') {
      typePart = 'pl';
    } else if (type === 'phrase') {
      typePart = 'ph';
    } else if (type === 'websearch') {
      typePart = 'w';
    }
    const configPart = config === undefined ? '' : `(${config})`;
    this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
    return this;
  }

  /**
   * Match only rows where each column in `query` keys is equal to its
   * associated value. Shorthand for multiple `.eq()`s.
   *
   * @param query - The object to filter with, with column names as keys mapped
   * to their filter values
   */
  match(query: Record<string, unknown>): this {
    Object.entries(query).forEach(([column, value]) => {
      this.url.searchParams.append(column, `eq.${value}`);
    });
    return this;
  }

  /**
   * Match only rows which doesn't satisfy the filter.
   *
   * @param column - The column to filter on
   * @param operator - The operator to be negated to filter with
   * @param value - The value to filter with
   */
  not(column: string, operator: string, value: unknown): this {
    this.url.searchParams.append(column, `not.${operator}.${value}`);
    return this;
  }

  /**
   * Match only rows which satisfy at least one of the filters.
   *
   * @param filters - The filters to use, following PostgREST syntax
   * @param options - Named parameters
   */
  or(filters: string, { referencedTable }: { referencedTable?: string } = {}): this {
    const key = referencedTable ? `${referencedTable}.or` : 'or';
    this.url.searchParams.append(key, `(${filters})`);
    return this;
  }

  /**
   * Match only rows which satisfy the filter. This is an escape hatch - you
   * should use the specific filter methods wherever possible.
   *
   * @param column - The column to filter on
   * @param operator - The operator to filter with
   * @param value - The value to filter with
   */
  filter(column: string, operator: string, value: unknown): this {
    this.url.searchParams.append(column, `${operator}.${value}`);
    return this;
  }
}
