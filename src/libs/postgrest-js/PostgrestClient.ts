import { PostgrestQueryBuilder } from './PostgrestQueryBuilder';
import { PostgrestFilterBuilder } from './PostgrestFilterBuilder';
import { PostgrestHeaders } from './PostgrestHeaders';
import { PostgrestURL } from './PostgrestURL';
import { PostgrestFetch } from './PostgrestBuilder';

/**
 * PostgREST client
 * 
 * Miniprogram-compatible implementation
 */
export class PostgrestClient {
  protected url: string;
  public headers: PostgrestHeaders;
  protected schemaName?: string;
  protected fetch?: PostgrestFetch;

  /**
   * Creates a PostgREST client.
   *
   * @param url - URL of the PostgREST endpoint
   * @param options - Named parameters
   * @param options.headers - Custom headers
   * @param options.schema - Postgres schema to switch to
   * @param options.fetch - Custom fetch
   */
  constructor(
    url: string,
    {
      headers = {},
      schema,
      fetch,
    }: {
      headers?: Record<string, string>;
      schema?: string;
      fetch?: PostgrestFetch;
    } = {}
  ) {
    this.url = url;
    this.headers = new PostgrestHeaders(headers);
    this.schemaName = schema;
    this.fetch = fetch;
  }

  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from<T = unknown>(relation: string): PostgrestQueryBuilder<T> {
    if (!relation || typeof relation !== 'string' || relation.trim() === '') {
      throw new Error('Invalid relation name: relation must be a non-empty string.');
    }
    const url = new PostgrestURL(`${this.url}/${relation}`);
    return new PostgrestQueryBuilder<T>(url, {
      headers: this.headers,
      schema: this.schemaName,
      fetch: this.fetch,
    });
  }

  /**
   * Select a schema to query or perform a function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema: string): PostgrestClient {
    return new PostgrestClient(this.url, {
      headers: this.headers.toObject(),
      schema,
      fetch: this.fetch,
    });
  }

  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   */
  rpc(
    fn: string,
    args: Record<string, unknown> = {},
    {
      head = false,
      get = false,
      count,
    }: {
      head?: boolean;
      get?: boolean;
      count?: 'exact' | 'planned' | 'estimated';
    } = {}
  ): PostgrestFilterBuilder<unknown> {
    let method: 'GET' | 'HEAD' | 'POST';
    const url = new PostgrestURL(`${this.url}/rpc/${fn}`);
    let body: Record<string, unknown> | undefined;

    if (head || get) {
      method = head ? 'HEAD' : 'GET';
      Object.entries(args)
        .filter(([_, value]) => value !== undefined)
        .map(([name, value]): [string, string] => [
          name,
          Array.isArray(value) ? `{${value.join(',')}}` : `${value}`,
        ])
        .forEach(([name, value]) => {
          url.searchParams.append(name, value);
        });
    } else {
      method = 'POST';
      body = args;
    }

    const headers = new PostgrestHeaders(this.headers.toObject());
    if (count) {
      headers.set('Prefer', `count=${count}`);
    }

    return new PostgrestFilterBuilder({
      method,
      url,
      headers,
      schema: this.schemaName,
      body,
      fetch: this.fetch,
    });
  }
}
