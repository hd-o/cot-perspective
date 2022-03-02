import { Use } from './resolve-container'

type GetSortedKeys = (d: Record<string, unknown>) => string[]

/** Returns sorted keys array from given object */
export const useGetSortedKeys: Use<GetSortedKeys> = () => {
  return (data) => Object.keys(data).sort()
}
