import csv from 'csv-parse/lib/sync'
import pick from 'lodash/pick'

const propertiesToSelect = <const> [
  'Market and Exchange Names',
  'As of Date in Form YYYY-MM-DD',
  'Open Interest (All)',
  'Noncommercial Positions-Long (All)',
  'Noncommercial Positions-Short (All)',
  'Commercial Positions-Long (All)',
  'Commercial Positions-Short (All)',
  'Change in Noncommercial-Long (All)',
  'Change in Noncommercial-Short (All)',
  'Change in Commercial-Long (All)',
  'Change in Commercial-Short (All)',
  '% of OI-Noncommercial-Long (All)',
  '% of OI-Noncommercial-Short (All)',
  '% of OI-Commercial-Long (All)',
  '% of OI-Commercial-Short (All)'
]

export type CSVData = Record<typeof propertiesToSelect[number], string>

export interface FormattedCSVData extends CSVData {
  market: string,
  exchange: string
}

export type COTData = Record<string, Record<string, FormattedCSVData[]>>

/**
 * Transforms csv string into js object, grouped first by exchange, then by market name.
 * This grouping makes view rendering easier (mapping through the values)
 */
export const processData = (csvContent: string): COTData => {
  return csv(csvContent, { trim: true, columns: true, skip_empty_lines: true })
    .reduce((data: COTData, csvData: CSVData) => {
      const marketNameSplit = csvData['Market and Exchange Names'].split(' - ')
      const market = marketNameSplit[0].trim()
      const exchange = marketNameSplit[1].trim()

      if (!data[exchange]) data[exchange] = {}
      if (!data[exchange][market]) data[exchange][market] = []

      data[exchange][market].push({ market, exchange, ...pick(csvData, propertiesToSelect) })

      return data
    }, {})
}
