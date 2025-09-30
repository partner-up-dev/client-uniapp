import { EVENT } from "@/data/enum";
import { t } from "@/locale/use";
import store from "@/store";
import { useAccountStore } from "@/store/account";
import log from "@/utils/log";
import { un } from "@uni-helper/uni-network";
import { errorReport } from "@/utils/vendor";
import * as v from "valibot";

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
  data?: Record<string, unknown> | string | ArrayBuffer | ArrayBufferView | URLSearchParams;
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
      const { Account } = await import("@/business/account");
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
}