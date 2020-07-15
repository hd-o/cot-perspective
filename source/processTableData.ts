import { CSVData, FormattedCSVData } from './processData'

export const traderCategories = <const> ['Commercial', 'Noncommercial']

type TraderCategory = typeof traderCategories[number]

/**
 * For a given trader category, return a function that prepares
 * an array of data to be used in table/view rendering
*/
export function processTableData (selectedTraderCategory: TraderCategory) {
  return (values: FormattedCSVData): (string|number)[] => {
    const longs = Number(values[`${selectedTraderCategory} Positions-Long (All)` as keyof CSVData])
    const shorts = Number(values[`${selectedTraderCategory} Positions-Short (All)` as keyof CSVData])
    const netPositions = longs - shorts
    return [
      values['As of Date in Form YYYY-MM-DD'],
      longs,
      shorts,
      Number(values[`Change in ${selectedTraderCategory}-Long (All)` as keyof CSVData]),
      Number(values[`Change in ${selectedTraderCategory}-Short (All)` as keyof CSVData]),
      values[`% of OI-${selectedTraderCategory}-Long (All)` as keyof CSVData],
      values[`% of OI-${selectedTraderCategory}-Short (All)` as keyof CSVData],
      netPositions
    ]
  }
}
