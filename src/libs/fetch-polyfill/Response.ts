/**
 * Miniprogram-compatible Response class
 * 
 * A Response implementation compatible with Web Fetch API that works in UniApp
 * miniprogram environment.
 */

import { Headers } from './Headers';

type HeadersInit = Headers | Record<string, string> | [string, string][];

export interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
  url?: string;
}

export class Response {
  private _body: unknown;
  private _bodyUsed: boolean = false;
  readonly headers: Headers;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;

  constructor(body: unknown, init: ResponseInit = {}) {
    this._body = body;
    this.status = init.status ?? 200;
    this.statusText = init.statusText ?? '';
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new Headers(init.headers);
    this.url = init.url ?? '';
  }

  get bodyUsed(): boolean {
    return this._bodyUsed;
  }

  async json<T = unknown>(): Promise<T> {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed');
    }
    this._bodyUsed = true;
    
    if (typeof this._body === 'string') {
      try {
        return JSON.parse(this._body);
      } catch {
        throw new TypeError('Failed to parse body as JSON');
      }
    }
    return this._body as T;
  }

  async text(): Promise<string> {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed');
    }
    this._bodyUsed = true;
    
    if (typeof this._body === 'string') {
      return this._body;
    }
    return JSON.stringify(this._body);
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed');
    }
    this._bodyUsed = true;
    
    const text = typeof this._body === 'string' ? this._body : JSON.stringify(this._body);
    const encoder = new TextEncoder();
    return encoder.encode(text).buffer;
  }

  async blob(): Promise<Blob> {
    throw new Error('Blob is not supported in UniApp environment');
  }

  async formData(): Promise<FormData> {
    throw new Error('FormData is not supported in UniApp environment');
  }

  clone(): Response {
    if (this._bodyUsed) {
      throw new TypeError('Cannot clone a response that has already been consumed');
    }
    return new Response(this._body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      url: this.url,
    });
  }
}
