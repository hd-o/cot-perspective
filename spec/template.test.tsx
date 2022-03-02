import { shallow } from 'enzyme'
import React from 'react'
import { averagePeriod } from '../src/model/average-period'
import { defaultSelections } from '../src/model/default-selections'
import { traderCategories } from '../src/model/trader-categories'
import { getSortedKeys } from '../src/util/get-sorted-keys'
import { getTestData } from '../src/util/get-test-data'
import { processTableData } from '../src/util/process-table-data'
import { Template } from '../src/view/template'

/** Verify correct Template rendering of test data */
test('Template snapshot', async () => {
  const testData = await getTestData()
  const marketsData = testData[defaultSelections.exchange]
  const marketData = marketsData[defaultSelections.market]
  const template = (
    <Template
      dropDownsData={{
        data: testData,
        exchanges: getSortedKeys(testData),
        markets: getSortedKeys(testData[defaultSelections.exchange]),
        traderCategories,
        ...defaultSelections
      }}
      tableData={{
        averagePeriod,
        values: marketData.map(
          processTableData(defaultSelections.traderCategory)
        )
      }}
    />
  )
  expect(shallow(template)).toMatchSnapshot()
})
