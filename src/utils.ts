export function bestSearchQuery(items: FactcheckItem[]): string | undefined {
  const high = items.filter((x) => x.danger_level === 'high')
  if (high.length > 0) {
    return high[0].search_queries[0]
  }
  const medium = items.filter((x) => x.danger_level === 'mid')
  if (medium.length > 0) {
    return medium[0].search_queries[0]
  }
  const low = items.filter((x) => x.danger_level === 'low')
  if (low.length > 0) {
    return low[0].search_queries[0]
  }
  return undefined
}
