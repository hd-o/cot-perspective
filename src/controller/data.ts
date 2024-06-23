import { Controller } from '@/controller'
import { COTData, CSVData, FormattedCSVData, TraderCategory } from '@/model/types'
import { DataTableProps } from '@/view/data-table'

export interface FetchDataProps {
  /** The latest year of which to load historical data */
  year: number
}

export interface GetDataProps extends FetchDataProps {
  /**
   * Minimum entries the current year should have,
   * otherwise load more data from previous year
   */
  minimumEntries: number
}

export class DataController {
  private get _constants () {
    return this.ctrl.model.constants
  }

  constructor (private readonly ctrl: Controller) {}

  async fetchData (props: FetchDataProps) {
    try {
      console.log('• Making data dir')
      const destinationDir = 'data'
      this.ctrl.file.makeDir(destinationDir)
      console.log('• Fetching data')
      const fileName = `deahistfo${props.year}.zip`
      this.ctrl.file.downloadFile({
        destinationDir,
        fileName,
        sourceUrl: `${this._constants.historyPath}${fileName}`,
      })
      console.log('• Extracting data')
      const content = await this.ctrl.file.getZipContent(`data/deahistfo${props.year}.zip`)
      if (content === undefined) throw new Error('undefined data content')
      console.log('• Processing data content')
      return this.processData(content)
    } catch (error) {
      console.log('• Error fetching data: ', error)
      return {}
    }
  }

  getAverage (periodDays: number, values: DataTableProps['values']) {
    return (rowIndex: number) => {
      const sum = values
        .slice(0, periodDays)
        .reduce((total, row) => total + Number(row[rowIndex]), 0)
      return Math.trunc(sum / periodDays).toLocaleString()
    }
  }

  async getData (props: GetDataProps) {
    const data = await this.fetchData(props)
    // If not enough entries in current year,
    // load previous year and join data for each market
    console.log('• Checking data size')
    const euroFx = data['CHICAGO MERCANTILE EXCHANGE']?.['EURO FX'] ?? []
    if (euroFx.length < props.minimumEntries) {
      // Limit retries of previous years
      if (props.year === 2020) throw new Error('previous year limit')
      console.log('• Fetching data for previous year')
      const year = props.year - 1
      const previousYearData = await this.getData({ ...props, year })
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

  getSortedKeys <D extends {[k: string]: any}> (data: D): Array<keyof D> {
    return Object.keys(data).sort()
  }

  processData (csv: string): COTData {
    const records = this.ctrl.pkg.csv.parse(csv, { trim: true, columns: true, skip_empty_lines: true })
    return records.reduce(
      (data: COTData, csvData: CSVData) => {
        const [marketText = '', exchangeText = ''] = csvData['Market and Exchange Names'].split(' - ')
        const market = marketText.trim()
        const exchange = exchangeText.trim()
        if (market.length === 0 || exchange.length === 0) return data
        if (data[exchange] === undefined) data[exchange] = {}
        if (data[exchange][market] === undefined) data[exchange][market] = []
        data[exchange][market].push({
          market,
          exchange,
          ...this.ctrl.pkg.lodash.pick(csvData, this._constants.propertiesToSelect),
        })
        return data
      },
      {},
    )
  }

  /** @returns Table view rendering data */
  processTableData (category: TraderCategory) {
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
