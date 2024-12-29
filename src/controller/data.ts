import type { FileController } from '@/controller/file'
import type { COTData, CSVData, FormattedCSVData, TraderCategory } from '@/model/types'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { parse } from 'csv-parse/sync'
import { pick } from 'lodash'

const logger = new Logger(import.meta.filename)

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

type PeriodValues = Array<string | number>

export type AverageInput = {
  /** Period in days */
  averagePeriod: number
  values: Array<PeriodValues>
}

export class DataController {
  file: FileController

  constructor(dependencies: { file: FileController }) {
    this.file = dependencies.file
  }

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

  getAverage(input: AverageInput) {
    const { averagePeriod, values } = input
    return (rowIndex: number) => {
      const sum = values
        .slice(0, averagePeriod)
        .reduce((total, row) => total + Number(row[rowIndex]), 0)
      return Math.trunc(sum / averagePeriod).toLocaleString()
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
        const [marketText = '', exchangeText = ''] = csvData['Market and Exchange Names'].split(' - ')
        const market = marketText.trim()
        const exchange = exchangeText.trim()
        if (market.length === 0 || exchange.length === 0) {
          return data
        }
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

  /** @returns Table view rendering data */
  processTableData(category: TraderCategory) {
    return (data: FormattedCSVData) => {
      const longs = Number(data[`${category} Positions-Long (All)` as keyof CSVData])
      const shorts = Number(data[`${category} Positions-Short (All)` as keyof CSVData])
      const netPositions = longs - shorts
      return [
        data['As of Date in Form YYYY-MM-DD'],
        longs,
        shorts,
        Number(data[`Change in ${category}-Long (All)` as keyof CSVData]),
        Number(data[`Change in ${category}-Short (All)` as keyof CSVData]),
        data[`% of OI-${category}-Long (All)` as keyof CSVData],
        data[`% of OI-${category}-Short (All)` as keyof CSVData],
        netPositions,
      ]
    }
  }
}
