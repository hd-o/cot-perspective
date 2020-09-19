import React from 'react'
import { testData } from '../constants/testData'
import { getSortedKeys } from '../functions/getSortedKeys'
import { traderCategories } from '../constants/traderCategories'
import { selectedExchange, selectedMarket, selectedTraderCategory } from '../constants/defaultSelections'
import { shallow } from 'enzyme'
import { averagePeriod } from '../constants/averagePeriod'
import { processTableData } from '../functions/processTableData'
import { Template } from './Template'

/**
 * Verify correct Template rendering of test data
 */
test('Template snapshot', () => {
  const marketsData = testData[selectedExchange]
  const marketData = marketsData[selectedMarket]
  const template = <Template
    dropDownsData={{
      data: testData,
      exchanges: getSortedKeys(testData),
      markets: getSortedKeys(testData[selectedExchange]),
      traderCategories,
      selectedExchange,
      selectedMarket,
      selectedTraderCategory
    }}
    tableData={{
      averagePeriod,
      values: marketData.map(processTableData(selectedTraderCategory))
    }}
  />
  expect(shallow(template)).toMatchSnapshot()
})
