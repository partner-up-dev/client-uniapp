// ==================== Fetch API Compatible Wrapper ====================
// Re-exports from the unified fetch-polyfill module for backwards compatibility

import {
  Headers,
  Response,
  fetch as fetchImpl,
  type RequestInit,
} from '@/libs/fetch-polyfill';

// Type aliases for backwards compatibility
export type FetchRequestInit = RequestInit;

/**
 * FetchHeaders - alias for Headers from fetch-polyfill
 * @deprecated Use Headers from '@/libs/fetch-polyfill' directly
 */
export const FetchHeaders = Headers;

/**
 * FetchResponse - alias for Response from fetch-polyfill
 * @deprecated Use Response from '@/libs/fetch-polyfill' directly
 */
export const FetchResponse = Response;

/**
 * fetch - re-export from fetch-polyfill
 * @deprecated Use fetch from '@/libs/fetch-polyfill' directly
 */
export const fetch = fetchImpl;
