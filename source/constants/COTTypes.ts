import { COTPropertiesToSelect } from '../constants/COTPropertiesToSelect'
import { traderCategories } from './traderCategories'

export type TraderCategory = typeof traderCategories[number]

export type CSVData = Record<typeof COTPropertiesToSelect[number], string>

export interface FormattedCSVData extends CSVData {
  market: string,
  exchange: string
}

export type MarketsData = Record<string, FormattedCSVData[]>

export type COTData = Record<string, MarketsData>
