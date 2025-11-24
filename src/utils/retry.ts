export function do_retry(
  to_retry: (...args: any[]) => any,
  paramters: {
    [key: string]: any
    retried: number
    max_retries: number
    delay: number
  }
) {
  if (paramters.retried < paramters.max_retries) {
    setTimeout(() => {
      paramters.retried += 1
      to_retry(paramters)
    }, paramters.delay * 1000)
  }
}
