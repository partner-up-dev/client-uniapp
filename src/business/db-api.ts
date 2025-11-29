// ==================== PostgREST API Client ====================

import { PostgrestClient } from "@/libs/postgrest-js";
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
 * Uses miniprogram-compatible postgrest-js implementation.
 *
 * @typeParam SchemaName - The database schema name (e.g., 'public', 'communication', 'partner_request')
 */
export class DBApiClient extends PostgrestClient {
  private _tableName: string;
  private _initialized: boolean = false;

  constructor(opts: { tableName: string; schema?: string }) {
    const schemaName = opts.schema ?? "public";

    if (!PGRST_URL) {
      log.warn("DBApiClient: VITE_PGRST_URL is not configured. PostgREST operations will fail.");
      // Use empty string to allow construction, will fail on actual requests
      super("", {
        schema: schemaName,
        headers: getAuthHeaders(),
      });
    } else {
      super(PGRST_URL, {
        schema: schemaName,
        headers: getAuthHeaders(),
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
    return super.from(this._tableName);
  }
}
