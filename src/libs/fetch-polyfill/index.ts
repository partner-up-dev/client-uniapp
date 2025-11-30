/**
 * Fetch API Polyfill for UniApp Miniprogram
 * 
 * This module provides miniprogram-compatible implementations of Web Fetch API
 * classes and functions. Since UniApp miniprogram environment doesn't have
 * native support for Headers, URL, URLSearchParams, Response, and fetch,
 * this polyfill provides compatible implementations.
 * 
 * Usage:
 * ```typescript
 * import { fetch, Headers, Response, URL, URLSearchParams } from '@/libs/fetch-polyfill';
 * 
 * // Make a request
 * const response = await fetch('https://api.example.com/data', {
 *   method: 'POST',
 *   headers: new Headers({ 'Content-Type': 'application/json' }),
 *   body: JSON.stringify({ key: 'value' }),
 * });
 * 
 * const data = await response.json();
 * ```
 */

export { Headers } from './Headers';
export { Response, type ResponseInit } from './Response';
export { URL, URLSearchParams } from './URL';
export { fetch, createPostgrestFetch, type RequestInit, type FetchFn } from './fetch';
