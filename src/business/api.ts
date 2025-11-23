import { EVENT } from "@/data/enum";
import { t } from "@/locale/use";
import store from "@/store";
import { useAccountStore } from "@/store/account";
import log from "@/utils/log";
import { un } from "@uni-helper/uni-network";
import { errorReport } from "@/utils/vendor";
import * as v from "valibot";
import { Account } from "@/business/account/base";

// Base URL from env; instance clients will set this when constructed
const BASE_URL: string = (import.meta.env.VITE_BACKEND_MAIN_URL || "") as string;
const DEFAULT_TIMEOUT = 5000;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_SUCCESS_CODES = [200, 201, 204, 307, 302, 301] as const;

// ParseTarget: either a Valibot schema or any class constructor (e.g., returned by V.class(...))
type ParseTarget = v.BaseSchema<any, any, any> | (abstract new (...args: any) => any);

// Given a ParseTarget, infer the parsed output type
export type ParsedOf<S> =
  // If S is a class constructor, infer its instance type (e.g., Location)
  S extends abstract new (...args: any) => infer I ? I :
  // If S is a Valibot schema, infer its output
  S extends v.BaseSchema<any, infer O, any> ? O :
  unknown;

export class Body<S extends ParseTarget | undefined = undefined> {
  private readonly _raw: unknown;
  private readonly _schema?: S;

  constructor(raw: unknown, schema?: S) {
    this._raw = raw;
    this._schema = schema;
  }

  // Original payload from server, unmodified
  get raw(): unknown {
    return this._raw;
  }

  // Lazily-validated data via Valibot or ValibotClass; returns unknown when no schema provided
  get parsed(): ParsedOf<S> {
    if (this._schema) {
      const target = this._schema as ParseTarget;
      const maybeParse = (target as any)?.parse as ((d: unknown) => unknown) | undefined;
      // If provided target exposes a static parse (ValibotClass), prefer that
      if (typeof maybeParse === 'function') {
        return maybeParse.call(target as any, this._raw) as ParsedOf<S>;
      }
      // Otherwise, treat it as a Valibot schema
      return v.parse(target as v.BaseSchema<any, any, any>, this._raw) as ParsedOf<S>;
    }
    // No schema -> return raw as-is (unknown)
    return this._raw as ParsedOf<S>;
  }
}

export interface APIResponse<S extends ParseTarget | undefined = undefined> {
  body: Body<S>;
  statusCode: number;
  header: Record<string, unknown>;
  cookies: string[];
}

export interface requestAPIParams<S extends ParseTarget | undefined = undefined> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data?: object | Array<any> | string | ArrayBuffer | ArrayBufferView | URLSearchParams;
  headers?: Record<string, unknown>;
  timeout?: number;
  retry_left?: number;
  retry_delay?: number;
  operation_id?: string;
  // Optional schema or ValibotClass to validate/parse the response body on demand
  schema?: S;
  code_handlers?: {
    [property: number]: (res: APIResponse<S>) => boolean;
  };
  success_codes?: number[];
}

// Utility type: choose S if provided, otherwise fallback FS
type SchemaOr<S extends ParseTarget | undefined, FS extends ParseTarget | undefined> =
  S extends undefined ? FS : S;

export class APIClient<FS extends ParseTarget | undefined = undefined> {

  protected _modulePrefix: string;
  protected _clientId: string;
  protected _dt: (msg: string) => string;

  protected _http = un.create();
  protected _fallbackSchema?: FS;

  // Extras stored on the request config for interceptors to read back
  private typeExtrasGuard = true; // dummy to keep private section grouped
  private static readonly _noop = () => { /* placeholder to avoid empty class sections */ };

  private getExtras(from: unknown): {
    __schema?: ParseTarget;
    __operation_id?: string;
    __success_codes?: number[];
    __code_handlers?: { [status: number]: (res: APIResponse<any>) => boolean };
    __retry_left?: number;
    __retry_delay?: number;
  } {
    // Safely unwrap the custom extras we inject on each request
    const cfg = (from as any)?.config ?? {};
    return (cfg.__apiExtras ?? {}) as Record<string, unknown> as any;
  }

  private buildApiResponse<S2 extends ParseTarget | undefined>(
    response: any,
    schema?: S2,
  ): APIResponse<S2> {
    return {
      body: new Body<S2>(response?.data as unknown, schema),
      statusCode: (response?.status ?? 0) as number,
      header: (response?.headers ?? {}) as Record<string, unknown>,
      cookies: (response?.cookies ?? []) as string[],
    };
  }

