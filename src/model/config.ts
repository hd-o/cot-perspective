import { DropDownSelections, PropertiesToSelect, TraderCategory } from './types'

export const config = {
  assetsPath: './src/assets',
  /** Quantity of periods to calculate the average of COT values */
  averagePeriod: 12,
  buildPath: './build',
  /** Index pages, or test default page selection */
  defaultSelections: {
    exchange: 'CHICAGO MERCANTILE EXCHANGE',
    market: 'EURO FX',
    traderCategory: 'Noncommercial',
  } satisfies DropDownSelections,
  dropdownClass: 'js-page-dropdown-select',
  historyPath: 'https://www.cftc.gov/sites/default/files/files/dea/history/',
  propertiesToSelect: [
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
    '% of OI-Commercial-Short (All)',
  ] satisfies PropertiesToSelect[],
  traderCategories: [
    'Commercial',
    'Noncommercial',
  ] satisfies TraderCategory[],
} as const
