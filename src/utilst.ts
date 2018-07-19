export const isArray = <T extends any[]>(value: T): value is T =>
  Array.isArray(value)
