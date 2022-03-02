/** Returns sorted keys array from given object */
export const getSortedKeys = (data: Record<string, unknown>): string[] =>
  Object.keys(data).sort()
