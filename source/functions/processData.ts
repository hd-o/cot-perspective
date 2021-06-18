import csv from 'csv-parse/lib/sync'
import pick from 'lodash/pick'
import { propertiesToSelect } from '../data/propertiesToSelect'
import { COTData, CSVData } from '../data/types'

/**
 * Transforms csv string into js object, grouped first by exchange, then by market name.
 * This grouping makes view rendering easier (mapping through the values)
 */
export const processData = (csvContent: string): COTData =>
  csv(csvContent, { trim: true, columns: true, skip_empty_lines: true }).reduce(
    (data: COTData, csvData: CSVData) => {
      const marketNameSplit = csvData['Market and Exchange Names'].split(' - ')
      const market = marketNameSplit[0].trim()
      const exchange = marketNameSplit[1].trim()
      // Set initial values
      if (!data[exchange]) data[exchange] = {}
      if (!data[exchange][market]) data[exchange][market] = []
      // Filter csv data, and push to result
      data[exchange][market].push({
        market,
        exchange,
        ...pick(csvData, propertiesToSelect)
      })
      return data
    },
    {}
  )
