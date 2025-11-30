/**
 * PostgREST client for miniprogram (UniApp)
 * 
 * A miniprogram-compatible re-implementation of @supabase/postgrest-js
 * that uses fetch-polyfill for Headers and URL.
 */

export { PostgrestClient } from './PostgrestClient';
export { PostgrestQueryBuilder } from './PostgrestQueryBuilder';
export { PostgrestFilterBuilder } from './PostgrestFilterBuilder';
export { PostgrestTransformBuilder } from './PostgrestTransformBuilder';
export { PostgrestBuilder, type PostgrestResponse, type PostgrestFetch } from './PostgrestBuilder';
export { PostgrestError, type PostgrestErrorContext } from './PostgrestError';

// Re-export from fetch-polyfill for backwards compatibility
export { Headers as PostgrestHeaders, URL as PostgrestURL, URLSearchParams as PostgrestURLSearchParams } from '@/libs/fetch-polyfill';
