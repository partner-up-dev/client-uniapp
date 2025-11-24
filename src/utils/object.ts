export function deepcopy<T = object>(raw_object: T): T {
  return JSON.parse(JSON.stringify(raw_object))
}

export const getPropByPath = (obj: any, path: string): any => {
  const keys: string[] = path.split('.')
  try {
    return keys.reduce((acc: any, key: string) => (acc !== undefined && acc !== null ? acc[key] : undefined), obj)
  } catch (error) {
    return undefined
  }
}

export function getType(target: unknown): string {
  const typeStr = Object.prototype.toString.call(target)
  const match = typeStr.match(/\[object (\w+)\]/)
  const type = match && match.length ? match[1].toLowerCase() : ''
  return type
}

export function nullToUndef<T>(val: T | null): T | undefined {
  return val === null ? undefined : val
}

export function undefToNull<T>(val: T | undefined): T | null {
  return val === undefined ? null : val
}

export function withFallback<T, ReturnType>(
  val: T | undefined | null,
  valid_func: (val: T) => ReturnType,
  fallback: ReturnType | (() => ReturnType)
): ReturnType {
  if (val === undefined || val === null) {
    return typeof fallback === 'function' ? (fallback as () => ReturnType)() : fallback
  }
  return valid_func(val)
}

export function objFilterToArray<ElementType extends string>(obj: Partial<Record<ElementType, boolean>>): ElementType[] {
  return Object.keys(obj).filter(key => obj[key as ElementType]) as ElementType[]
}

export function objNullToUndef(val: { [key: string]: any | null }): { [key: string]: any | undefined } {
  return Object.fromEntries(
    Object.entries(val).map(([key, value]) => [key, value === null ? undefined : value])
  )
}
