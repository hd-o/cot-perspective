import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import unzipper from 'unzipper'
import { COTData } from '../model/types'
import { useProcessData } from './process-data'
import { Use } from './resolve-container'

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

const historyPath = 'https://www.cftc.gov/sites/default/files/files/dea/history/'

/** Parse historical data from CFTC */
export const useGetData: Use<GetData> = (resolve) => {
  const processData = resolve(useProcessData)

  const getData: GetData = async (config) => {
    console.log('making data dir')
    if (!existsSync('data')) mkdirSync('data')

    console.log('fetching data')
    const fileName = `deahistfo${config.year}.zip`
    if (!existsSync(`data/${fileName}`)) execSync(`wget -P data ${historyPath}${fileName}`)

    console.log('• Extracting data')
    const directory = await unzipper.Open.file(`data/deahistfo${config.year}.zip`)
    const file = directory.files.find((d) => d.path === 'annualof.txt')
    const content = await file?.buffer().then(b => b.toString())
    if (content === undefined) throw new Error('undefined data content')

    console.log('• Reading data content')
    const data = processData(content)

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
