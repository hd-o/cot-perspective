import type { FormattedCSVData } from '@/model/types'
import type { TableRow } from './table-data'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  averageOf,
  formatAverageContracts,
  formatContracts,
  formatPercent,
  processTableData,
  trendClass,
} from './table-data'

function row(partial: Partial<TableRow> & Pick<TableRow, 'long' | 'short'>): TableRow {
  return {
    date: '2026-08-11',
    changeLong: 0,
    changeShort: 0,
    percentLong: 0,
    percentShort: 0,
    net: partial.long - partial.short,
    ...partial,
  }
}

describe('processTableData', () => {
  const snapshot = {
    'market': 'EURO FX',
    'exchange': 'CHICAGO MERCANTILE EXCHANGE',
    'As of Date in Form YYYY-MM-DD': '2026-08-11',
    'Noncommercial Positions-Long (All)': '  181390',
    'Noncommercial Positions-Short (All)': '  261305',
    'Change in Noncommercial-Long (All)': '   -1620',
    'Change in Noncommercial-Short (All)': '    -338',
    '% of OI-Noncommercial-Long (All)': '    19.8',
    '% of OI-Noncommercial-Short (All)': '    28.5',
  } as FormattedCSVData

  it('maps CFTC fields and computes net as long minus short', () => {
    assert.deepEqual(processTableData('Noncommercial')(snapshot), {
      date: '2026-08-11',
      long: 181390,
      short: 261305,
      changeLong: -1620,
      changeShort: -338,
      percentLong: 19.8,
      percentShort: 28.5,
      net: -79915,
    })
  })
})

describe('averageOf', () => {
  const values = [
    row({ long: 181390, short: 261305, percentLong: 19.8, percentShort: 28.5 }),
    row({ long: 183011, short: 261642, percentLong: 19.7, percentShort: 28.1 }),
    row({ long: 184936, short: 285476, percentLong: 19.4, percentShort: 29.9 }),
    row({ long: 202520, short: 267697, percentLong: 22.0, percentShort: 29.0 }),
    row({ long: 213268, short: 247525, percentLong: 23.1, percentShort: 26.8 }),
    row({ long: 210488, short: 247117, percentLong: 23.2, percentShort: 27.2 }),
    row({ long: 204230, short: 254511, percentLong: 21.3, percentShort: 26.6 }),
    row({ long: 213640, short: 238394, percentLong: 22.4, percentShort: 25.0 }),
    row({ long: 204099, short: 201923, percentLong: 19.9, percentShort: 19.7 }),
    row({ long: 199791, short: 218136, percentLong: 19.7, percentShort: 21.5 }),
    row({ long: 210447, short: 194718, percentLong: 21.5, percentShort: 19.9 }),
    row({ long: 199698, short: 203454, percentLong: 20.7, percentShort: 21.1 }),
  ]

  it('uses the newest 12 weeks and does not truncate', () => {
    assert.equal(averageOf(values, 12, 'long'), 200626.5)
    assert.equal(averageOf(values, 12, 'short'), 240158 + 1 / 6)
    assert.equal(averageOf(values, 12, 'net'), -39531 - 2 / 3)
  })

  it('rounds contract averages and keeps one decimal for percents', () => {
    assert.equal(formatAverageContracts(averageOf(values, 12, 'long')), '200,627')
    assert.equal(formatAverageContracts(averageOf(values, 12, 'short')), '240,158')
    assert.equal(formatAverageContracts(averageOf(values, 12, 'net')), '-39,532')
    assert.equal(formatPercent(averageOf(values, 12, 'percentLong')), '21.1 %')
    assert.equal(formatPercent(averageOf(values, 12, 'percentShort')), '25.3 %')
  })
})

describe('formatters', () => {
  it('formats weekly contracts without rounding and marks missing values', () => {
    assert.equal(formatContracts(181390), '181,390')
    assert.equal(formatContracts(Number.NaN), 'Not Available')
    assert.equal(formatPercent(19.8), '19.8 %')
    assert.equal(formatPercent(Number.NaN), 'Not Available')
  })

  it('colors long/short/net against the older week', () => {
    assert.equal(trendClass(10, 20), 'column-negative')
    assert.equal(trendClass(20, 10), 'column-positive')
    assert.equal(trendClass(10, 10), '')
    assert.equal(trendClass(10, undefined), '')
  })
})
