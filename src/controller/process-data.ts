import { parse } from 'csv-parse/sync'
import pick from 'lodash/pick'
import { propertiesToSelect } from '../model/properties-to-select'
import { COTData, CSVData } from '../model/types'
import { Use } from './resolve-container'

type ReduceCSV = (data: COTData, csvData: CSVData) => COTData

type ProcessData = (csv: string) => COTData

/**
 * Transforms csv string into js object, grouped first by exchange, then by market name.
 * This grouping makes view rendering easier (mapping through the values)
 */
export const useProcessData: Use<ProcessData> = () => {
  const reduceCSV: ReduceCSV = (data, csvData) => {
    // console.log("csvData['Market and Exchange Names']")
    // console.log(csvData['Market and Exchange Names'])
    const [marketText = '', exchangeText = ''] = csvData['Market and Exchange Names'].split(' - ')
    const market = marketText.trim()
    const exchange = exchangeText.trim()
    if (market.length === 0 || exchange.length === 0) return data
    // Set initial values
    if (data[exchange] === undefined) data[exchange] = {}
    if (data[exchange][market] === undefined) data[exchange][market] = []
    // Filter csv data, and push to result
    data[exchange][market].push({
      market,
      exchange,
      ...pick(csvData, propertiesToSelect),
    })
    return data
  }

  const processData: ProcessData = (dataCSV) => {
    const records = parse(dataCSV, { trim: true, columns: true, skip_empty_lines: true })
    return records.reduce(reduceCSV, {})
  }

  return processData
}
