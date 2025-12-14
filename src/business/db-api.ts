// ==================== PostgREST API Client ====================

import { PostgrestQueryBuilder, PostgrestFilterBuilder } from "@/libs/postgrest-js";
import { useAccountStore } from "@/store/account";
import store from "@/store";
import log from "@/utils/log";
import { Headers, URL } from "@/libs/fetch-polyfill";
import type { TableSchemaT } from "@/libs/postgrest-js";


// PostgREST URL from env
const PGRST_URL: string = (import.meta.env.VITE_PGRST_URL || "") as string;

// Credentials from backend main (same as api.ts)
function getAuthHeaders(): Record<string, string> {
  const authHeaders = useAccountStore(store).authHeaders as Record<string, string | undefined>;
  const headers: Record<string, string> = {};
  if (authHeaders.Authorization) {
    headers["Authorization"] = authHeaders.Authorization;
  }
  if (authHeaders.authorization) {
    headers["authorization"] = authHeaders.authorization;
  }
  return headers;
}

/**
 * DBApiClient extending PostgrestQueryBuilder for direct CRUD operations.
 * Uses the same credentials as the main backend API.
 * 
 * Unlike the base PostgrestQueryBuilder which is designed for single-use query building,
 * DBApiClient is designed to be reused across multiple operations. Each query method
 * creates a fresh query builder with updated auth headers.
 *
 * Uses miniprogram-compatible postgrest-js implementation.
 *
 * @example
 * ```typescript
 * // Define a DBApiClient for a table
 * static dbClient = new DBApiClient({
 *   tableName: 'users',
 *   schema: 'public',
 * });
 * 
 * // Use directly - no need to call from()
 * const users = await MyClass.dbClient.select('*').eq('active', true);
 * await MyClass.dbClient.insert({ name: 'John' });
 * await MyClass.dbClient.update({ name: 'Jane' }).eq('id', 1);
 * await MyClass.dbClient.delete().eq('id', 1);
 * ```
 *
 * @param opts.tableName - The table name to query
 * @param opts.schema - The database schema name (e.g., 'public', 'communication', 'partner_request')
 * @param opts.tableSchema - The Valibot schema for validating table rows
 */
export class DBApiClient<Result = unknown> extends PostgrestQueryBuilder<Result> {
  private _baseUrl: string;
  private _tableName: string;
  private _schema?: string;
  private _tableSchema?: TableSchemaT;
  private _initialized: boolean = false;

  constructor(opts: { tableName: string; schema?: string; tableSchema?: TableSchemaT }) {
    const schemaName = opts.schema ?? "public";
    const baseUrl = PGRST_URL || "";
    const tableUrl = `${baseUrl}/${opts.tableName}`;

    if (!PGRST_URL) {
      log.warn("DBApiClient: VITE_PGRST_URL is not configured. PostgREST operations will fail.");
    }

    // Initialize with a URL - this will be replaced on each operation
    super(new URL(tableUrl), {
      headers: getAuthHeaders(),
      schema: schemaName,
      tableSchema: opts.tableSchema,
    });

    this._baseUrl = baseUrl;
    this._tableName = opts.tableName;
    this._schema = schemaName;
    this._tableSchema = opts.tableSchema;
    this._initialized = !!PGRST_URL;
  }

  /**
   * Creates a fresh query builder with updated auth headers.
   * This ensures each operation gets the latest auth state.
   */
  private createFreshBuilder(): PostgrestQueryBuilder<Result> {
    if (!this._initialized) {
      throw new Error("DBApiClient: VITE_PGRST_URL environment variable is not configured.");
    }

    const freshUrl = new URL(`${this._baseUrl}/${this._tableName}`);
    const freshHeaders = new Headers(getAuthHeaders());

    // Extract the actual Valibot schema if tableSchema is a Valibot class
    const actualSchema = this._tableSchema && 'V' in this._tableSchema ? this._tableSchema.V : this._tableSchema;

    return new PostgrestQueryBuilder<Result>(freshUrl, {
      headers: freshHeaders,
      schema: this._schema,
      tableSchema: actualSchema,
    });
  }

  /**
   * Perform a SELECT query on the table or view.
   * Creates a fresh query builder with updated auth headers.
   *
   * @param columns - The columns to retrieve, separated by commas
   * @param options - Named parameters
   */
  override select<Columns extends string = '*'>(
    columns?: Columns,
    options?: { head?: boolean; count?: 'exact' | 'planned' | 'estimated' }
  ): PostgrestFilterBuilder<Result[]> {
    return this.createFreshBuilder().select(columns, options);
  }

  /**
   * Perform an INSERT into the table or view.
   * Creates a fresh query builder with updated auth headers.
   *
   * @param values - The values to insert
   * @param options - Named parameters
   */
  override insert(
    values: Partial<Result> | Partial<Result>[],
    options?: { count?: 'exact' | 'planned' | 'estimated'; defaultToNull?: boolean }
  ): PostgrestFilterBuilder<Result> {
    return this.createFreshBuilder().insert(values, options);
  }

  /**
   * Perform an UPSERT on the table or view.
   * Creates a fresh query builder with updated auth headers.
   *
   * @param values - The values to upsert with
   * @param options - Named parameters
   */
  override upsert(
    values: Partial<Result> | Partial<Result>[],
    options?: {
      onConflict?: string;
      ignoreDuplicates?: boolean;
      count?: 'exact' | 'planned' | 'estimated';
      defaultToNull?: boolean;
    }
  ): PostgrestFilterBuilder<Result> {
    return this.createFreshBuilder().upsert(values, options);
  }

  /**
   * Perform an UPDATE on the table or view.
   * Creates a fresh query builder with updated auth headers.
   *
   * @param values - The values to update with
   * @param options - Named parameters
   */
  override update(
    values: Partial<Result>,
    options?: { count?: 'exact' | 'planned' | 'estimated' }
  ): PostgrestFilterBuilder<Result> {
    return this.createFreshBuilder().update(values, options);
  }

  /**
   * Perform a DELETE on the table or view.
   * Creates a fresh query builder with updated auth headers.
   *
   * @param options - Named parameters
   */
  override delete(options?: { count?: 'exact' | 'planned' | 'estimated' }): PostgrestFilterBuilder<Result> {
    return this.createFreshBuilder().delete(options);
  }
}
