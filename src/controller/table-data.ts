import type { CSVData, FormattedCSVData, TraderCategory } from '@/model/types'

export type TableRow = {
  changeLong: number
  changeShort: number
  date: string
  long: number
  net: number
  percentLong: number
  percentShort: number
  short: number
}

export type AverageInput = {
  /** Number of weekly COT snapshots to average */
  averagePeriod: number
  values: TableRow[]
}

export function processTableData(category: TraderCategory) {
  return (data: FormattedCSVData): TableRow => {
    const long = Number(data[`${category} Positions-Long (All)` as keyof CSVData])
    const short = Number(data[`${category} Positions-Short (All)` as keyof CSVData])
    return {
      date: data['As of Date in Form YYYY-MM-DD'],
      long,
      short,
      changeLong: Number(data[`Change in ${category}-Long (All)` as keyof CSVData]),
      changeShort: Number(data[`Change in ${category}-Short (All)` as keyof CSVData]),
      percentLong: Number(data[`% of OI-${category}-Long (All)` as keyof CSVData]),
      percentShort: Number(data[`% of OI-${category}-Short (All)` as keyof CSVData]),
      net: long - short,
    }
  }
}

export function averageOf(
  values: TableRow[],
  period: number,
  key: Exclude<keyof TableRow, 'date'>,
): number {
  const slice = values.slice(0, period)
  const sum = slice.reduce((total, row) => total + row[key], 0)
  return sum / period
}

export function formatContracts(value: number): string {
  if (Number.isNaN(value)) {
    return 'Not Available'
  }
  return value.toLocaleString()
}

export function formatAverageContracts(value: number): string {
  if (Number.isNaN(value)) {
    return 'Not Available'
  }
  return Math.round(value).toLocaleString()
}

export function formatPercent(value: number): string {
  if (Number.isNaN(value)) {
    return 'Not Available'
  }
  return `${value.toFixed(1)} %`
}

export function trendClass(current: number, previous: number | undefined): string {
  if (previous === undefined || Number.isNaN(current) || Number.isNaN(previous)) {
    return ''
  }
  if (previous > current) {
    return 'column-negative'
  }
  if (previous < current) {
    return 'column-positive'
  }
  return ''
}
