// ==================== PostgREST API Client ====================

import { PostgrestClient } from "@supabase/postgrest-js";
import type { GenericSchema } from "@supabase/postgrest-js";
import { fetch as apiFetch } from "./api-fetch";
import { useAccountStore } from "@/store/account";
import store from "@/store";
import log from "@/utils/log";

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
 * DBApiClient extending PostgrestClient for pure CRUD operations.
 * Uses the same credentials as the main backend API.
 *
 * @typeParam SchemaName - The database schema name (e.g., 'public', 'communication', 'partner_request')
 */
export class DBApiClient<
  SchemaName extends string = "public"
> extends PostgrestClient<Record<SchemaName, GenericSchema>, {}, SchemaName, GenericSchema> {
  private _tableName: string;
  private _initialized: boolean = false;

  constructor(opts: { tableName: string; schema?: SchemaName }) {
    const schemaName = opts.schema ?? ("public" as SchemaName);

    if (!PGRST_URL) {
      log.warn("DBApiClient: VITE_PGRST_URL is not configured. PostgREST operations will fail.");
      // Use empty string to allow construction, will fail on actual requests
      super("", {
        schema: schemaName,
        fetch: apiFetch as typeof fetch,
      });
    } else {
      super(PGRST_URL, {
        schema: schemaName,
        headers: getAuthHeaders(),
        fetch: apiFetch as typeof fetch,
      });
      this._initialized = true;
    }

    this._tableName = opts.tableName;
  }

  /**
   * Get a query builder for the configured table.
   * Updates auth headers before each request.
   */
  from() {
    if (!this._initialized) {
      throw new Error("DBApiClient: VITE_PGRST_URL environment variable is not configured.");
    }
    // Update headers with current auth state before each request
    const currentHeaders = getAuthHeaders();
    Object.entries(currentHeaders).forEach(([key, value]) => {
      this.headers.set(key, value);
    });
    return super.from(this._tableName as any);
  }
}
