import React from 'react'
import { getTestData } from '../functions/getTestData'
import { getSortedKeys } from '../functions/getSortedKeys'
import { traderCategories } from '../data/traderCategories'
import { defaultSelections } from '../data/defaultSelections'
import { shallow } from 'enzyme'
import { averagePeriod } from '../data/averagePeriod'
import { processTableData } from '../functions/processTableData'
import { Template } from './Template'

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
