export interface SWAPICollection<T> {
  results: T[]
  previous: string | null
  next: string | null
  count: number
}
