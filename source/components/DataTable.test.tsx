import React from 'react'
import { shallow } from 'enzyme'
import { selectedExchange, selectedMarket, selectedTraderCategory } from '../constants/defaultSelections'
import { testData } from '../constants/testData'
import { DataTable, getAverage } from './DataTable'
import { processTableData } from '../functions/processTableData'
import { averagePeriod } from '../constants/averagePeriod'

/**
 * Verify correct DataTable rendering of test data
 */
test('DataTable Snapshot', () => {
  const marketsData = testData[selectedExchange]
  const marketData = marketsData[selectedMarket]
  const dataTable = <DataTable
    averagePeriod={averagePeriod}
    values={marketData.map(processTableData(selectedTraderCategory))}
  />
  expect(shallow(dataTable)).toMatchSnapshot()
})

/**
 * Verify getAverage returns the correctly formatted average
 */
test('getAverage', () => {
  const _average = getAverage(2, [[0, 120200], [0, 320500], [0, 190510]])
  expect(_average(1)).toEqual('220,350')
})
