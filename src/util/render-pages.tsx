import { averagePeriod } from '../model/average-period'
import { GetData } from './get-data'
import { getSortedKeys } from './get-sorted-keys'
import { renderExchange } from './render-exchange'

type RenderPages = (g: GetData) => Promise<void>

export const renderPages: RenderPages = async (getData) => {
  const data = await getData({
    year: new Date().getFullYear(),
    minimumEntries: averagePeriod,
  })
  const exchanges = getSortedKeys(data)
  exchanges.forEach(renderExchange({ data, exchanges }))
}
