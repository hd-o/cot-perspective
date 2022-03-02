import { DataTableProps } from '../view/data-table'
import { Use } from './resolve-container'

type GetAverage =
  (p: number, v: DataTableProps['values']) =>
  (rowIndex: number) => string

/**
 * Returns function that calculates average, and returns
 * formatted value in locale string, for the chosen row
 */
export const useGetAverage: Use<GetAverage> = () => {
  return (period, values) => (rowIndex) => {
    const sum = values
      .slice(0, period)
      .reduce((total, row) => total + Number(row[rowIndex]), 0)
    return Math.trunc(sum / period).toLocaleString()
  }
}
