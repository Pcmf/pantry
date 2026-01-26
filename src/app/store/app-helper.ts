export function toEntityMap<T extends { id: string }>
  (items: T[]): Record<string, T> {
  return Object.fromEntries(items.map(i => [i.id, i]))
}

