/**
 * Miniprogram-compatible URL class for PostgREST
 * 
 * Re-exports URL and URLSearchParams from fetch-polyfill for backwards compatibility.
 */

import { URL, URLSearchParams } from '@/libs/fetch-polyfill';

/**
 * @deprecated Use URL from '@/libs/fetch-polyfill' directly
 */
export const PostgrestURL = URL;

/**
 * @deprecated Use URLSearchParams from '@/libs/fetch-polyfill' directly
 */
export const PostgrestURLSearchParams = URLSearchParams;

// Re-export types for TypeScript compatibility
export type { URL as PostgrestURLType, URLSearchParams as PostgrestURLSearchParamsType } from '@/libs/fetch-polyfill';
