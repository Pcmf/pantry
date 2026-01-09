export function sortRecordByProp<T>(
  record: Record<string, T>,
  selector: (value: T) => number | string,
  direction: 'asc' | 'desc' = 'asc'
): Record<string, T> {
  const factor = direction === 'asc' ? 1 : -1;

  console.log('sorting record', selector)

  return Object.fromEntries(
    Object.entries(record).sort(
      ([, a], [, b]) => factor * (
        selector(a) > selector(b) ? 1 :
        selector(a) < selector(b) ? -1 : 0
      )
    )
  );
}
