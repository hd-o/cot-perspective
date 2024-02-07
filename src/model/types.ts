export type CSVData = Record<PropertiesToSelect, string>

export type COTData = Record<string, MarketsData>

export interface DropDownSelections {
  exchange: string
  market: string
  traderCategory: TraderCategory
}

export interface FormattedCSVData extends CSVData {
  exchange: string
  market: string
}

export type MarketsData = Record<string, FormattedCSVData[]>

export type PropertiesToSelect =
  | 'Market and Exchange Names'
  | 'As of Date in Form YYYY-MM-DD'
  | 'Open Interest (All)'
  | 'Noncommercial Positions-Long (All)'
  | 'Noncommercial Positions-Short (All)'
  | 'Commercial Positions-Long (All)'
  | 'Commercial Positions-Short (All)'
  | 'Change in Noncommercial-Long (All)'
  | 'Change in Noncommercial-Short (All)'
  | 'Change in Commercial-Long (All)'
  | 'Change in Commercial-Short (All)'
  | '% of OI-Noncommercial-Long (All)'
  | '% of OI-Noncommercial-Short (All)'
  | '% of OI-Commercial-Long (All)'
  | '% of OI-Commercial-Short (All)'

export type TraderCategory = 'Commercial' | 'Noncommercial'

export type TraderCategories = readonly TraderCategory[]
