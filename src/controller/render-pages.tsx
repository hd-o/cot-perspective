import { averagePeriod } from '../model/average-period'
import { GetData } from './get-data'
import { useGetSortedKeys } from './get-sorted-keys'
import { useRenderExchange } from './render-exchange'
import { Use } from './resolve-container'

type RenderPages = (g: GetData) => Promise<void>

export const useRenderPages: Use<RenderPages> = (resolve) => {
  const getSortedKeys = resolve(useGetSortedKeys)
  const renderExchange = resolve(useRenderExchange)

  return async (getData) => {
    const data = await getData({
      year: new Date().getFullYear(),
      minimumEntries: averagePeriod,
    })
    const exchanges = getSortedKeys(data)
    console.log(`• Rendering pages for ${exchanges.length} exchanges`)
    exchanges.forEach(renderExchange({ data, exchanges }))
  }
}
