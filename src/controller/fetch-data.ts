import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import unzipper from 'unzipper'
import { COTData } from '../model/types'
import { useProcessData } from './process-data'
import { Use } from './resolve-container'

export interface FetchDataConfig {
  /** The latest year of which to load historical data */
  year: number
}

const historyPath = 'https://www.cftc.gov/sites/default/files/files/dea/history/'

type FetchData = (config: FetchDataConfig) => Promise<COTData>

export const useFetchData: Use<FetchData> = (resolve) => {
  const processData = resolve(useProcessData)

  return async (config) => {
    try {
      console.log('• Making data dir')
      if (!existsSync('data')) mkdirSync('data')

      console.log('• Fetching data')
      const fileName = `deahistfo${config.year}.zip`
      if (!existsSync(`data/${fileName}`)) execSync(`wget -P data ${historyPath}${fileName}`)

      console.log('• Extracting data')
      const directory = await unzipper.Open.file(`data/deahistfo${config.year}.zip`)
      const file = directory.files.find((d) => d.path === 'annualof.txt')
      const content = await file?.buffer().then(b => b.toString())
      if (content === undefined) throw new Error('undefined data content')

      console.log('• Processing data content')
      return processData(content)
    } catch (error) {
      console.log('• Error fetching data: ', error)
      return {}
    }
  }
}
