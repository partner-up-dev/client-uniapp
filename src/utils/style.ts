export function makeNumberPX(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

// Shared primitive types used across non-business modules
// Size matches Avatar's historical size values for compatibility
export type Size = "xSmall" | "small" | "medium" | "large" | "xLarge";

export type Radius = 'none' | 'xs' | 'sm' | 'med' | 'lg' | 'full';