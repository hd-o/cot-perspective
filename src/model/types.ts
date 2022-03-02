import { propertiesToSelect } from './properties-to-select'

export type CSVData = Record<typeof propertiesToSelect[number], string>

export interface FormattedCSVData extends CSVData {
  exchange: string
  market: string
}

export type MarketsData = Record<string, FormattedCSVData[]>

export type COTData = Record<string, MarketsData>
