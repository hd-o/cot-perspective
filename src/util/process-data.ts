import { parse } from 'csv-parse/sync'
import pick from 'lodash/pick'
import { propertiesToSelect } from '../model/properties-to-select'
import { COTData, CSVData } from '../model/types'

type ReduceCSV = (data: COTData, csvData: CSVData) => COTData

const reduceCSV: ReduceCSV = (data, csvData) => {
  const marketNameSplit = csvData['Market and Exchange Names'].split(' - ')
  const market = marketNameSplit[0].trim()
  const exchange = marketNameSplit[1].trim()
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

/**
 * Transforms csv string into js object, grouped first by exchange, then by market name.
 * This grouping makes view rendering easier (mapping through the values)
 */
export const processData = (dataCSV: string): COTData => {
  const records = parse(dataCSV, { trim: true, columns: true, skip_empty_lines: true })
  return records.reduce(reduceCSV, {})
}
