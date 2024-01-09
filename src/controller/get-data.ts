
import { COTData } from '../model/types'
import { FetchDataConfig, useFetchData } from './fetch-data'
import { Use } from './resolve-container'

export interface GetDataConfig extends FetchDataConfig {
  /**
   * Minimum entries the current year should have,
   * otherwise load more data from previous year
   */
  minimumEntries: number
}

export type GetData = (c: GetDataConfig) => Promise<COTData>

/** Parse historical data from CFTC */
export const useGetData: Use<GetData> = (resolve) => {
  const fetchData = resolve(useFetchData)

  const getData: GetData = async (config) => {
    const data = await fetchData(config)
    // If not enough entries in current year,
    // load previous year, and join the data for each market
    console.log('• Checking data size')
    const euroFx = data['CHICAGO MERCANTILE EXCHANGE']?.['EURO FX'] ?? []

    if (euroFx.length < config.minimumEntries) {
      // Limit retries of previous years
      if (config.year === 2020) throw new Error('previous year limit')
      console.log('• Fetching data for previous year')
      const year = config.year - 1
      const previousYearData = await getData({ ...config, year })
      for (const exchange in previousYearData) {
        for (const market in previousYearData[exchange]) {
          const previousData = previousYearData[exchange][market]
          if (previousData === undefined) continue
          data[exchange] ??= {}
          data[exchange][market] ??= []
          data[exchange][market].push(...previousData)
        }
      }
    }

    console.log('• Successfully processed data')
    return data
  }

  return getData
}
