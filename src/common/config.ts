import type { DropDownSelections, PropertiesToSelect, TraderCategory } from '../model/types'
import { env } from 'node:process'

export const config = {
  assetsPath: './src/assets',
  /** Quantity of periods to calculate the average of COT values */
  averagePeriod: 12,
  buildPath: './build',
  defaultSelections: <DropDownSelections>{
    exchange: 'CHICAGO MERCANTILE EXCHANGE',
    market: 'EURO FX',
    traderCategory: 'Noncommercial',
  },
  env: {
    prod: env.BUILD_ENV === 'prod',
  },
  historyPath: 'https://www.cftc.gov/sites/default/files/files/dea/history/',
  propertiesToSelect: <PropertiesToSelect[]>[
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
  ],
  traderCategories: <TraderCategory[]>[
    'Commercial',
    'Noncommercial',
  ],
  ui: {
    containerId: 'cotperspective',
    dropdownClass: 'js-page-dropdown-select',
  },
}
