type GetSortedKeys = (d: Record<string, unknown>) => string[]

/** Returns sorted keys array from given object */
export const getSortedKeys: GetSortedKeys = (data) => Object.keys(data).sort()
