import type { FileController } from '@/controller/file'
import type { COTData, CSVData } from '@/model/types'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { parseMarketAndExchange } from '@/controller/market-name'
import { parse } from 'csv-parse/sync'
import { pick } from 'lodash'

const logger = new Logger('data')

export type DataFetchInput = {
  /** The latest year of which to load historical data */
  year: number
}

export type DataInput = DataFetchInput & {
  /**
   * Minimum entries the current year should have,
   * otherwise load more data from previous year
   */
  minimumEntries: number
}

export class DataController {
  constructor(readonly file: FileController) {}

  async fetchData(input: DataFetchInput) {
    try {
      logger.info('making data dir')
      const destinationDir = 'data'
      this.file.makeDir(destinationDir)
      logger.info('fetching data')
      const fileName = `deahistfo${input.year}.zip`
      this.file.downloadFile({
        destinationDir,
        fileName,
        sourceURL: `${config.historyPath}${fileName}`,
      })
      logger.info('extracting data')
      const content = await this.file.getZipContent(`data/deahistfo${input.year}.zip`)
      if (content === undefined) {
        throw new Error('UndefinedDataContent')
      }
      logger.info('processing data content')
      return this.processData(content)
    }
    catch (error) {
      logger.error('caught', error)
      return {}
    }
  }

  async getData(input: DataInput) {
    const data = await this.fetchData(input)
    // If not enough entries in current year,
    // load previous year and join data for each market
    logger.info('checking data size')
    const euroFx = data['CHICAGO MERCANTILE EXCHANGE']?.['EURO FX'] ?? []
    if (euroFx.length < input.minimumEntries) {
      // Limit retries of previous years
      if (input.year === 2020) {
        throw new Error('previous year limit')
      }
      logger.info('Fetching data for previous year')
      const year = input.year - 1
      const previousYearData = await this.getData({ ...input, year })
      for (const exchange in previousYearData) {
        for (const market in previousYearData[exchange]) {
          const previousData = previousYearData[exchange][market]
          if (previousData === undefined) {
            continue
          }
          data[exchange] ??= {}
          data[exchange][market] ??= []
          data[exchange][market].push(...previousData)
        }
      }
    }
    logger.info('successfully processed data')
    return data
  }

  getSortedKeys <D extends Record<string, any>>(data: D): Array<keyof D> {
    return Object.keys(data).sort()
  }

  processData(csvContent: string): COTData {
    const records = parse(csvContent, { trim: true, columns: true, skip_empty_lines: true })
    return records.reduce(
      (data: COTData, csvData: CSVData) => {
        const parsed = parseMarketAndExchange(csvData['Market and Exchange Names'])
        if (parsed === undefined) {
          return data
        }
        const { exchange, market } = parsed
        if (data[exchange] === undefined) {
          data[exchange] = {}
        }
        if (data[exchange][market] === undefined) {
          data[exchange][market] = []
        }
        data[exchange][market].push({
          market,
          exchange,
          ...pick(csvData, config.propertiesToSelect),
        })
        return data
      },
      {},
    )
  }
}
