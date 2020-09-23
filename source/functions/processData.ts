import csv from 'csv-parse/lib/sync'
import pick from 'lodash/pick'
import { COTPropertiesToSelect } from '../constants/COTPropertiesToSelect'
import { COTData, CSVData } from '../constants/COTTypes'

/**
 * Transforms csv string into js object, grouped first by exchange, then by market name.
 * This grouping makes view rendering easier (mapping through the values)
 */
export const processData = (csvContent: string): COTData =>
  csv(csvContent, { trim: true, columns: true, skip_empty_lines: true })
    .reduce((data: COTData, csvData: CSVData) => {
      const marketNameSplit = csvData['Market and Exchange Names'].split(' - ')
      const market = marketNameSplit[0].trim()
      const exchange = marketNameSplit[1].trim()

      if (!data[exchange]) data[exchange] = {}
      if (!data[exchange][market]) data[exchange][market] = []

      data[exchange][market].push({ market, exchange, ...pick(csvData, COTPropertiesToSelect) })

      return data
    }, {})