  private isSuccess(statusCode: number, successCodes: number[]): boolean {
    return successCodes.includes(statusCode);
  }

  private updateTokenFromHeaders(headers: unknown): void {
    const headerObj = (headers ?? {}) as Record<string, unknown>;
    useAccountStore(store).upsertToken({
      Authorization: headerObj['Authorization'] as string | undefined,
      authorization: headerObj['authorization'] as string | undefined,
    });
  }

  // Handle 401 with optional retry/login; returns retried response or rejects with APIResponse
  private async handle401(response: any, extras: ReturnType<APIClient['getExtras']>) {
    const retryLeft = extras.__retry_left ?? 0;
    const retryDelay = extras.__retry_delay ?? DEFAULT_RETRY_DELAY;
    const toApiRes = (schema?: ParseTarget) =>
      this.buildApiResponse(response, (schema ?? this._fallbackSchema) as any);

    const noRetryLeft = retryLeft <= 0;
    if (noRetryLeft) {
      uni.$emit(EVENT.ACCOUNT_LOGGED_OUT);
      return Promise.reject(toApiRes(extras.__schema));
    }

    // Backoff then try login and retry once
    await new Promise<void>((r) => setTimeout(r, retryDelay));
    try {
      await Account.login(false);
      const newCfg: any = { ...(response as any).config };
      newCfg.__apiExtras = { ...(newCfg.__apiExtras ?? {}), __retry_left: retryLeft - 1 };
      return this._http(newCfg as any);
    } catch {
      uni.$emit(EVENT.ACCOUNT_LOGGED_OUT);
      return Promise.reject(toApiRes(extras.__schema));
    }
  }

  constructor(opts?: {
    modulePrefix?: string;
    dt?: (msg: string) => string;
    clientId?: string;
    fallbackSchema?: FS;
  }) {
    this._modulePrefix = opts?.modulePrefix ?? '';
    // TODO use env variaable
    // #ifdef MP-WEIXIN
    this._clientId = opts?.clientId ?? 'mp-weixin';
    // #endif
    // #ifndef MP-WEIXIN
    this._clientId = opts?.clientId ?? '';
    // #endif
    this._dt = opts?.dt ?? ((msg: string) => msg);
    this._fallbackSchema = opts?.fallbackSchema;

    // Configure per-instance client
    this._http.defaults.validateStatus = () => true;
    this._http.defaults.baseUrl = BASE_URL;

    // Inject auth headers and x-Client-Id for each request
    this._http.interceptors.request.use((config) => {
      const authHeaders = useAccountStore(store).authHeaders as Record<string, unknown>;
      const incomingHeaders = config.headers as Record<string, unknown> | undefined;
      const mergedHeaders = {
        ...authHeaders,
        ...incomingHeaders,
        'x-Client-Id': this._clientId,
      } as Record<string, unknown>;
      config.headers = mergedHeaders;
      return config;
    });

    // Response interceptor: update token, handle success codes, custom handlers and 401
    this._http.interceptors.response.use(async (response) => {
      this.updateTokenFromHeaders(response.headers);

      const extras = this.getExtras(response);
      const statusCode = (response.status ?? 0) as number;
      const successCodes = extras.__success_codes ?? [...DEFAULT_SUCCESS_CODES];
      const toApiRes = (schema?: ParseTarget) =>
        this.buildApiResponse(response, (schema ?? this._fallbackSchema) as any);

      // Custom handler for specific status code
      const customHandler = extras.__code_handlers?.[statusCode];
      if (customHandler) {
        const apiRes = toApiRes(extras.__schema);
        const shouldResolve = customHandler(apiRes);
        return shouldResolve ? response : Promise.reject(apiRes);
      }

      // 401 handling with retry and login
      if (statusCode === 401) {
        return this.handle401(response, extras);
      }

      // Success path
      if (this.isSuccess(statusCode, successCodes)) return response;

      // Otherwise report and reject
      this.reportFailureInst(extras.__operation_id);
      return Promise.reject(toApiRes(extras.__schema));
    }, (err) => {
      try {
        const extras = this.getExtras(err);
        this.reportFailureInst(extras.__operation_id, 'request_error');
      } catch { /* ignore reporting failures */ }
      return Promise.reject(err);
    });
  }

