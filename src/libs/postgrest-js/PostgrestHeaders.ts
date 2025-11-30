/**
 * Miniprogram-compatible Headers class for PostgREST
 * 
 * Re-exports the Headers class from fetch-polyfill for backwards compatibility.
 */

import { Headers } from '@/libs/fetch-polyfill';

/**
 * @deprecated Use Headers from '@/libs/fetch-polyfill' directly
 */
export const PostgrestHeaders = Headers;

// Re-export the type for TypeScript compatibility
export type { Headers as PostgrestHeadersType } from '@/libs/fetch-polyfill';
