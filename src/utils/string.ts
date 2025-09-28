export function kebabCase(word: string): string {
  const newWord: string = word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  return newWord
}

export function snakeCase(word: string): string {
  const newWord: string = word
    .replace(/[A-Z]/g, function (match) {
      return '_' + match
    })
    .toLowerCase()
  return newWord
}

export function objToQuery(
  obj: Record<string, boolean | number | string | (string | boolean | number)[] | undefined>,
  with_prefix: boolean = false
): string {
  const query = Object.entries(obj)
    .map(([key, value]) => {
      let new_value
      if (value === undefined) {
        new_value = null
      } else if (Array.isArray(value)) {
        new_value = value.join(',')
      } else {
        new_value = value
      }
      return `${key}=${new_value}`
    })
    .join('&')
  return (with_prefix ? '?' : '') + query
}