  protected static reportFailure(
    operation_id?: string,
    fail_type: 'request_error' | 'response_error' = 'response_error',
    status_code?: number, api_name?: string,
  ) {
    // Static context: use global i18n translator directly
    if (!api_name && operation_id) {
      api_name = t(`${operation_id}.name`);
    }

    const errmsg = status_code
      ? t(`${operation_id}.report.${status_code}`)
      : t(`api.report.${fail_type}`);

    errorReport(`${api_name}${errmsg}`);
  }

  // Instance-level failure reporter for composition
  protected reportFailureInst(
    operation_id?: string,
    fail_type: 'request_error' | 'response_error' = 'response_error',
    status_code?: number, api_name?: string,
  ) {
    if (!api_name && operation_id) {
      api_name = this._dt(`${operation_id}.name`)
    }

    let errmsg: string;
    if (status_code) {
      errmsg = this._dt(`${operation_id}.report.${status_code}`)
    }
    else {
      errmsg = t(`api.report.${fail_type}`)
    }

    errorReport(
      `${api_name}${errmsg}`
    )
  }

  // Public instance method to support composition-based API usage
  // Overload 1: caller provides a concrete schema S per request -> returns APIResponse<S>
  public requestHTTP<S extends ParseTarget>(
    params: Omit<requestAPIParams<S>, 'schema'> & { schema: S }
  ): Promise<APIResponse<S>>;
  // Overload 2: caller provides no schema -> returns APIResponse<FS> using client's fallback schema
  public requestHTTP(
    params: Omit<requestAPIParams<undefined>, 'schema'> & { schema?: undefined }
  ): Promise<APIResponse<FS>>;
  // Implementation signature covering both overloads
  public requestHTTP<S extends ParseTarget | undefined = undefined>(
    params: requestAPIParams<S>
  ): Promise<APIResponse<SchemaOr<S, FS>>> {
    let {
      method,
      endpoint,
      data,
      headers,
      timeout = DEFAULT_TIMEOUT,
      retry_left = 0,
      retry_delay = DEFAULT_RETRY_DELAY,
      operation_id,
      code_handlers = {},
      success_codes = [...DEFAULT_SUCCESS_CODES],
    } = params;

    // Compose URL parts based on configured BASE_URL + per-instance prefix.
    const urlWithPrefix = `${this._modulePrefix}${endpoint}`;
    const fullUrl = `${BASE_URL}${urlWithPrefix}`;

    return new Promise((resolve, reject) => {
      const config: any = {
        method,
        url: urlWithPrefix,
        data,
        headers: headers as Record<string, unknown> | undefined,
        timeout,
        // Inject per-request extras for interceptors
        __apiExtras: {
          __schema: params.schema,
          __operation_id: operation_id,
          __success_codes: success_codes,
          __code_handlers: code_handlers,
          __retry_left: retry_left,
          __retry_delay: retry_delay,
        },
      };
      this._http(config)
        .then((response) => {
          // Convert to APIResponse; interceptors already handled success/error decisions
          const schemaForBody = (params.schema ?? this._fallbackSchema) as SchemaOr<S, FS>;
          const apiRes = this.buildApiResponse(response, schemaForBody);

          log.info(`Request to ${method} ${fullUrl} Done`, apiRes);
          resolve(apiRes as unknown as APIResponse<SchemaOr<S, FS>>);
        })
        .catch((err) => {
          // log
          log.error(
            'API Request Failed',
            `Request to: ${method} ${fullUrl}`,
            `With: DATA ${JSON.stringify(data)}`,
            `With: HEADER ${JSON.stringify(headers)}`,
            err,
          );

          reject(err);
        });
    });
  }

  public dt(msg: string): string {
    return this._dt(msg);
  }
}

// ==================== Fetch API Compatible Wrapper ====================

// Type definitions for Fetch API
type HeadersInit = FetchHeaders | Record<string, string> | [string, string][];
type BodyInit = string | ArrayBuffer | ArrayBufferView | URLSearchParams | FormData | Blob | object;

export interface FetchRequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  signal?: AbortSignal;
}

/**
 * Headers class compatible with Web Fetch API
 */
export class FetchHeaders implements Iterable<[string, string]> {
  private _headers: Map<string, string> = new Map();

