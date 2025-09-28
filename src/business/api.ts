import { EVENT } from "@/data/enum";
import { t } from "@/locale/use";
import store from "@/store";
import { useAccountStore } from "@/store/account";
import log from "@/utils/log";

export interface requestAPIParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: object,
  headers?: object,
  timeout?: number,
  retry_left?: number,
  retry_delay?: number,
  operation_id?: string,
  code_handlers?: {
    [property: number]:
    (
      res: APIResponse
    ) => boolean
  },
  success_codes?: number[]
}

export interface APIResponse {
  data: object,
  statusCode: number,
  header: object,
  cookies: string[]
}

export class API {

  static MODULE_PREFIX: string = '';
  // #ifdef MP-WEIXIN
  static CLIENT_ID: string = 'mp-weixin';
  // #endif
  static dt: (msg: string) => string = (msg: string) => msg;

  protected reportFailure(
    operation_id?: string,
    fail_type: 'request_error' | 'response_error' = 'response_error',
    status_code?: number, api_name?: string,
  ) {
    if (!api_name && operation_id) {
      api_name = this.dt(`${operation_id}.name`)
    }

    let errmsg: string;
    if (status_code) {
      errmsg = this.dt(`${operation_id}.report.${status_code}`)
    }
    else {
      errmsg = t(`api.report.${fail_type}`)
    }

    errorReport(
      `${api_name}${errmsg}`
    )
  }

  static requestAPI(
    params: requestAPIParams
  ): Promise<APIResponse> {

    let {
      method,
      endpoint,
      data,
      headers,
      timeout = 5000,
      retry_left = 0,
      retry_delay = 1000,
      operation_id,
      code_handlers = {},
      success_codes = [200, 201, 204, 307, 302, 301]
    } = params;

    return new Promise((resolve, reject) => {
      const auth_headers = useAccountStore(store).authHeaders;
      const url = `${import.meta.env.VITE_BACKEND_MAIN_URL}${this.MODULE_PREFIX}${endpoint}`

      uni.request({
        method, url,
        data,
        headers: {
          ...auth_headers,
          ...headers,
          'x-Client-Id': this.CLIENT_ID,
        },
        timeout,
        success: (res) => {
          // log
          log.info(`Request to ${method} ${url} Done`, res)

          useAccountStore(store).upsertToken(res.header)

          // customized handlers
          if (code_handlers[res.statusCode]) {
            if (code_handlers[res.statusCode](
              res as APIResponse
            )) {
              resolve(res as APIResponse)
            }
            else {
              reject(res)
            }
          }

          // preset handlers
          switch (res.statusCode) {
            case 401:
              if (retry_left > 0) {
                retry_left -= 1;
                setTimeout(() => {
                  useAccountStore(store).login()
                    .then(() => {
                      this.requestAPI(params).then((res) => {
                        resolve(res as APIResponse)
                      }).catch(() => {
                        reject(res)
                      })
                    }).catch(() => {
                      reject(res)
                    })
                }, retry_delay)
              }
              else {
                uni.$emit(EVENT.ACCOUNT_LOGGED_OUT);
                reject();
              }
              return;
          }

          if (success_codes.includes(res.statusCode)) {
            resolve(res as APIResponse);
          }
          else {
            this.reportFailure(operation_id);
            reject(res);
          }
        },
        fail: (err) => {
          this.reportFailure(operation_id, 'request_error')

          // log
          log.error(
            'API Request Failed',
            `Request to: ${method} ${url}`,
            `With: DATA ${data}`,
            `With: HEADER ${headers}`,
            err
          )

          reject(err)
        }
      })
    })
  }
}