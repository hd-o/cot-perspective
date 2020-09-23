import unzipper from 'unzipper'
import request from 'request'
import { processData } from './processData'
import { COTData } from '../constants/COTTypes'

const zipBaseURL = 'https://www.cftc.gov/sites/default/files/files/dea/history/'

/**
 * Fetch historical data from CFTC website, and parse to JSON.
 * @param year The latest year of which to load historical data
 * @param minimumEntries Minimum entries the current year should have, otherwise load more data from previous year
 */
export const getCOTData = async (year: number, minimumEntries: number): Promise<COTData> => {
  console.log(`-- fetching COT data for year: ${year}`)
  const zipURL = `${zipBaseURL}deahistfo${year}.zip`
  // Current types for unzipper seem to be incorrect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directory = await unzipper.Open.url(request as any, zipURL)
  const file = directory.files.find(d => d.path === 'annualof.txt')
  const contentBuffer = await file?.buffer()
  if (!contentBuffer) throw new Error('CSV content buffer undefined')
  const data = processData(contentBuffer.toString())
  // If not enough entries in current year, then load previous year, and join the data for each market
  if (data['CHICAGO MERCANTILE EXCHANGE']['EURO FX']?.length < minimumEntries) {
    console.log('-- fetching COT data for previous year')
    const previousYearData = await getCOTData(year - 1, minimumEntries)
    for (const exchange in data) {
      for (const market in data[exchange]) {
        const previousData = previousYearData[exchange][market]
        if (previousData) data[exchange][market].push(...previousData)
      }
    }
  }
  return data
}
