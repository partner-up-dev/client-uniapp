export function debounce<FunctionType extends (...args: any[]) => any>(
  func: FunctionType,
  wait: number
): (...args: Parameters<FunctionType>) => void {
  let timeout: number | null = null
  return (...args: Parameters<FunctionType>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<FunctionType extends (...args: any[]) => any>(
  func: FunctionType,
  wait: number
): FunctionType {
  let previous = 0
  return function (...args: Parameters<FunctionType>) {
    const now = Date.now()
    if (now - previous > wait) {
      func(...args)
      previous = now
    }
  } as FunctionType
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T extends Function>(value: any): value is T {
  return getType(value) === 'function'
}

// Local import to avoid a circular barrel dependency
function getType(target: unknown): string {
  const typeStr = Object.prototype.toString.call(target)
  const match = typeStr.match(/\[object (\w+)\]/)
  const type = match && match.length ? match[1].toLowerCase() : ''
  return type
}
