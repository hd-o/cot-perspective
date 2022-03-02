import request from 'request'
import unzipper from 'unzipper'
import { COTData } from '../model/types'
import { useProcessData } from './process-data'
import { Use } from './resolve-container'

const zipBaseURL = 'https://www.cftc.gov/sites/default/files/files/dea/history/'

export interface GetDataConfig {
  /**
   * Minimum entries the current year should have,
   * otherwise load more data from previous year
   */
  minimumEntries: number
  /** The latest year of which to load historical data */
  year: number
}

export type GetData = (c: GetDataConfig) => Promise<COTData>

/** Fetch, and parse historical data from CFTC */
export const useGetData: Use<GetData> = (resolve) => {
  const processData = resolve(useProcessData)

  const getData: GetData = async (config) => {
    console.log(`• Fetching COT data for year: ${config.year}`)
    const zipURL = `${zipBaseURL}deahistfo${config.year}.zip`

    // Current types for unzipper seem to be incorrect
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directory = await unzipper.Open.url(request as any, zipURL)

    console.log('• Extracting data file')
    const file = directory.files.find((d) => d.path === 'annualof.txt')
    const contentBuffer = await file?.buffer()
    if (contentBuffer == null) throw new Error('CSV content buffer undefined')

    console.log('• Reading data file content')
    const data = processData(contentBuffer.toString())

    // If not enough entries in current year,
    // load previous year, and join the data for each market
    console.log('• Checking data size')
    const euroFx = data['CHICAGO MERCANTILE EXCHANGE']['EURO FX'] ?? []

    if (euroFx.length < config.minimumEntries) {
      console.log('• Fetching data for previous year')
      const year = config.year - 1
      const previousYearData = await getData({ ...config, year })
      for (const exchange in data) {
        for (const market in data[exchange]) {
          const previousData = previousYearData[exchange][market]
          if (previousData === undefined) continue
          data[exchange][market].push(...previousData)
        }
      }
    }

    console.log('• Successfully fetched data')
    return data
  }

  return getData
}
