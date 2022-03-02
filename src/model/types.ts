import { propertiesToSelect } from './properties-to-select'
import { traderCategories } from './trader-categories'

export type TraderCategory = typeof traderCategories[number]

export type TraderCategories = readonly TraderCategory[]

export type CSVData = Record<typeof propertiesToSelect[number], string>

export interface FormattedCSVData extends CSVData {
  exchange: string
  market: string
}

export type MarketsData = Record<string, FormattedCSVData[]>

export type COTData = Record<string, MarketsData>
