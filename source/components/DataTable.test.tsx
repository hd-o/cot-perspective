import React from 'react'
import { shallow } from 'enzyme'
import { defaultSelections } from '../data/defaultSelections'
import { getTestData } from '../functions/getTestData'
import { DataTable, getAverage } from './DataTable'
import { processTableData } from '../functions/processTableData'
import { averagePeriod } from '../data/averagePeriod'

/** Verify correct DataTable rendering of test data */
test('DataTable Snapshot', async () => {
  const testData = await getTestData()
  const marketsData = testData[defaultSelections.exchange]
  const marketData = marketsData[defaultSelections.market]
  const dataTable = (
    <DataTable
      averagePeriod={averagePeriod}
      values={marketData.map(
        processTableData(defaultSelections.traderCategory)
      )}
    />
  )
  expect(shallow(dataTable)).toMatchSnapshot()
})

/** Verify getAverage returns the correctly formatted average */
test('getAverage', () => {
  const _average = getAverage(2, [
    [0, 120200],
    [0, 320500],
    [0, 190510]
  ])
  expect(_average(1)).toEqual('220,350')
})
