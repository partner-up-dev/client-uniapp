/**
 * PostgREST client for miniprogram (UniApp)
 * 
 * A miniprogram-compatible re-implementation of @supabase/postgrest-js
 * that doesn't rely on browser APIs like Headers or URL.
 * 
 * The underlying fetch polyfills are provided by '@/libs/fetch-polyfill'.
 */

export { PostgrestClient } from './PostgrestClient';
export { PostgrestQueryBuilder } from './PostgrestQueryBuilder';
export { PostgrestFilterBuilder } from './PostgrestFilterBuilder';
export { PostgrestTransformBuilder } from './PostgrestTransformBuilder';
export { PostgrestBuilder, type PostgrestResponse, type PostgrestFetch } from './PostgrestBuilder';
export { PostgrestHeaders } from './PostgrestHeaders';
export { PostgrestURL, PostgrestURLSearchParams } from './PostgrestURL';
export { PostgrestError, type PostgrestErrorContext } from './PostgrestError';

// Re-export fetch-polyfill utilities for convenience
export { createPostgrestFetch, type FetchFn } from '@/libs/fetch-polyfill';