  constructor(init?: HeadersInit) {
    if (init) {
      if (init instanceof FetchHeaders) {
        init._headers.forEach((value, key) => this._headers.set(key, value));
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => this._headers.set(key.toLowerCase(), value));
      } else if (typeof init === 'object') {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value);
        });
      }
    }
  }

  append(name: string, value: string): void {
    const key = name.toLowerCase();
    const existing = this._headers.get(key);
    this._headers.set(key, existing ? `${existing}, ${value}` : value);
  }

  delete(name: string): void {
    this._headers.delete(name.toLowerCase());
  }

  get(name: string): string | null {
    return this._headers.get(name.toLowerCase()) ?? null;
  }

  has(name: string): boolean {
    return this._headers.has(name.toLowerCase());
  }

  set(name: string, value: string): void {
    this._headers.set(name.toLowerCase(), value);
  }

  forEach(callbackfn: (value: string, key: string, parent: FetchHeaders) => void, thisArg?: any): void {
    this._headers.forEach((value, key) => {
      callbackfn.call(thisArg, value, key, this);
    });
  }

  [Symbol.iterator](): Iterator<[string, string]> {
    return this._headers.entries();
  }

  entries(): IterableIterator<[string, string]> {
    return this._headers.entries();
  }

  keys(): IterableIterator<string> {
    return this._headers.keys();
  }

  values(): IterableIterator<string> {
    return this._headers.values();
  }
}

/**
 * Response class compatible with Web Fetch API
 */
export class FetchResponse {
  private _body: any;
  private _bodyUsed: boolean = false;
  readonly headers: FetchHeaders;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;

  constructor(body: any, init: {
    status?: number;
    statusText?: string;
    headers?: HeadersInit;
    url?: string;
  } = {}) {
    this._body = body;
    this.status = init.status ?? 200;
    this.statusText = init.statusText ?? '';
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new FetchHeaders(init.headers);
    this.url = init.url ?? '';
  }

  get bodyUsed(): boolean {
    return this._bodyUsed;
  }

  async json<T = any>(): Promise<T> {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed');
    }
    this._bodyUsed = true;
    
    if (typeof this._body === 'string') {
      try {
        return JSON.parse(this._body);
      } catch (e) {
        throw new TypeError('Failed to parse body as JSON');
      }
    }
    return this._body;
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

  clone(): FetchResponse {
    if (this._bodyUsed) {
      throw new TypeError('Cannot clone a response that has already been consumed');
    }
    return new FetchResponse(this._body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      url: this.url,
    });
  }
}

/**
 * Fetch function compatible with Web Fetch API, wrapping uni.request
 * This function is designed to work with @supabase/postgrest-js
 * 
 * @param input - URL string or Request object
 * @param init - Request initialization options
 * @returns Promise resolving to FetchResponse
 */
export async function fetch(
  input: string | URL,
  init?: FetchRequestInit
): Promise<FetchResponse> {
  const url = typeof input === 'string' ? input : input.toString();
  const method = (init?.method ?? 'GET').toUpperCase();
  
  // Prepare headers
  const headers: Record<string, string> = {};
  if (init?.headers) {
    const headerObj = init.headers instanceof FetchHeaders 
      ? init.headers 
      : new FetchHeaders(init.headers);
    headerObj.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Prepare body
  let data: any = undefined;
  if (init?.body != null) {
    if (typeof init.body === 'string') {
      data = init.body;
    } else if (init.body instanceof ArrayBuffer || ArrayBuffer.isView(init.body)) {
      throw new Error('ArrayBuffer body is not fully supported in UniApp environment');
    } else if (init.body instanceof URLSearchParams) {
      data = init.body.toString();
    } else if (typeof init.body === 'object') {
      // Assume it's a JSON-serializable object
      data = init.body;
    }
  }

  return new Promise<FetchResponse>((resolve, reject) => {
    const requestTask = uni.request({
      url,
      method: method as any,
      data,
      header: headers,
      timeout: DEFAULT_TIMEOUT,
      success: (res) => {
        const responseHeaders: Record<string, string> = {};
        if (res.header) {
          Object.entries(res.header).forEach(([key, value]) => {
            responseHeaders[key] = String(value);
          });
        }

        const response = new FetchResponse(res.data, {
          status: res.statusCode,
          statusText: '',
          headers: responseHeaders,
          url,
        });

        resolve(response);
      },
      fail: (err) => {
        // Create an error response
        const errorResponse = new FetchResponse(
          { error: err.errMsg || 'Network request failed' },
          {
            status: 0,
            statusText: err.errMsg || 'Network Error',
            url,
          }
        );
        reject(errorResponse);
      },
    });

    // Handle abort signal
    if (init?.signal) {
      init.signal.addEventListener('abort', () => {
        requestTask.abort();
        reject(new Error('Request aborted'));
      });
    }
  });
}