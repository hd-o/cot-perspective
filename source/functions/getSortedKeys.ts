
/**
 * Returns a sorted array containing the keys of the given Record/Object
 */
export const getSortedKeys = (data: Record<string, unknown>): string[] => Object.keys(data).sort()
