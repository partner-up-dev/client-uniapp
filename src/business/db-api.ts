// ==================== PostgREST API Client ====================

import { PostgrestClient } from "@supabase/postgrest-js";
import type { GenericSchema } from "@supabase/postgrest-js";
import { fetch as apiFetch } from "./api-fetch";
import { useAccountStore } from "@/store/account";
import store from "@/store";

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
 * Creates a custom fetch that injects auth headers
 */
function createAuthenticatedFetch(): typeof fetch {
  return ((input: RequestInfo | URL, init?: RequestInit) => {
    const authHeaders = getAuthHeaders();
    const existingHeaders = init?.headers || {};
    const mergedHeaders = {
      ...authHeaders,
      ...(existingHeaders instanceof Headers
        ? Object.fromEntries(existingHeaders.entries())
        : Array.isArray(existingHeaders)
          ? Object.fromEntries(existingHeaders)
          : existingHeaders),
    };
    return apiFetch(input as string | URL, {
      ...init,
      headers: mergedHeaders,
    });
  }) as typeof fetch;
}

/**
 * DBApiClient wrapping postgrest-js for pure CRUD operations.
 * Uses the same credentials as the main backend API.
 *
 * @typeParam Schema - Database schema type from postgrest-js
 */
export class DBApiClient<Schema extends GenericSchema = GenericSchema> {
  private _client: PostgrestClient<{ public: Schema }, {}, "public", Schema>;
  private _tableName: string;

  constructor(opts: { tableName: string }) {
    this._tableName = opts.tableName;
    this._client = new PostgrestClient<{ public: Schema }, {}, "public", Schema>(PGRST_URL, {
      fetch: createAuthenticatedFetch(),
    });
  }

  /**
   * Access the underlying PostgrestClient for advanced operations
   */
  get client(): PostgrestClient<{ public: Schema }, {}, "public", Schema> {
    return this._client;
  }

  /**
   * Get a query builder for the configured table
   */
  from() {
    return this._client.from(this._tableName as string & keyof Schema["Tables"]);
  }
}
